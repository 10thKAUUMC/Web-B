import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import LpCommentSection from '../components/LpCommentSection';
import { FiX, FiHeart, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteLp, patchLp } from '../apis/lp';
import { uploadImage } from '../apis/upload';
import { postLike, deleteLike } from '../apis/likes';
import { getMyInfo } from '../apis/user';

export default function LpDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const lpIdNumber = Number(lpid);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);
  const { data: myInfo } = useQuery({ queryKey: ['myInfo'], queryFn: getMyInfo });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editThumbnailPreview, setEditThumbnailPreview] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);

  const { mutate: deleteMutate } = useMutation({
    mutationFn: () => deleteLp(lpIdNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpList'] });
      navigate('/');
    },
    onError: () => alert('삭제에 실패했습니다.'),
  });

  const { mutate: editMutate } = useMutation({
    mutationFn: () => patchLp(lpIdNumber, {
      title: editTitle,
      content: editContent,
      thumbnail: editThumbnail || (data?.thumbnail?.startsWith('blob:') ? '' : data?.thumbnail) || '',
      tags: editTags.length > 0 ? editTags : ['기본태그'],
      published: true,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpIdNumber] });
      setIsEditing(false);
    },
    onError: () => alert('수정에 실패했습니다.'),
  });

  const { mutate: likeMutate, isPending: isLikePending } = useMutation({
    mutationFn: (isCurrentlyLiked: boolean) =>
      isCurrentlyLiked ? deleteLike(lpIdNumber) : postLike(lpIdNumber),
    onMutate: async (isCurrentlyLiked: boolean) => {
      await queryClient.cancelQueries({ queryKey: ['lp', lpIdNumber] });
      const previousData = queryClient.getQueryData(['lp', lpIdNumber]);
      queryClient.setQueryData(['lp', lpIdNumber], (old: any) => {
        if (!old) return old;
        const likes = old.likes || [];
        if (isCurrentlyLiked) {
          return { ...old, likes: likes.filter((l: any) => l.userId !== myInfo?.id) };
        } else {
          return { ...old, likes: [...likes, { id: Date.now(), userId: myInfo?.id, lpId: lpIdNumber }] };
        }
      });
      return { previousData };
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(['lp', lpIdNumber], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lp', lpIdNumber] });
    },
  });

  const handleDeleteClick = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) deleteMutate();
    setIsMenuOpen(false);
  };

  const handleEditClick = () => {
    setEditTitle(data?.title || '');
    setEditContent(data?.content || '');
    const thumb = data?.thumbnail || '';
    setEditThumbnail(thumb.startsWith('blob:') ? '' : thumb);
    setEditThumbnailPreview(thumb.startsWith('blob:') ? '' : thumb);
    setEditTags(data?.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || []);
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEditThumbnailPreview(previewUrl);
      try {
        const url = await uploadImage(file);
        setEditThumbnail(url);
      } catch {
        alert('이미지 업로드 실패');
        setEditThumbnailPreview(editThumbnail);
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

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 text-gray-300">
        <p className="text-lg">정보를 불러오는 데 문제가 발생했습니다.</p>
        <button onClick={() => refetch()} className="px-6 py-2.5 bg-[#2a2a2d] hover:bg-[#3a3a3d] text-white rounded-lg transition-colors font-semibold">
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) return null;

  const isLiked = myInfo ? data.likes?.some((l: any) => l.userId === myInfo.id) : false;
  const likesCount = data.likes?.length || 0;
  const displayThumbnail = isEditing
    ? (editThumbnailPreview || data.thumbnail || 'https://via.placeholder.com/600')
    : (data.thumbnail?.startsWith('blob:') ? 'https://via.placeholder.com/600' : data.thumbnail || 'https://via.placeholder.com/600');

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 mt-4 md:mt-8">
      <div className="bg-[#151518] border border-[#222226] rounded-3xl p-8 sm:p-12 shadow-2xl relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{data.author?.name?.[0]?.toUpperCase() || '익'}</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">{data.author?.name || '익명 사용자'}</h3>
              <span className="text-gray-500 text-sm font-medium">
                {new Date(data.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors">
                <FiMoreHorizontal size={24} />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#222226] border border-[#333338] rounded-xl shadow-xl overflow-hidden z-20">
                  <button onClick={handleEditClick} className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-[#2a2a2d] flex items-center gap-2 transition-colors">
                    <FiEdit2 size={16} /> 수정
                  </button>
                  <button onClick={handleDeleteClick} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2d] flex items-center gap-2 transition-colors">
                    <FiTrash2 size={16} /> 삭제
                  </button>
                </div>
              )}
            </div>
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors">
              <FiX size={24} />
            </button>
          </div>
        </div>

        {isEditing ? (
          <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full text-3xl font-extrabold text-white mb-6 bg-[#1a1a1e] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 text-center" />
        ) : (
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-16 text-center leading-tight">{data.title}</h1>
        )}

        <div className="flex justify-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <div
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-full h-full rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a] group ${!isEditing ? 'animate-[spin_12s_linear_infinite]' : 'cursor-pointer'}`}
            >
              <img src={displayThumbnail} alt={data.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <span className="text-white text-sm font-bold">사진 변경</span>
                </div>
              )}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-sm bg-black/40 flex items-center justify-center shadow-inner">
                  <div className="w-6 h-6 bg-[#151518] rounded-full shadow-inner"></div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
        </div>

        {isEditing ? (
          <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={4} className="w-full max-w-2xl mx-auto block mb-6 bg-[#1a1a1e] border border-[#333] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 resize-none" />
        ) : (
          <div className="max-w-2xl mx-auto mb-16">
            <p className="text-gray-300 text-center text-lg leading-relaxed whitespace-pre-wrap font-medium">{data.content}</p>
          </div>
        )}

        {isEditing && (
          <div className="flex gap-3 justify-center mb-8">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-[#2a2a2d] text-white rounded-lg hover:bg-[#3a3a3d] transition-colors">취소</button>
            <button onClick={() => editMutate()} className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">저장</button>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {data?.tags?.map((tag: any, index: number) => (
            <span key={tag?.id || index} className="px-4 py-1.5 bg-[#2a2a2d] text-gray-300 rounded-full text-sm font-semibold hover:bg-[#333338] hover:text-white transition-colors cursor-default">
              # {typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>

        <div className="flex justify-center border-t border-[#222226] pt-10">
          <button
            onClick={() => !isLikePending && likeMutate(isLiked)}
            disabled={isLikePending}
            className="flex items-center gap-2 transition-all transform active:scale-95 text-gray-300 hover:text-white disabled:opacity-50"
          >
            {isLiked ? <FaHeart size={26} className="text-red-500" /> : <FiHeart size={26} />}
            <span className="font-bold text-xl ml-1">{likesCount}</span>
          </button>
        </div>

        <LpCommentSection lpId={lpIdNumber} />
      </div>
    </div>
  );
}