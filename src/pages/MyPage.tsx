import { useState, useEffect, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import useGetMyInfo from '../hooks/queries/useGetMyInfo';
import useUpdateMyInfo from '../hooks/mutations/useUpdateMyInfo';
import { useAuth } from '../context/AuthContext';
import { postUploadImage } from '../apis/user';

export default function MyPage() {
  const { accessToken } = useAuth();
  const { data: me, isPending } = useGetMyInfo(!!accessToken);
  const { mutate, isPending: isUpdating } = useUpdateMyInfo();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarBase64, setAvatarBase64] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (me) {
      setName(me.name || '');
      setBio(me.bio || '');
      setAvatarBase64(me.avatar || '');
    }
  }, [me]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await postUploadImage(file);
      setAvatarBase64(res.imageUrl);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    mutate({
      name: name.trim() || undefined,
      bio: bio.trim() || undefined,
      avatar: avatarBase64 || undefined
    });
  };

  if (isPending) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-[#151518] border border-[#222226] rounded-3xl p-10 flex flex-col items-center gap-8 shadow-2xl">
        
        <div className="relative group">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden cursor-pointer flex items-center justify-center border-4 border-[#222226]"
          >
            {avatarBase64 ? (
              <img src={avatarBase64} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-4xl">
                👤
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white font-bold text-xs">변경</span>
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

        <div className="w-full flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              className="flex-1 bg-[#1a1a1c] border border-gray-600 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white transition-colors"
            />
            <button 
              onClick={handleSubmit}
              disabled={isUpdating}
              className="p-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <FiCheck size={24} />
            </button>
          </div>

          <input 
            type="text" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio를 입력해주세요 (선택사항)"
            className="w-[calc(100%-72px)] bg-[#1a1a1c] border border-gray-600 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white transition-colors"
          />

          <div className="w-[calc(100%-72px)] px-5 py-2 text-gray-400 text-sm">
            {me?.email}
          </div>
        </div>

      </div>
    </div>
  );
}