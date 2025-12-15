import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHRContent = async (prompt: string, context?: string): Promise<string> => {
  try {
    const fullPrompt = `
      Você é um Assistente de Recursos Humanos Sênior experiente e prestativo para a plataforma NexusHR.
      Responda em Português do Brasil. Use formatação Markdown.
      Seja profissional, empático e direto.
      
      Contexto dos dados atuais (se fornecido): ${context || 'Nenhum contexto específico.'}
      
      Pergunta do usuário: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "Desculpe, não consegui gerar uma resposta no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao consultar o assistente de IA. Verifique sua chave de API.";
  }
};