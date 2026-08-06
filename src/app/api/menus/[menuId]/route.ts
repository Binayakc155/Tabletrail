import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";
import { removeLocalUpload, replaceMenuImage } from "@/lib/restaurant-management";

const menuSchema = z.object({
  title: z.string().min(2).max(120),
  imageUrl: z.union([z.string().url(), z.literal("")]).optional().transform((value) => value || null),
});

async function getManagedMenu(menuId: string) {
  const user = await getCurrentAppUser();
  if (!user || !isOwnerOrAdmin(user.role)) return null;

  const menu = await prisma.menu.findFirst({
    where: user.role === "admin" ? { id: menuId } : { id: menuId, restaurant: { ownerId: user.id } },
  });
  return { user, menu };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const managed = await getManagedMenu(menuId);
  if (!managed?.user) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!managed.menu) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const parsed = menuSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid menu." }, { status: 400 });

  if (parsed.data.imageUrl !== managed.menu.imageUrl) {
    await removeLocalUpload(managed.menu.imageUrl);
  }
  const menu = await prisma.menu.update({ where: { id: menuId }, data: parsed.data });
  return NextResponse.json({ menu });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const managed = await getManagedMenu(menuId);
  if (!managed?.user) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!managed.menu) return NextResponse.json({ message: "Not found." }, { status: 404 });

  await removeLocalUpload(managed.menu.imageUrl);
  await prisma.menu.delete({ where: { id: menuId } });
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: Request, { params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const managed = await getManagedMenu(menuId);
  if (!managed?.user) return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  if (!managed.menu) return NextResponse.json({ message: "Not found." }, { status: 404 });

  const formData = await request.formData();
  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0 || !image.type.startsWith("image/")) {
    return NextResponse.json({ message: "Please select a valid image file." }, { status: 400 });
  }
  if (image.size > 5 * 1024 * 1024) {
    return NextResponse.json({ message: "Menu images must be 5 MB or smaller." }, { status: 400 });
  }

  const imageUrl = await replaceMenuImage(managed.menu.imageUrl, image, `menu-${menuId}`);
  const menu = await prisma.menu.update({ where: { id: menuId }, data: { imageUrl } });
  return NextResponse.json({ menu });
}
