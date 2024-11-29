export function DemoSection() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">See it in Action</h2>
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        <video 
          controls
          className="w-full"
        //   poster="./public/demo-thumbnail.jpg" // Optional: Add a thumbnail
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