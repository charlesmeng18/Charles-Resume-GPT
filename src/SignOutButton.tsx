import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from '@/components/ui/button';

export function SignOut() {
  const { signOut } = useAuthActions();
  return (
    <Button 
      className="text-lg font-semibold py-3 px-6 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition duration-200 mt-4"
      onClick={() => void signOut()}
    >
      Finish Chat and Sign Out
    </Button>
  );
}