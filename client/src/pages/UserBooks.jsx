import React from 'react';
import BorrowedBooks from '@/components/BorrowedBooks';

const UserBooks = () => {
  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8 mt-30">
      <BorrowedBooks />
    </div>
  );
};

export default UserBooks;