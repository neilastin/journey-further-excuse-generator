// Main application state types
export interface AppState {
  // Form inputs
  scenario: string;
  audience: string;

  // Loading states
  isGeneratingExcuses: boolean;
  isGeneratingImage: boolean;

  // Generated content
  excuses: ExcusesResponse | null;

  // Image generation
  uploadedHeadshot: File | null;
  generatedImage: string | null; // Base64 data URL

  // UI state
  currentLoadingMessage: string;
  showExcuses: boolean;
  copySuccess: Record<string, boolean>; // Track copy status per excuse

  // Error state
  error: string | null;
}

// Excuse structure from API
export interface ExcuseItem {
  title: string;
  text: string;
}

export interface ExcusesResponse {
  excuse1: ExcuseItem;
  excuse2: ExcuseItem;
  comedicStyle: string; // The style used for excuse2 (Risky excuse)
  excuseFocus?: string; // The excuse focus used (e.g., 'robin-skidmore')
}

// Form dropdown options
export type AudienceOption =
  | 'A Colleague'
  | 'Your Manager'
  | 'A Direct Report'
  | 'The Client'
  | 'HR'
  | 'Finance'
  | 'A Random Stranger On LinkedIn'
  | 'Robin Skidmore';

// API request types
export interface CustomExcuseOptions {
  style?: string; // If specified, use this style instead of random
  narrativeElements?: string[]; // IDs of selected narrative elements (max 3)
  excuseFocus?: string; // ID of selected excuse focus
  aiModel?: 'claude' | 'gemini'; // AI model to use for generation
}

export interface GenerateExcusesRequest {
  scenario: string;
  audience: AudienceOption;
  customOptions?: CustomExcuseOptions; // Optional Customise customization
}

export interface GenerateImageRequest {
  excuseText: string;
  comedicStyle: string; // The comedic style from the excuse
  headshotBase64?: string;
  headshotMimeType?: string;
  originalSituation?: string;
  keepSameClothes?: boolean;
  aspectRatio?: string;
  lusciousLocks?: boolean;
  excuseFocus?: string;
  imageQuality?: 'standard' | 'pro'; // Image generation quality tier
}

// API response types
export interface GenerateImageResponse {
  imageUrl: string;
}

export interface ApiError {
  error: string;
}

// Component props
export interface ExcuseCardProps {
  title: string;
  text: string;
  accentColor: 'blue' | 'purple' | 'green';
  onCopy: () => void;
  isCopied: boolean;
}

export interface LoadingAnimationProps {
  messages: string[];
  interval?: number; // milliseconds between message changes
}

// Admin unlock types
export interface AdminUnlockRequest {
  password: string;
}

export interface AdminUnlockResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Slack sharing types
export interface ShareToSlackRequest {
  scenario: string;
  excuseText: string;
  excuseType: 'excuse1' | 'excuse2' | 'excuse3';
  imageBase64: string;
}

export interface ShareToSlackResponse {
  success: boolean;
  message?: string;
  remaining?: number;
}
