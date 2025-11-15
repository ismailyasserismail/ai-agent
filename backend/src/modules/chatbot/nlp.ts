import { BotResponse, Intent, TrainingPhrase } from '../knowledge/knowledge.types';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

export interface IntentMatch {
  intent: Intent;
  score: number;
  response: BotResponse | null;
}

export function matchIntent(
  message: string,
  intents: Intent[],
  phrases: TrainingPhrase[],
  responses: BotResponse[],
  preferredLanguage: string
): IntentMatch | null {
  const tokens = tokenize(message);
  let bestMatch: IntentMatch | null = null;

  for (const intent of intents) {
    const intentPhrases = phrases.filter((p) => p.intentId === intent.id);
    const intentResponses = responses.filter((r) => r.intentId === intent.id);
    const highestPhraseScore = intentPhrases.reduce((max, phrase) => {
      const similarity = jaccardSimilarity(tokens, tokenize(phrase.phrase));
      return Math.max(max, similarity);
    }, 0);

    if (!bestMatch || highestPhraseScore > bestMatch.score) {
      const responseForLanguage = intentResponses.find((r) => r.language === preferredLanguage);
      const fallbackResponse = intentResponses.find((r) => r.language === 'en');
      bestMatch = {
        intent,
        score: highestPhraseScore,
        response: responseForLanguage ?? fallbackResponse ?? null,
      };
    }
  }

  if (bestMatch && bestMatch.score > 0.3) {
    return bestMatch;
  }

  return null;
}
