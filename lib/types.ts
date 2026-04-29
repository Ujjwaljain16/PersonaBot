export type MessageRole = "user" | "assistant";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: string; // ISO string for simplicity
}

export interface Persona {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  accentColor: string;
  systemPrompt: string;
  suggestions: string[];
  greeting: string;
}

export type PersonaMeta = Omit<Persona, "systemPrompt">;

export interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StudyPlan {
  title: string;
  steps: Array<{
    week: string;
    focus: string;
    tasks: string[];
  }>;
  tip?: string;
}
