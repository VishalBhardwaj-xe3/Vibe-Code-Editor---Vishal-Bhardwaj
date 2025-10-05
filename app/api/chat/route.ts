import { db } from "@/lib/db";
import { type NextRequest, NextResponse } from "next/server";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface chatRequest {
  message: string;
  history: ChatMessage[];
}

async function generateAIResponse(messages: ChatMessage[]): Promise<string> {
  const systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. When showing code, use proper formatting with language-specific syntax.
Keep responses concise but comprehensive. Use code blocks with language specification when providing code examples.`;

  const fullMessages = [{ role: "system", content: systemPrompt }, ...messages];

  const prompt = fullMessages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "codellama:latest",
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 1000,
          num_predict: 1000,
          repeat_penalty: 1.1,
          context_length: 4096,
        },
      }),
      //   signal: controller.signal,
    });

    const data = await response.json();
    if (!data.response) {
      throw new Error("No response from AI model");
    }
    return data.response.trim();
  } catch (error) {
    console.error("AI generation error:", error);
    throw Error("Failed to generate AI response");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: chatRequest = await req.json();
    // const body = await req.json();

    // // Handle prompt enhancement
    // if (body.action === "enhance") {
    //   const enhancedPrompt = await enhancePrompt(
    //     body as EnhancePromptRequest
    //   );
    //   return NextResponse.json({ enhancedPrompt });
    // }

    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg: any) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role)
        )
      : [];

    const recentHistory = validHistory.slice(-10);
    const messages: ChatMessage[] = [
      ...recentHistory,
      { role: "user", content: message },
    ];

      const aiResponse = await generateAIResponse(messages);
      
      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      });
  } catch (error) {
       console.error("Error in AI chat route:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      {
        error: "Failed to generate AI response",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
