export function DemoSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">See it in Action</h2>
      <div className="relative rounded-lg overflow-hidden shadow-xl">
        <video 
          controls
          className="w-full" style={{ aspectRatio: '9/16' }}
        >
          <source src="./public/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="text-sm text-gray-500 text-center mt-2">
        Preview of the Chat Assistant in action
      </p>
    </div>
  );
} 