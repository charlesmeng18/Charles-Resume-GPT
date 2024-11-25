import React, { useEffect, useState } from 'react';
import { useAction, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

type FollowUpQuestionsProps = {
  userId: string;
  onQuestionClick: (question: string) => void;
  loading: boolean;
};

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  userId,
  onQuestionClick,
  loading,
}) => {
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const generateFollowUpsAction = useAction(api.followUpQuestions.generateFollowUps);
  const chatHistory = useQuery(api.chatHistory.getChatHistory, { userId });

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!chatHistory || chatHistory.length === 0) return;

      try {
        const questions = await generateFollowUpsAction({ userId });
        setFollowUpQuestions(questions);
      } catch (error) {
        console.error('Error fetching follow-up questions:', error);
      }
    };

    fetchFollowUps();
  }, [chatHistory, userId, generateFollowUpsAction]);

  if (followUpQuestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-8" w-full max-w-md>
      <h3 className="text-lg font-semibold">Follow-Up Questions</h3>
      <div className="flex flex-col items-start">
        {followUpQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => onQuestionClick(question)}
              disabled={loading}
              className={`w-3/4 text-left text-gray-600 hover:text-gray-800 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              } bg-none border-none p-0 pb-2 text-base leading-6 m-0 whitespace-normal overflow-visible block flex justify-between items-center`}
            >
              <span className="pr-2">{question}</span>
              <span className="text-2xl font-bold">+</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
