import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SignInPage } from "./SignInPage";

export function LandingPage() {
  const techStack = [
    {
        title: "Search Relevance and RAG (Retrieval Augmented Generation)",
        description: "ChatGPT-like experience, with search optimizations including query rewriting, hybrid search, and reranking",
        badges: ["Chat Generation LLM: GPT-4o", "Search: Vector + Lexical Retrieval", "Embeddings: text-embedding-3-small", "Ranking: Jina Reranker V2", "Query Rewrites: GPT-3.5 turbo"] 
    },
    {
        title: "Data Processing and Search Infra",
        description: "Processes and indexes content using LlamaParse and LlamaIndex, and stored in a Convex database",
        badges: [ "Parsing and Chunking: LlamaParse + LlamaIndex Tools", "Search Database: Convex DB"]  
    },
    {
        title: "React Frontend",
        description: "Built with React and styled with ShadcnUI for a responsive user experience",
        badges: ["React", "TypeScript", "ShadcnUI", "TailwindCSS"]
    },
      {
        title: "Serverless Backend",
        description: "Built with Convex.dev, with serverless backend, with real-time capabilities and built-in authentication", 
        badges: ["Convex Backend", "Convex Auth"]
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
          <span className="bg-background px-2 text-muted-foreground">This app is programmed using the following tools:</span>
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