import { SignInForm } from './SignInForm';


export function SignInPage() {
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Charles Meng's Resume Assistant</h1>
      <p className="text-l text-muted-foreground mb-6">
        I'm a Chat Assistant programmed by Charles to help you learn more about his background and skills in AI/ML, Search, and Product Management
      </p>
      <SignInForm />
    </div>
  );
}
