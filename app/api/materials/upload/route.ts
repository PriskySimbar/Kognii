import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import PDFParser from "pdf2json";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 },
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "PDF must be smaller than 10MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const content = await extractPdfText(buffer);

    if (!content.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. Make sure the PDF contains selectable text.",
        },
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
        title: file.name.replace(/\.pdf$/i, ""),
        content,
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      materialId: material.id,
    });
  } catch (error) {
    console.error("PDF upload error:", error);

    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 },
    );
  }
}

function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (error: any) => {
      reject(error.parserError);
    });

    parser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = pdfData.Pages.flatMap((page: any) =>
          page.Texts.map((text: any) =>
            text.R.map((run: any) => run.T).join(""),
          ),
        ).join("\n");

        resolve(text);
      } catch (error) {
        reject(error);
      }
    });

    parser.parseBuffer(buffer);
  });
}
