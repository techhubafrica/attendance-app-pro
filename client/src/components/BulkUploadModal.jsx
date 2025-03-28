import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bulkUploadBooks } from "@/redux/actions/bookActions";

const BulkUploadModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await dispatch(bulkUploadBooks(formData));
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk Upload Books</AlertDialogTitle>
          <AlertDialogDescription>
            Upload a CSV file to bulk upload books to the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleUpload}>
          <Input type="file" accept=".csv" onChange={handleFileChange} />
          <AlertDialogFooter className={"mt-3"}>
            <AlertDialogCancel className={"cursor-pointer"}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              className="bg-blue-600 text-white cursor-pointer hover:bg-blue-500"
            >
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
        {message && <p className="text-red-600 mt-2">{message}</p>}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkUploadModal;