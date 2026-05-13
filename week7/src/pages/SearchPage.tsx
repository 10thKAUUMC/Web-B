const SearchPage = () => {
  return (
    <div className="flex-1 bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-5">
        찾기
      </h1>

      <input
        type="text"
        placeholder="LP 검색..."
        className="
          w-full
          max-w-md
          p-3
          rounded-lg
          bg-zinc-900
          border
          border-gray-700
          outline-none
        "
      />
    </div>
  );
};

export default SearchPage;