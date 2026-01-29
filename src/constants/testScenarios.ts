export interface TestScenario {
    id: string;
    category: string;
    name: string;
    questions: string[];
}

export const TEST_SCENARIOS: TestScenario[] = [
    {
        id: 'customer-service-basic',
        category: 'customer-service',
        name: 'Müşteri Hizmetleri - Temel Sorular',
        questions: [
            'Merhaba, sipari şim ne zaman gelir?',
            'Ürünümü nasıl iade edebilirim?',
            'Fiyat indirimi yapabilir misiniz?',
            'Kargo ücreti ne kadar?',
            'Ürününüz bozuk geldi, ne yapmalıyım?',
        ],
    },
    {
        id: 'customer-service-complaint',
        category: 'customer-service',
        name: 'Müşteri Hizmetleri - Şikayet',
        questions: [
            'Siparişim hala gelmedi, çok kızdım!',
            'Müşteri hizmetleriniz çok kötü, kimse cevap vermiyor',
            'İade talebim reddedildi, bu kabul edilemez!',
            'Para iadem ne zaman hesabıma yatacak?',
        ],
    },
    {
        id: 'ecommerce-sales',
        category: 'ecommerce',
        name: 'E-commerce - Satış Soruları',
        questions: [
            'Bu ürünün özellikleri neler?',
            'Stoğunuzda var mı?',
            'Taksit seçenekleri neler?',
            'Kargo bedava mı?',
            'İndirim var mı?',
            'Benzer ürünleriniz var mı?',
        ],
    },
    {
        id: 'lead-generation',
        category: 'lead-generation',
        name: 'Lead Generation - İlk Temas',
        questions: [
            'Hizmetleriniz hakkında bilgi alabilir miyim?',
            'Fiyatları öğrenebilir miyim?',
            'Demo talep ediyorum',
            'Şirketiniz hangi şehirlerde hizmet veriyor?',
            'Referanslarınızı görebilir miyim?',
        ],
    },
    {
        id: 'healthcare-appointment',
        category: 'healthcare',
        name: 'Sağlık - Randevu',
        questions: [
            'Randevu almak istiyorum',
            'Hangi doktorlar var?',
            'En erken ne zaman randevu alabilirim?',
            'Randevumu iptal etmek istiyorum',
            'Randevu ücretli mi?',
        ],
    },
    {
        id: 'education-course',
        category: 'education',
        name: 'Eğitim - Kurs Soruları',
        questions: [
            'Hangi kursları önerirsiniz?',
            'Kurs süresi ne kadar?',
            'Sertifika veriliyor mu?',
            'Online mı yoksa yüz yüze mi?',
            'Kurs ücreti ne kadar?',
            'Ödeme planı var mı?',
        ],
    },
];
