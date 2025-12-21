import axiosClient from "../lib/axiosClient";

export const getAllCategories = async (page = 0, size = 100) => {
  const response = await axiosClient.get("/api/categories/getAllCategories", {
    params: { page, size },
  });
  return response.data;
};

export const getCategoryById = async (categoryId) => {
  const response = await axiosClient.get(`/api/categories/${categoryId}`);
  return response.data;
};
