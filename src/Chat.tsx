import { useState } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import ReactMarkdown from 'react-markdown';


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

  // Handle loading state
  if (getChatHistory === undefined) {
    return <div>Loading chat history...</div>;
  }

  return (
    <div>
      <ChatMessageList>
        {getChatHistory.map((entry, index) => (
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
                  <ReactMarkdown>{entry.answer}</ReactMarkdown>
                </ChatBubbleMessage>
              </ChatBubble>
            </div>
          </div>
        ))}
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
