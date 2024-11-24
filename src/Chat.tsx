import React, { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { WelcomeSection } from './WelcomeSection';

export function Chat({ sessionId, userId }: { sessionId: string, userId: string }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the chat history using useQuery
  const getChatHistory = useQuery(api.chatHistory.getChatHistory, { userId });
  // Set up the mutation to submit a question
  const generateAnswerAction = useAction(api.openai.generateAnswer);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      // get the timestamp of the message
      const timestamp = Date.now();

      console.log(question)
      // Submit the question using the mutation
      await generateAnswerAction({ sessionId, userId, question, timestamp });

      // Clear the input field
      setQuestion('');
    } catch (error) {
      console.error('Error submitting question:', error);
      // Optionally, display an error message to the user
    } finally {
      setLoading(false);
    }

  };

  const handleQueryClick = async (queryText: string) => {
    // Set the question first
    setQuestion(queryText);
    
    // Create timestamp
    const timestamp = Date.now();

    setLoading(true);
    try {
      // Directly call generateAnswerAction instead of using handleSubmit
      await generateAnswerAction({ sessionId, userId, question: queryText, timestamp });
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  // Handle loading state
  if (getChatHistory === undefined) {
    return <div>Loading chat history...</div>;
  }

  return (
    <div>
        <ChatMessageList>
        {getChatHistory.length === 0 ? (
          <WelcomeSection onQueryClick={handleQueryClick} />
        ) : (
          getChatHistory.map((entry, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-end">
                <ChatBubble variant="sent">
                  <ChatBubbleMessage variant="sent">
                    {entry.question}
                  </ChatBubbleMessage>
                </ChatBubble>
              </div>
              <div className="flex justify-start">
                <ChatBubble variant="received">
                  <ChatBubbleMessage variant="received">
                    <CustomMarkdown content={cleanUpText(entry.answer)} />
                  </ChatBubbleMessage>
                </ChatBubble>
              </div>
            </div>
          ))
        )}
      </ChatMessageList>
      <form onSubmit={handleSubmit}>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Hit :tab and ask away about Charles' resume..."
          required
          disabled={loading}
          className="w-full"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Generating Answer...' : 'Ask'}
        </Button>
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