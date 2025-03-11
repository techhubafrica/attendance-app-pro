import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addBook, updateBook } from '@/redux/actions/bookActions';
import { toast } from 'sonner';
import { fetchRegions } from '@/redux/actions/regionActions';
import { Loader2 } from 'lucide-react';

const BookModal = ({ isOpen, onClose, book = null, isEditing = false }) => {
  const dispatch = useDispatch();
  const { regions } = useSelector(state => state.regions);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    quantity: 1,
    region: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    if (book && isEditing) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        description: book.description || '',
        category: book.category || '',
        quantity: book.quantity || 1,
        region: book.region?._id || book.region || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category: '',
        quantity: 1,
        region: ''
      });
    }
  }, [book, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.quantity || formData.quantity < 0) newErrors.quantity = 'Quantity must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = {
        ...formData,
        quantity: Number(formData.quantity) // Ensure quantity is a number
      };

      if (isEditing && book) {
        await dispatch(updateBook(book._id, data));
      } else {
        await dispatch(addBook(data));
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Fiction', 
    'Non-Fiction', 
    'Science', 
    'Technology', 
    'History', 
    'Biography', 
    'Self-Help',
    'Reference',
    'Textbook',
    'Children',
    'Business & Entrepreneurship',
    'Other'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Book' : 'Add New Book'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update book details below' : 'Enter book details below'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Book Title*
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="author" className="text-sm font-medium">
                  Author*
                </label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author name"
                />
                {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="isbn" className="text-sm font-medium">
                  ISBN
                </label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Enter ISBN"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category*
                </label>
                <Select 
                  onValueChange={(value) => handleSelectChange('category', value)}
                  value={formData.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity*
                </label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                />
                {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="region" className="text-sm font-medium">
                 Library Region*
                </label>
                <Select 
                  onValueChange={(value) => handleSelectChange('region', value)}
                  value={formData.region}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {regions.map(region => (
                      <SelectItem key={region._id} value={region._id}>
                        {region.regionName}, {region.capital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
              </div>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter book description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className={"cursor-pointer"}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className={"flex items-center gap-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 border border-transparent rounded-md group cursor-pointer"}>
              {loading ? <>
                  <Loader2 className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" />
                  Processing...
                </> : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookModal;