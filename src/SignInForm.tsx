import { useState, FormEvent } from 'react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert } from '@/components/ui/alert';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const checkAllowlistStatus = useMutation(api.allowlist.checkAllowlistStatus);
  const addToAllowlist = useMutation(api.allowlist.addToAllowlist);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setConfirmation('');
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    try {
      const isAllowlisted = await checkAllowlistStatus({ email: email });

      if (!isAllowlisted) {
        setError('Your email is not authorized to access this application. Please request allowlist access below.');
        setLoading(false);
        return;
      }

      await signIn('resend', formData);
      setConfirmation('Allowlist Confirmed! Magic link has been sent to your email - please use the link to log in.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (email: string) => {
    if (!email) {
      setError('Please enter an email address first.');
      return;
    }
    
    try {
      await addToAllowlist({ email, isAllowed: false });
      setRequestSent(true);
      setError('Your access request has been submitted. You will be notified when access is granted.');
    } catch (err: any) {
      if (err.message?.includes('already in the allowlist')) {
        setError('Your request is already pending. Please wait for approval.');
      } else {
        setError('Failed to submit access request. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-lg bg-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        <label htmlFor="email" className="block text-lg font-semibold text-gray-800">
          Enter your email here:
        </label>
        <Input
          name="email"
          id="email"
          type="email"
          required
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-lg p-3 hover:bg-blue-700 transition duration-200">
          {loading ? 'Sending...' : 'Sign In with Magic Link'}
        </Button>
      </form>
      {confirmation && (
        <Alert className="mt-4">
          {confirmation}
        </Alert>
      )}
      {error && (
        <div className="space-y-4 mt-4">
          <Alert variant="default">
            {error}
          </Alert>
          {!requestSent && (
            <Button 
              onClick={() => handleRequestAccess(
                (document.querySelector('input[name="email"]') as HTMLInputElement)?.value
              )}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Request Allowlist Access
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
