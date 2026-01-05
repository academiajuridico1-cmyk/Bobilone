import { GoogleGenAI } from "@google/genai";

export const generateHRContent = async (prompt: string, context?: string): Promise<string> => {
  try {
    // A API Key deve ser obtida exclusivamente de process.env.API_KEY injetada pelo ambiente
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const fullPrompt = `
      Você é um Assistente de Recursos Humanos Sênior experiente e prestativo para a plataforma NexusHR.
      Responda em Português do Brasil. Use formatação Markdown.
      Seja profissional, empático e direto.
      
      Contexto dos dados atuais: ${context || 'Nenhum contexto adicional.'}
      
      Pergunta do usuário: ${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: fullPrompt }] }],
    });

    // Acessa a propriedade .text diretamente, conforme as regras da SDK
    return response.text || "Não foi possível obter uma resposta da IA.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Erro de conexão com o assistente de IA. Verifique as configurações de ambiente da API_KEY no Vercel.";
  }
};