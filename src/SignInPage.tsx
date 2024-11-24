import { SignInForm } from './SignInForm';


export function SignInPage() {
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Charles' Resume Assistant</h1>
      <p className="text-l text-muted-foreground mb-6">
        I'm RAG Assistant created by Charles, to help you learn more about his Product and AI background and skills
      </p>
      <SignInForm />
    </div>
  );
}
