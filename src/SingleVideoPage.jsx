import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  ChevronLeft,
  Loader,
} from "lucide-react";

export default function SingleVideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [commenting, setCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const videoRef = useRef(null);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  // hello
  useEffect(() => {
    async function fetchVideoData() {
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/video/${videoId}`);
        setVideo(response.data.video);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching video:", err);
        setError("Failed to load video. Please try again later.");
        setLoading(false);
      }
    }

    if (videoId) {
      fetchVideoData();
    }
  }, [videoId, baseUrl]);

  const handleLike = async () => {
    try {
      if (video.liked) {
        await axios.put(`${baseUrl}/api/video/remove-like/${videoId}`);
      } else {
        await axios.put(`${baseUrl}/api/video/like/${videoId}`);
      }

      setVideo({
        ...video,
        liked: !video.liked,
        likeCount: video.liked ? video.likeCount - 1 : video.likeCount + 1,
      });
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setCommenting(true);
      await axios.put(`${baseUrl}/api/video/comment/${videoId}`, {
        comment: comment,
      });

      setVideo({
        ...video,
        comments: [
          ...video.comments,
          {
            comment: comment,
            commentedAt: new Date().toISOString(),
          },
        ],
      });

      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setCommenting(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  const shareVideo = () => {
    if (navigator.share) {
      navigator
        .share({
          title: video.title,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={goBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!video) return null;

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 relative">
            <div className="w-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={baseUrl + video.src}
                className="w-80 aspect-[9/16] bg-black rounded-lg object-contain"
                onClick={(e) => {
                  e.target.paused ? e.target.play() : e.target.pause();
                }}
                autoPlay
                loop
              />
            </div>

            <h1 className="text-xl font-semibold mt-4">{video.title}</h1>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      video.liked
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }`}
                  />
                  <span>{video.likeCount}</span>
                </button>

                <button
                  onClick={() => setShowComments(!showComments)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-6 h-6 text-gray-600" />
                  <span>{video.comments.length}</span>
                </button>
              </div>

              <button onClick={shareVideo} className="flex items-center gap-1">
                <Share2 className="w-6 h-6 text-gray-600" />
                <span>Share</span>
              </button>
            </div>
          </div>

          <div
            className={`w-full md:w-1/2 ${
              showComments ? "block" : "hidden md:block"
            }`}
          >
            <div className="border rounded-lg p-4 h-full">
              <h2 className="text-lg font-semibold mb-4">Comments</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {video.comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  video.comments.map((comment, index) => (
                    <div key={index} className="border-b pb-3">
                      <div className="flex justify-between items-start">
                        <p className="text-sm break-words">{comment.comment}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.commentedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleComment}
                  disabled={commenting || !comment.trim()}
                  className="bg-blue-500 text-white rounded-full p-2 disabled:bg-gray-300"
                >
                  {commenting ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
