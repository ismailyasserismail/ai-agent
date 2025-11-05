"""Behavioral checks for the Al Mutahidah agent."""

from ai_agent import AlMutahidahAgent


def test_pricing_response_includes_currency():
    agent = AlMutahidahAgent()
    reply = agent.respond("What is the price for a monthly helper in Riyadh?")
    assert "SAR" in reply
    assert "monthly" in reply.lower()


def test_arabic_message_preserves_language():
    agent = AlMutahidahAgent()
    reply = agent.respond("هل فيه تنظيف بالساعة بكرة في جدة؟")
    # Ensure Arabic characters are present and instructions mention availability.
    assert "أقدر" in reply
    assert "التالي" in reply


def test_default_prompt_when_service_unknown():
    agent = AlMutahidahAgent()
    reply = agent.respond("Hello")
    assert "Al Mutahidah" in reply
    assert reply.splitlines()[0].endswith("help.")
