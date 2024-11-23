import { SignInForm } from './SignInForm';


export function SignInPage() {
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Charles' Resume Assistant</h1>
      <p className="text-xl text-muted-foreground mb-6">
        An intelligent AI assistant powered by advanced RAG technology
      </p>
      <SignInForm />
    </div>
  );
}
