import { SignInForm } from './SignInForm';
import { Card, CardContent } from '@/components/ui/card';

export function SignInPage() {
  return (
    <Card className="shadow-xl">
      <CardContent className="p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Welcome! Charles' Resume Assistant here 👋
          </h1>
          <div className="text-left mb-4">
            I'm a Chat Assistant, created by Charles to highlight his experience and skills in Product Management, Search, AI/ML, Enterprise SAAS, and general passion for building things. <br />
            <br />
            Sign in below to start chatting!
          </div>
          <SignInForm />
        </div>
      </CardContent>
    </Card>
  );
}
