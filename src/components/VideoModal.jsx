import React, { useRef, useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Link,
} from "lucide-react";
import CommentsSection from "./CommentsSection";

export default function VideoModal({
  videos,
  modalIndex,
  setModalIndex,
  handleLike,
  handleComment,
  loadMoreVideos,
  totalCount,
  closeModal,
}) {
  const [openComments, setOpenComments] = useState(null);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const videoRef = useRef();

  const handleCommentSubmit = async (videoId) => {
    if (!comment.trim()) return;
    setCommenting(true);

    try {
      await handleComment(videoId, comment);
      setComment("");
    } finally {
      setCommenting(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const updateProgressBar = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoDuration) * 100;
      setProgress(currentProgress);
    }
  };

  useEffect(() => {
    setProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [modalIndex]);

  return (
    <div
      style={{ background: "rgba(0, 0, 0, 0.92)" }}
      className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center"
    >
      <div
        className="absolute top-6 right-6 text-white cursor-pointer bg-gray-800 bg-opacity-50 rounded-full p-2 z-40"
        onClick={closeModal}
      >
        <X size={24} />
      </div>

      <div className="relative flex items-center justify-center w-full max-w-6xl px-4">
        {modalIndex > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setModalIndex((i) => (i > 0 ? i - 1 : i));
            }}
            className="absolute left-8 z-10 text-white text-2xl bg-gray-800 bg-opacity-50 rounded-full p-2"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex items-center justify-center gap-4">
          {modalIndex > 0 && (
            <div className="hidden sm:block">
              <video
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenComments(null);
                  setModalIndex((i) => (i > 0 ? i - 1 : i));
                }}
                className="w-[150px] sm:w-[200px] aspect-[9/16] rounded-lg object-cover"
                src={baseUrl + videos[modalIndex - 1].src}
                muted
                loop
              />
            </div>
          )}

          <div className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gray-700 z-10">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <video
              className="w-[300px] sm:w-[350px] aspect-[9/16] rounded-lg object-cover cursor-pointer"
              src={baseUrl + videos[modalIndex].src}
              ref={videoRef}
              autoPlay
              onClick={(e) => {
                e.stopPropagation();
                e.target.paused ? e.target.play() : e.target.pause();
              }}
              loop
              onTimeUpdate={updateProgressBar}
              onLoadedMetadata={handleLoadedMetadata}
            />

            {openComments && (
              <CommentsSection
                video={videos[modalIndex]}
                comment={comment}
                setComment={setComment}
                handleComment={handleCommentSubmit}
                commenting={commenting}
                onClose={() => setOpenComments(null)}
              />
            )}

            <div className="absolute bottom-3 left-3 w-full text-white text-xs bg-opacity-50">
              {videos[modalIndex].title}
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(videos[modalIndex]._id, videos[modalIndex].liked);
                }}
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 cursor-pointer relative"
              >
                <Heart
                  size={20}
                  fill={videos[modalIndex].liked ? "#ff0000" : "none"}
                  color={videos[modalIndex].liked ? "#ff0000" : "white"}
                />
                <span className="text-[10px] absolute top-[26%] right-[42%] transform text-white">
                  {videos[modalIndex].likeCount}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenComments(null);
                  setOpenComments(videos[modalIndex]);
                }}
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 cursor-pointer relative"
              >
                <MessageCircle size={20} className="text-white" />
                <span className="text-[10px] absolute top-[26%] right-[42%] transform text-white">
                  {videos[modalIndex].comments.length}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const videoUrl = baseUrl + videos[modalIndex].src;
                  navigator.clipboard
                    .writeText(videoUrl)
                    .then(() => {
                      alert("Link copied!");
                    })
                    .catch((err) => {
                      console.error("Failed to copy link:", err);
                    });
                }}
                className="bg-gray-800 bg-opacity-70 rounded-full p-2 cursor-pointer"
              >
                <Link className="size-5 text-white" />
              </button>
            </div>
          </div>

          {modalIndex < videos.length - 1 && (
            <div className="hidden sm:block">
              <video
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenComments(null);
                  setModalIndex((i) => (i + 1 < videos.length ? i + 1 : i));
                }}
                className="w-[150px] sm:w-[200px] aspect-[9/16] rounded-lg object-cover"
                src={baseUrl + videos[modalIndex + 1].src}
                muted
                loop
              />
            </div>
          )}
        </div>

        {modalIndex < videos.length - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenComments(null);
              if (
                modalIndex + 2 == videos.length &&
                videos.length < totalCount
              ) {
                loadMoreVideos();
              }
              setModalIndex((i) => (i + 1 < videos.length ? i + 1 : i));
            }}
            className="absolute right-8 z-10 text-white text-2xl bg-gray-800 bg-opacity-50 rounded-full p-2"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
