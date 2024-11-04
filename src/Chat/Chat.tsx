import { useState } from 'react';
import { useQuery, useMutation , useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function Chat({ sessionId , userId }: { sessionId: string, userId: string }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the chat history using useQuery
  const chatHistory = useQuery(api.chatHistory.getChatHistory, { userId });

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
  if (chatHistory === undefined) {
    return <div>Loading chat history...</div>;
  }

  return (
    <div>
      <ul>
        {chatHistory.map((entry, index) => (
          <li key={index}>
            <strong>Q:</strong> {entry.question}
            <br />
            <strong>A:</strong> {entry.answer}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about my resume..."
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
