"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Loader2, PencilLine, Plus, Trash2 } from "lucide-react";

import type { OwnerRestaurant } from "@/components/owner/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type MenuItem = { id: string; name: string; description: string | null; price: string | number; imageUrl: string | null; isAvailable: boolean };
type Menu = { id: string; title: string; imageUrl: string | null; items: MenuItem[]; categories: Array<{ id: string; name: string; items: MenuItem[] }> };
type ItemEditor = { menuId: string; item?: MenuItem } | null;

async function request(url: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(url, { ...init, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Unable to save menu changes.");
  }
  return response.status === 204 ? null : response.json();
}

export function MenuManagementDialog({ restaurant, open, onOpenChange, onChanged }: { restaurant: OwnerRestaurant | null; open: boolean; onOpenChange: (open: boolean) => void; onChanged: () => void }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuEditor, setMenuEditor] = useState<Menu | "new" | null>(null);
  const [itemEditor, setItemEditor] = useState<ItemEditor>(null);
  const [isPending, startTransition] = useTransition();

  const loadMenus = async () => {
    if (!restaurant) return;
    setLoading(true);
    setError(null);
    try {
      const data = await request(`/api/restaurants/${restaurant.id}/menus`);
      setMenus(data.menus);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load menus.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loading the selected restaurant's remote menu is the effect's purpose.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) void loadMenus();
  // The selected restaurant is the data source; load when it changes or the dialog opens.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, restaurant?.id]);

  const run = (work: () => Promise<void>) => startTransition(async () => {
    setError(null);
    try {
      await work();
      await loadMenus();
      onChanged();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to save menu changes.");
    }
  });

  function saveMenu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { title: String(form.get("title") ?? ""), imageUrl: String(form.get("imageUrl") ?? "") };
    const image = form.get("image");
    run(async () => {
      const result = menuEditor === "new"
        ? await request(`/api/restaurants/${restaurant?.id}/menus`, { method: "POST", body: JSON.stringify(payload) })
        : menuEditor ? await request(`/api/menus/${menuEditor.id}`, { method: "PATCH", body: JSON.stringify(payload) }) : null;
      if (image instanceof File && image.size > 0 && result?.menu?.id) {
        const imageData = new FormData();
        imageData.set("image", image);
        await request(`/api/menus/${result.menu.id}`, { method: "POST", body: imageData });
      }
      setMenuEditor(null);
    });
  }

  function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!itemEditor) return;
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""), description: String(form.get("description") ?? "") || undefined,
      price: Number(form.get("price")), imageUrl: String(form.get("imageUrl") ?? "") || undefined,
    };
    run(async () => {
      if (itemEditor.item) await request(`/api/menu-items/${itemEditor.item.id}`, { method: "PATCH", body: JSON.stringify(payload) });
      else await request(`/api/menus/${itemEditor.menuId}/items`, { method: "POST", body: JSON.stringify(payload) });
      setItemEditor(null);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Menu management</DialogTitle>
          <DialogDescription>Upload menus, add dishes, and keep the menu for {restaurant?.name ?? "this restaurant"} up to date.</DialogDescription>
        </DialogHeader>

        {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        {loading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-500" /></div> : null}
        {!loading ? <div className="space-y-3">
          <Button type="button" className="rounded-xl bg-orange-500 text-white hover:bg-orange-600" onClick={() => setMenuEditor("new")} disabled={isPending}><Plus className="h-4 w-4" /> Upload menu</Button>
          {menus.length === 0 ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No menus yet. Upload your first menu to add dishes.</p> : null}
          {menus.map((menu) => {
            const categorizedIds = new Set(menu.categories.flatMap((category) => category.items.map((item) => item.id)));
            const visibleItems = [...menu.categories.flatMap((category) => category.items), ...menu.items.filter((item) => !categorizedIds.has(item.id))];
            return <section key={menu.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="font-semibold text-slate-950">{menu.title}</h3>{menu.imageUrl ? <a className="text-xs text-orange-700 underline" href={menu.imageUrl} target="_blank" rel="noreferrer">View menu image</a> : null}</div>
                <div className="flex gap-2"><Button type="button" size="sm" variant="outline" className="rounded-xl" onClick={() => setMenuEditor(menu)}><PencilLine className="h-4 w-4" /> Edit</Button><Button type="button" size="sm" variant="outline" className="rounded-xl border-rose-200 text-rose-700" disabled={isPending} onClick={() => { if (window.confirm(`Delete ${menu.title}? This also deletes its dishes.`)) run(async () => { await request(`/api/menus/${menu.id}`, { method: "DELETE" }); }); }}><Trash2 className="h-4 w-4" /> Delete</Button></div>
              </div>
              <div className="mt-4 space-y-2">{visibleItems.map((item) => <div key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2"><div><p className="text-sm font-medium">{item.name} <span className="text-slate-500">{Number(item.price).toFixed(2)}</span></p>{item.description ? <p className="text-xs text-slate-500">{item.description}</p> : null}</div><div className="flex gap-1"><Button type="button" size="icon" variant="ghost" className="h-8 w-8" onClick={() => setItemEditor({ menuId: menu.id, item })} aria-label={`Edit ${item.name}`}><PencilLine className="h-4 w-4" /></Button><Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-rose-700" onClick={() => { if (window.confirm(`Delete ${item.name}?`)) run(async () => { await request(`/api/menu-items/${item.id}`, { method: "DELETE" }); }); }} aria-label={`Delete ${item.name}`}><Trash2 className="h-4 w-4" /></Button></div></div>)}</div>
              <Button type="button" size="sm" variant="outline" className="mt-3 rounded-xl" onClick={() => setItemEditor({ menuId: menu.id })}><Plus className="h-4 w-4" /> Add dish</Button>
            </section>;
          })}
        </div> : null}
      </DialogContent>

      <Dialog open={menuEditor !== null} onOpenChange={(next) => !next && setMenuEditor(null)}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{menuEditor === "new" ? "Upload menu" : "Edit menu"}</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={saveMenu}><div className="space-y-2"><Label htmlFor="menu-title">Menu title</Label><Input id="menu-title" name="title" defaultValue={menuEditor !== "new" ? menuEditor?.title : ""} required /></div><div className="space-y-2"><Label htmlFor="menu-local-image">Menu photo</Label><Input id="menu-local-image" name="image" type="file" accept="image/*" /><p className="text-xs text-slate-500">Choose an image from your device (up to 5 MB).</p></div><div className="space-y-2"><Label htmlFor="menu-image">Or use a menu image URL</Label><Input id="menu-image" name="imageUrl" type="url" defaultValue={menuEditor !== "new" ? menuEditor?.imageUrl ?? "" : ""} placeholder="https://..." /></div><DialogFooter><Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save menu</Button></DialogFooter></form></DialogContent></Dialog>
      <Dialog open={itemEditor !== null} onOpenChange={(next) => !next && setItemEditor(null)}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>{itemEditor?.item ? "Edit dish" : "Add dish"}</DialogTitle></DialogHeader><form className="space-y-4" onSubmit={saveItem}><div className="space-y-2"><Label htmlFor="dish-name">Dish name</Label><Input id="dish-name" name="name" defaultValue={itemEditor?.item?.name} required /></div><div className="space-y-2"><Label htmlFor="dish-description">Description</Label><Textarea id="dish-description" name="description" className="min-h-20" defaultValue={itemEditor?.item?.description ?? ""} /></div><div className="space-y-2"><Label htmlFor="dish-price">Price</Label><Input id="dish-price" name="price" type="number" min="0.01" step="0.01" defaultValue={itemEditor?.item ? String(itemEditor.item.price) : ""} required /></div><div className="space-y-2"><Label htmlFor="dish-image">Dish image URL (optional)</Label><Input id="dish-image" name="imageUrl" type="url" defaultValue={itemEditor?.item?.imageUrl ?? ""} /></div><DialogFooter><Button type="submit" disabled={isPending}>{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save dish</Button></DialogFooter></form></DialogContent></Dialog>
    </Dialog>
  );
}
