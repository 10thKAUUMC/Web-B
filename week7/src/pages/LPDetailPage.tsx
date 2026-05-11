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
  const likes = currentLp?.likes || 0;

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

  const handleLike = () => {
    likeLp.mutate({ id: lpid!, currentLikes: likes });
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
              <button onClick={handleLike} className="bg-zinc-900 px-5 py-2 rounded-full text-pink-500 border border-pink-500/20 hover:bg-pink-500 hover:text-white transition flex items-center gap-2 mb-6">
                <span>❤️</span> <span className="font-bold">{likes}</span>
              </button>
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{currentLp?.content}</p>
            </div>
          </>
        )}
      </div>

      <div className="max-w-3xl">
        <h2 className="text-xl font-bold mb-6">Comments ({comments.length})</h2>
        <div className="flex gap-3 mb-10">
          <input value={commentInput} onChange={(e) => setCommentInput(e.target.value)} className="flex-1 bg-zinc-900 p-4 rounded-xl outline-none border border-zinc-800 focus:border-pink-500" placeholder="댓글을 입력하세요." />
          <button onClick={handleAddComment} className="bg-pink-600 px-8 rounded-xl font-bold">등록</button>
        </div>
        <div className="space-y-6">
          {comments.map((c: any) => (
            <div key={c.id} className="border-b border-zinc-900 pb-6 group">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-pink-500 text-sm">{c.author || "User"}</span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => { setEditingId(c.id); setEditValue(c.text); }} className="text-xs text-zinc-500 hover:text-white">수정</button>
                  <button onClick={() => window.confirm("삭제할까요?") && comment.delete.mutate({ lpId: lpid!, commentId: c.id, existingComments: comments })} className="text-xs text-red-900">삭제</button>
                </div>
              </div>
              {editingId === c.id ? (
                <div className="flex flex-col gap-2">
                  <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-zinc-800 p-3 rounded-lg text-white outline-none" />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="text-xs text-zinc-500">취소</button>
                    <button onClick={() => handleUpdateComment(c.id)} className="text-xs text-pink-500 font-bold">저장</button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-300">{c.text || c.content}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LPDetailPage;