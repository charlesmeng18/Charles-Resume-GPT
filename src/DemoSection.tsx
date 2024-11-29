export function DemoSection() {
  return (
    <div className="w-full">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <video 
          controls
          muted
          className="w-full h-auto object-contain"
          poster="/poster.jpg"
        >
          <source src="/demo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <p className="text-sm text-gray-500 text-center mt-2">
        Ask it any questions you might ask Charles in an interview or coffee chat
      </p>
    </div>
  );
} 