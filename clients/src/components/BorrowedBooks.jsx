import React, { useEffect } from 'react';
import { getUserBorrowedBooks, returnBook } from '@/redux/actions/bookActions';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, differenceInDays } from 'date-fns';
import { ArrowUpRight, BookOpen, AlertTriangle, Clock, BookMarked, Library } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BorrowedBooks = () => {
  const dispatch = useAppDispatch();
  const { borrowedBooks, isLoading } = useAppSelector(state => state.books);

  useEffect(() => {
    dispatch(getUserBorrowedBooks());
  }, [dispatch]);

  const handleReturnBook = async (borrowedBookId) => {
    try {
      await dispatch(returnBook(borrowedBookId));
      dispatch(getUserBorrowedBooks()); // Refresh the list
      window.location.reload();
    } catch (error) {
      console.error('Failed to return book:', error);
    }
  };

  // Check if due date is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Calculate days until due
  const getDaysUntilDue = (dueDate) => {
    return differenceInDays(new Date(dueDate), new Date());
  };

  // Get overdue and nearly due books
  const overdueBooks = borrowedBooks?.filter(loan => 
    loan.status === 'borrowed' && isOverdue(loan.dueDate)
  ) || [];
  
  const nearlyDueBooks = borrowedBooks?.filter(loan => 
    loan.status === 'borrowed' && 
    !isOverdue(loan.dueDate) && 
    getDaysUntilDue(loan.dueDate) <= 3
  ) || [];

  return (
    <Card className="border-t-4 border-t-blue-500 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardTitle className="text-xl flex items-center gap-2 text-blue-700">
          <BookMarked className="h-5 w-5 text-green-600" />
          My Reading Collection
        </CardTitle>
        <CardDescription className="text-slate-600">
          Track and manage your borrowed library materials
        </CardDescription>
      </CardHeader>

      {/* Notifications Section */}
      {(overdueBooks.length > 0 || nearlyDueBooks.length > 0) && (
        <div className="px-6 space-y-3 bg-slate-50 py-3">
          {overdueBooks.length > 0 && (
            <Alert variant="destructive" className="border-red-600 bg-red-50 shadow-sm">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-700">Attention Required!</AlertTitle>
              <AlertDescription className="text-red-600">
                You have {overdueBooks.length} overdue {overdueBooks.length === 1 ? 'book' : 'books'}. 
                Please return {overdueBooks.length === 1 ? 'it' : 'them'} soon to avoid additional fees.
              </AlertDescription>
            </Alert>
          )}
          
          {nearlyDueBooks.length > 0 && (
            <Alert variant="outline" className="border-amber-500 bg-amber-50 shadow-sm">
              <Clock className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Coming Due Soon</AlertTitle>
              <AlertDescription className="text-amber-600">
                You have {nearlyDueBooks.length} {nearlyDueBooks.length === 1 ? 'book' : 'books'} due within the next 3 days.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <CardContent className={
        (overdueBooks.length > 0 || nearlyDueBooks.length > 0) ? "pt-3" : "bg-white"
      }>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : borrowedBooks?.length > 0 ? (
          <div className="rounded-lg overflow-hidden border border-slate-200">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="text-blue-700">Book Title</TableHead>
                  <TableHead className="text-blue-700">Author</TableHead>
                  <TableHead className="text-blue-700">Borrowed Date</TableHead>
                  <TableHead className="text-blue-700">Due Date</TableHead>
                  <TableHead className="text-blue-700">Status</TableHead>
                  <TableHead className="text-right text-blue-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.map((loan) => {
                  const daysUntilDue = getDaysUntilDue(loan.dueDate);
                  const isNearlyDue = daysUntilDue <= 3 && daysUntilDue >= 0;
                  
                  return (
                    <TableRow 
                      key={loan._id}
                      className={
                        isOverdue(loan.dueDate) && loan.status !== 'returned' 
                          ? 'bg-red-50 hover:bg-red-100' 
                          : isNearlyDue && loan.status !== 'returned'
                            ? 'bg-amber-50 hover:bg-amber-100'
                            : 'hover:bg-slate-50'
                      }
                    >
                      <TableCell className="font-medium text-slate-800">{loan.book.title}</TableCell>
                      <TableCell className="text-slate-600">{loan.book.author}</TableCell>
                      <TableCell className="text-slate-600">{format(new Date(loan.borrowDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={
                            isOverdue(loan.dueDate) && loan.status !== 'returned' 
                              ? 'text-red-600 font-medium' 
                              : isNearlyDue && loan.status !== 'returned'
                                ? 'text-amber-600 font-medium'
                                : 'text-slate-600'
                          }>
                            {format(new Date(loan.dueDate), 'MMM dd, yyyy')}
                          </span>
                          
                          {isOverdue(loan.dueDate) && loan.status !== 'returned' && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                              {Math.abs(daysUntilDue)} {Math.abs(daysUntilDue) === 1 ? 'day' : 'days'} overdue
                            </span>
                          )}
                          
                          {isNearlyDue && loan.status !== 'returned' && (
                            <span className="ml-2 inline-flex items-center rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                              Due in {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          loan.status === 'overdue' ? 'bg-red-100 text-red-600' : 
                          loan.status === 'borrowed' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={isOverdue(loan.dueDate) && loan.status !== 'returned' ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleReturnBook(loan._id)}
                          disabled={loan.status === 'returned'}
                          className={`cursor-pointer ${
                            loan.status !== 'returned' && !isOverdue(loan.dueDate) ? 'border-green-500 text-green-600 hover:bg-green-50' : ''
                          }`}
                        >
                          {loan.status === 'returned' ? 'Returned' : 'Return Book'}
                          {loan.status !== 'returned' && <ArrowUpRight className="ml-1 h-4 w-4" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
            <Library className="h-12 w-12 mx-auto text-slate-400 mb-3" />
            <p className="text-slate-600 mb-2">You don't have any borrowed books at the moment.</p>
            <Button 
              variant="outline" 
              className="mt-4 cursor-pointer bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700" 
              onClick={() => window.location.href = '/books'}
            >
              Browse Books
            </Button>
          </div>
        )}
      </CardContent>
      
      {overdueBooks.length > 0 && (
        <CardFooter className="border-t bg-red-50 text-sm text-red-700 py-3">
          <p className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Please note: Overdue books may incur additional fees. Contact the library if you need assistance.
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default BorrowedBooks;