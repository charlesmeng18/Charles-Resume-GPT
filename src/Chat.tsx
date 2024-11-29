import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WelcomeSection } from './WelcomeSection';
import { FollowUpQuestions } from './FollowUpQuestions';

type LoadingStep = {
  step: string;
  description: string;
};

const RAG_STEPS: LoadingStep[] = [
  { 
    step: "Rewriting query", 
    description: "Optimizing the query for better search results..." 
  },
  { 
    step: "Retrieving", 
    description: "Finding relevant documents using embedding search..." 
  },
  { 
    step: "Reranking", 
    description: "Reranking results with Cohere for better relevance..." 
  },
  { 
    step: "Generating", 
    description: "Generating a comprehensive answer from the sources..." 
  },
  { 
    step: "Preparing presentation", 
    description: "Formatting the response for a clear presentation..." 
  }
];

export function Chat({ sessionId, userId }: { sessionId: string, userId: string }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLoadingStep, setCurrentLoadingStep] = useState<number>(0);
  const [loadingStepInterval, setLoadingStepInterval] = useState<NodeJS.Timeout | null>(null);
  const [optimisticMessages, setOptimisticMessages] = useState<Array<{ question: string, timestamp: number }>>([]);

  // Fetch the chat history using useQuery
  const getChatHistory = useQuery(api.chatHistory.getChatHistory, { userId });
  // Set up the mutation to submit a question
  const generateAnswerAction = useAction(api.openai.generateAnswer);

  // Add an effect to clean up optimistic messages once they appear in chat history
  useEffect(() => {
    if (getChatHistory) {
      // Remove optimistic messages that are now in the chat history
      setOptimisticMessages(prev => 
        prev.filter(msg => 
          !getChatHistory.some(history => history.timestamp === msg.timestamp)
        )
      );
    }
  }, [getChatHistory]);

  const startLoadingCarousel = () => {
    const interval = setInterval(() => {
      setCurrentLoadingStep((prev) => (prev + 1) % RAG_STEPS.length);
    }, 4000); // Change step every 2 seconds
    setLoadingStepInterval(interval);
  };

  const stopLoadingCarousel = () => {
    if (loadingStepInterval) {
      clearInterval(loadingStepInterval);
      setLoadingStepInterval(null);
    }
    setCurrentLoadingStep(0);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    startLoadingCarousel();
    
    // Create timestamp
    const timestamp = Date.now();
    
    // Optimistically add the user's message
    setOptimisticMessages(prev => [...prev, { question, timestamp }]);
    
    try {
      await generateAnswerAction({ sessionId, userId, question, timestamp });
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      // Optionally remove the optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.timestamp !== timestamp));
    } finally {
      stopLoadingCarousel();
      setLoading(false);
    }
  };

  const handleQueryClick = async (queryText: string) => {
    const timestamp = Date.now();
    
    // Optimistically add the clicked question
    setOptimisticMessages(prev => [...prev, { question: queryText, timestamp }]);
    
    setLoading(true);
    startLoadingCarousel();
    try {
      await generateAnswerAction({ sessionId, userId, question: queryText, timestamp });
    } catch (error) {
      console.error('Error submitting question:', error);
      // Optionally remove the optimistic message on error
      setOptimisticMessages(prev => prev.filter(msg => msg.timestamp !== timestamp));
    } finally {
      stopLoadingCarousel();
      setLoading(false);
      setQuestion('');
    }
  };

  // Handle loading state
  if (getChatHistory === undefined) {
    return <div>Loading chat history...</div>;
  }

  const renderLoadingIndicator = () => {
    if (!loading) return null;
    
    const currentStep = RAG_STEPS[currentLoadingStep];
    return (
      <div className="mb-4 relative overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-200/10 via-blue-200/5 to-blue-200/10 rounded-lg backdrop-blur-sm 
                        before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] 
                        before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-transparent"></div>
            <div className="font-medium text-gray-800">{currentStep.step}</div>
          </div>
          <p className="text-sm text-gray-600 mt-2 ml-6">{currentStep.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-orange-50">
      <ChatMessageList>
        {getChatHistory.length === 0 && optimisticMessages.length === 0 ? (
          <WelcomeSection onQueryClick={handleQueryClick} loading={loading} />
        ) : (
          <>
            {/* Render existing chat history */}
            {getChatHistory.map((entry, index) => (
              <div key={`history-${index}`} className="space-y-2">
                <div className="flex justify-end">
                  <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">{entry.question}</ChatBubbleMessage>
                  </ChatBubble>
                </div>
                <div className="flex justify-start">
                  <ChatBubble variant="received">
                    <ChatBubbleMessage
                      variant="received"
                      className="max-w-[90%]" // Set max width to 75%
                    >
                      <CustomMarkdown content={cleanUpText(entry.answer)} />
                    </ChatBubbleMessage>
                  </ChatBubble>
                </div>
              </div>
            ))}
            
            {/* Render optimistic messages */}
            {optimisticMessages.map((msg) => (
              <div key={`optimistic-${msg.timestamp}`} className="space-y-2">
                <div className="flex justify-end">
                  <ChatBubble variant="sent">
                    <ChatBubbleMessage variant="sent">{msg.question}</ChatBubbleMessage>
                  </ChatBubble>
                </div>
              </div>
            ))}
          </>
        )}
      </ChatMessageList>
      {renderLoadingIndicator()}
      {!loading && (
        <div className="w-full mb-4 ml-6">
          <FollowUpQuestions 
            userId={userId} 
            onQuestionClick={handleQueryClick} 
            loading={loading} 
          />
        </div>
      )}
      <form onSubmit={handleSubmit} className="ml-6 mb-12 mr-6">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about Charles..."
          required
          disabled={loading}
          className="w-full h-16 text-lg bg-white border-none shadow-md focus:ring-2 focus:ring-blue-500 mb-5"
        />
        {/* <Button type="submit" disabled={loading} className="w-1/10">
          {loading ? 'Generating Answer...' : 'Ask'}
        </Button> */}
      </form>
    </div>
  );
}

function cleanUpText(input: string): string {
  return input
    .replace(/\r\n|\r|\n/g, '\n') // Normalize line endings to '\n'
    .replace(/\n{2,}/g, '\n') // Remove consecutive line breaks
    .replace(/[ \t]{2,}/g, ' ') // Collapse multiple spaces
    .trim(); // Trim whitespace
}

interface CustomMarkdown {
  children: string;
}
function CustomMarkdown({ content }: { content: string }): JSX.Element {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 style={{ fontSize: '1.5rem', fontWeight: '650', marginBottom: '0.5rem' }} {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem' }} {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 style={{ fontSize: '1.1rem', fontWeight: '575', marginBottom: '0.5rem' }} {...props} />
        ),
        p: ({ node, ...props }) => (
          <p style={{ marginBottom: '0.75rem', lineHeight: '1.5' }} {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}