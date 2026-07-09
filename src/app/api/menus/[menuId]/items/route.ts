import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

const menuItemSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
});

export async function POST(request: Request, { params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params;
  const user = await getCurrentAppUser();

  if (!user || !isOwnerOrAdmin(user.role)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const menu = await prisma.menu.findFirst({
    where: user.role === "admin" ? { id: menuId } : { id: menuId, restaurant: { ownerId: user.id } },
  });

  if (!menu) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  const parsed = menuItemSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid menu item." }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      ...parsed.data,
      price: parsed.data.price,
      menuId,
    },
  });

  return NextResponse.json({ item }, { status: 201 });
}
