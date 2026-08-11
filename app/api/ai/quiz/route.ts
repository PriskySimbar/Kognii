import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Material content is required" },
        { status: 400 },
      );
    }

    const prompt = `
You are an AI study assistant.

Create a quiz based ONLY on the following study material.

Generate exactly 5 multiple-choice questions.

Return ONLY valid JSON in this exact structure:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": 0
    }
  ]
}

Rules:
- Each question must have exactly 4 options.
- "answer" must be the index of the correct option.
- The answer index must be 0, 1, 2, or 3.
- Questions must be based on the provided material.
- Do not add explanations.
- Do not use markdown.
- Return valid JSON only.

Study material:

${content}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    const quiz = JSON.parse(text);

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("QUIZ GENERATION ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate quiz",
      },
      { status: 500 },
    );
  }
}
