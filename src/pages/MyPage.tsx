import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyInfo, updateMyInfo } from '../apis/user';
import { uploadImage } from '../apis/upload';

export default function MyPage() {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const { data, isPending } = useQuery({
    queryKey: ['myInfo'],
    queryFn: getMyInfo,
  });

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: () => updateMyInfo({
      name: editName,
      bio: editBio || undefined,
      avatar: editAvatar || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      setIsEditing(false);
    },
    onError: () => alert('수정에 실패했습니다.'),
  });

  const handleEditClick = () => {
    setEditName(data?.name || '');
    setEditBio(data?.bio || '');
    setEditAvatar(data?.avatar || '');
    setIsEditing(true);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setEditAvatar(url);
      } catch {
        alert('이미지 업로드 실패');
      }
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto w-full mt-8 pb-20">
      <div className="bg-[#151518] border border-[#222226] rounded-3xl p-8 shadow-2xl">

        <div className="flex items-center gap-6">
          {/* 프로필 사진 */}
          {isEditing ? (
            <label className="cursor-pointer shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500 hover:opacity-80 transition-opacity">
                {editAvatar ? (
                  <img src={editAvatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">{editName?.[0]?.toUpperCase() || '?'}</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          ) : (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#333] shrink-0">
              {data?.avatar ? (
                <img src={data.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center">
                  <span className="text-white font-bold text-3xl">{data?.name?.[0]?.toUpperCase() || '?'}</span>
                </div>
              )}
            </div>
          )}

          {/* 오른쪽 정보 */}
          <div className="flex-1 flex flex-col gap-3">
            {isEditing ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="이름"
                  className="w-full bg-[#1a1a1e] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-pink-500"
                />
                <input
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Bio (선택)"
                  className="w-full bg-[#1a1a1e] border border-[#333] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-pink-500"
                />
                <p className="text-gray-500 text-sm">{data?.email}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-white font-bold text-xl">{data?.name}</p>
                  <button
                    onClick={handleEditClick}
                    className="text-xs text-gray-400 hover:text-white border border-[#333] hover:border-pink-500 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    설정
                  </button>
                </div>
                <p className="text-gray-300 text-sm">{data?.bio || 'Bio가 없습니다.'}</p>
                <p className="text-gray-500 text-sm">{data?.email}</p>
              </>
            )}
          </div>
        </div>

        {/* 수정 버튼 */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-[#2a2a2d] text-white rounded-lg hover:bg-[#3a3a3d] transition-colors">취소</button>
            <button onClick={() => mutate()} disabled={isUpdating} className="flex-1 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50">
              {isUpdating ? '저장 중...' : '저장'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}