/**
 * Random badge subtitle variations for the header
 * Self-aware, self-deprecating commentary on AI tools
 */

const BADGE_SUBTITLES = [
  "Because why not? We use it for everything else.",
  "Another AI tool you definitely needed.",
  "Because everything needs AI now, apparently.",
  "AI solving problems nobody asked it to solve.",
  "Peak human innovation right here.",
  "The future is now, and it's pointless.",
  "Finally, technology we can be proud of.",
  "What a time to be alive and irresponsible.",
  "The answer to a question nobody asked.",
  "Because human excuses are so last year.",
  "Finally, AI has a real world purpose",
  "Using cutting-edge tech for pointless stuff.",
  "Oh great, another AI powered app",
  "Because if it's not AI-powered, does it even exist?",
  "This is what they trained the models for.",
] as const;

/**
 * Get a random badge subtitle
 */
export function getRandomSubtitle(): string {
  const randomIndex = Math.floor(Math.random() * BADGE_SUBTITLES.length);
  return BADGE_SUBTITLES[randomIndex];
}
