import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";


const useGetLpDetail = (lpid: string | undefined) => {
  return useQuery({
    queryKey: ["lp", lpid],
    
    queryFn: () => {
      if (!lpid) throw new Error("ID가 없습니다.");
      return getLpDetail(lpid);
    },
    
    enabled: !!lpid,
  });
};

export default useGetLpDetail;