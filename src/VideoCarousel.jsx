import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import VideoGrid from "./components/VideoGrid";
import VideoModal from "./components/VideoModal";
import useVideoData from "./hooks/useVideoData";

export default function VideoCarousel() {
  const {
    videos,
    loading,
    totalCount,
    loadMoreVideos,
    handleLike,
    handleComment,
    page,
  } = useVideoData();

  const [startIndex, setStartIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    if (modalIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalIndex]);

  const nextSlide = () => {
    setStartIndex((prev) => (prev < totalCount ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setStartIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  return (
    <div className="relative w-full py-6">
      <div className="w-full">
        <div className="text-center text-wrap">
          If the initial loading takes time. Please be patient as the backend is
          deployed on a free tier on render.
          <br />
          <a
            className="underline text-blue-500"
            href="https://github.com/amangodara2314/slider-task"
            target="_blank"
          >
            Frontend Code
          </a>{" "}
          |{" "}
          <a
            className="underline text-blue-500"
            href="https://github.com/amangodara2314/slider-task-backend"
            target="_blank"
          >
            Backend Code
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center gap-1 mt-16">
        <button
          onClick={prevSlide}
          className="text-white bg-gray-700 px-1 py-3 rounded disabled:opacity-50 transition"
          disabled={startIndex === 0}
        >
          <ChevronLeft />
        </button>

        <VideoGrid
          videos={videos}
          totalCount={totalCount}
          startIndex={startIndex}
          loading={loading}
          loadMoreVideos={loadMoreVideos}
          setModalIndex={setModalIndex}
          page={page}
        />

        <button
          onClick={nextSlide}
          className="text-white bg-gray-700 px-1 py-3 rounded disabled:opacity-50 transition"
          disabled={
            startIndex >=
            totalCount - Math.max(Math.floor(window.innerWidth / 272), 1)
          }
        >
          <ChevronRight />
        </button>
      </div>

      {modalIndex !== null && videos[modalIndex] && (
        <VideoModal
          videos={videos}
          modalIndex={modalIndex}
          setModalIndex={setModalIndex}
          handleLike={handleLike}
          handleComment={handleComment}
          loadMoreVideos={loadMoreVideos}
          totalCount={totalCount}
          closeModal={closeModal}
        />
      )}
    </div>
  );
}
