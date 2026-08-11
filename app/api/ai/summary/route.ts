import { GoogleGenAI } from "@google/genai";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // 1. Check authentication
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get request data
    const body = await request.json();

    const { materialId } = body;

    if (!materialId) {
      return NextResponse.json(
        { error: "Material ID is required" },
        { status: 400 },
      );
    }

    // 3. Find material belonging to current user
    const material = await prisma.material.findFirst({
      where: {
        id: materialId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!material) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 },
      );
    }

    // 4. Send material to Gemini
    const prompt = `
You are an AI study assistant.

Summarize the following study material for a university student.

Requirements:
- Explain the main idea clearly.
- Identify the most important concepts.
- Use simple but academically accurate language.
- Do not add information that is not supported by the material.
- Keep the summary concise.

Study material:

${material.content}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const summary = response.text;

    if (!summary) {
      return NextResponse.json(
        { error: "Gemini returned an empty response" },
        { status: 500 },
      );
    }

    // 5. Save summary to database
    const savedSummary = await prisma.summary.upsert({
      where: {
        materialId: material.id,
      },
      update: {
        content: summary,
      },
      create: {
        content: summary,
        materialId: material.id,
      },
    });

    // 6. Return result
    return NextResponse.json({
      summary: savedSummary.content,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
