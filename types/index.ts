export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
}

export interface SuggestedQuestion {
  text: string;
  category: string;
}
