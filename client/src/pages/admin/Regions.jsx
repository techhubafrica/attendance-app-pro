import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegions, deleteRegion } from "@/redux/actions/regionActions";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MapPin, Plus, Pencil, Trash2, Search } from "lucide-react";
import RegionModal from "@/components/RegionModal";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Regions = () => {
  const dispatch = useDispatch();
  const { regions, isLoading, pagination } = useSelector((state) => state.regions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchRegions(currentPage));
  }, [dispatch, currentPage]);

  const handleAddRegion = () => {
    setIsEditing(false);
    setSelectedRegion(null);
    setIsModalOpen(true);
  };

  const handleEditRegion = (region) => {
    setIsEditing(true);
    setSelectedRegion(region);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (region) => {
    setRegionToDelete(region);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (regionToDelete) {
      await dispatch(deleteRegion(regionToDelete._id));
      setDeleteDialogOpen(false);
      setRegionToDelete(null);
      toast.success("Region deleted successfully");
    } else {
      toast.error("Failed to delete region");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredRegions = regions.filter(
    (region) =>
      region.regionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (region.capital &&
        region.capital.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8 min-h-screen mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">Region Management</h1>
          <p className="text-green-700">Manage your organization's regions</p>
        </div>
        <Button
          onClick={handleAddRegion}
          className="flex items-center gap-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-md mt-4 md:mt-0"
        >
          <Plus size={16} />
          Add Region
        </Button>
      </div>

      <Card className="border-blue-200 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search regions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
        </div>
      ) : filteredRegions.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          {searchTerm
            ? "No regions match your search"
            : "No regions found. Add one to get started!"}
        </div>
      ) : (
        <Card className="border-blue-200 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-blue-100 to-green-100">
                <TableRow>
                  <TableHead className="text-blue-800 font-semibold">Region Name</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Capital</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Appointments</TableHead>
                  <TableHead className="text-blue-800 font-semibold">Robotics Labs</TableHead>
                  <TableHead className="text-right text-blue-800 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow
                    key={region._id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <TableCell className="font-medium capitalize">
                      {region.regionName}
                    </TableCell>
                    <TableCell className="capitalize">
                      {region.capital || "N/A"}
                    </TableCell>
                    <TableCell>{region.appointments?.length || 0}</TableCell>
                    <TableCell>
                      <div className="grid gap-1">
                        {region.roboticsLabs?.map((lab) => (
                          <Badge
                            key={lab.labName}
                            className="bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 capitalize"
                          >
                            {lab.labName}
                          </Badge>
                        )) || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditRegion(region)}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={14} className="mr-1" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() => handleDeleteClick(region)}
                            >
                              <Trash2 size={14} className="mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-red-200">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the region
                                {region.regionName && ` "${region.regionName}"`}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {!searchTerm && pagination.totalPages > 1 && (
        <CardFooter>
          <Pagination className="w-full justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (page === 2 || page === pagination.totalPages - 1) {
                  return <PaginationEllipsis key={page} />;
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={
                    currentPage === pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}

      <RegionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        region={selectedRegion}
        isEditing={isEditing}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the region
              {regionToDelete?.regionName && ` "${regionToDelete.regionName}"`}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Regions;