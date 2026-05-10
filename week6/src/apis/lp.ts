import { axiosInstance } from "./axios";

export const getLpList = async (page: number = 1, sort: string = "desc") => {
  
  const response = await axiosInstance.get("/lps");

  
  console.log("파라미터 제거 후 서버 데이터:", response.data);
  
  return response.data.data || response.data;
};

export const getLpDetail = async (lpid: string) => {
  const response = await axiosInstance.get(`/lps/${lpid}`);
  return response.data.data || response.data;
};