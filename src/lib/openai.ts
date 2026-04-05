import OpenAI, { APIError, RateLimitError } from "openai";

const globalForOpenAI = globalThis as unknown as {
  openai: OpenAI | undefined;
};

const openai = globalForOpenAI.openai ?? new OpenAI();

if (process.env.NODE_ENV !== "production") {
  globalForOpenAI.openai = openai;
}

export async function generateSalesBrief(
  companyName: string,
  companyUrl?: string
): Promise<string> {
  const userMessage = companyUrl
    ? `Generate a sales brief for: ${companyName} (Website: ${companyUrl})`
    : `Generate a sales brief for: ${companyName}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are a B2B sales intelligence analyst. Given a company name (and optionally their website URL), generate a concise sales brief that a sales rep could use before a call. Include:\n- What the company does (1-2 sentences)\n- Estimated company size/stage (startup, mid-market, enterprise)\n- Potential pain points a SaaS product could solve\n- Suggested conversation starters for a sales call\nKeep the total response under 150 words. Be specific and actionable, not generic.",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.error("OpenAI rate limit exceeded:", error.message);
    } else if (error instanceof APIError) {
      console.error("OpenAI API error:", error.message);
    } else {
      console.error("Unexpected error generating sales brief:", error);
    }
    throw new Error("Failed to generate brief. Please try again.");
  }
}
