
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getShoppingAdvice(userQuery: string, context: string) {
  try {
    // Generate content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userQuery,
      config: {
        systemInstruction: `Você é o Bitt Assistant, um especialista em moda infantil da loja Bitt Kids. 
        Ajude os pais a escolherem as melhores roupas com base em tamanho, clima, ocasião e idade da criança.
        Seja amigável, acolhedor e use emojis. Responda em Português do Brasil.
        Contexto da loja: ${context}`,
      },
    });
    // Accessing the .text property directly as per the latest @google/genai guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ops! Tive um probleminha para pensar agora. Que tal me perguntar sobre nossos conjuntos de verão?";
  }
}
