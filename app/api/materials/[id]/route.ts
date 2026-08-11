import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const material = await prisma.material.findFirst({
    where: {
      id,
      user: {
        email: session.user.email,
      },
    },
  });

  if (!material) {
    return NextResponse.json({ error: "Material not found" }, { status: 404 });
  }

  return NextResponse.json(material);
}
