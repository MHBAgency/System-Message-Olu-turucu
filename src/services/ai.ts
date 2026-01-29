import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

export const initializeAI = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
};

export const sendMessage = async (
    userMessage: string,
    systemPrompt: string,
    conversationHistory: { role: string; content: string }[]
): Promise<string> => {
    if (!genAI) {
        throw new Error('AI not initialized. Please provide an API key.');
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-pro',
            systemInstruction: systemPrompt,
        });

        // Build conversation history
        const history = conversationHistory.map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const optimizePrompt = async (
    currentPrompt: string,
    conversationHistory: { role: string; content: string }[],
    problematicMessage: { user: string; ai: string; annotation?: string },
    apiKey: string
): Promise<{ optimizedPrompt: string; explanation: string }> => {
    const tempGenAI = new GoogleGenerativeAI(apiKey);
    const model = tempGenAI.getGenerativeModel({
        model: 'gemini-2.5-pro',
    });

    const optimizationPrompt = `Sen bir System Prompt Optimization uzmanısın. Görevin mevcut system prompt'u analiz edip iyileştirmek.

**Mevcut System Prompt:**
\`\`\`
${currentPrompt}
\`\`\`

**Konuşma Geçmişi:**
${conversationHistory
            .slice(-5)
            .map((msg) => `${msg.role}: ${msg.content}`)
            .join('\n')}

**Problematik Yanıt:**
Kullanıcı: ${problematicMessage.user}
AI: ${problematicMessage.ai}
${problematicMessage.annotation ? `Kullanıcı Notu: ${problematicMessage.annotation}` : ''}

**Görevlerin:**
1. Problemi analiz et - AI neden hatalı yanıt verdi?
2. System prompt'u iyileştir - Spesifik ve net talimatlar ekle
3. Sadece gerekli kısmı değiştir, tüm prompt'u yeniden yazma

**Yanıt Formatı (JSON):**
{
  "optimizedPrompt": "İyileştirilmiş system prompt",
  "explanation": "Hangi değişiklikleri yaptın ve neden?"
}

Sadece JSON yanıt ver, başka açıklama ekleme.`;

    try {
        const result = await model.generateContent(optimizationPrompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                optimizedPrompt: parsed.optimizedPrompt,
                explanation: parsed.explanation,
            };
        }

        throw new Error('Invalid response format from AI');
    } catch (error) {
        console.error('Error optimizing prompt:', error);
        throw error;
    }
};
