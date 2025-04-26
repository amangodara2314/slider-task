import React from "react";
import { CircleMinus, Send } from "lucide-react";

export default function CommentsSection({
  video,
  comment,
  setComment,
  handleComment,
  commenting,
  onClose,
}) {
  return (
    <div className="absolute bottom-0 left-0 w-full h-1/2 rounded-t-2xl z-50 bg-white p-4 flex flex-col comment-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Comments</h1>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <CircleMinus className="size-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {video?.comments.length === 0 ? (
          <div className="text-center text-sm text-gray-500 mt-12">
            No Comments Yet
          </div>
        ) : (
          video.comments.map((comment, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2">
              <div className="text-sm text-gray-700 break-words w-full">
                <p>{comment.comment}</p>
              </div>
              <div className="text-[10px] text-gray-400 whitespace-nowrap">
                {new Date(comment.commentedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          value={comment}
          placeholder="Add a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={commenting}
          onClick={() => handleComment(video._id)}
          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full disabled:bg-gray-300"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}
