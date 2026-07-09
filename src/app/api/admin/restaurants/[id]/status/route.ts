import { NextResponse } from "next/server";
import { z } from "zod";

import { getCurrentAppUser } from "@/lib/clerk-auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentAppUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ restaurant });
}
