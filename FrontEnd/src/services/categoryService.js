import axiosClient from "../lib/axiosClient";

const BASE_URL = "/api/categories";

export const getAllCategories = async (page = 0, size = 10, keyword = "") => {
  const params = { page, size };
  if (keyword) params.keyword = keyword;
  const response = await axiosClient.get(`${BASE_URL}/getAllCategories`, { params });
  return response.data;
};

export const createCategory = async (data) => {
  const response = await axiosClient.post(`${BASE_URL}/create`, data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await axiosClient.put(`${BASE_URL}/update/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`${BASE_URL}/delete/${id}`);
  return response.data;
};
