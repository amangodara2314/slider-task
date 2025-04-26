import React, { useRef, useEffect } from "react";

export default function SkeletonPreview({ loadMoreVideos, loading }) {
  const observerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreVideos();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <div
      ref={observerRef}
      className="w-64 aspect-[9/16] bg-gray-200 rounded-2xl animate-pulse mx-2"
    ></div>
  );
}
