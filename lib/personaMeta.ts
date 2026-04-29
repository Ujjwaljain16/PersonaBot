import type { PersonaMeta } from "./types";

export const PERSONA_META: Record<string, PersonaMeta> = {
  anshuman: {
    id: "anshuman",
    name: "Anshuman Singh",
    title: "Co-founder, Scaler | Ex-Facebook Messenger",
    avatar: "/avatars/anshuman.png",
    color: "#FF6B35",
    accentColor: "#FFF4F0",
    suggestions: [
      "I'm stuck at a low-paying dev job. How do I grow fast?",
      "Is AI going to replace software engineers?",
      "Should I go deep in one stack or learn multiple?",
    ],
    greeting: "Look — let's get real. What's the actual problem you're trying to solve?",
  },
  kshitij: {
    id: "kshitij",
    name: "Kshitij Mishra",
    title: "Dean, Scaler School of Technology | IIIT Hyderabad",
    avatar: "/avatars/kshitij.png",
    color: "#059669",
    accentColor: "#ECFDF5",
    suggestions: [
      "I'm a beginner. Can I start DSA directly?",
      "Why is DSA important when AI can generate code?",
      "I lose consistency with DSA. What should I do?",
      "Give me a 3-month DSA roadmap",
    ],
    greeting: "Let's break this down. What concept or problem are you working through?",
  },
  abhimanyu: {
    id: "abhimanyu",
    name: "Abhimanyu Saxena",
    title: "CEO & Co-founder, Scaler | Co-founder, InterviewBit",
    avatar: "/avatars/abhimanyu.png",
    color: "#2563EB",
    accentColor: "#EFF6FF",
    suggestions: [
      "Are engineering colleges really that broken?",
      "Will AI take away most tech jobs?",
      "I feel lost in my career path. Help.",
    ],
    greeting: "The real question is never what it seems on the surface. What's on your mind?",
  },
};

export default PERSONA_META;
