import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const SAMPLE_QUERIES = [
    "Overview of Charles' experience as a Product Manager",
    "What's Charles' experience with building Search and GenAI products",
    "Tell me about Charles' strengths as a Product Manager?",
    "What is Charles' educational background?"
  ] as const;
  
  interface WelcomeSectionProps {
    onQueryClick: (query: string) => void;
  }
  
  export function WelcomeSection({ onQueryClick }: WelcomeSectionProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SAMPLE_QUERIES.map((query, index) => (
              <Button
                key={index}
                variant="secondary"
                className="h-auto py-4 px-4 text-left justify-start hover:bg-secondary/80 transition-colors"
                onClick={() => onQueryClick(query)}
              >
                <span className="line-clamp-2">{query}</span>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }