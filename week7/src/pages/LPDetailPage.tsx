import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { useLpMutation } from "../hooks/useLpMutation";

const LPDetailPage = () => {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const { data: lp, isLoading } = useGetLpDetail(lpid);
  const { comment, deleteLp, updateLp, likeLp } = useLpMutation();

  const [commentInput, setCommentInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isEditingLp, setIsEditingLp] = useState(false);
  const [lpForm, setLpForm] = useState({ title: "", content: "", thumbnail: "", tags: "" });

  const currentLp = lp?.data || lp;
  const comments = currentLp?.comments || [];
  
  // 🔥 좋아요 관련 데이터 추출
  const likes = currentLp?.likes || 0;
  const likedBy = currentLp?.likedBy || [];
  const myName = localStorage.getItem("userName") || "사용자";
  const isLiked = likedBy.includes(myName); // 현재 로그인한 사람이 좋아요를 눌렀는지 여부

  const handleEditLpClick = () => {
    setLpForm({
      title: currentLp?.title || "",
      content: currentLp?.content || "",
      thumbnail: currentLp?.thumbnail || "",
      tags: currentLp?.tags ? currentLp.tags.join(", ") : ""
    });
    setIsEditingLp(true);
  };

  const handleSaveLp = () => {
    const tagsArray = lpForm.tags.split(",").map(t => t.trim()).filter(t => t !== "");
    updateLp.mutate({ id: lpid!, data: { ...lpForm, tags: tagsArray } }, {
      onSuccess: () => setIsEditingLp(false)
    });
  };

  // 🔥 좋아요 토글 로직
  const handleLike = () => {
    const newLikedBy = isLiked 
      ? likedBy.filter((name: string) => name !== myName) // 이미 눌렀으면 배열에서 제거
      : [...likedBy, myName]; // 안 눌렀으면 배열에 추가

    // 이전 답변에서 수정해드린 useLpMutation의 likeLp가 이 인자들을 받을 수 있어야 합니다!
    likeLp.mutate({ id: lpid!, likes: newLikedBy.length, likedBy: newLikedBy });
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    comment.add.mutate({ lpId: lpid!, text: commentInput, existingComments: comments }, {
      onSuccess: () => setCommentInput("")
    });
  };

  const handleUpdateComment = (id: string) => {
    if (!editValue.trim()) return;
    comment.edit.mutate({ lpId: lpid!, commentId: id, text: editValue, existingComments: comments }, {
      onSuccess: () => setEditingId(null)
    });
  };

  if (isLoading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* 상단 버튼 영역 유지... */}
      <div className="flex justify-between mb-8">
        <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white">← 뒤로가기</button>
        <div className="flex gap-3">
          {isEditingLp ? (
            <>
              <button onClick={() => setIsEditingLp(false)} className="text-zinc-500 text-sm">취소</button>
              <button onClick={handleSaveLp} className="text-pink-500 text-sm font-bold">저장하기</button>
            </>
          ) : (
            <>
              <button onClick={handleEditLpClick} className="text-zinc-400 text-sm border border-zinc-800 px-3 py-1 rounded">수정</button>
              <button onClick={() => window.confirm("LP를 삭제하시겠습니까?") && deleteLp.mutate(lpid!, { onSuccess: () => navigate("/") })} className="text-red-500 text-sm border border-red-500/20 px-3 py-1 rounded">삭제</button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-10 mb-16">
        {isEditingLp ? (
           // 편집 폼 유지...
          <div className="flex-1 space-y-4">
            <input value={lpForm.thumbnail} onChange={e => setLpForm({...lpForm, thumbnail: e.target.value})} className="w-full bg-zinc-900 p-3 rounded-lg outline-none focus:border-pink-500 border border-zinc-800" placeholder="썸네일 URL" />
            <input value={lpForm.title} onChange={e => setLpForm({...lpForm, title: e.target.value})} className="w-full bg-zinc-900 p-4 rounded-lg text-2xl font-bold outline-none focus:border-pink-500 border border-zinc-800" placeholder="제목" />
            <input value={lpForm.tags} onChange={e => setLpForm({...lpForm, tags: e.target.value})} className="w-full bg-zinc-900 p-3 rounded-lg outline-none focus:border-pink-500 border border-zinc-800" placeholder="태그 (쉼표 구분)" />
            <textarea value={lpForm.content} onChange={e => setLpForm({...lpForm, content: e.target.value})} className="w-full bg-zinc-900 p-4 rounded-lg h-32 outline-none focus:border-pink-500 border border-zinc-800" placeholder="내용" />
          </div>
        ) : (
          <>
            <img src={currentLp?.thumbnail} className="w-64 h-64 object-cover rounded-2xl shadow-xl bg-zinc-900 flex-shrink-0" alt="Cover" />
            <div className="flex-1">
              <h1 className="text-4xl font-black mb-2">{currentLp?.title}</h1>
              <div className="flex gap-2 mb-4">
                {currentLp?.tags?.map((tag: string, i: number) => (
                  <span key={i} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
              
              {/* 🔥 좋아요 버튼 스타일 및 상태 반영 */}
              <button 
                onClick={handleLike} 
                className={`px-5 py-2 rounded-full border transition flex items-center gap-2 mb-6
                  ${isLiked 
                    ? "bg-pink-500 text-white border-pink-500" 
                    : "bg-zinc-900 text-pink-500 border-pink-500/20 hover:bg-pink-500 hover:text-white"
                  }`}
              >
                <span>{isLiked ? "❤️" : "🤍"}</span> <span className="font-bold">{likes}</span>
              </button>

              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{currentLp?.content}</p>
            </div>
          </>
        )}
      </div>

      {/* 댓글 영역 유지... (코드 생략, 기존과 동일) */}
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>
        {/* ... */}
      </div>
    </div>
  );
};

export default LPDetailPage;