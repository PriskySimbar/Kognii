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

Create 10 useful flashcards from the study material below.

Rules:
- Focus on important concepts.
- Questions should test understanding, not random details.
- Answers should be concise but informative.
- Do not include information that is not present in the material.
- Return ONLY valid JSON.
- Do not use markdown.

Required JSON format:

{
  "cards": [
    {
      "question": "Question here",
      "answer": "Answer here"
    }
  ]
}

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

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const flashcards = JSON.parse(cleanedText);

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Flashcards error:", error);

    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 },
    );
  }
}
