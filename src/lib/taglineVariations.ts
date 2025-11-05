/**
 * Tagline variations with matching form labels
 * Each variation creates tone consistency from tagline → form → placeholder
 */

export interface TaglineVariation {
  tagline: {
    line1: string;
    line2: string;
  };
  formLabels: {
    situation: string;
    audience: string;
    placeholder: string;
  };
}

export const taglineVariations: TaglineVariation[] = [
  {
    tagline: {
      line1: "Bad things happen. You get blamed.",
      line2: "Let's craft an excuse that reflects that truth."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's blaming you?",
      placeholder: "Example: I missed the quarterly presentation that my boss spent three weeks preparing for"
    }
  },
  {
    tagline: {
      line1: "Sometimes the truth needs a little polish.",
      line2: "Generate perfectly reasonable explanations. No judgement."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who are you explaining to?",
      placeholder: "Example: I showed up two hours late to my daughter's first piano recital"
    }
  },
  {
    tagline: {
      line1: "Look, we both know you're innocent. Technically.",
      line2: "Let's make sure everyone else knows it too."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who needs convincing?",
      placeholder: "Example: I completely forgot about our 10-year wedding anniversary dinner reservation"
    }
  },
  {
    tagline: {
      line1: "Everyone deserves a good defence. Even you.",
      line2: "Especially you. Generate excuses tailored to your situation."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's asking?",
      placeholder: "Example: I didn't finish the project that's been due for six months and the client is furious"
    }
  },
  {
    tagline: {
      line1: "Correlation isn't causation.",
      line2: "Just because you were there doesn't mean it's your fault."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's connecting the dots?",
      placeholder: "Example: The entire company database crashed five minutes after I ran my script"
    }
  },
  {
    tagline: {
      line1: "The universe has a funny way of pointing fingers.",
      line2: "Usually at you. Let's redirect that blame."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's pointing fingers?",
      placeholder: "Example: Our biggest client left after I accidentally replied-all with complaints about them"
    }
  },
  {
    tagline: {
      line1: "Accountability is overrated.",
      line2: "Generate believable explanations for literally anything."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who wants accountability?",
      placeholder: "Example: I spent the entire marketing budget on a conference in Ibiza that I forgot to tell anyone about"
    }
  },
  {
    tagline: {
      line1: "You're not avoiding responsibility.",
      line2: "You're strategically reframing the narrative."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's hearing your side?",
      placeholder: "Example: I missed the emergency call from my boss whilst I was at the beach for the weekend"
    }
  },
  {
    tagline: {
      line1: "It's not lying if you believe it.",
      line2: "We'll help you believe it. Generate excuses that convince everyone."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who do you need to convince?",
      placeholder: "Example: I ignored 47 reminder emails about submitting my expense reports before the audit"
    }
  },
  {
    tagline: {
      line1: "Context is everything.",
      line2: "And with the right context, nothing is your fault."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's missing the context?",
      placeholder: "Example: I cancelled our holiday plans that we booked 18 months ago, three days before departure"
    }
  },
  {
    tagline: {
      line1: "Bad timing. Wrong place. Totally innocent.",
      line2: "Let's make sure your story reflects these facts."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who needs your side?",
      placeholder: "Example: I arrived four hours late to my own surprise birthday party that everyone flew in for"
    }
  },
  {
    tagline: {
      line1: "They're going to ask questions.",
      line2: "We'll make sure you have answers. Very good answers."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's asking questions?",
      placeholder: "Example: I completely forgot about the board meeting where I was supposed to present our annual results"
    }
  },
  {
    tagline: {
      line1: "Plausible deniability is an art form.",
      line2: "Consider us your personal gallery."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who are you explaining to?",
      placeholder: "Example: I didn't see any of the 23 text messages about collecting my mother-in-law from the airport"
    }
  },
  {
    tagline: {
      line1: "You were merely adjacent to the problem.",
      line2: "Generate excuses that establish proper distance."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who thinks you're involved?",
      placeholder: "Example: The office printer exploded in flames exactly three seconds after I hit print on my 500-page document"
    }
  },
  {
    tagline: {
      line1: "Responsibility is a spectrum.",
      line2: "We specialise in the 'definitely not me' end."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's asking about it?",
      placeholder: "Example: I left the front door unlocked and someone walked in and stole everything we own"
    }
  },
  {
    tagline: {
      line1: "Every story has two sides.",
      line2: "Yours just happens to be more convenient."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who heard the other side first?",
      placeholder: "Example: I left my best friend's wedding reception during the speeches to go to a different party"
    }
  },
  {
    tagline: {
      line1: "The facts are debatable. Highly debatable.",
      line2: "Let's debate them in your favour."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who are we debating with?",
      placeholder: "Example: I turned in my dissertation three weeks after the final deadline for graduation"
    }
  },
  {
    tagline: {
      line1: "Mistakes were made. By someone.",
      line2: "Generate excuses proving that someone wasn't you."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who thinks it was you?",
      placeholder: "Example: I accidentally deleted the only backup copy of five years of company financial records"
    }
  },
  {
    tagline: {
      line1: "You're not making excuses.",
      line2: "You're providing alternative perspectives on reality."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who needs perspective?",
      placeholder: "Example: I didn't attend my sister's birthday party that she had been planning for 11 months"
    }
  },
  {
    tagline: {
      line1: "Life is complicated. Blame is simple.",
      line2: "Let's complicate the blame part."
    },
    formLabels: {
      situation: "What happened?",
      audience: "Who's simplifying the blame?",
      placeholder: "Example: I lost my house keys, car keys, and work badge all in the same week during the busiest time of year"
    }
  }
];

/**
 * Get a random tagline variation
 */
export function getRandomVariation(): TaglineVariation {
  const randomIndex = Math.floor(Math.random() * taglineVariations.length);
  return taglineVariations[randomIndex];
}
