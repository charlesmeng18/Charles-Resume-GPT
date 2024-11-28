import { SignInForm } from './SignInForm';
import { Card, CardContent } from '@/components/ui/card';

export function SignInPage() {
  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Welcome! Charles' Resume Assistant here 👋
            </h1>
            <div className="text-left">
              I'm a Chat Assistant, created by Charles to highlight his experience and skills in AI/ML, Search, and Product Management. <br />
              <br />
              Sign in below to start chatting!
            </div>
            <SignInForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
