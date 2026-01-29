import { INDUSTRY_TEMPLATES, BOT_TYPES, TONE_OPTIONS, PLATFORM_OPTIONS, FEATURE_OPTIONS, IndustryTemplate } from '../constants/industryTemplates';

export interface WizardState {
    industry: string;
    botType: string;
    tone: string;
    platforms: string[];
    features: string[];
    customRequirements: string;
}

export const generateWizardPrompt = (state: WizardState): string => {
    const template = INDUSTRY_TEMPLATES[state.industry] || INDUSTRY_TEMPLATES.general;
    const botType = Object.values(BOT_TYPES).find(t => t.id === state.botType);
    const tone = Object.values(TONE_OPTIONS).find(t => t.id === state.tone);

    let prompt = template.basePrompt;

    // 1. Identity & Role Refinement
    if (botType) {
        prompt = prompt.replace('asistanısın.', `asistanısın. Öncelikli görevin **${botType.name}** olarak hizmet vermektir.`);
    }

    // 2. Tone & Style
    prompt += `\n\n## 💬 İletişim Tarzı ve Tonalite\n`;
    if (tone) {
        prompt += `- **Tonalite:** ${tone.name}\n`;
        prompt += `- **Örnek:** ${tone.example}\n`;
    }

    // Add platform specific instructions
    if (state.platforms.length > 0) {
        prompt += `- **Platformlar:** ${state.platforms.map(p => PLATFORM_OPTIONS.find(opt => opt.id === p)?.name).join(', ')}\n`;

        if (state.platforms.includes('whatsapp')) {
            prompt += `- Kısa ve net mesajlar kullan (WhatsApp uyumlu)\n`;
            prompt += `- Gereksiz boşluklardan kaçın\n`;
        }
        if (state.platforms.includes('instagram')) {
            prompt += `- Samimi ve etkileşim odaklı ol\n`;
            prompt += `- DM karakter sınırını gözet\n`;
        }
    }

    // 3. Rules & Constraints
    prompt += `\n## 🚫 Kurallar ve Sınırlar\n`;
    template.defaultRules.forEach(rule => {
        prompt += `- ${rule}\n`;
    });

    // Add feature specific rules
    if (state.features.length > 0) {
        prompt += `\n## 🚀 Özellikler ve Yetenekler\n`;
        if (state.features.includes('gdpr')) {
            prompt += `- **KVKK/GDPR:** Kişisel verileri asla kaydetme, hassas bilgi isteme.\n`;
        }
        if (state.features.includes('multilang')) {
            prompt += `- **Çoklu Dil:** Kullanıcının dilini algıla ve aynı dilde yanıt ver (TR/EN).\n`;
        }
        if (state.features.includes('emoji')) {
            prompt += `- **Emoji:** Mesajlarını uygun emoji'lerle zenginleştir. 😊\n`;
        }
        if (state.features.includes('appointment')) {
            prompt += `- **Randevu:** Müsaitlik durumunu kontrol et ve randevu oluşturma adımlarını başlat.\n`;
        }
    }

    // 4. Custom Requirements
    if (state.customRequirements?.trim()) {
        prompt += `\n## 🛠️ Özel Gereksinimler\n`;
        prompt += state.customRequirements.split('\n').map(line => `- ${line}`).join('\n');
    }

    // 5. Example Dialogues
    prompt += `\n\n## 📋 Örnek Diyaloglar\n`;
    template.exampleDialogues.forEach(dialogue => {
        prompt += `\n---\n${dialogue}\n`;
    });

    return prompt;
};
