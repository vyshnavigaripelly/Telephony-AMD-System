export const AMD_STRATEGIES = [
  {
    id: "twilio-native",
    label: "Twilio Native AMD",
    description: "Baseline machineDetection integration leveraging Twilio callbacks."
  },
  {
    id: "twilio-jambonz",
    label: "Twilio + Jambonz",
    description: "SIP trunk routed through Jambonz with aggressive AMD tuning."
  },
  {
    id: "hugging-face",
    label: "Hugging Face Wav2Vec",
    description: "Custom FastAPI inference using wav2vec voicemail classifier."
  },
  {
    id: "gemini-flash",
    label: "Gemini 2.5 Flash",
    description: "Real-time multimodal reasoning for ambiguous greetings."
  }
] as const;

export type AMDStrategyId = (typeof AMD_STRATEGIES)[number]["id"];
