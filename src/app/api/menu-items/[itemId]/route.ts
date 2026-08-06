import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

const itemSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive(),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional().transform((value) => value || null),
  categoryId: z.string().nullable().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

async function getManagedItem(itemId: string) {
  const user = await getCurrentAppUser();
  if (!user || !isOwnerOrAdmin(user.role)) return null;
  const item = await prisma.menuItem.findFirst({
    where: user.role === "admin" ? { id: itemId } : { id: itemId, menu: { restaurant: { ownerId: user.id } } },
  });
  return { user, item };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const managed = await getManagedItem(itemId);
  if (!managed?.user) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!managed.item) return NextResponse.json({ message: "Not found." }, { status: 404 });
  const parsed = itemSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid menu item." }, { status: 400 });
  const item = await prisma.menuItem.update({ where: { id: itemId }, data: parsed.data });
  return NextResponse.json({ item });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const managed = await getManagedItem(itemId);
  if (!managed?.user) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!managed.item) return NextResponse.json({ message: "Not found." }, { status: 404 });
  await prisma.menuItem.delete({ where: { id: itemId } });
  return new NextResponse(null, { status: 204 });
}
