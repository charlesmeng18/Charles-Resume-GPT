import { Card, CardHeader } from '@/components/ui/card';
import { SignInForm } from './SignInForm';

interface HeaderProps {
  title: string;
}

export function SignInPage({ title }: HeaderProps) {
  return (
    <Card className="w-full max-w-lg p-6 bg-white rounded-lg border-none">
        <CardHeader className="text-center bg-white">
            <h1 className="text-3xl font-bold">{title}</h1>
        </CardHeader>
        <SignInForm />
  </Card>
  );
}
