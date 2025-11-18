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

export interface PhotoEvidenceProps {
  excuseText: string;
  onImageGenerated: (imageUrl: string) => void;
}
