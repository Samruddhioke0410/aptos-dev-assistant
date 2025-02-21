import React from 'react';
import { SuggestedQuestion } from '../types';

interface Props {
  onQuestionClick: (question: string) => void;
}

const suggestedQuestions: SuggestedQuestion[] = [
  { text: "How do I deploy a Move module?", category: "deployment" },
  { text: "What is the Aptos token standard?", category: "tokens" },
  { text: "How do I set up my development environment?", category: "setup" },
  { text: "What are the best practices for Move smart contracts?", category: "development" }
];

export default function SuggestedQuestions({ onQuestionClick }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {suggestedQuestions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onQuestionClick(q.text)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          {q.text}
        </button>
      ))}
    </div>
  );
}
