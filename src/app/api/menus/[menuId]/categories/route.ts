import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { isOwnerOrAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

const categorySchema = z.object({
  name: z.string().min(2).max(120),
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

  const parsed = categorySchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid category." }, { status: 400 });
  }

  const category = await prisma.category.create({ data: { ...parsed.data, menuId } });

  return NextResponse.json({ category }, { status: 201 });
}
