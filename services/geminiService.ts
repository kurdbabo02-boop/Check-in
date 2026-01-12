import { GoogleGenAI } from "@google/genai";
import { Goal, ChatMessage, ChatMode, Source } from "../types";

const apiKey = process.env.API_KEY || '';

const getContext = (goals: Goal[]) => {
  const active = goals.filter(g => !g.completed).map(g => `- [ ] ${g.title} (${g.category})`).join('\n');
  const completed = goals.filter(g => g.completed).map(g => `- [x] ${g.title} (${g.category})`).join('\n');
  
  return `Je bent een professionele, serieuze en behulpzame assistent in een doelen-app genaamd "DoelenDeck".
  
  Hier zijn de huidige doelen van de gebruiker:
  ${active.length > 0 ? "Nog te doen:\n" + active : "Geen openstaande doelen."}
  
  ${completed.length > 0 ? "Reeds voltooid:\n" + completed : ""}
  
  Gebruik deze informatie om vragen te beantwoorden. Wees beknopt, direct en zakelijk maar vriendelijk.`;
};

// Fast AI Response using Flash Lite
export const getFastMotivation = async (): Promise<string> => {
  if (!apiKey) return "API Key ontbreekt.";
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: "Geef me een extreem korte (max 10 woorden), krachtige motivatie quote om nu aan het werk te gaan. Geen emoji's.",
    });
    return response.text || "Actie ondernemen is de sleutel tot succes.";
  } catch (error) {
    console.error(error);
    return "Focus en begin gewoon.";
  }
};

// Chat function supporting multiple modes
export const sendChatMessage = async (
  history: ChatMessage[], 
  newMessage: string, 
  goals: Goal[],
  mode: ChatMode
): Promise<{ text: string; sources: Source[] }> => {
  if (!apiKey) return { text: "Configureer je API Key in de omgevingvariabelen.", sources: [] };

  const ai = new GoogleGenAI({ apiKey });
  let model = 'gemini-3-pro-preview';
  let config: any = {
    systemInstruction: getContext(goals),
  };

  // Configure based on mode
  if (mode === 'RESEARCH') {
    model = 'gemini-3-flash-preview';
    config.tools = [{ googleSearch: {} }];
  } else if (mode === 'THINKING') {
    model = 'gemini-3-pro-preview';
    // Max budget for Gemini 3 Pro is 32768. Do not set maxOutputTokens.
    config.thinkingConfig = { thinkingBudget: 32768 };
  } else {
    // STANDARD
    model = 'gemini-3-pro-preview';
  }

  try {
    const chat = ai.chats.create({
      model: model,
      config: config,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message: newMessage });
    const text = result.text || "";
    const sources: Source[] = [];

    // Extract Grounding Metadata if available
    if (result.candidates && result.candidates[0]?.groundingMetadata?.groundingChunks) {
      const chunks = result.candidates[0].groundingMetadata.groundingChunks;
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error(error);
    return { text: "Er is een fout opgetreden bij het verbinden met de AI.", sources: [] };
  }
};