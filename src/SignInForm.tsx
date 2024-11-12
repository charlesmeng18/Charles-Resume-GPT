import { useState, FormEvent } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Alert} from '@/components/ui/alert';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setConfirmation('');
    const formData = new FormData(event.currentTarget);
    try {
      await signIn('resend', formData);
      setConfirmation('A magic link has been sent to your email.');
    } catch (error) {
      setConfirmation('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          name="email"
          id="email"
          type="email"
          required
          disabled={loading}
          className="w-full"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Button>
      </form>
      {confirmation && (
        <Alert className="mt-4">
          {confirmation}
        </Alert>
      )}
    </div>
  );
}
