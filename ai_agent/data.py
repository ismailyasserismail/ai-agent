"""Static knowledge base for the Al Mutahidah concierge agent."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class ServiceProfile:
    """Knowledge record for an Al Mutahidah service."""

    name_en: str
    name_ar: str
    summary_en: str
    summary_ar: str
    price_from: int
    highlights_en: List[str]
    highlights_ar: List[str]


SERVICE_PROFILES: Dict[str, ServiceProfile] = {
    "hourly_cleaning": ServiceProfile(
        name_en="Hourly home cleaning",
        name_ar="تنظيف بالساعة",
        summary_en="Trained cleaners for 2–8 hour visits with supplies on request.",
        summary_ar="عاملات نظافة مدرّبات لزيارات من ٢ إلى ٨ ساعات مع إمكانية توفير الأدوات.",
        price_from=99,
        highlights_en=[
            "Online booking with instant confirmation",
            "Professionally trained and vetted cleaners",
            "Flexible scheduling across major KSA cities",
        ],
        highlights_ar=[
            "حجز إلكتروني بتأكيد فوري",
            "عاملات مدرّبات ومفوّضات رسميًا",
            "مواعيد مرنة تغطي أغلب مدن المملكة",
        ],
    ),
    "monthly_helper": ServiceProfile(
        name_en="Monthly resident domestic helper",
        name_ar="عاملة مقيمة شهرية",
        summary_en="Live-in helper contracts covering accommodation, onboarding, and replacements.",
        summary_ar="عقود عاملة منزلية مقيمة مع السكن والاستقبال والاستبدال متى احتجت.",
        price_from=3499,
        highlights_en=[
            "Flexible 1–12 month contracts",
            "Replacement guarantee and HR support",
            "Philippine, Indonesian, and other nationalities",
        ],
        highlights_ar=[
            "عقود مرنة من شهر حتى ١٢ شهر",
            "ضمان استبدال ودعم موارد بشرية",
            "خيارات متعددة للجنسيات من الفلبين وغيرها",
        ],
    ),
    "monthly_driver": ServiceProfile(
        name_en="Monthly resident driver",
        name_ar="سائق خاص مقيم",
        summary_en="Qualified KSA-licensed drivers for household or personal needs.",
        summary_ar="سائقون مؤهلون برخصة سعودية لخدمة الأسر والأفراد.",
        price_from=3799,
        highlights_en=[
            "Drivers screened and licensed in KSA",
            "Contracts include accommodation support",
            "Ideal for family transportation needs",
        ],
        highlights_ar=[
            "سائقون مجتازون للفحص وبرخصة سارية",
            "يشمل الدعم في السكن والمتابعة",
            "مثالي لتنقلات الأسرة اليومية",
        ],
    ),
    "business": ServiceProfile(
        name_en="Business services",
        name_ar="حلول قطاع الأعمال",
        summary_en="Dedicated manpower solutions and facility support for businesses.",
        summary_ar="حلول قوى عاملة وخدمات تشغيلية مخصصة للشركات.",
        price_from=0,
        highlights_en=[
            "Custom SLAs and onboarding",
            "Experienced corporate account managers",
            "Support for hospitality, retail, and offices",
        ],
        highlights_ar=[
            "اتفاقيات خدمة مخصصة",
            "مديرو حسابات خبراء للقطاع التجاري",
            "خدمات للضيافة والتجزئة والمكاتب",
        ],
    ),
    "recruitment": ServiceProfile(
        name_en="Recruitment & mediation",
        name_ar="الاستقدام والوساطة",
        summary_en="Full recruitment journey management including Philippine workforce.",
        summary_ar="إدارة متكاملة لرحلة الاستقدام بما فيها الأيدي العاملة الفلبينية.",
        price_from=0,
        highlights_en=[
            "Licensed mediation with POEA/DMW partners",
            "Document guidance and embassy coordination",
            "Optional airport pickup and onboarding",
        ],
        highlights_ar=[
            "وساطة مرخّصة مع شركاء معتمدين",
            "إرشاد للمستندات والتنسيق مع السفارات",
            "استقبال المطار وخدمة ما بعد الوصول",
        ],
    ),
}


SERVICE_KEYWORDS = {
    "hourly_cleaning": {
        "en": ["clean", "hourly", "maid", "housekeeper"],
        "ar": ["تنظيف", "عاملة", "بالساعة", "نظافة"],
    },
    "monthly_helper": {
        "en": ["live-in", "helper", "maid", "resident"],
        "ar": ["مقيمة", "شهرية", "عاملة", "خادمة"],
    },
    "monthly_driver": {
        "en": ["driver", "chauffeur"],
        "ar": ["سائق", "سواقة"],
    },
    "business": {
        "en": ["business", "company", "corporate"],
        "ar": ["شركات", "أعمال", "قطاع"],
    },
    "recruitment": {
        "en": ["recruit", "visa", "mediation"],
        "ar": ["استقدام", "تأشيرة", "وساطة"],
    },
}


AR_PRICING_KEYWORDS = ["سعر", "كم", "التكلفة", "العرض"]
EN_PRICING_KEYWORDS = ["price", "cost", "quote", "rate"]

AR_AVAILABILITY_KEYWORDS = ["متى", "متاح", "بكرة", "أقرب", "جدول"]
EN_AVAILABILITY_KEYWORDS = ["available", "availability", "slot", "schedule"]

AR_OFFERS_KEYWORDS = ["عرض", "عروض", "خصم"]
EN_OFFERS_KEYWORDS = ["offer", "promo", "discount"]

AR_GENERAL_TIPS_KEYWORDS = ["نصائح", "طريقة", "كيف"]
EN_GENERAL_TIPS_KEYWORDS = ["tips", "how", "best way"]


def normalize(text: str) -> str:
    return text.lower()
