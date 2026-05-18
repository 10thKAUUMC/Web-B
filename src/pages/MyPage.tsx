import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, updateMyInfo } from '../apis/user';
import { uploadImage } from '../apis/upload';
import { getMyLpList, getLikedLpList } from '../apis/lp';
import LpCard from '../components/LpCard';

export default function MyPage() {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [activeTab, setActiveTab] = useState<'liked' | 'mine'>('liked');

  const { data, isPending } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });

  const { data: myLpData } = useQuery({
    queryKey: ['myLpList'],
    queryFn: () => getMyLpList({ order: 'desc', limit: 12 }),
    enabled: activeTab === 'mine',
  });

  const { data: likedLpData } = useQuery({
    queryKey: ['likedLpList'],
    queryFn: () => getLikedLpList({ order: 'desc', limit: 12 }),
    enabled: activeTab === 'liked',
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: () => updateMyInfo({
      name: editName,
      bio: editBio || undefined,
      avatar: editAvatar || undefined,
    }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['myInfo'] });
      const previousData = queryClient.getQueryData(['myInfo']);
      queryClient.setQueryData(['myInfo'], (old: any) => ({
        ...old,
        name: editName,
        bio: editBio || old?.bio,
        avatar: editAvatar || old?.avatar,
      }));
      localStorage.setItem('userName', JSON.stringify(editName));
      setIsEditingName(false);
      return { previousData };
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(['myInfo'], context.previousData);
      alert('수정에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setEditAvatar(url);
        mutate();
      } catch {
        alert('이미지 업로드 실패');
      }
    }
  };

  const handleNameEdit = () => {
    setEditName(data?.name || '');
    setEditBio(data?.bio || '');
    setEditAvatar(data?.avatar || '');
    setIsEditingName(true);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full mt-8 pb-20">
      <div className="bg-[#151518] border border-[#222226] rounded-3xl p-8 shadow-2xl mb-6">
        <div className="flex items-center gap-6">
          <label className="cursor-pointer shrink-0">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#333] hover:border-pink-500 transition-colors">
              {data?.avatar ? (
                <img src={data.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#2a2a2d] flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">👤</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-[#1a1a1e] border border-[#333] text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-pink-500 text-lg font-bold"
                    autoFocus
                  />
                  <button onClick={() => mutate()} disabled={isUpdating} className="text-pink-500 hover:text-pink-400">✓</button>
                </>
              ) : (
                <>
                  <p className="text-white font-bold text-xl">{data?.name}</p>
                  <button onClick={handleNameEdit} className="text-gray-500 hover:text-white text-xs border border-[#333] px-2 py-1 rounded transition-colors">수정</button>
                </>
              )}
            </div>
            <p className="text-gray-400 text-sm">{data?.bio || '자기소개가 없습니다.'}</p>
            <p className="text-gray-500 text-sm">{data?.email}</p>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-[#222226] mb-6">
        <button
          onClick={() => setActiveTab('liked')}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'liked' ? 'text-white border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          내가 좋아요 한 LP
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-6 py-3 text-sm font-semibold transition-colors ${activeTab === 'mine' ? 'text-white border-b-2 border-pink-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          내가 작성한 LP
        </button>
      </div>

      {/* LP 목록 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {activeTab === 'liked' && likedLpData?.data?.map((lp: any) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
        {activeTab === 'liked' && likedLpData?.data?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            좋아요한 LP가 없습니다.
          </div>
        )}
        {activeTab === 'mine' && myLpData?.data?.map((lp: any) => (
          <LpCard key={lp.id} lp={lp} />
        ))}
        {activeTab === 'mine' && myLpData?.data?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            작성한 LP가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}