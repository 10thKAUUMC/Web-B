import { useParams, useNavigate } from 'react-router-dom';
import useGetLpDetail from '../hooks/queries/useGetLpDetail';
import { 
  FiX, 
  FiHeart, 
  FiMoreHorizontal, 
  FiEdit2, 
  FiTrash2 
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useState } from 'react';

export default function LpDetailPage() {
  const { lpid } = useParams();
  const navigate = useNavigate();
  const lpIdNumber = Number(lpid);
  const { data, isPending, isError, refetch } = useGetLpDetail(lpIdNumber);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

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
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2.5 bg-[#2a2a2d] hover:bg-[#3a3a3d] text-white rounded-lg transition-colors font-semibold"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 mt-4 md:mt-8">
      <div className="bg-[#151518] border border-[#222226] rounded-3xl p-8 sm:p-12 shadow-2xl relative">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">
                {data.author?.name?.[0]?.toUpperCase() || '익'}
              </span>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">
                {data.author?.name || '익명 사용자'}
              </h3>
              <span className="text-gray-500 text-sm font-medium">
                {new Date(data.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors"
              >
                <FiMoreHorizontal size={24} />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-[#222226] border border-[#333338] rounded-xl shadow-xl overflow-hidden z-20">
                  <button className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-[#2a2a2d] flex items-center gap-2 transition-colors">
                    <FiEdit2 size={16} /> 수정
                  </button>
                  <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2a2a2d] flex items-center gap-2 transition-colors">
                    <FiTrash2 size={16} /> 삭제
                  </button>
                </div>
              )}
            </div>
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a2d] rounded-full transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-16 text-center leading-tight">
          {data.title}
        </h1>

        <div className="flex justify-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a] animate-[spin_12s_linear_infinite] group">
            <img 
              src={data.thumbnail || 'https://via.placeholder.com/600'} 
              alt={data.title} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
               <div className="w-20 h-20 rounded-full border border-white/20 backdrop-blur-sm bg-black/40 flex items-center justify-center shadow-inner">
                  <div className="w-6 h-6 bg-[#151518] rounded-full shadow-inner"></div>
               </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <p className="text-gray-300 text-center text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {data.content}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {data?.tags?.map((tag: any, index: number) => (
            <span 
              key={tag?.id || index} 
              className="px-4 py-1.5 bg-[#2a2a2d] text-gray-300 rounded-full text-sm font-semibold hover:bg-[#333338] hover:text-white transition-colors cursor-default"
            >
              # {typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>

        <div className="flex justify-center border-t border-[#222226] pt-10">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="flex items-center gap-2 transition-all transform active:scale-95 text-gray-300 hover:text-white"
          >
            {isLiked ? (
              <FaHeart size={26} className="text-red-500" />
            ) : (
              <FiHeart size={26} />
            )}
            <span className="font-bold text-xl ml-1">
              {Number(data.likes?.length || 0) + (isLiked ? 1 : 0)}
            </span>
          </button>
        </div>
        
      </div>
    </div>
  );
}