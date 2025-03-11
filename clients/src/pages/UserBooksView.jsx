import React, { useEffect, useState } from 'react';
import { fetchBooks, searchBooks } from '@/redux/actions/bookActions';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Search, Eye, BookOpen } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

const UserBooksView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, isLoading, pagination } = useAppSelector(state => state.books);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    dispatch(fetchBooks(currentPage));
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (searchTerm) {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      
      const timeoutId = setTimeout(() => {
        dispatch(searchBooks(searchTerm));
      }, 500);
      
      setDebounceTimeout(timeoutId);
    } else {
      dispatch(fetchBooks(currentPage));
    }
    
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchTerm, dispatch]);

  const handleViewDetails = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCategoryColor = (category) => {
    const categories = {
      'Fiction': 'bg-blue-100 text-blue-800',
      'Non-fiction': 'bg-green-100 text-green-800',
      'Science': 'bg-teal-100 text-teal-800',
      'History': 'bg-cyan-100 text-cyan-800',
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Arts': 'bg-teal-100 text-teal-800',
      'Philosophy': 'bg-cyan-100 text-cyan-800'
    };
    
    return categories[category] || 'bg-blue-50 text-blue-600';
  };

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30 rounded-lg">
      <Card className="border-blue-200 shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-green-100 border-b border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2 text-blue-700">
                <Book className="h-6 w-6 text-green-600" />
                Library Catalogue
              </CardTitle>
              <CardDescription className="text-blue-600">
                Browse and borrow books from our collection
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-blue-500" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                className="pl-10 border-blue-200 focus:border-green-400 focus:ring-green-400 h-12 text-blue-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-blue-50 rounded-lg border border-blue-100">
              <BookOpen className="h-12 w-12 mx-auto text-blue-400 mb-2" />
              <p className="text-blue-700 font-medium text-lg">
                {searchTerm ? "No books match your search" : "No books found in the library."}
              </p>
              <p className="text-green-600 mt-2">
                Try adjusting your search or check back later for new additions.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <Card key={book._id} className="overflow-hidden h-full flex flex-col border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow bg-white border-blue-100">
                    <div className="p-6">
                      <h3 className="font-semibold text-lg line-clamp-1 text-blue-700">{book.title}</h3>
                      <p className="text-sm text-green-700">by {book.author || 'Unknown'}</p>
                      
                      <div className="mt-3 flex items-center">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(book.category)}`}>
                          {book.category || 'Uncategorized'}
                        </span>
                      </div>
                      
                      {book.description && (
                        <p className="mt-3 text-sm text-blue-600 line-clamp-2">
                          {book.description}
                        </p>
                      )}
                      
                      <div className="mt-3 text-sm font-medium">
                        <span className={book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}>
                          {book.availableCopies > 0 ? '✓ Available' : '✗ Not Available'} 
                        </span>
                        <span className="text-blue-600 ml-2">
                          ({book.availableCopies} / {book.quantity || 0})
                        </span>
                      </div>
                    </div>
                    
                    <CardFooter className="mt-auto p-4 pt-0">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        onClick={() => handleViewDetails(book._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {!searchTerm && pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} 
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700'}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === pagination.totalPages || 
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        )
                        .map((page, index, array) => {
                          if (index > 0 && array[index - 1] !== page - 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <PaginationItem>
                                  <span className="px-2 text-blue-700">...</span>
                                </PaginationItem>
                                <PaginationItem>
                                  <PaginationLink
                                    onClick={() => handlePageChange(page)}
                                    isActive={page === currentPage}
                                    className={page === currentPage ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
                                  >
                                    {page}
                                  </PaginationLink>
                                </PaginationItem>
                              </React.Fragment>
                            );
                          }
                          
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                onClick={() => handlePageChange(page)}
                                isActive={page === currentPage}
                                className={page === currentPage ? 'bg-green-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < pagination.totalPages && handlePageChange(currentPage + 1)} 
                          className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBooksView;