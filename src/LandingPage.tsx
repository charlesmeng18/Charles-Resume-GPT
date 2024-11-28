import { SignInPage } from "./SignInPage";
import { TechStackSection } from "./TechStack"; // Adjust the path if necessary

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section with SignInPage */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-lg mt-16 md:mt-24 lg:mt-32">
          <SignInPage />
        </div>
      </div>

      {/* Tech stack section */}
      <TechStackSection />
    </div>
  );
}
