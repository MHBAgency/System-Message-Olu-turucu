import { GoogleGenerativeAI } from '@google/generative-ai';
import { initializeAI } from './ai';

export const organizePrompt = async (prompt: string, apiKey: string): Promise<{
    organized: string;
    changes: string[];
    conflicts: string[];
}> => {
    initializeAI(apiKey);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const organizationPrompt = `Sen bir expert prompt organizer'sın. Görevi: Verilen system prompt'u DÜZENLEMEKTİR, DEĞİŞTİRMEMEKTİR.

**ÇOK ÖNEMLİ KURALLAR:**
1. İçeriği ASLA değiştirme - sadece organize et
2. Hiçbir bilgiyi silme veya önemini değiştirme
3. Anlamı koruyarak sadece yapıyı düzelt
4. Tekrar eden kuralları birleştir
5. Çelişkileri tespit et ama düzeltme (sadece raporla)

**YAPILACAK AKSİYONLAR:**

1. **Placeholder Temizliği:**
   - "TODO", "Buraya eklenecek", "...", "[X]" gibi eksik kısımları tespit et
   - Bunları temizle ve "changes" array'ine ekle
   - Gerçek içerik varsa koru, sadece placeholder'ları sil

2. **Emoji/Icon Ekle:**
   - Her ana başlık için uygun emoji ekle
   - Örnekler: 🎯 Görevler, 📋 Kurallar, 💬 İletişim, ⚠️ Hata Yönetimi, 🔒 Güvenlik, 📌 Örnekler
   - Tutarlı şekilde kullan

3. **Tonalite Tutarlılığı:**
   - "Sen" vs "Siz" karışıklığını düzelt - hep aynısını kullan
   - "Yapmalısın" vs "Yapacaksın" vs "Yap" → tek bir tarz seç
   - Tutarlı olsun

4. **Eksik Bölüm Tespiti:**
   - Standart bölümler: Kimlik, Görevler, Kurallar, İletişim Tarzı, Hata Yönetimi, Örnekler
   - Eksik olanları "⚠️ EKSİK BÖLÜMLER" altında raporla (conflicts array'de)
   - Yeni bölüm ekleme, sadece eksikleri raporla

5. **Format Standardizasyonu:**
   - Bullet tutarlılığı: hep \`-\` kullan
   - Numbering düzelt: 1. 2. 3. sıralı olsun
   - Başlık seviyelerini düzelt: # (ana), ## (alt), ### (detay)
   - Boş satırları normalize et (başlıklar arası 2 satır, paragraflar arası 1 satır)

6. **Tekrarları Birleştir:**
   - Aynı kuraldan birden fazla yerde bahsedilmişse birleştir
   - "Müşteri memnuniyeti" 5 yerde geçiyorsa 1 yere indir
   - Bilgi kaybı olmadan merge et

7. **Semantic Grouping:**
   - İlgili kuralları yakın gruplara topla
   - Örn: "Müşteri iletişimi" kurallarını aynı bölümde
   - "Güvenlik/Gizlilik" kurallarını bir arada

8. **Öncelik Sıralaması:**
   - "ASLA", "KEsinlikle", "Zorunlu" gibi kritik kuralları yukarı taşı
   - Önemli → Normal → Opsiyonel sıralaması

9. **Çelişki Tespiti:**
   - Birbiriyle çelişen kuralları bul
   - Bunları **düzeltme**, sadece conflicts array'de raporla
   - Örn: "Her zaman resmi ol" vs "Samimi ve arkadaş canlısı ol"

**ÇIKTI FORMATI:**
\`\`\`json
{
  "organized": "Düzenlenmiş prompt metni (markdown formatında, emoji'lerle)",
  "changes": [
    "2 placeholder temizlendi",
    "Emoji başlıklar eklendi",
    "Tonalite 'sen' olarak standardize edildi",
    "Tekrar eden 'müşteri memnuniyeti' kuralı birleştirildi",
    "Format düzeltildi: bullet'lar standardize edildi"
  ],
  "conflicts": [
    "⚠️ Çelişki: 'Her zaman resmi' vs 'Samimi ol'",
    "⚠️ Eksik bölüm: Hata Yönetimi bölümü yok",
    "⚠️ Eksik bölüm: Örnek diyaloglar eksik"
  ]
}
\`\`\`

**ÖNERİLEN YAPILANMA:**

# 🤖 [Bot İsmi/Kimliği]

Kimlik tanımı...

## 🎯 Ana Görevler
1. ...
2. ...

## 📋 Kurallar ve Kısıtlamalar

### 🔒 Kritik Kurallar
- ASLA yapılmayacaklar...

### ✅ Standart Kurallar
- Normal kurallar...

## 💬 İletişim Tarzı
- Tonalite...
- Dil özellikleri...

## ⚠️ Hata Yönetimi
- Bilinmeyen sorularda ne yapacaksın...
- Hata durumları...

## 📌 Örnekler

### Örnek 1: [Senaryo]
**Kullanıcı:** "..."
**Sen:** "..."

---

**ORGANİZE EDİLECEK PROMPT:**

${prompt}

---

**UNUTMA:** 
- İçeriği değiştirme, sadece organize et!
- Tüm bilgileri koru!
- Emoji ekle, format düzelt, tekrarları birleştir!
- Eksikleri ve çelişkileri raporla ama düzeltme!

JSON formatında yanıt ver:`;

    try {
        const result = await model.generateContent(organizationPrompt);
        const responseText = result.response.text();

        // Extract JSON from response
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) ||
            responseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('Invalid response format from AI');
        }

        const jsonText = jsonMatch[1] || jsonMatch[0];
        const parsed = JSON.parse(jsonText);

        return {
            organized: parsed.organized || responseText,
            changes: parsed.changes || [],
            conflicts: parsed.conflicts || []
        };
    } catch (error) {
        console.error('Error organizing prompt:', error);
        throw new Error(`Failed to organize prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};
