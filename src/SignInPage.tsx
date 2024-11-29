import { SignInForm } from './SignInForm';
import { CardContent } from '@/components/ui/card';

export function SignInPage() {
  return (
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome!
          </h1>
          <h2 className="text-3xl text-center font-bold mb-4">
            Charles' Resume Assistant here 👋
          </h2>
          <div className="text-left mb-4 text-gray-400 text-sm italic">
            I'm a Chat Assistant programmed by Charles to answer questions about his expertise in Product Management, Search, ML/GenAI, and Enterprise SAAS.
          </div>
          <SignInForm />
        </div>
      </CardContent>
  );
}
