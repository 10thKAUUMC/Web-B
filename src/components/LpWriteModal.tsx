import { useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { postLp } from '../apis/lp';
import { uploadImage } from '../apis/upload';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface LpWriteModalProps {
  onClose: () => void;
}

export default function LpWriteModal({ onClose }: LpWriteModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setIsUploading(true);
      try {
        const url = await uploadImage(file);
        setThumbnail(url);
      } catch {
        alert('이미지 업로드에 실패했습니다.');
        setThumbnailPreview('');
        setThumbnail('');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: () => postLp({ title, content, thumbnail, tags, published: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      onClose();
    },
    onError: () => {
      alert('LP 작성에 실패했습니다.');
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!content.trim()) return alert('내용을 입력해주세요.');
    if (tags.length === 0) return alert('태그를 하나 이상 추가해주세요.');
    if (isUploading) return alert('이미지 업로드 중입니다. 잠시 기다려주세요.');
    mutate();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-[#1a1a1e] rounded-2xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FiX size={20} />
        </button>

        <div className="flex justify-center items-center mb-6 h-40">
          <div className="relative flex items-center">
            {thumbnailPreview && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-[#333] z-10">
                <img src={thumbnailPreview} alt="LP" className="w-full h-full object-cover" />
              </div>
            )}
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`w-32 h-32 rounded-full bg-[#111] border-4 border-[#222] flex items-center justify-center cursor-pointer hover:border-pink-500 transition-all shadow-xl ${thumbnailPreview ? '-ml-8 z-0' : 'z-10'}`}
            >
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#222] border-2 border-[#333] flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#444]" />
                </div>
              )}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <div className="flex flex-col gap-3">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요" className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500" />
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력해주세요" className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500" />
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="LP Tag"
              className="flex-1 bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500"
            />
            <button onClick={handleAddTag} className="px-5 py-3 bg-[#2a2a2d] hover:bg-pink-500 text-white rounded-lg font-semibold transition-colors">Add</button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#2a2a2d] text-gray-300 rounded-full text-sm">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-white ml-1">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending || isUploading}
          className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? '작성 중...' : isUploading ? '업로드 중...' : 'Add LP'}
        </button>
      </div>
    </div>
  );
}