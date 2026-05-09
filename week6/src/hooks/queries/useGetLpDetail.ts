import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";

const useGetLpDetail = (
  lpid: string
) => {
  return useQuery({
    queryKey: ["lp", lpid],

    queryFn: () =>
      getLpDetail(lpid),

    enabled: !!lpid,
  });
};

export default useGetLpDetail;