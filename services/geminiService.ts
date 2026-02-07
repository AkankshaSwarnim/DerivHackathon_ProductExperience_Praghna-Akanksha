
import { GoogleGenAI, Type } from "@google/genai";
import { FunnelMetrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const runPreFixDiagnosis = async (data: any): Promise<string> => {
  const prompt = `
    Analyze the following pre-fix aggregated funnel data.
    Your task is to perform a DIAGNOSIS, not to propose a solution yet.

    Pre-fix Aggregated Data:
    ${JSON.stringify(data, null, 2)}

    Instructions:
    1. Identify the primary problem in the funnel and where it occurs.
    2. Diagnose the most likely root cause using behavioral signals (hesitation, rage clicks, repeated attempts).
    3. Explicitly state what this problem is NOT (e.g., technical breakage vs cognitive friction).
    4. Assess severity and confidence level of the diagnosis.
    5. Clearly state whether this issue is suitable for a UX/design fix, a technical fix, or further investigation.

    Output format:
    - Problem Summary (1–2 sentences)
    - Diagnosis (WHY this is happening)
    - Evidence (which metrics/signals support this)
    - What this is NOT
    - Severity (Low / Medium / High)
    - Confidence score (0–1)

    Do NOT suggest fixes yet or Define success criteria yet.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.1 }
  });

  return response.text || '';
};

export const generateCommitmentCard = async (diagnosis: string): Promise<string> => {
  const prompt = `
    Based on this diagnosis: "${diagnosis}"
    
    Now LOCK the diagnosis by doing the following:
    1. State the core hypothesis in ONE sentence.
    2. Define clear, measurable success criteria that would prove this hypothesis correct.
    3. Specify which behavioral signals should decrease and which metrics should improve.
    4. Define a time window for evaluation.

    IMPORTANT RULES:
    - Do NOT revise or improve the diagnosis.
    - Do NOT analyze new data.
    - Do NOT hedge with multiple hypotheses.
    - Treat this as a commitment that future evaluation must be judged against.

    Output only a structured JSON object titled "Committed Issue Card – Success Criteria".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      temperature: 0.1 
    }
  });

  return response.text || '';
};

export const runPostFixEvaluation = async (commitment: any, postData: any): Promise<string> => {
  const prompt = `
    Evaluate the following post-fix aggregated data against the previously committed success criteria.

    Committed Issue Card – Success Criteria:
    ${JSON.stringify(commitment, null, 2)}

    Post-fix Aggregated Data:
    ${JSON.stringify(postData, null, 2)}

    Determine:
    - Whether each success criterion was met
    - Overall verdict: KEEP, ITERATE, or ROLLBACK
    - One-sentence rationale

    Output clearly formatted results.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.1 }
  });

  return response.text || '';
};

export const generateRolePerspectives = async (evaluation: string): Promise<string> => {
  const prompt = `
    Based on this validation outcome: "${evaluation}"

    Present how this outcome would be viewed by the following stakeholders:
    1. A Product Lead
    2. A Designer
    3. A Data/Growth Analyst
    4. A Senior Leader

    Rules:
    - Highlight ONLY what they care about.
    - Use concise, decision-ready language.
    - Do not repeat the full Issue Card.
    - Return a JSON object with keys: "product_lead", "designer", "analyst", "senior_leader".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      temperature: 0.1 
    }
  });

  return response.text || '';
};
