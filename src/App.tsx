import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { SignInPage } from "./SignInPage";
import { Chat } from "./Chat";
import { SignOut } from "./SignOutButton";
import { Card } from '@/components/ui/card';


function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const startSession = useMutation(api.session.startSession);

  useEffect(() => {
    if (isAuthenticated && !sessionId) {
      // Start a new session when the user authenticates
      startSession()
        .then(({ sessionId, userId }) => {
          setSessionId(sessionId);
          setUserId(userId);
        })
        .catch((error) => console.error("Failed to start session:", error));
    }
  }, [isAuthenticated, sessionId, startSession]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  console.log("User ID is ", { userId })
  console.log("Session ID is ", { sessionId })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Unauthenticated>
        <Card>
          <SignInPage title="Welcome to Charles' Interview Assistant" />
        </Card>
      </Unauthenticated>
      <Authenticated>
        <div className="w-full max-w-2xl p-6 bg-transparent rounded-lg mb-4">
          {sessionId && userId && <Chat sessionId={sessionId} userId={userId} />}
        </div>
        <div className="absolute top-4 right-4">
          <SignOut />
        </div>
      </Authenticated>
    </div>
  );
}

export default App;