import api from '@/utils/server';
import {
  setLoading,
  setBooks,
  setBook,
  addBookSuccess,
  updateBookSuccess,
  deleteBookSuccess,
  setError,
  setBookLoans,
  setBorrowedBooks,
} from '../slices/bookSlice';
import { toast } from 'sonner';

// Get all books with pagination
export const fetchBooks = (page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/books/all-books?page=${page}&limit=${limit}`);
    dispatch(setBooks(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch books'));
  }
};

// Get a single book
export const fetchBookById = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/books/${id}`);
    dispatch(setBook(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch book details'));
  }
};

// Add a new book
export const addBook = (bookData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post('/books/create-books', bookData);
    console.log(response.data)
    dispatch(addBookSuccess(response.data));
    toast.success('Book added successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to add book'));
    throw error;
  }
};

// Update a book
export const updateBook = (id, bookData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/books/${id}`, bookData);
    dispatch(updateBookSuccess(response.data.book));
    toast.success('Book updated successfully');
    return response.data.book;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to update book'));
    throw error;
  }
};

// Delete a book
export const deleteBook = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    await api.delete(`/books/${id}`);
    dispatch(deleteBookSuccess(id));
    toast.success('Book deleted successfully');
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to delete book'));
    throw error;
  }
};

// Search books
export const searchBooks = (query) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/books/search?query=${query}`);
    dispatch(setBooks(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to search books'));
  }
};

// Borrow a book
export const borrowBook = (bookId) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.post(`/books/${bookId}/borrow`);
    toast.success('Book borrowed successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to borrow book'));
    throw error;
  }
};

// Return a book
export const returnBook = (borrowedBookId) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.put(`/books/${borrowedBookId}/return`);
    toast.success('Book returned successfully');
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to return book'));
    throw error;
  }
};

// Get user's borrowed books
export const getUserBorrowedBooks = () => async (dispatch) => {
  try {
    dispatch(setLoading());   
    const response = await api.get(`/books/user-borrowed-books`);
    dispatch(setBorrowedBooks(response.data.borrowedBooks));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch borrowed books'));
  }
};

// Get all book loans (admin/faculty)
export const getAllBookLoans = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get('/books/book-loans');
    dispatch(setBookLoans(response.data.bookLoans));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch book loans'));
  }
};

// Get book loans for a specific user (admin/faculty)
export const getBookLoansByUser = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading());
    
    const response = await api.get(`/books/book-loans/user/${userId}`);
    dispatch(setBookLoans(response.data));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || 'Failed to fetch user book loans'));
  }
};