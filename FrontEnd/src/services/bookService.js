import axiosClient from "../lib/axiosClient";

export const getAllBooks = async (page = 0, size = 10) => {
  const response = await axiosClient.get("/api/books/getAllBooks", {
    params: { page, size },
  });
  return response.data;
};

export const getBooksByCategory = async (categoryId, page = 0, size = 10) => {
  const response = await axiosClient.get(`/api/books/category/${categoryId}`, {
    params: { page, size },
  });
  return response.data;
};

export const getBookById = async (bookId) => {
  const response = await axiosClient.get(`/api/books/${bookId}`);
  return response.data;
};
