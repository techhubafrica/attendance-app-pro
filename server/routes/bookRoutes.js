import express from "express";
import {
  getBooks,
  borrowBook,
  returnBook,
  createBook,
  searchBooks,
  updateBook,
  getSingleBook,
  deleteBook,
  getBookLoansByUser,
  getUserBorrowedBooks,
  getAllBookLoans,
} from "../controllers/bookController.js";
import { isAdmin, isAdminOrFaculty, verifyToken } from "../middleware/auth.js";
import { validateBookCreation } from "../middleware/validators.js";

const router = express.Router();

router.get("/user-borrowed-books", verifyToken, getUserBorrowedBooks);

router.get("/book-loans", verifyToken, isAdminOrFaculty, getAllBookLoans);
// Public routes
router.get("/all-books", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getSingleBook);

// User routes
router.post("/:bookId/borrow", verifyToken, borrowBook);
router.put("/:borrowedBookId/return", verifyToken, returnBook);

// Admin routes
router.post("/create-books", [verifyToken, isAdmin, validateBookCreation], createBook);
router.put("/:id", [verifyToken, isAdmin, validateBookCreation], updateBook);
router.delete("/:id", verifyToken, isAdmin, deleteBook);

// Admin or faculty routes
router.get("/book-loans/user/:userId", verifyToken, isAdminOrFaculty, getBookLoansByUser);

export default router;