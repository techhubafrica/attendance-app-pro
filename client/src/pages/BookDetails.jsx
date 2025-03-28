import React from "react";
import { borrowBook } from "@/redux/actions/bookActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Book as BookIcon,
  MapPin,
  Tag,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

const BookDetails = ({ book }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { isLoading } = useAppSelector((state) => state.books);
  const navigate = useNavigate();

  const handleBorrowBook = async () => {
    if (!user) {
      toast.error("You must be logged in to borrow books");
      return;
    }

    try {
      await dispatch(borrowBook(book._id));
      navigate("/my-books");
    } catch (error) {
      console.error("Failed to borrow book:", error);
    }
  };

  if (!book) return null;

  const isStudent =
    user && ["student", "faculty", "teacher"].includes(user.role);
  const isAvailable = book.availableCopies > 0;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{book.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <User className="h-4 w-4 mr-1" />
              {book.author}
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {book.category}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {book.description && (
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">ISBN</h4>
              <p className="text-muted-foreground">{book.isbn || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Region</h4>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {book.region?.regionName || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Available Copies</h4>
              <p
                className={`font-medium ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {book.availableCopies} / {book.quantity}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Added On</h4>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {book.createdAt
                    ? format(new Date(book.createdAt), "MMMM dd, yyyy")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {isStudent && (
        <CardFooter className="border-t pt-6">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            disabled={!isAvailable || isLoading}
            onClick={handleBorrowBook}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <BookIcon className="mr-2 h-4 w-4" />
                {isAvailable ? "Borrow Book" : "Currently Unavailable"}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookDetails;
