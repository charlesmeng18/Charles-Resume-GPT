import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { SignInForm } from "./components/auth/SignInForm";
import { Chat } from "./Chat/Chat";
import { SignOut } from "./components/auth/SignOutButton";

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
  console.log("User ID is ", {userId})
  console.log("Session ID is ",  {sessionId})
  return (
    <>
      <Unauthenticated>
        <div>
          <h1>Welcome to Resume GPT</h1>
          <SignInForm />
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="App">
          <h1>Welcome to Resume GPT</h1>
          {sessionId ? (
            <Chat sessionId={sessionId} userId={userId} />
          ) : (
            <div>Starting session...</div>
          )}
          <SignOut />
        </div>
      </Authenticated>
    </>
  );
}

export default App;
