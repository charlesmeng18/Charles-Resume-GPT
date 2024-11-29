import { SignInPage } from "./SignInPage";
import { TechStackSection } from "./TechStack";

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Hero section with SignIn and Demo side by side */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* SignIn section */}
          <div className="w-full max-w-lg mx-auto lg:mx-0">
            <SignInPage />
          </div>
          
          {/* Demo section */}
          <div className="w-full">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <video 
                className="w-full h-auto object-contain"
                controls
                muted
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <p className="text-sm text-gray-500 text-center mt-2">
              Watch a quick demo of the Chat Assistant in action
            </p>
          </div>
        </div>
      </div>

      {/* Tech stack section */}
      <TechStackSection />
    </div>
  );
}
