import { validationResult } from "express-validator";
import Book from "../models/bookModel.js";
import User from "../models/User.js";
import BookLoan from "../models/bookLoanModel.js";
import Region from "../models/regionModel.js";

// Get all books (with region details populated)
export const getBooks = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Book.countDocuments();
    const books = await Book.find()
      .populate("region", "regionName capital") // Populate region details
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Borrow a book
export const borrowBook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!["student", "faculty", "teacher"].includes(user.role)) {
      return res.status(403).json({
        message: "Only students, faculty, and teachers can borrow books",
      });
    }

    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies === 0) {
      return res
        .status(400)
        .json({ message: "Book is not available for borrowing" });
    }

    // Check if the user has already borrowed this book and not returned it
    const existingLoan = await BookLoan.findOne({
      user: req.user.id,
      book: book._id,
      status: "borrowed",
    });

    if (existingLoan) {
      return res.status(400).json({
        message: "You have already borrowed this book and not returned it.",
      });
    }

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1); // Set due date to 1 month from now

    const bookLoan = new BookLoan({
      user: req.user.id,
      book: book._id,
      dueDate,
    });

    await bookLoan.save();

    book.availableCopies -= 1;
    await book.save();

    res.json(bookLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Return a borrowed book
export const returnBook = async (req, res) => {
  try {
    const bookLoan = await BookLoan.findById(req.params.borrowedBookId);
    if (!bookLoan) {
      return res
        .status(404)
        .json({ message: "Borrowed book record not found" });
    }

    if (bookLoan.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "User not authorized" });
    }

    if (bookLoan.status === "returned") {
      return res
        .status(400)
        .json({ message: "Book has already been returned" });
    }

    bookLoan.status = "returned";
    bookLoan.returnDate = new Date();

    await bookLoan.save();

    const book = await Book.findById(bookLoan.book);
    book.availableCopies += 1;
    await book.save();

    res.json(bookLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get user's borrowed books
export const getUserBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await BookLoan.find({
      user: req.user.id,
      status: "borrowed",
    })
      .populate({ path: "book", select: "title author" })
      .sort({ dueDate: 1 })
      .exec();

    if (!borrowedBooks.length) {
      return res.status(404).json({ message: "No borrowed books found" });
    }
    res.status(200).json({ success: true, borrowedBooks });
  } catch (error) {
    console.error("Error fetching borrowed books:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new book (admin only)
export const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, author, isbn, category, description, quantity, region } =
      req.body;
    // Validate region ID
    const existingRegion = await Region.findById(region);
    if (!existingRegion) {
      return res.status(404).json({ message: "Region not found" });
    }
    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      description,
      quantity,
      region,
    });

    const book = await newBook.save();
    res.status(201).json(book);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "A book with this ISBN already exists." });
    }
    console.error("Server Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Update a book (admin only)
export const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Update book error:", error);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};
// Search books
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } },
      ],
    }).populate("region", "name capital"); // Populate region details
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Get a single book (with region details populated)
export const getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      "region",
      "regionName capital"
    ); // Populate region details
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// Delete a book (admin only)
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await book.deleteOne(); // Use deleteOne() instead of remove()

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all book loans (for admin or faculty)
export const getAllBookLoans = async (req, res) => {
  try {
    const bookLoans = await BookLoan.find()
      .populate("user", "name email") // Populate user details
      .populate("book", "title author"); // Populate book details
    if (!bookLoans.length) {
      return res.status(404).json({ message: "No book loans available" });
    }
    res.status(200).json({ success: true, bookLoans });
  } catch (err) {
    console.error("Error fetching book loans:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// Get book loans for a specific user (for admin or faculty)
export const getBookLoansByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookLoans = await BookLoan.find({ user: userId })
      .populate("user", "name email") // Populate user details
      .populate("book", "title author"); // Populate book details

    res.json(bookLoans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
