import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";

const useGetLpList = (
  page: number,
  sort: string
) => {
  return useQuery({
    queryKey: [
      "lps",
      page,
      sort,
    ],

    queryFn: () =>
      getLpList(),

    staleTime:
      1000 * 60 * 5,

    gcTime:
      1000 * 60 * 10,
  });
};

export default
  useGetLpList;