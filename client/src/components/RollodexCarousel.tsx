import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RollodexCarouselProps {
  videos: Array<{
    videoUrl: string;
    thumbnailUrl: string;
  }>;
}

export default function RollodexCarousel({ videos }: RollodexCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const goToVideo = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextVideo();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Main Video Display - 16:9 Aspect Ratio */}
      <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-4xl mx-auto" style={{ aspectRatio: '16/9' }}>
        <AnimatePresence>
          <motion.video
            key={videos[currentIndex]?.videoUrl}
            src={videos[currentIndex]?.videoUrl}
            autoPlay={isPlaying}
            muted
            loop
            playsInline
            className="w-full h-full object-contain absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </AnimatePresence>






      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={prevVideo}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-white/80 font-medium text-sm">
          {currentIndex + 1} of {videos.length}
        </div>

        <button
          onClick={nextVideo}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Video Grid Gallery */}
      <div className="grid grid-cols-5 gap-3">
        {videos.map((video, index) => (
          <motion.div
            key={index}
            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
              currentIndex === index 
                ? 'ring-3 ring-cyan-400 scale-105 shadow-lg shadow-cyan-400/30' 
                : 'hover:scale-102 hover:ring-2 hover:ring-white/30'
            }`}
            style={{ aspectRatio: '16/9' }}
            onClick={() => goToVideo(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <video
              src={video.videoUrl}
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ pointerEvents: 'none' }}
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 transition-all duration-300 ${
              currentIndex === index 
                ? 'bg-cyan-400/20' 
                : 'bg-black/40 hover:bg-black/20'
            }`} />
            
            {/* Play indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              {currentIndex === index ? (
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Number */}
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded font-bold">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Play/Pause Control */}
      <div className="flex justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
        >
          {isPlaying ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
              </svg>
              <span>Pause Auto-Play</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Resume Auto-Play</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}