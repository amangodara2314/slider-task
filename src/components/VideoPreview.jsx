import React, { useRef, useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function VideoPreview({ src, title, likeCount, liked }) {
  const videoRef = useRef();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVisible) return;

    if (!isLoaded) {
      video.src = src;
      console.log(title + "is loading");
      video.load();
      setIsLoaded(true);
    }

    if (isVisible) {
      video.currentTime = 0;
      video.play().catch((err) => console.log("Autoplay prevented:", err));
    } else {
      video.pause();
    }
  }, [isVisible, isLoaded, src]);

  return (
    <div className="aspect-[9/16] rounded-2xl overflow-hidden relative w-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover relative"
        muted
        playsInline
        loop
      />
      <div className="flex items-center gap-1 text-white text-xs absolute bottom-3 left-3">
        <Heart
          size={10}
          fill={liked ? "#ff0000" : "none"}
          color={liked ? "#ff0000" : "white"}
        />
        <span>{likeCount || 0}</span>
      </div>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
}
