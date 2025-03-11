import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBookLoans} from '@/redux/actions/bookActions';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Book, Search, Users } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const BookLoans = () => {
  const dispatch = useDispatch();
  const { bookLoans, isLoading } = useSelector(state => state.books);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllBookLoans());
  }, [dispatch]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredLoans = bookLoans ? bookLoans.filter(loan => {
    const matchesSearch = searchTerm === '' || 
      loan.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || loan.status === filter;
    
    return matchesSearch && matchesFilter;
  }) : [];

  // Check if due date is overdue
  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Book className="h-6 w-6" />
          Book Loans Management
        </CardTitle>
        <CardDescription>
          View and manage all book loans
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by book title or user..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-[180px]">
            <Select value={filter} onValueChange={handleFilterChange} >
              <SelectTrigger className={"cursor-pointer"}>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent >
                <SelectItem value="all" className={"cursor-pointer"}>All Loans</SelectItem>
                <SelectItem value="borrowed" className={"cursor-pointer"}>Borrowed</SelectItem>
                <SelectItem value="returned" className={"cursor-pointer"}>Returned</SelectItem>
                <SelectItem value="overdue" className={"cursor-pointer"}>Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLoans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Borrowed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell className="font-medium">{loan.book?.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{loan.user.name}</span>
                      <span className="text-xs text-muted-foreground">{loan.user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(loan.borrowDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <span className={isOverdue(loan.dueDate) && loan.status !== 'returned' ? 'text-red-600 font-medium' : ''}>
                      {format(new Date(loan.dueDate), 'MMM dd, yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {loan.returnDate ? format(new Date(loan.returnDate), 'MMM dd, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={
                      loan.status === 'overdue' ? 'text-red-600 font-medium' : 
                      loan.status === 'borrowed' ? 'text-amber-600 font-medium' : 'text-green-600 font-medium'
                    }>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-4">No book loans found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookLoans;