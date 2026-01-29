export interface QualityScore {
    total: number; // 0-100
    categories: {
        clarity: { score: number; max: number; feedback: string[] };
        completeness: { score: number; max: number; feedback: string[] };
        constraints: { score: number; max: number; feedback: string[] };
        examples: { score: number; max: number; feedback: string[] };
        errorHandling: { score: number; max: number; feedback: string[] };
    };
    recommendations: string[];
    strengths: string[];
}

export const analyzePromptQuality = (prompt: string): QualityScore => {
    if (!prompt || prompt.trim().length === 0) {
        return {
            total: 0,
            categories: {
                clarity: { score: 0, max: 25, feedback: ['Prompt boş!'] },
                completeness: { score: 0, max: 25, feedback: ['İçerik yok'] },
                constraints: { score: 0, max: 20, feedback: ['Kısıtlama yok'] },
                examples: { score: 0, max: 15, feedback: ['Örnek yok'] },
                errorHandling: { score: 0, max: 15, feedback: ['Hata yönetimi yok'] },
            },
            recommendations: ['Prompt yazmaya başlayın!'],
            strengths: [],
        };
    }

    const lower = prompt.toLowerCase();
    const lines = prompt.split('\n').filter(l => l.trim());
    const wordCount = prompt.split(/\s+/).length;

    // Category 1: Clarity (25 points)
    let clarityScore = 0;
    const clarityFeedback: string[] = [];

    if (wordCount > 50) { clarityScore += 8; } else { clarityFeedback.push('Çok kısa - daha detaylı olabilir'); }
    if (lower.includes('sen') || lower.includes('you') || lower.includes('asistan')) {
        clarityScore += 8;
    } else {
        clarityFeedback.push('Kimlik tanımı eksik ("Sen bir __ asistanısın")');
    }
    if (lines.length > 5) { clarityScore += 9; } else { clarityFeedback.push('Daha yapılandırılmış olabilir (başlıklar, maddeler)'); }

    // Category 2: Completeness (25 points)
    let completenessScore = 0;
    const completenessFeedback: string[] = [];

    if (lower.includes('görev') || lower.includes('task') || lower.includes('amaç')) {
        completenessScore += 8;
    } else {
        completenessFeedback.push('Ana görev/amaç belirtilmemiş');
    }
    if (lower.includes('ton') || lower.includes('stil') || lower.includes('samimi') || lower.includes('profesyonel')) {
        completenessScore += 8;
    } else {
        completenessFeedback.push('Tonalite tanımı yok (samimi/resmi/profesyonel)');
    }
    if (wordCount > 150) { completenessScore += 9; } else { completenessFeedback.push('Daha kapsamlı olabilir (150+ kelime önerilen)'); }

    // Category 3: Constraints (20 points)
    let constraintsScore = 0;
    const constraintsFeedback: string[] = [];

    if (lower.includes('yapma') || lower.includes('asla') || lower.includes('hiçbir zaman') || lower.includes('yapamazsın')) {
        constraintsScore += 10;
    } else {
        constraintsFeedback.push('Kısıtlamalar belirtilmemiş ("Yapmamalısın:", "Asla:")');
    }
    if (lower.includes('türkçe') || lower.includes('turkish') || lower.includes('language')) {
        constraintsScore += 5;
    } else {
        constraintsFeedback.push('Dil tercihi belirtilmemiş');
    }
    if (lower.includes('max') || lower.includes('en fazla') || lower.includes('kısa')) {
        constraintsScore += 5;
    } else {
        constraintsFeedback.push('Yanıt uzunluk kısıtı yok (örn: "Max 3 paragraf")');
    }

    // Category 4: Examples (15 points)
    let examplesScore = 0;
    const examplesFeedback: string[] = [];

    if (lower.includes('örnek') || lower.includes('example') || lower.includes('mesela')) {
        examplesScore += 10;
    } else {
        examplesFeedback.push('Örnek conversation/scenario yok');
    }
    if (lower.includes('kullanıcı:') || lower.includes('user:') || lower.includes('q:') || lower.includes('a:')) {
        examplesScore += 5;
    } else {
        examplesFeedback.push('Diyalog örnekleri ekle (Kullanıcı: ... / AI: ...)');
    }

    // Category 5: Error Handling (15 points)
    let errorHandlingScore = 0;
    const errorHandlingFeedback: string[] = [];

    if (lower.includes('bilmiyor') || lower.includes('emin değil') || lower.includes('cevap veremez')) {
        errorHandlingScore += 8;
    } else {
        errorHandlingFeedback.push('Bilinmeyen sorular için strateji yok');
    }
    if (lower.includes('yönlendir') || lower.includes('insan') || lower.includes('destek')) {
        errorHandlingScore += 7;
    } else {
        errorHandlingFeedback.push('İnsan desteğine yönlendirme stratejisi eksik');
    }

    const totalScore = clarityScore + completenessScore + constraintsScore + examplesScore + errorHandlingScore;

    // Generate recommendations
    const recommendations: string[] = [];
    const strengths: string[] = [];

    if (clarityScore < 20) recommendations.push('✏️ Daha net kimlik tanımı ekle: "Sen [Rol] olarak [Amaç]..."');
    else strengths.push('✅ Kimlik tanımı net');

    if (completenessScore < 20) recommendations.push('📋 Ana görevleri ve tonaliteyi belirt');
    else strengths.push('✅ Kapsamlı içerik');

    if (constraintsScore < 15) recommendations.push('🚫 Kısıtlamalar ekle: "Asla:", "Yapmamalısın:"');
    else strengths.push('✅ Kısıtlamalar mevcut');

    if (examplesScore < 10) recommendations.push('💬 Örnek diyaloglar ekle (Kullanıcı: ... / AI: ...)');
    else strengths.push('✅ Örnekler var');

    if (errorHandlingScore < 10) recommendations.push('⚠️ Hata yönetimi ekle: "Bilmiyorsan ne yapacaksın?"');
    else strengths.push('✅ Hata yönetimi tanımlı');

    if (totalScore < 60) {
        recommendations.push('🎯 Component Library\'den hazır parçalar ekle');
        recommendations.push('🤖 AI Generator\'ü dene - otomatik oluştur');
    }

    return {
        total: totalScore,
        categories: {
            clarity: { score: clarityScore, max: 25, feedback: clarityFeedback },
            completeness: { score: completenessScore, max: 25, feedback: completenessFeedback },
            constraints: { score: constraintsScore, max: 20, feedback: constraintsFeedback },
            examples: { score: examplesScore, max: 15, feedback: examplesFeedback },
            errorHandling: { score: errorHandlingScore, max: 15, feedback: errorHandlingFeedback },
        },
        recommendations,
        strengths,
    };
};

export const getScoreColor = (score: number, max: number): string => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
};

export const getTotalScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
};

export const getScoreLabel = (score: number): string => {
    if (score >= 90) return 'Mükemmel! 🌟';
    if (score >= 80) return 'Harika! 🎉';
    if (score >= 70) return 'İyi 👍';
    if (score >= 60) return 'Orta 💭';
    if (score >= 40) return 'Geliştirilebilir 📝';
    return 'Çok Zayıf ⚠️';
};
