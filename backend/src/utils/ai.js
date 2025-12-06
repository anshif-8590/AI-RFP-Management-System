import fs from "fs/promises";
import OpenAI from "openai";
import dotenv from "dotenv"

dotenv.config();


const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PROMPT_PATH = "./prompts/rfp_from_text.txt";
const PROPOSAL_PROMPT_PATH = "./prompts/proposal_from_email.txt";
const RECOMMEND_PROMPT_PATH = "./prompts/recommendation_prompt.txt";



// ❗ Remove `async` here – it's a normal function
function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in model response");
  return jsonMatch[0];
}

export async function convertRfpText(
  rawText,
  { model = process.env.OPENAI_MODEL || "gpt-3.5-turbo", maxRetries = 2 } = {}
) {
  const basePrompt = await fs.readFile(PROMPT_PATH, "utf8");

  // make sure this is a template string with backticks:
  const userPrompt = `${basePrompt}\n\nRFP_TEXT:\n${rawText}`;

  let lastErr = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const resp = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.0,
        max_tokens: 800
      });

      const content = resp.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from model");

      const jsonText = extractJson(content);   // ✅ now returns a string
      const parsed = JSON.parse(jsonText);     // ✅ valid JSON

      // ensure arrays
      parsed.requirements = Array.isArray(parsed.requirements)
        ? parsed.requirements
        : [];
      parsed.deliverables = Array.isArray(parsed.deliverables)
        ? parsed.deliverables
        : [];

      // normalize budget
      if (parsed.budget !== null && parsed.budget !== undefined) {
        const n = Number(String(parsed.budget).replace(/[^0-9.]/g, ""));
        parsed.budget = Number.isFinite(n) ? n : null;
      } else {
        parsed.budget = null;
      }

      parsed.deadline = parsed.deadline || null;

      return parsed;
    } catch (err) {
      lastErr = err;
      console.warn(
        `convertRfpText attempt ${attempt} failed:`,
        err.message || err
      );
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }

  throw new Error(
    `Failed to convert text after retries: ${lastErr?.message || lastErr}`
  );
}

export async function parseProposalEmail(
  rawEmail,
  { model = process.env.OPENAI_MODEL || "gpt-3.5-turbo" } = {}
) {
  const basePrompt = await fs.readFile(PROPOSAL_PROMPT_PATH, "utf8");
  const userPrompt = `${basePrompt}\n\nVENDOR_EMAIL:\n${rawEmail}`;

  const resp = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.0,
    max_tokens: 400
  });

  const content = resp.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response in proposal parsing");

  const jsonText = extractJson(content);
  const parsed = JSON.parse(jsonText);

  // Normalize fields
  if (parsed.price !== null && parsed.price !== undefined) {
    const n = Number(String(parsed.price).replace(/[^0-9.]/g, ""));
    parsed.price = Number.isFinite(n) ? n : null;
  } else parsed.price = null;

  if (parsed.deliveryDays !== null && parsed.deliveryDays !== undefined) {
    const d = parseInt(parsed.deliveryDays, 10);
    parsed.deliveryDays = Number.isFinite(d) ? d : null;
  } else parsed.deliveryDays = null;

  parsed.currency = parsed.currency || null;
  parsed.warranty = parsed.warranty || null;
  parsed.paymentTerms = parsed.paymentTerms || null;
  parsed.notes = parsed.notes || null;

  return parsed;
}

export async function generateRecommendationText(scoredProposals) {
  const prompt = await fs.readFile(RECOMMEND_PROMPT_PATH, "utf8");

  // Build text for GPT using clean scoring data
  const formatted = scoredProposals.map(p => {
    return `
Vendor: ${p.vendor}
Price: ${p.price}
Delivery Days: ${p.deliveryDays}
Warranty: ${p.warranty}
Payment Terms: ${p.paymentTerms}
Score: ${p.score}
`;
  }).join("\n");

  const userPrompt = `${prompt}\n\n${formatted}`;

  const resp = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.0,
    max_tokens: 250
  });

  return resp.choices?.[0]?.message?.content || "No recommendation available.";
}

