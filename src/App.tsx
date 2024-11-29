import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { Chat } from "./Chat";
import { SignOut } from "./SignOutButton";
import {LandingPage} from './LandingPage'

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
    <div className="min-h-screen bg-orange-50">
      <Unauthenticated>
        <LandingPage />
      </Unauthenticated>
      <Authenticated>
        {sessionId && userId && (
          <div className="mb-16">
            <div className="flex justify-end mb-4">
              <SignOut />
            </div>
            <Chat sessionId={sessionId} userId={userId} />
          </div>
        )}
      </Authenticated>
    </div>
  );
}

export default App;