import axiosClient from "../lib/axiosClient";

export const getAllUsers = async (page = 0, size = 10) => {
  const response = await axiosClient.get("/api/user/getAllUsers", {
    params: {
      page,
      size,
    },
  });
  return response.data;
};
