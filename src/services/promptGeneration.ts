import { initializeAI } from './ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeneratorAnswers {
    botType: string;
    industry: string;
    mainGoals: string;
    tone: string;
    constraints: string;
    additionalInfo: string;
}

export const generatePromptFromAnswers = async (answers: GeneratorAnswers, apiKey: string): Promise<string> => {
    initializeAI(apiKey);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const generationPrompt = `Sen bir expert system prompt yazarısın. Aşağıdaki bilgilere dayanarak profesyonel, kapsamlı ve etkili bir system prompt oluştur:

**Chatbot Türü:** ${answers.botType}
**Sektör:** ${answers.industry}
**Ana Görevler:** ${answers.mainGoals}
**Tonalite:** ${answers.tone}
**Kısıtlamalar:** ${answers.constraints}
**Ek Bilgiler:** ${answers.additionalInfo || ''}

Lütfen aşağıdaki yapıda, profesyonel ve detaylı bir system prompt yaz:

1. **Kimlik Tanımı** - "Sen..." ile başla, rolü net belirt
2. **Ana Görevler** - Bullet points ile görevleri listele
3. **Tonalite & Stil** - Konuşma tarzını detayl\u0131ca tanımla
4. **Kısıtlamalar** - "Asla:", "Hiçbir zaman:" ile listele
5. **Hata Yönetimi** - Bilinmeyen sorular için strateji
6. **Örnek Diyaloglar** - En az 2 örnek conversation

ÖNEMLI:
- Türkçe yaz
- Konkret ve actionable ol
- Best practices uygula (örnek diyaloglar, net kısıtlamalar, hata yönetimi)
- Minimum 200 kelime olsun
- Profesyonel formatta yaz

Sadece system prompt'u yaz, başka açıklama ekleme.`;

    const result = await model.generateContent(generationPrompt);
    const response = result.response;
    const generatedPrompt = response.text();

    return generatedPrompt;
};
