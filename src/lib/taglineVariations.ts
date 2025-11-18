/**
 * Tagline variations for the hero section
 * Each variation is randomly selected on page load
 */

export interface TaglineVariation {
  tagline: {
    line1: string;
    line2: string;
  };
}

export const taglineVariations: TaglineVariation[] = [
  {
    tagline: {
      line1: "Bad things happen. You get blamed.",
      line2: "We'll help you craft an excuse that reflects the truth. Your truth."
    }
  },
  {
    tagline: {
      line1: "Look, we both know you're innocent. Technically.",
      line2: "We'll help you make sure everyone else knows it too."
    }
  },
  {
    tagline: {
      line1: "Everyone deserves a good defence. Even you.",
      line2: "Especially you. We'll generate excuses tailored to your situation."
    }
  },
  {
    tagline: {
      line1: "Correlation isn't causation.",
      line2: "We'll help you prove being there doesn't mean it's your fault."
    }
  },
  {
    tagline: {
      line1: "The universe has a funny way of pointing fingers.",
      line2: "Usually at you. We'll help you redirect that blame elsewhere."
    }
  },
  {
    tagline: {
      line1: "Accountability is overrated.",
      line2: "We'll generate believable explanations for literally anything."
    }
  },
  {
    tagline: {
      line1: "You're not avoiding responsibility.",
      line2: "We'll help you strategically reframe the narrative. Big difference."
    }
  },
  {
    tagline: {
      line1: "It's not lying if you believe it.",
      line2: "We'll help you believe it. And convince everyone else too."
    }
  },
  {
    tagline: {
      line1: "Context is everything.",
      line2: "We'll provide the right context. The kind where nothing is your fault."
    }
  },
  {
    tagline: {
      line1: "They're going to ask questions.",
      line2: "We'll make sure you have answers. Very good answers."
    }
  },
  {
    tagline: {
      line1: "The facts are debatable. Highly debatable.",
      line2: "We'll help you debate them in your favour. Vigorously."
    }
  },
  {
    tagline: {
      line1: "Mistakes were made. By someone.",
      line2: "We'll generate excuses proving that someone wasn't you."
    }
  },
  {
    tagline: {
      line1: "The algorithm changed. Again. Obviously.",
      line2: "We'll explain why your campaign tanked through no fault of yours."
    }
  },
  {
    tagline: {
      line1: "SEO takes time. Conveniently, unlimited time.",
      line2: "We'll explain why those rankings still haven't materialised. Convincingly."
    }
  },
  {
    tagline: {
      line1: "The data tells a story. We'll help you tell a better one.",
      line2: "We'll generate explanations for metrics that absolutely don't make sense."
    }
  },
  {
    tagline: {
      line1: "Attribution is basically astrology anyway.",
      line2: "We'll create perfectly reasonable explanations for those abysmal figures."
    }
  },
  {
    tagline: {
      line1: "The pixel stopped firing. Probably. Maybe.",
      line2: "We'll generate technical excuses that sound impressively complicated."
    }
  },
  {
    tagline: {
      line1: "A/B testing revealed something. We're still analysing what.",
      line2: "We'll explain why you need another three months. At least."
    }
  },
  {
    tagline: {
      line1: "Content is king. Unfortunately, the king is missing.",
      line2: "We'll help you explain why the blog hasn't been updated since 2019."
    }
  },
  {
    tagline: {
      line1: "Engagement is down. Bots are getting smarter at ignoring you.",
      line2: "We'll generate excuses for your social media disasters. All of them."
    }
  },
  {
    tagline: {
      line1: "The client brief was clear. Clearly confusing.",
      line2: "We'll explain why you built something completely different. Brilliantly different."
    }
  },
  {
    tagline: {
      line1: "Billable hours are flexible. Very flexible.",
      line2: "We'll generate timesheet entries that sound impressively legitimate."
    }
  },
  {
    tagline: {
      line1: "The brand guidelines say one thing. Your heart says another.",
      line2: "We'll justify why you followed your instincts. Creative freedom and all that."
    }
  },
  {
    tagline: {
      line1: "The contract clearly states... something you didn't read properly.",
      line2: "We'll help you explain why you promised something you can't deliver."
    }
  },
  {
    tagline: {
      line1: "Your timesheet is due. Your memory is selective.",
      line2: "We'll generate plausible reconstructions of last week's activities. Very plausible."
    }
  },
  {
    tagline: {
      line1: "The deadline was flexible. Until it absolutely wasn't.",
      line2: "We'll help you explain why you treated it like a suggestion for three months."
    }
  },
  {
    tagline: {
      line1: "You weren't ignoring Slack. You were focusing deeply.",
      line2: "We'll generate productivity explanations for your radio silence. Deep work, innit."
    }
  },
  {
    tagline: {
      line1: "The team meeting clashed with something. Anything.",
      line2: "We'll create scheduling conflicts that sound more important than they are."
    }
  },
  {
    tagline: {
      line1: "Remote working means flexible hours. Very, very flexible.",
      line2: "We'll explain why you responded to that urgent email at 11am the next day."
    }
  },
  {
    tagline: {
      line1: "The Town Hall was scheduled. Your calendar disagreed.",
      line2: "We'll generate technical explanations for your mysterious absence."
    }
  },
  {
    tagline: {
      line1: "You missed the client call. Your lunch ran long. Very long.",
      line2: "We'll generate prioritisation explanations that sound strategic. Visionary, even."
    }
  },
  {
    tagline: {
      line1: "The project budget you managed has somehow evaporated.",
      line2: "We'll explain those expenses that seemed reasonable at the time. Still do, really."
    }
  },
  {
    tagline: {
      line1: "Your presentation is tomorrow. You started it never.",
      line2: "We'll generate time management explanations for your chronic procrastination."
    }
  },
  {
    tagline: {
      line1: "Team drinks were mandatory. Your absence was noted.",
      line2: "We'll create work-life boundary excuses that don't sound antisocial. Promise."
    }
  },
  {
    tagline: {
      line1: "The training session you skipped is now business-critical knowledge.",
      line2: "We'll explain why you'll need extensive catch-up time. And budget. Lots of budget."
    }
  },
  {
    tagline: {
      line1: "Analytics say one thing. Your gut says another. Your gut won.",
      line2: "We'll generate data-driven justifications for ignoring all that data."
    }
  },
  {
    tagline: {
      line1: "You had ample prep time, but chose doomscrolling",
      line2: "We'll generate confident explanations for totally winging that last call."
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
