# Kognii

> AI-powered study assistant that transforms learning materials into personalized learning tools.

Kognii is a full-stack AI study assistant designed to help students turn their learning materials into interactive study resources.

Users can upload study materials or PDF documents, then use AI to generate summaries, quizzes, and flashcards from the content.

🌐 **Live Demo:** https://kognii.vercel.app

---

## ✨ Features

### 🔐 Google Authentication

Users can securely sign in using their Google account.

- Google OAuth
- Protected dashboard
- User-specific materials
- Session-based authentication

### 📄 Study Material Management

Users can create and manage their own study materials.

- Add study materials
- View material details
- Store materials in PostgreSQL
- Materials are associated with authenticated users

### 📑 PDF Upload

Users can upload PDF documents directly to Kognii.

The application:

1. Receives the uploaded PDF
2. Extracts the text content
3. Processes the extracted content
4. Stores the material in the database
5. Makes the material available for AI-powered learning features

### 🤖 AI Summaries

Kognii can transform long study materials into concise summaries.

The AI focuses on:

- Main ideas
- Key concepts
- Important definitions
- Relevant information

### 🧠 AI Quiz Generation

Kognii generates multiple-choice questions from the uploaded material.

Each quiz contains:

- Questions
- Multiple-choice options
- Correct answers
- Interactive answer selection
- Automatic scoring
- Score feedback

### 🗂️ AI Flashcards

Kognii can transform study material into AI-generated flashcards for active recall.

Flashcards are designed to help students review:

- Concepts
- Definitions
- Important facts
- Key relationships

### 📊 Interactive Learning

Instead of simply displaying AI-generated text, Kognii provides interactive learning tools that allow users to actively engage with their material.

---

# 🛠️ Tech Stack

## Frontend

- [Next.js](https://nextjs.org/)
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js App Router
- Next.js Route Handlers
- Prisma ORM
- PostgreSQL

## Authentication

- Auth.js
- Google OAuth

## AI

- Google Gemini API

## Document Processing

- PDF text extraction
- `pdfjs-dist`

## Database

- PostgreSQL
- Prisma ORM

## Deployment

- Vercel

---

# 🏗️ Architecture

Kognii follows a full-stack architecture where the frontend communicates with backend API routes, which then interact with external AI services and the database.

```text
                         ┌─────────────────────┐
                         │       User          │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      Next.js        │
                         │     Frontend        │
                         └──────────┬──────────┘
                                    │
                         API Requests / Actions
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Route Handlers    │
                         │      Backend        │
                         └──────┬───────┬──────┘
                                │       │
                   ┌────────────┘       └────────────┐
                   ▼                                 ▼
          ┌─────────────────┐              ┌─────────────────┐
          │     Prisma      │              │  Gemini API     │
          │      ORM        │              │       AI        │
          └────────┬────────┘              └─────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   PostgreSQL    │
          │    Database     │
          └─────────────────┘
