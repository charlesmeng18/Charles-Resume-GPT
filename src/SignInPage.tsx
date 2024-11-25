import { SignInForm } from './SignInForm';
import { Card, CardContent } from '@/components/ui/card';

export function SignInPage() {
  return (
    <div className="w-full flex justify-center">
      <Card className="w-full max-w-lg shadow-xl">
        <CardContent className="p-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Welcome to Charles Meng's Resume Assistant
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              I'm a Chat Assistant programmed by Charles to help you learn more
              about his background and skills in AI/ML, Search, and Product
              Management
            </p>
            <SignInForm />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
