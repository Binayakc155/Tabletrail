import { NextResponse } from "next/server";
import { z } from "zod";

import { ensureLocalUser, getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

const menuSchema = z.object({
  title: z.string().min(2).max(120).default("Main menu"),
  imageUrl: z.string().url().optional(),
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const menus = await prisma.menu.findMany({
    where: { restaurantId: id },
    include: { categories: { include: { items: true } }, items: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ menus });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentAppUser();

  if (!user || !isOwnerOrAdmin(user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: user.role === "admin" ? { id } : { id, ownerId: user.id },
  });

  if (!restaurant) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const parsed = menuSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid menu." }, { status: 400 });
  }

  await ensureLocalUser(user);
  const menu = await prisma.menu.create({ data: { ...parsed.data, restaurantId: id } });

  return NextResponse.json({ menu }, { status: 201 });
}
