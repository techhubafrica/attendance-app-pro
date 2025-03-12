import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchBookById } from '@/redux/actions/bookActions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BookDetails from '@/pages/BookDetails';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { book } = useAppSelector(state => state.books);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-6 mt-16">
      <Button 
        onClick={handleGoBack} 
        className="mb-6 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer"
      >
        <ArrowLeft size={18} />
        Back to Books
      </Button>

      {book ? (
        <div className="rounded-lg border border-blue-200 shadow-md p-6 bg-white">
          <BookDetails book={book} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-green-200 bg-white shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Book not found</h2>
          <p className="text-green-600">The requested book could not be found or may have been removed.</p>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;