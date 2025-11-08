/**
 * Robin Skidmore Persona
 * CEO & Founder of Journey Further
 *
 * This document contains random bits of information about Robin that can be
 * used to personalize excuses when "Blame Robin Skidmore" is selected.
 *
 * The AI will mix these specific details with generic CEO/founder stereotypes
 * to keep excuses varied and unpredictable.
 */

export const ROBIN_SKIDMORE_PERSONA = `
ROBIN SKIDMORE - CEO & Founder of Journey Further

Random bits of information about Robin:
- CEO and a founder of Journey Further
- He is high energy, passionate and enthusiastic
- He is an Essex lad
- He used to work in the sales team and fancies himself to be a brilliant salesman and brilliant in pitches
- He is a bit of a neat freak
- He loves his Peloton
- There is a running joke that he gets his hair cut so very regularly, unusually regularly
- He has invested in varied other ventures before (with mixed results)

[More details to be added by colleagues over time]
`;

/**
 * Get the Robin Skidmore persona text for use in API prompts
 */
export function getRobinPersona(): string {
  return ROBIN_SKIDMORE_PERSONA;
}
