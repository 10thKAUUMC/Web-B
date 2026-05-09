import { useState, useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { getCommentList, postComment, deleteComment } from "../apis/comment";
import { CommentSkeleton } from "./Skeleton";
import { FiTrash2 } from "react-icons/fi";

interface LpCommentSectionProps {
  lpId: number;
}

export default function LpCommentSection({ lpId }: LpCommentSectionProps) {
  const queryClient = useQueryClient();
  const [commentOrder, setCommentOrder] = useState<"desc" | "asc">("desc");
  const [commentText, setCommentText] = useState("");

  const { ref: commentRef, inView: commentInView } = useInView();

  const {
    data: commentData,
    isLoading: isCommentLoading,
    fetchNextPage: fetchNextCommentPage,
    hasNextPage: hasNextCommentPage,
    isFetchingNextPage: isFetchingNextCommentPage,
  } = useInfiniteQuery({
    queryKey: ["lpComments", lpId, commentOrder],
    queryFn: ({ pageParam }) =>
      getCommentList(lpId, pageParam as number, 10, commentOrder),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });

  useEffect(() => {
    if (commentInView && hasNextCommentPage) fetchNextCommentPage();
  }, [commentInView, hasNextCommentPage, fetchNextCommentPage]);

  const createCommentMutation = useMutation({
    mutationFn: () => postComment(lpId, commentText),
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(lpId, commentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["lpComments", lpId] }),
  });

  const comments = commentData?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="mt-16 bg-[#121215] rounded-2xl p-6 sm:p-8 border border-[#222226]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">
          댓글 <span className="text-pink-500">{comments.length}</span>
        </h3>
        <div className="flex border border-gray-600 rounded text-xs font-bold overflow-hidden">
          <button
            onClick={() => setCommentOrder("asc")}
            className={`px-3 py-1 ${commentOrder === "asc" ? "bg-white text-black" : "bg-[#151518] text-white"}`}
          >
            오래된순
          </button>
          <button
            onClick={() => setCommentOrder("desc")}
            className={`px-3 py-1 ${commentOrder === "desc" ? "bg-white text-black" : "bg-[#151518] text-white"}`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="flex-1 bg-[#1a1a1e] border border-[#333338] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
        />
        <button
          onClick={() => {
            if (!commentText.trim()) return alert("댓글을 입력해주세요.");
            createCommentMutation.mutate();
          }}
          disabled={createCommentMutation.isPending}
          className="bg-[#3a3a3d] hover:bg-pink-500 text-white px-5 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          작성
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {isCommentLoading &&
          Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}

        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">
                {comment.author?.name?.[0] || "익"}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-white font-bold text-sm mr-2">
                    {comment.author?.name || "익명"}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("정말 삭제하시겠습니까?"))
                      deleteCommentMutation.mutate(comment.id);
                  }}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <p className="text-gray-300 mt-1 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}

        {isFetchingNextCommentPage && <CommentSkeleton />}

        <div ref={commentRef} className="h-4 w-full" />
      </div>
    </div>
  );
}