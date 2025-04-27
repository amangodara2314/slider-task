import React, { useRef } from "react";
import VideoPreview from "./VideoPreview";
import SkeletonPreview from "./SkeletonPreview";

export default function VideoGrid({
  videos,
  totalCount,
  startIndex,
  loading,
  loadMoreVideos,
  setModalIndex,
}) {
  const containerRef = useRef();
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div ref={containerRef} className="overflow-hidden w-[90vw] sm:w-full">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${startIndex * 272}px)`,
        }}
      >
        {loading &&
          Array(3)
            .fill(null)
            .map((_, idx) => (
              <div
                key={idx}
                className="w-64 flex-shrink-0 mx-2 flex items-center justify-center aspect-[9/16]"
              >
                {console.log(idx)}
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            ))}
        {!loading &&
          Array(totalCount)
            .fill(null)
            .map((_, idx) => {
              const video = videos[idx];
              return video ? (
                <div
                  key={video._id || idx}
                  className="w-64 flex-shrink-0 mx-2 cursor-pointer"
                  onClick={() => {
                    setModalIndex(idx);
                  }}
                >
                  <VideoPreview
                    containerRef={containerRef}
                    src={baseUrl + video.src}
                    title={video.title}
                    likeCount={video.likeCount}
                    liked={video.liked}
                  />
                </div>
              ) : (
                <div key={idx}>
                  <SkeletonPreview
                    loadMoreVideos={loadMoreVideos}
                    loading={loading}
                  />
                </div>
              );
            })}

        {loading && (
          <div className="w-64 flex-shrink-0 mx-2 flex items-center justify-center aspect-[9/16]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    </div>
  );
}
