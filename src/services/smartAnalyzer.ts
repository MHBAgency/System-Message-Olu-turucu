import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeAI } from './ai';

export interface AnalysisContext {
    industry: string;
    botType: string;
    language: string;
    targetAudience: string;
    complexity: 'Basit' | 'Orta' | 'Gelişmiş';
}

export interface CategoryScore {
    identity: number;
    tasks: number;
    rules: number;
    tone: number;
    errorHandling: number;
    examples: number;
    security: number;
    readability: number;
    consistency: number;
    completeness: number;
    total: number;
}

export interface Suggestion {
    id: string;
    title: string;
    severity: 'critical' | 'important' | 'recommended';
    category: string;
    reasoning: string;
    contentToAdd: string;
    insertPosition: 'start' | 'rules' | 'examples' | 'errors' | 'end';
}

export interface SmartAnalysisResult {
    context: AnalysisContext;
    scores: CategoryScore;
    suggestions: Suggestion[];
    gaps: string[];
    strengths: string[];
}

export const analyzePromptSmart = async (
    prompt: string,
    apiKey: string
): Promise<SmartAnalysisResult> => {
    initializeAI(apiKey);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const analysisPrompt = `Sen bir expert prompt analyzer'sın. Verilen system prompt'u DETAYLI analiz edeceksin.

**GÖREV:**
1. Context tespit et (sektör, bot türü, dil vb)
2. 10 kategoride detaylı puanla (0-100)
3. Akıllı, uygulanabilir öneriler sun

**ANALİZ YAPISI:**

## 1. CONTEXT DETECTİON
Prompt'u oku ve tespit et:
- **Industry**: E-commerce, Sağlık, Eğitim, Finans, Genel, vb (EN UYGUN SEKTÖR)
- **Bot Type**: Müşteri Hizmetleri, Satış, Destek, Asistan, Öğretmen, vb
- **Language**: Türkçe, İngilizce, Mix
- **Target Audience**: B2B, B2C, İç Kullanım
- **Complexity**: Basit (100-500 kelime), Orta (500-2000), Gelişmiş (2000+)

## 2. DETAYLI PUANLAMA (0-100 her kategori)

### 2.1 Identity Clarity (Kimlik Netliği)
- Bot kendini tanımlamış mı?
- Rol ve sorumluluklar net mi?
- **Puan**: 0-100

### 2.2 Task Definition (Görev Tanımı)
- Ana görevler açık mı?
- Ne yapacağı belirtilmiş mi?
- **Puan**: 0-100

### 2.3 Rules & Constraints (Kurallar)
- Yapılacak/yapılmayacaklar var mı?
- Kısıtlamalar belirtilmiş mi?
- **Puan**: 0-100

### 2.4 Tone & Communication (İletişim)
- Tonalite tanımlanmış mı?
- İletişim tarzı net mi?
- **Puan**: 0-100

### 2.5 Error Handling (Hata Yönetimi)
- Bilinmeyen sorularda ne yapacak?
- Hata durumları ele alınmış mı?
- **Puan**: 0-100

### 2.6 Examples (Örnekler)
- Örnek diyaloglar var mı?
- Sayıca yeterli mi? (en az 3-5)
- **Puan**: 0-100

### 2.7 Security & Compliance (Güvenlik)
- Gizlilik kuralları var mı?
- Compliance (KVKK, GDPR vb) ele alınmış mı?
- **Puan**: 0-100

### 2.8 Readability (Okunabilirlik)
- Format düzgün mü?
- Başlıklar organize mi?
- **Puan**: 0-100

### 2.9 Consistency (Tutarlılık)
- Tonalite tutarlı mı (sen/siz)?
- Terminoloji tutarlı mı?
- **Puan**: 0-100

### 2.10 Completeness (Tamlık)
- Tüm standart bölümler var mı?
- Eksik alan var mı?
- **Puan**: 0-100

**TOPLAM**: (Tüm kategorilerin toplamı, max 1000)

## 3. AKILLI ÖNERİLER

Her öneri şu formatta:

**Öneri Kriterleri:**
- **Severity**: critical (zorunlu), important (önemli), recommended (tavsiye)
- **Personalized**: Tespit edilen industry/context'e ÖZEL olmalı
- **Actionable**: Uygulanabilir, somut içerik olmalı
- **Smart**: Generic değil, prompt'a özel

**Öneri Örnekleri (Industry-Specific):**

### E-commerce için:
{
  "title": "Fiyat Taahhüdü Yasağı Ekle",
  "severity": "critical",
  "category": "rules",
  "reasoning": "E-commerce botları fiyat garantisi vermemeli - değişken fiyatlar sorun yaratır",
  "contentToAdd": "## 🚫 ASLA YAPMA\\n- ASLA kesin fiyat taahhüdünde bulunma\\n- 'Güncel fiyat için www.site.com adresini kontrol edin' de\\n- Fiyatlar değişebilir uyarısı yap",
  "insertPosition": "rules"
}

### Sağlık için:
{
  "title": "Tıbbi Sorumluluk Reddi",
  "severity": "critical",
  "category": "security",
  "reasoning": "Sağlık botları yasal sorumluluk taşır - disclaimer zorunlu",
  "contentToAdd": "## ⚠️ TIBBİ SORUMLULUK REDDİ\\n- ASLA tıbbi tanı koyma\\n- ASLA ilaç önerme\\n- Sadece genel bilgi ver\\n- Acil durumlarda 112'yi ara diye yönlendir",
  "insertPosition": "start"
}

### Missing Examples:
{
  "title": "Örnek Diyaloglar Ekle (×3)",
  "severity": "important",
  "reasoning": "Örnekler bot'un davranışını netleştirir ve kalite puanını yükseltir",
  "contentToAdd": "## 📌 Örnek Diyaloglar\\n\\n### Örnek 1: [Senaryo]\\n**Kullanıcı:** \\"....\\"\\n**Sen:** \\"....\\"\\n\\n### Örnek 2: [Senaryo]\\n**Kullanıcı:** \\"....\\"\\n**Sen:** \\"....\\"\\n\\n### Örnek 3: [Senaryo]\\n**Kullanıcı:** \\"....\\"\\n**Sen:** \\"....\\"",
  "insertPosition": "examples"
}

**ÖNEMLİ:**
- Her öneri PROMPT'A ÖZEL olmalı
- Generic şablonlar değil, context-aware öneriler
- En az 3-8 öneri sun
- Severity'ye göre sırala (critical → important → recommended)

## 4. GAPS (Eksikler) & STRENGTHS (Güçlü Yanlar)

**Gaps**: Eksik olan bölümler listelensin
**Strengths**: İyi yapılmış kısımlar övülsün

---

**ÇIKTI FORMATI (JSON):**

\`\`\`json
{
  "context": {
    "industry": "E-commerce",
    "botType": "Müşteri Hizmetleri",
    "language": "Türkçe",
    "targetAudience": "B2C",
    "complexity": "Orta"
  },
  "scores": {
    "identity": 85,
    "tasks": 70,
    "rules": 60,
    "tone": 75,
    "errorHandling": 30,
    "examples": 20,
    "security": 40,
    "readability": 80,
    "consistency": 65,
    "completeness": 55,
    "total": 580
  },
  "suggestions": [
    {
      "id": "1",
      "title": "...",
      "severity": "critical",
      "category": "rules",
      "reasoning": "...",
      "contentToAdd": "...",
      "insertPosition": "rules"
    }
  ],
  "gaps": ["Hata yönetimi eksik", "Örnekler yetersiz"],
  "strengths": ["Kimlik çok net tanımlanmış", "Tonalite tutarlı"]
}
\`\`\`

---

**ANALİZ EDİLECEK PROMPT:**

${prompt}

---

**UNUTMA:**
- Context'i DİKKATLİCE tespit et
- Her kategoriyi ADIL puanla (0-100)
- Önerileri PROMPT'A ÖZEL yap
- Industry best practices uygula
- Actionable, uygulanabilir öneriler sun

JSON formatında yanıt ver!`;

    try {
        const result = await model.generateContent(analysisPrompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
            responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);

        // Add IDs to suggestions if not present
        if (parsed.suggestions) {
            parsed.suggestions = parsed.suggestions.map((s: Suggestion, idx: number) => ({
                ...s,
                id: s.id || `suggestion-${idx + 1}`
            }));
        }

        return parsed as SmartAnalysisResult;
    } catch (error) {
        console.error('Error in smart analysis:', error);
        throw new Error(`Failed to analyze prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
