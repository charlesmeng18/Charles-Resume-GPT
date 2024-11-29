import { SignInForm } from './SignInForm';
import { Card, CardContent } from '@/components/ui/card';

export function SignInPage() {
  return (
    <Card className="shadow-xl w-full max-w-2xl overflow-visible">
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome! Charles' Resume Assistant here 👋
          </h1>
          <div className="text-left mb-4 text-gray-400 text-sm italic">
            I'm a Chat Assistant programmed by Charles to assist with questions about his expertise in Product Management, Search, AI, and Enterprise SAAS.
          </div>
          <SignInForm />
        </div>
      </CardContent>
    </Card>
  );
}
