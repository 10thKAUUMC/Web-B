import { axiosInstance } from "./axios";

export const getLpList =
  async () => {
    const response =
      await axiosInstance.get(
        "/lps"
      );

    return response.data;
  };

export const getLpDetail =
  async (lpid: string) => {
    const response =
      await axiosInstance.get(
        `/lps/${lpid}`
      );

    return response.data;
  };