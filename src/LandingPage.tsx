import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInPage } from "./SignInPage";

export function LandingPage() {
  const techStack = [
    {
        title: "React Frontend Stack",
        description: "Built with React and styled with ShadcnUI for a responsive and beautiful user experience",
        badges: ["React", "TypeScript", "ShadcnUI", "TailwindCSS"]
    },
      {
        title: "Serverless Backend",
        description: "Fully serverless architecture with real-time capabilities and built-in authentication",
        badges: ["Convex Backend", "Real-time Updates", "Convex Auth"]
      },
    {
    title: "Vector Search Infrastructure",
    description: "High-performance vector similarity search powered by Convex's vector database",
    badges: ["Convex DB", "Vector Search", "Chunk Management"]
    },
    {
      title: "Advanced RAG Pipeline",
      description: "Leveraging state-of-the-art retrieval augmented generation with query rewriting and hybrid search capabilities",
      badges: ["GPT-4", "text-embedding-3-small", "Hybrid Search", "Query Rewriting"]
    }
  ];

  return (
    <div className="container mx-auto flex flex-col items-center space-y-8 p-8">
      {/* Sign In section */}
      <div className="w-full max-w-lg">
        <SignInPage/>
      </div>

      {/* Divider with text */}
      <div className="relative w-full max-w-lg my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">This app is coded by Charles powered by the following tools:</span>
        </div>
      </div>

      {/* Tech stack grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {techStack.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {item.badges.map((badge, badgeIndex) => (
                  <Badge key={badgeIndex} variant="secondary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}