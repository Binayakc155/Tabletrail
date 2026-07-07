import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { signUpSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: parsed.error.issues[0]?.message ?? "Invalid sign up data.",
        },
        { status: 400 }
      );
    }

    const { email, name, password, role } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to create your account right now.",
      },
      { status: 500 }
    );
  }
}
