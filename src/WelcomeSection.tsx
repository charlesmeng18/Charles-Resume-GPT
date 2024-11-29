import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const SAMPLE_QUERIES = [
  "What's Charles' experience with building Search and GenAI products?",
  "Give me an overview of Charles' Resume and educational background",
  "Tell me about Charles' biggest projects led as a Product Manager"
] as const;

interface WelcomeSectionProps {
  onQueryClick: (query: string) => void;
  loading: boolean;
}

export function WelcomeSection({ onQueryClick, loading }: WelcomeSectionProps) {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          What's up, Charles Meng's Resume Assistant here! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ask me anything about his background, skills, or experience
        </p>
      </div>

      <Card className="p-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Perhaps to start, select one of:
        </h2>
        <div className="flex flex-col items-start space-y-3">
          {SAMPLE_QUERIES.map((query, index) => (
            <Button
              key={index}
              variant="secondary"
              className={`w-3/4 h-auto py-4 px-4 text-left justify-start hover:bg-secondary/80 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => onQueryClick(query)}
              disabled={loading}
            >
              <span>{query}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}
