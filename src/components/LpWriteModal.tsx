import { useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import usePostLp from '../hooks/mutations/usePostLp';
import usePatchLp from '../hooks/mutations/usePatchLp';
import { postUploadImage } from '../apis/user';

interface LpWriteModalProps {
  onClose: () => void;
  initialData?: any;
}

export default function LpWriteModal({ onClose, initialData }: LpWriteModalProps) {
  const isEditMode = !!initialData;
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tagInput, setTagInput] = useState('');
  
  const initialTags = initialData?.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
  const [tags, setTags] = useState<string[]>(initialTags);
  
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(initialData?.thumbnail || '');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.thumbnail || null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: postMutate, isPending: isPosting } = usePostLp();
  const { mutate: patchMutate, isPending: isPatching } = usePatchLp();

  const isPending = isPosting || isPatching;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result as string);
    reader.readAsDataURL(file);

    try {
      const res = await postUploadImage(file);
      const uploadedUrl = typeof res === 'string' ? res : res?.url || res?.imageUrl || res?.data;
      setThumbnailUrl(uploadedUrl);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return alert('제목과 내용을 입력해주세요.');
    if (!thumbnailUrl && !previewUrl) return alert('이미지가 아직 업로드 중이거나 실패했습니다. 다시 등록해주세요.');
    
    const payload = { 
      title, 
      content, 
      thumbnail: thumbnailUrl || previewUrl || '', 
      tags, 
      published: true 
    };

    if (isEditMode) {
      patchMutate({ lpId: initialData.id, data: payload }, {
        onSuccess: () => {
          alert('LP가 성공적으로 수정되었습니다!');
          onClose();
        }
      });
    } else {
      postMutate(payload, { 
        onSuccess: () => {
          alert('LP가 성공적으로 추가되었습니다!');
          onClose(); 
        } 
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[#222226] w-full max-w-sm rounded-3xl p-8 relative flex flex-col gap-5 shadow-2xl border border-[#333338]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors">
          <FiX size={24} />
        </button>

        <div className="flex justify-center mt-2 mb-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-48 rounded-full bg-black border-8 border-[#1a1a1c] overflow-hidden cursor-pointer relative flex items-center justify-center group shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-gray-900 to-black rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full border-[8px] border-[#151518]"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">사진 변경</span>
            </div>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>

        <div className="flex flex-col gap-3">
          <input 
            type="text" 
            placeholder="LP Name" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#151518] border border-[#333338] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-pink-500 text-white"
          />
          <input 
            type="text" 
            placeholder="LP Content" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-[#151518] border border-[#333338] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-pink-500 text-white"
          />
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="LP Tag" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="flex-1 bg-[#151518] border border-[#333338] rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-pink-500 text-white"
            />
            <button 
              onClick={handleAddTag}
              className="px-6 bg-[#2a2a2d] hover:bg-[#333338] text-white rounded-xl text-sm font-bold transition-colors"
            >
              Add
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-md text-xs font-semibold text-gray-200">
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-red-400">
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full mt-4 bg-[#e2e2e2] text-black font-extrabold py-4 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
        >
          {isPending ? '처리 중...' : isEditMode ? 'Edit LP' : 'Add LP'}
        </button>
      </div>
    </div>
  );
}