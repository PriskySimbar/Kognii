import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const materials = await prisma.material.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(materials);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const material = await prisma.material.create({
    data: {
      title,
      content,
      userId: user.id,
    },
  });

  return NextResponse.json(material, { status: 201 });
}
