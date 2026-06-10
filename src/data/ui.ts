import { DEFAULT_LOCALE, type Locale } from "../lib/i18n";

/** Übersetzungen für Menü-/UI-Texte, gekeyt nach dem deutschen Quell-String. */
export const UI: Record<string, Partial<Record<Locale, string>>> = {
  // ── Navigation ──
  "Startseite": { en: "Home", pl: "Strona główna", tr: "Ana sayfa", ru: "Главная", ar: "الرئيسية" },
  "Angebot": { en: "Offerings", pl: "Oferta", tr: "Hizmetler", ru: "Услуги", ar: "الخدمات" },
  "Yoga": { en: "Yoga", pl: "Yoga", tr: "Yoga", ru: "Йога", ar: "اليوغا" },
  "Pilates": { en: "Pilates", pl: "Pilates", tr: "Pilates", ru: "Пилатес", ar: "بيلاتس" },
  "Massagen": { en: "Massages", pl: "Masaże", tr: "Masajlar", ru: "Массаж", ar: "التدليك" },
  "Heilraum": { en: "Healing Space", pl: "Przestrzeń uzdrawiania", tr: "Şifa Alanı", ru: "Пространство исцеления", ar: "مساحة الشفاء" },
  "Mantra": { en: "Mantra", pl: "Mantra", tr: "Mantra", ru: "Мантра", ar: "المانترا" },
  "Jahreskreis": { en: "Wheel of the Year", pl: "Krąg Roku", tr: "Yıl Döngüsü", ru: "Круг года", ar: "عجلة السنة" },
  "Retreat": { en: "Retreat", pl: "Retreat", tr: "Retreat", ru: "Ретрит", ar: "الخلوة" },
  "Preise": { en: "Prices", pl: "Cennik", tr: "Fiyatlar", ru: "Цены", ar: "الأسعار" },
  "Blog": { en: "Blog", pl: "Blog", tr: "Blog", ru: "Блог", ar: "المدوّنة" },
  "Kontakt": { en: "Contact", pl: "Kontakt", tr: "İletişim", ru: "Контакты", ar: "اتصل بنا" },
  "Über mich": { en: "About me", pl: "O mnie", tr: "Hakkımda", ru: "Обо мне", ar: "عنّي" },

  // ── Marke / Tagline ──
  "Yoga, Pilates & Massagen in Berlin-Pankow": {
    en: "Yoga, Pilates & massages in Berlin-Pankow",
    pl: "Joga, pilates i masaże w Berlin-Pankow",
    tr: "Berlin-Pankow'da yoga, Pilates ve masaj",
    ru: "Йога, пилатес и массаж в Берлин-Панков",
    ar: "يوغا وبيلاتس وتدليك في برلين-بانكوف",
  },

  // ── Buttons / CTAs ──
  "Termin": { en: "Book now", pl: "Umów się", tr: "Randevu", ru: "Запись", ar: "حجز موعد" },
  "Termin vereinbaren": { en: "Book an appointment", pl: "Umów wizytę", tr: "Randevu al", ru: "Записаться", ar: "احجز موعداً" },
  "Alle ansehen": { en: "View all", pl: "Zobacz wszystko", tr: "Tümünü gör", ru: "Показать все", ar: "عرض الكل" },

  // ── Footer ──
  "Entdecken": { en: "Discover", pl: "Odkryj", tr: "Keşfet", ru: "Меню", ar: "استكشف" },
  "Alle Wege zu mir": { en: "All ways to reach me", pl: "Wszystkie drogi do mnie", tr: "Bana ulaşmanın yolları", ru: "Все способы связи", ar: "كل طرق التواصل معي" },
  "Scanne den Code für WhatsApp, Instagram, Anfahrt & mehr.": {
    en: "Scan the code for WhatsApp, Instagram, directions & more.",
    pl: "Zeskanuj kod – WhatsApp, Instagram, dojazd i więcej.",
    tr: "WhatsApp, Instagram, yol tarifi ve daha fazlası için kodu tarayın.",
    ru: "Отсканируйте код: WhatsApp, Instagram, маршрут и другое.",
    ar: "امسح الرمز للوصول إلى واتساب وإنستغرام والاتجاهات والمزيد.",
  },
  "Alle Links": { en: "All links", pl: "Wszystkie linki", tr: "Tüm bağlantılar", ru: "Все ссылки", ar: "كل الروابط" },
  "Mit Achtsamkeit gemacht in Berlin-Pankow.": {
    en: "Made with care in Berlin-Pankow.",
    pl: "Stworzone z uważnością w Berlin-Pankow.",
    tr: "Berlin-Pankow'da özenle yapıldı.",
    ru: "Сделано с заботой в Берлин-Панков.",
    ar: "صُنع بعناية في برلين-بانكوف.",
  },
  "© 2026 Runayoga. Alle Rechte vorbehalten.": {
    en: "© 2026 Runayoga. All rights reserved.",
    pl: "© 2026 Runayoga. Wszelkie prawa zastrzeżone.",
    tr: "© 2026 Runayoga. Tüm hakları saklıdır.",
    ru: "© 2026 Runayoga. Все права защищены.",
    ar: "© 2026 Runayoga. جميع الحقوق محفوظة.",
  },

  // ── Rechtliches ──
  "Impressum": { en: "Imprint", pl: "Nota prawna", tr: "Künye", ru: "Импрессум", ar: "بيانات الناشر" },
  "Datenschutz": { en: "Privacy", pl: "Prywatność", tr: "Gizlilik", ru: "Конфиденциальность", ar: "الخصوصية" },
  "AGB": { en: "Terms", pl: "Regulamin", tr: "Şartlar", ru: "Условия", ar: "الشروط والأحكام" },

  // ── Karte / Map ──
  "So findest du mich": { en: "How to find me", pl: "Jak mnie znaleźć", tr: "Bana nasıl ulaşırsınız", ru: "Как меня найти", ar: "كيف تجدني" },
  "In Google Maps öffnen": { en: "Open in Google Maps", pl: "Otwórz w Google Maps", tr: "Google Haritalar'da aç", ru: "Открыть в Google Maps", ar: "افتح في خرائط جوجل" },
  "Mit Öffentlichen (BVG)": { en: "Public transport (BVG)", pl: "Komunikacją (BVG)", tr: "Toplu taşıma (BVG)", ru: "Транспорт (BVG)", ar: "المواصلات العامة (BVG)" },

  // ── Cards ──
  "Mehr erfahren": { en: "Learn more", pl: "Dowiedz się więcej", tr: "Daha fazla", ru: "Подробнее", ar: "اعرف المزيد" },
  "Eintrag": { en: "entry", pl: "wpis", tr: "kayıt", ru: "запись", ar: "عنصر" },
  "Einträge": { en: "entries", pl: "wpisy", tr: "kayıt", ru: "записей", ar: "عناصر" },

  // ── Kontakt-Block ──
  "E-Mail": { en: "Email", pl: "E-mail", tr: "E-posta", ru: "Эл. почта", ar: "البريد الإلكتروني" },
  "Telefon": { en: "Phone", pl: "Telefon", tr: "Telefon", ru: "Телефон", ar: "الهاتف" },
  "Adresse": { en: "Address", pl: "Adres", tr: "Adres", ru: "Адрес", ar: "العنوان" },
  "Karte": { en: "Map", pl: "Mapa", tr: "Harita", ru: "Карта", ar: "خريطة" },
  "Öffnungszeiten": { en: "Opening hours", pl: "Godziny otwarcia", tr: "Çalışma saatleri", ru: "Часы работы", ar: "ساعات العمل" },
  "Wir sind für dich da": { en: "We're here for you", pl: "Jesteśmy dla Ciebie", tr: "Senin için buradayız", ru: "Мы рядом с вами", ar: "نحن هنا من أجلك" },
  "Schreib uns oder ruf an — wir freuen uns, von dir zu hören und finden gemeinsam den passenden Termin.": {
    en: "Write or call us — we'd love to hear from you and will find the right time together.",
    pl: "Napisz lub zadzwoń — chętnie Cię wysłuchamy i wspólnie znajdziemy odpowiedni termin.",
    tr: "Bize yazın ya da arayın — sizden haber almaktan mutluluk duyar, birlikte uygun bir zaman buluruz.",
    ru: "Напишите или позвоните — мы будем рады услышать вас и вместе подберём удобное время.",
    ar: "راسلنا أو اتصل بنا — يسعدنا أن نسمع منك وسنجد الموعد المناسب معاً.",
  },
  "Nachricht schreiben": { en: "Write a message", pl: "Napisz wiadomość", tr: "Mesaj yaz", ru: "Написать сообщение", ar: "اكتب رسالة" },
  "Mo–Fr": { en: "Mon–Fri", pl: "Pn–Pt", tr: "Pzt–Cum", ru: "Пн–Пт", ar: "الإثنين–الجمعة" },
  "Sa": { en: "Sat", pl: "Sob", tr: "Cmt", ru: "Сб", ar: "السبت" },
  "So": { en: "Sun", pl: "Niedz", tr: "Paz", ru: "Вс", ar: "الأحد" },
  "nach Vereinbarung": { en: "by appointment", pl: "po umówieniu", tr: "randevuyla", ru: "по записи", ar: "بموعد مسبق" },

  // ── Blog ──
  "Weiterlesen": { en: "Read more", pl: "Czytaj więcej", tr: "Devamını oku", ru: "Читать далее", ar: "اقرأ المزيد" },
  "Beitrag": { en: "post", pl: "wpis", tr: "yazı", ru: "запись", ar: "مقال" },
  "Beiträge": { en: "posts", pl: "wpisy", tr: "yazı", ru: "записей", ar: "مقالات" },
};

export function t(de: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return de;
  const entry = UI[de];
  return (entry && entry[locale]) || de;
}
