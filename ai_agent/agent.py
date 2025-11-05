"""Rule-based concierge agent for Al Mutahidah."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable, List, Optional

from .data import (
    AR_AVAILABILITY_KEYWORDS,
    AR_GENERAL_TIPS_KEYWORDS,
    AR_OFFERS_KEYWORDS,
    AR_PRICING_KEYWORDS,
    EN_AVAILABILITY_KEYWORDS,
    EN_GENERAL_TIPS_KEYWORDS,
    EN_OFFERS_KEYWORDS,
    EN_PRICING_KEYWORDS,
    SERVICE_KEYWORDS,
    SERVICE_PROFILES,
)

ARABIC_CHAR_PATTERN = re.compile(r"[\u0600-\u06FF]")


@dataclass
class AgentResponse:
    """Structured representation of a response."""

    summary: str
    actions: List[str]

    def render(self) -> str:
        lines = [self.summary]
        if self.actions:
            lines.extend(f"- {action}" for action in self.actions)
        return "\n".join(lines)


class AlMutahidahAgent:
    """Simple rule-based assistant that mirrors company concierge behavior."""

    def __init__(self) -> None:
        self._last_language: Optional[str] = None

    def respond(self, message: str) -> str:
        """Return a formatted response for the provided user message."""

        language = self._detect_language(message)
        self._last_language = language

        service = self._match_service(message)
        topic = self._detect_topic(message, language)

        if topic == "pricing" and service:
            response = self._handle_pricing(service, language)
        elif topic == "availability" and service:
            response = self._handle_availability(service, language)
        elif topic == "offers":
            response = self._handle_offers(service, language)
        elif topic == "tips":
            response = self._handle_general_tips(language)
        elif service:
            response = self._handle_service_overview(service, language)
        else:
            response = self._handle_default(language)

        return response.render()

    # --- language helpers -------------------------------------------------

    def _detect_language(self, message: str) -> str:
        if ARABIC_CHAR_PATTERN.search(message):
            return "ar"
        return "en"

    # --- service/topic detection -----------------------------------------

    def _match_service(self, message: str) -> Optional[str]:
        lowered = message.lower()
        best_service: Optional[str] = None
        best_score = 0
        for service, keywords in SERVICE_KEYWORDS.items():
            unique_keywords = set(self._iter_keywords(keywords["en"], keywords["ar"]))
            score = sum(1 for keyword in unique_keywords if keyword in lowered)
            if score > best_score:
                best_service = service
                best_score = score
        return best_service

    def _detect_topic(self, message: str, language: str) -> str:
        lowered = message.lower()
        if self._contains_any(lowered, EN_PRICING_KEYWORDS if language == "en" else AR_PRICING_KEYWORDS):
            return "pricing"
        if self._contains_any(lowered, EN_AVAILABILITY_KEYWORDS if language == "en" else AR_AVAILABILITY_KEYWORDS):
            return "availability"
        if self._contains_any(lowered, EN_OFFERS_KEYWORDS if language == "en" else AR_OFFERS_KEYWORDS):
            return "offers"
        if self._contains_any(lowered, EN_GENERAL_TIPS_KEYWORDS if language == "en" else AR_GENERAL_TIPS_KEYWORDS):
            return "tips"
        return "overview"

    @staticmethod
    def _iter_keywords(*groups: Iterable[str]) -> Iterable[str]:
        for group in groups:
            for keyword in group:
                yield keyword.lower()

    @staticmethod
    def _contains_any(text: str, keywords: Iterable[str]) -> bool:
        return any(keyword.lower() in text for keyword in keywords)

    # --- response builders -------------------------------------------------

    def _handle_pricing(self, service: str, language: str) -> AgentResponse:
        profile = SERVICE_PROFILES[service]
        if language == "ar":
            price = profile.price_from
            summary = (
                f"سعر {profile.name_ar} يبدأ من **{price:,} ريال** شهريًا حسب المدينة والخطة."
                if price
                else f"تكلفة {profile.name_ar} تعتمد على احتياجك، ونحسبها لك مباشرة."
            )
            actions = [
                "التالي → أرسل المدينة ومدة العقد/عدد الساعات وأي كود خصم للتحقق وإصدار العرض.",
            ]
        else:
            price = profile.price_from
            summary = (
                f"Pricing for {profile.name_en} starts from **SAR {price:,}** depending on city and plan."
                if price
                else f"The cost for {profile.name_en} depends on your exact requirements; I can quote it now."
            )
            actions = [
                "Next → Share your city, desired duration, and any promo code so I can lock the quote.",
            ]
        return AgentResponse(summary=summary, actions=actions)

    def _handle_availability(self, service: str, language: str) -> AgentResponse:
        profile = SERVICE_PROFILES[service]
        if language == "ar":
            summary = f"حاضر—أقدر أشيك على توفر {profile.name_ar} في مدينتك."
            actions = [
                "التالي → عطنا المدينة، التاريخ، والوقت المفضل مع عدد الساعات للتأكد من التوفر فورًا.",
            ]
        else:
            summary = f"Sure—I can check {profile.name_en} availability for your city."
            actions = [
                "Next → Send the city, preferred date/time, and hours so I can confirm the schedule.",
            ]
        return AgentResponse(summary=summary, actions=actions)

    def _handle_offers(self, service: Optional[str], language: str) -> AgentResponse:
        if language == "ar":
            target = SERVICE_PROFILES[service].name_ar if service else "الخدمة المطلوبة"
            summary = f"أتحقق من العروض المتاحة لـ{target} الآن."
            actions = [
                "التالي → اكتب المدينة والخدمة المطلوبة لأرسل لك الخصومات السارية أو كود العرض." if service else "التالي → حدد الخدمة والمدينة لعرض الخصومات الحالية.",
            ]
        else:
            target = SERVICE_PROFILES[service].name_en if service else "the service you need"
            summary = f"Let me check active offers for {target}."
            actions = [
                "Next → Tell me the city and service so I can share available promos." if service else "Next → Specify the service and city to see current discounts.",
            ]
        return AgentResponse(summary=summary, actions=actions)

    def _handle_general_tips(self, language: str) -> AgentResponse:
        if language == "ar":
            summary = "إليك نصيحة عامة—تذكر أنها إرشادات منزلية وليست سياسة رسمية للشركة."
            actions = [
                "نظّف البقعة سريعًا بمنديل قطن مبلل بماء فاتر ومنظف خفيف.",
                "جرّب في زاوية مخفية قبل التطبيق الكامل.",
                "احجز زيارة تنظيف عميق لو احتجت دعم إضافي.",
            ]
        else:
            summary = "Here’s a quick general tip—this is housekeeping advice, not a formal policy."
            actions = [
                "Blot the spot with a damp cloth and mild cleaner immediately.",
                "Test products on a hidden area first.",
                "Book a deep-cleaning visit if you want professional help.",
            ]
        return AgentResponse(summary=summary, actions=actions)

    def _handle_service_overview(self, service: str, language: str) -> AgentResponse:
        profile = SERVICE_PROFILES[service]
        if language == "ar":
            summary = f"{profile.name_ar}: {profile.summary_ar}"
            actions = [
                *profile.highlights_ar,
                "التالي → حدد المدينة والخدمة المطلوبة لنكمل الحجز أو التسعير.",
            ]
        else:
            summary = f"{profile.name_en}: {profile.summary_en}"
            actions = [
                *profile.highlights_en,
                "Next → Tell me your city and timing so I can proceed with booking or pricing.",
            ]
        return AgentResponse(summary=summary, actions=actions)

    def _handle_default(self, language: str) -> AgentResponse:
        if language == "ar":
            summary = "أهلاً! أنا مساعد المتحدة للخدمات المنزلية ومستعد أساعدك."
            actions = [
                "التالي → أخبرني بالخدمة (تنظيف، عاملة مقيمة، سائق، شركات، استقدام) والمدينة للبدء فورًا.",
            ]
        else:
            summary = "Hi! I’m the Al Mutahidah concierge and ready to help."
            actions = [
                "Next → Let me know the service (hourly cleaning, resident helper, driver, business, recruitment) and your city to get started.",
            ]
        return AgentResponse(summary=summary, actions=actions)
