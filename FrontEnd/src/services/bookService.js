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
  const response = await axiosClient.get(`/api/books/getBookById/${bookId}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await axiosClient.post("/api/books/create", bookData);
  return response.data;
};

export const updateBook = async (bookId, bookData) => {
  const response = await axiosClient.put(`/api/books/update/${bookId}`, bookData);
  return response.data;
};

export const deleteBook = async (bookId) => {
  const response = await axiosClient.delete(`/api/books/delete/${bookId}`);
  return response.data;
};
