import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import PERSONAS from "../../../lib/personas";
import { detectJailbreakAttempt, wrapUserInput, sanitizeOutput, logJailbreakAttempt } from "../../../lib/jailbreakDefense";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, personaId } = body as { messages: Array<{ role: string; content: string }>; personaId: string };

    if (!personaId || !PERSONAS[personaId]) {
      return NextResponse.json({ error: "Invalid persona selected." }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const persona = PERSONAS[personaId];
    const apiKey = process.env.GEMINI_API_KEY;
    const rawModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const primaryModel = rawModel.replace(/^models\//, "");
    const fallbackModels = ["gemini-2.5-flash-lite", "gemini-2.5-flash"]
      .map((model) => model.replace(/^models\//, ""))
      .filter((model, index, array) => array.indexOf(model) === index && model !== primaryModel);

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = [primaryModel, ...fallbackModels];

    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content) }],
    }));

    const lastMessageContent = String(messages[messages.length - 1]?.content || "");

    // Detect jailbreak attempt
    const jailbreakCheck = detectJailbreakAttempt(lastMessageContent);
    if (jailbreakCheck.detected) {
      logJailbreakAttempt(lastMessageContent, jailbreakCheck.severity);
      if (jailbreakCheck.severity === "high") {
        return NextResponse.json(
          { error: "I appreciate the creativity, but I stick to my approach. What can I help you with?" },
          { status: 400 }
        );
      }
    }

    // Wrap user input to reinforce persona authority
    const lastMessage = wrapUserInput(lastMessageContent, persona.name);
    let lastError: { status: number; message: string } | null = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: persona.systemPrompt,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessageStream(lastMessage);

        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            const encoder = new TextEncoder();
            let fullResponse = "";

            try {
              for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                  fullResponse += text;
                  controller.enqueue(encoder.encode(text));
                }
              }

              // Validate persona consistency on complete response
              const { clean: isConsistent, response: sanitized } = sanitizeOutput(fullResponse, persona.name);
              if (!isConsistent) {
                console.warn(`[SECURITY] Persona break detected in response, replacing with safe output`);
                controller.enqueue(encoder.encode("\n\n" + sanitized));
              }

              controller.close();
            } catch (streamError) {
              controller.error(streamError);
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const status = message.includes("503") || message.toLowerCase().includes("overload") ? 503 : 500;
        lastError = { status, message };

        if (status !== 503) {
          break;
        }
      }
    }

    if (lastError) {
      return NextResponse.json(
        {
          error:
            lastError.status === 503
              ? "Gemini is busy right now. Please try again in a moment."
              : lastError.message,
        },
        { status: lastError.status }
      );
    }

    return NextResponse.json({ error: "Gemini did not return a response." }, { status: 500 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("API error:", { message: errorMessage, stack: error instanceof Error ? error.stack : undefined });
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
