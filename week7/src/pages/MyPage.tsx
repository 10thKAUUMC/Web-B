import { useState } from "react";
import { useLpMutation } from "../hooks/useLpMutation";

const MyPage = () => {
  const { user } = useLpMutation();
  const [isModal, setIsModal] = useState(false);
  
  const [name, setName] = useState(localStorage.getItem("userName") || "사용자");
  const [bio, setBio] = useState("아직 작성된 Bio가 없습니다.");

  const [tempName, setTempName] = useState(name);
  const [tempBio, setTempBio] = useState(bio);

  const handleOpenModal = () => {
    setTempName(name);
    setTempBio(bio);
    setIsModal(true);
  };

  const handleSave = () => {
    // 🔥 1. 서버 응답을 기다리지 않고 UI(로컬 상태)를 즉시 변경 (낙관적 업데이트)
    setName(tempName);
    setBio(tempBio);
    setIsModal(false);

    // 🔥 2. 서버 통신 (캐시와 localStorage 로직은 useLpMutation의 onMutate에서 처리됨)
    user.update.mutate({ name: tempName, bio: tempBio }, {
      onSuccess: () => {
        alert("프로필이 업데이트 되었습니다!");
      },
      onError: () => {
        // 🔥 3. 만약 서버 통신에 실패했다면 원래 상태로 롤백
        setName(name);
        setBio(bio);
        alert("프로필 업데이트에 실패했습니다. 다시 시도해주세요.");
      }
    });
  };

  return (
    <div className="p-10 text-white min-h-screen bg-black">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <button onClick={handleOpenModal} className="bg-zinc-800 px-5 py-2 rounded-lg text-sm hover:bg-zinc-700 transition">설정</button>
        </div>
        <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 flex gap-6 items-center">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold text-pink-500 mb-1">{name}님</h2>
            <p className="text-zinc-400">{bio}</p>
          </div>
        </div>
      </div>

      {isModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-sm border border-zinc-800">
            <h2 className="text-xl font-bold mb-6">프로필 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">닉네임</label>
                <input 
                  value={tempName} 
                  onChange={e => setTempName(e.target.value)} 
                  className="w-full p-3 bg-zinc-800 rounded-lg outline-none focus:border-pink-500" 
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">자기소개</label>
                <textarea 
                  value={tempBio} 
                  onChange={e => setTempBio(e.target.value)} 
                  className="w-full p-3 bg-zinc-800 rounded-lg outline-none h-24 focus:border-pink-500" 
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={() => setIsModal(false)} className="flex-1 text-zinc-400 hover:text-white">취소</button>
              <button onClick={handleSave} className="flex-1 bg-pink-600 py-3 rounded-xl font-bold hover:bg-pink-500 transition">확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;