export function DemoSection() {
  return (
    <div className="w-full">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-4">
        Preview of the Chat Assistant in Action
      </h2>
      <div className="rounded-lg overflow-hidden shadow-lg">
        <video 
          controls
          muted
          className="w-full h-auto object-contain"
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="text-sm text-gray-500 text-center mt-2">
        Watch a quick preview of the Chat Assistant in action
      </p>
    </div>
  );
} 