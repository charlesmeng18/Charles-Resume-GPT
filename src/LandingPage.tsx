import { SignInPage } from "./SignInPage";
import { TechStackSection } from "./TechStack";
import { DemoSection } from "./DemoSection";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* SignIn section */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <SignInPage />
          </div>
          
          {/* Demo section */}
          <div className="w-full">
            <DemoSection />
          </div>
        </div>
      </div>

      <TechStackSection />
    </div>
  );
}
