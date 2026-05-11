type Props = {
  retry: () => void;
};

const Error = ({ retry }: Props) => {
  return (
    <div className="flex flex-col items-center gap-3 mt-10">
      <p>에러가 발생했습니다.</p>

      <button
        onClick={retry}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        다시 시도
      </button>
    </div>
  );
};

export default Error;