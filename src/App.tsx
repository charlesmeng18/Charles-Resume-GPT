// import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInForm } from "./components/auth/SignInForm";


function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <>
      <Unauthenticated>
      <div>
        <div>
          <h1>Welcome to Resume GPT</h1>
          <SignInForm />
        </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <div className="App">
          {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
        </div>
      </Authenticated>
    </>
  );
}

export default App;