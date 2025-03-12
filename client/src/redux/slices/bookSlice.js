import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'sonner';

const initialState = {
  books: [],
  book: null,
  bookLoans: [],
  borrowedBooks: [],
  isLoading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    setBooks: (state, action) => {
      state.books = action.payload.books || action.payload;
      if (action.payload.currentPage) {
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems
        };
      }
      state.isLoading = false;
      state.error = null;
    },
    setBook: (state, action) => {
      state.book = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setBookLoans: (state, action) => {
      state.bookLoans = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setBorrowedBooks: (state, action) => {
      state.borrowedBooks = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    resetBorrowedBooks: (state) => {
      state.borrowedBooks = [];
    },
    addBookSuccess: (state, action) => {
      state.books.push(action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    updateBookSuccess: (state, action) => {
      state.books = state.books.map(book => 
        book._id === action.payload._id ? action.payload : book
      );
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    deleteBookSuccess: (state, action) => {
      state.books = state.books.filter(book => book._id !== action.payload);
      state.isLoading = false;
      state.success = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.success = false;
      toast.error(action.payload || "An error occurred");
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  setLoading,
  setBooks,
  setBook,
  setBookLoans,
  setBorrowedBooks,
  addBookSuccess,
  updateBookSuccess,
  deleteBookSuccess,
  resetBorrowedBooks,
  setError,
  resetSuccess,
} = bookSlice.actions;

export default bookSlice.reducer;