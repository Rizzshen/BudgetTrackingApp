import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export const generateInsights = async (spendingData) => {
  const prompt = `
You are a personal finance assistant. Analyze the following spending data for a user and provide savings advice.

Spending by category (recent period):
${JSON.stringify(spendingData.byCategory, null, 2)}

Monthly trend:
${JSON.stringify(spendingData.monthlyTrend, null, 2)}

Total expenses: ${spendingData.totalExpense}
Total income: ${spendingData.totalIncome}
Balance: ${spendingData.balance}

Instructions:
- Identify the top 2-3 categories where spending seems high or could be reduced.
- Give 3-5 specific, actionable savings suggestions (not generic advice like "spend less").
- Keep the tone encouraging, not judgmental.
- Respond ONLY in valid JSON, with this exact structure and nothing else (no markdown, no code fences):
{
  "summary": "1-2 sentence overview of spending habits",
  "topConcerns": ["category1", "category2"],
  "suggestions": [
    { "title": "short title", "detail": "1-2 sentence explanation" }
  ]
}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const text = completion.choices[0].message.content;
  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error("Failed to parse AI response as JSON");
  }
};
