import React, { useState } from 'react';
import { useLpMutation } from '../hooks/useLpMutation';

const LpModal = ({ onClose }: { onClose: () => void }) => {
  const { createLp } = useLpMutation();

  // 입력 상태 관리
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imgPreview, setImgPreview] = useState<string>('');

  // 이미지 선택 및 미리보기
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput)) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return alert("제목과 내용을 입력해주세요!");

    const newLpData = {
      title: title,
      thumbnail: imgPreview || `https://picsum.photos/300/300?random=${Math.floor(Math.random() * 100)}`,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      content: content,
      tags: tags,
    };

    createLp.mutate(newLpData, { 
      onSuccess: () => {
        alert("성공적으로 등록되었습니다!");
        onClose();
      } 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white italic">ADD NEW RECORD</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl">✕</button>
        </div>

        {/* 이미지 업로드 */}
        <div className="mb-6">
          <div className="w-full aspect-square bg-zinc-800 rounded-xl mb-4 overflow-hidden border-2 border-dashed border-zinc-700 flex items-center justify-center relative">
            {imgPreview ? (
              <img src={imgPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <p className="text-zinc-500 text-sm">LP 사진 업로드 (클릭)</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* 입력란 */}
        <div className="space-y-4 mb-6">
          <input 
            className="w-full p-3 bg-zinc-800 text-white rounded-lg outline-none border border-transparent focus:border-pink-500"
            placeholder="앨범 제목 (예: YB - 나는 나비)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            className="w-full p-3 bg-zinc-800 text-white rounded-lg outline-none h-24 resize-none border border-transparent focus:border-pink-500"
            placeholder="앨범 상세 내용을 적어주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 태그 */}
        <div className="flex gap-2 mb-2">
          <input 
            className="flex-1 p-3 bg-zinc-800 text-white rounded-lg outline-none border border-transparent focus:border-pink-500"
            value={tagInput} 
            onChange={e => setTagInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && addTag()}
            placeholder="태그 입력"
          />
          <button onClick={addTag} className="bg-zinc-700 px-4 rounded-lg text-white font-bold">추가</button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
            <span key={tag} className="bg-pink-900/30 text-pink-500 px-3 py-1 rounded-full text-xs flex items-center gap-2 border border-pink-500/20">
              #{tag} <button onClick={() => setTags(tags.filter(t => t !== tag))}>✕</button>
            </span>
          ))}
        </div>
        
        <button 
          onClick={handleSubmit} 
          disabled={createLp.isPending}
          className="w-full py-4 bg-pink-600 text-white rounded-xl font-bold text-lg hover:bg-pink-500 transition disabled:opacity-50"
        >
          {createLp.isPending ? '저장 중...' : 'Add LP'}
        </button>
      </div>
    </div>
  );
};

export default LpModal;