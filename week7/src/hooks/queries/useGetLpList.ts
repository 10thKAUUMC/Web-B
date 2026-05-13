import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";

const useGetLpList = (sort: string = "desc") => {
  return useQuery({
    
    queryKey: ["lps", sort],
    queryFn: () => getLpList(1, sort), 
  });
};

export default useGetLpList;