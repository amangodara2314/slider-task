import { useState, useEffect } from "react";
import axios from "axios";

export default function useVideoData() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadVideos = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/video?page=${pageNum}&limit=6`
      );
      if (pageNum === 1) {
        setVideos(response.data.videos);
        setTotalCount(response.data.totalCount);
      } else {
        setVideos((prev) => [...prev, ...response.data.videos]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setLoading(false);
    }
  };

  const loadMoreVideos = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadVideos(nextPage);
    }
  };

  const handleLike = async (videoId, isLiked) => {
    try {
      if (isLiked) {
        await axios.put(`${baseUrl}/api/video/remove-like/${videoId}`);
      } else {
        await axios.put(`${baseUrl}/api/video/like/${videoId}`);
      }

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? {
                ...video,
                liked: !isLiked,
                likeCount: isLiked ? video.likeCount - 1 : video.likeCount + 1,
              }
            : video
        )
      );
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleComment = async (videoId, commentText) => {
    try {
      await axios.put(`${baseUrl}/api/video/comment/${videoId}`, {
        comment: commentText,
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? {
                ...video,
                comments: [
                  ...(video.comments || []),
                  {
                    comment: commentText,
                    commentedAt: new Date().toISOString(),
                  },
                ],
              }
            : video
        )
      );

      return true;
    } catch (error) {
      console.error("Error posting comment:", error);
      return false;
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return {
    videos,
    loading,
    totalCount,
    loadVideos,
    loadMoreVideos,
    handleLike,
    handleComment,
  };
}
