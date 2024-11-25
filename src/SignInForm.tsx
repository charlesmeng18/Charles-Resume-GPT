import { useState, FormEvent } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Alert} from '@/components/ui/alert';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');

  // Initialize the mutation for checking allowlist status
  const checkAllowlistStatus = useMutation(api.allowlist.checkAllowlistStatus);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setConfirmation('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      // Check if the email is allowlisted
      const isAllowlisted = await checkAllowlistStatus({ email: email });

      if (!isAllowlisted) {
        console.log(`${email} is not allowlisted`); 
        setError(`${email} is not authorized to access this application. Please reach out to Charles to request allowlist access.`);
        setLoading(false);
        return;
      }

      // Proceed with sign-in if allowlisted
      console.log(`${email} is allowlisted!`); 
      await signIn('resend', formData);
      setConfirmation('Allowlist access confirmed! Magic link has been sent to your email - use the link to log in.');
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="email" className="block text-m font-medium text-black-700">
          Enter your email here:
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
          {loading ? 'Sending...' : 'Sign In with Magic Link'}
        </Button>
      </form>
      {confirmation && (
        <Alert className="mt-4">
          {confirmation}
        </Alert>
      )}
        {error && (
        <Alert className="mt-4" variant="default">
          {error}
        </Alert>
      )}
    </div>
  );
}
