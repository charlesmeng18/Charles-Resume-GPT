import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
  import { Badge } from "@/components/ui/badge";
  
  export function TechStackSection() {
    const techStack = [
      {
        title: "Search Relevance and RAG (Retrieval Augmented Generation)",
        description:
          "ChatGPT-like experience, with search optimizations including query rewriting, hybrid search, and reranking",
        badges: [
          "Chat Generation LLM: GPT-4o",
          "Search: Vector + Lexical Retrieval",
          "Embeddings: text-embedding-3-small",
          "Ranking: Cohere Rerank Model V3",
          "Query Rewrites: GPT-3.5 turbo",
        ],
      },
      {
        title: "Serverless Backend",
        description:
          "Built with Convex.dev. Lightning-fast, production-ready backend that scales effortlessly! All with real-time capabilities, E2E typesafety, and built-in authentication",
        badges: ["Convex.dev Backend-as-a-Service", "Convex Auth"],
      },
      {
        title: "Data Processing and Search Infra",
        description:
          "Processes and indexes content using LlamaParse and LlamaIndex, and stored in a Convex database",
        badges: [
          "Parsing and Chunking: LlamaParse + LlamaIndex Tools",
          "Search Database: Convex DB",
        ],
      },
      {
        title: "React Frontend",
        description:
          "Built with React and styled with ShadcnUI for a responsive user experience",
        badges: ["React", "TypeScript", "ShadcnUI", "TailwindCSS"],
      }
    ];
  
    return (
      <div className="container mx-auto px-4 pb-10">
        {/* Divider with text */}
        <div className="relative w-full max-w-lg mx-auto mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted-foreground"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              This app is programmed using the following tools:
            </span>
          </div>
        </div>
  
        {/* Tech stack grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {techStack.map((item, index) => (
            <Card
              key={index}
              className="bg-transparent shadow-none hover:shadow-none transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-muted-foreground">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.badges.map((badge, badgeIndex) => (
                    <Badge
                      key={badgeIndex}
                      variant="outline"
                      className="text-muted-foreground border-muted-foreground"
                    >
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
  