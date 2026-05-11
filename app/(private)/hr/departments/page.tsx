"use client";

import { useState } from "react";
import { PlusCircle, Search, Building2, ChevronRight, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { Department, deleteDepartment } from "@/services/departments";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import CreateDepartment from "@/forms/departments/CreateDepartment";
import UpdateDepartment from "@/forms/departments/UpdateDepartment";

export default function DepartmentsPage() {
  const { data: departments, isLoading, refetch } = useFetchDepartments();
  const token = useAxiosAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [departmentToUpdate, setDepartmentToUpdate] = useState<Department | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!departmentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDepartment(departmentToDelete.reference, token);
      toast.success("Department deleted successfully");
      setDepartmentToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to delete department");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDepartments = departments?.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dept.email && dept.email.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="p-8 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded">
            <Building2 className="w-8 h-8 text-[#004d40]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#004d40]">Departments</h1>
            <p className="text-zinc-500">Manage organizational departments and assignments</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 rounded bg-white"
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded px-5 whitespace-nowrap">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Department</DialogTitle>
                <DialogDescription>
                  Define a new organizational unit within the system.
                </DialogDescription>
              </DialogHeader>
              <CreateDepartment
                onSuccess={() => { setIsCreateOpen(false); refetch(); }}
                onCancel={() => setIsCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <Table>
              <TableHeader className="bg-zinc-50/50">
                <TableRow>
                  <TableHead className="pl-6 w-[25%]">Name</TableHead>
                  <TableHead className="w-[20%]">Email</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[15%]">Head</TableHead>
                  <TableHead className="w-[10%]">Staff Count</TableHead>
                  <TableHead className="w-[10%] text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <TableRow key={dept.id} className="group hover:bg-zinc-50/50 cursor-pointer">
                      <TableCell className="pl-6 font-medium text-zinc-900 border-r md:border-none border-zinc-100">
                        <Link href={`/hr/departments/${dept.reference}`} className="hover:underline flex items-center">
                          {dept.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {dept.email || <span className="text-zinc-400 italic">Not set</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={dept.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}>
                          {dept.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        {dept.head || <span className="text-zinc-400 italic">Unassigned</span>}
                      </TableCell>
                      <TableCell className="text-zinc-600">
                        <Badge variant="secondary" className="bg-zinc-100">
                          {dept.staff?.length || 0} Members
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/hr/departments/${dept.reference}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/hr/departments/${dept.reference}`} className="cursor-pointer w-full">
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => setDepartmentToUpdate(dept)} className="cursor-pointer">
                                <Pencil className="mr-2 h-4 w-4" /> Edit Department
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={() => setDepartmentToDelete(dept)}
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Department
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Building2 className="h-8 w-8 text-zinc-300" />
                        <p>{searchTerm ? "No departments found matching your search." : "No departments have been added yet."}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Update Dialog */}
      <Dialog open={!!departmentToUpdate} onOpenChange={(open) => !open && setDepartmentToUpdate(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update information for {departmentToUpdate?.name}.
            </DialogDescription>
          </DialogHeader>
          {departmentToUpdate && (
            <UpdateDepartment
              department={departmentToUpdate}
              onSuccess={() => { setDepartmentToUpdate(null); refetch(); }}
              onCancel={() => setDepartmentToUpdate(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!departmentToDelete} onOpenChange={(open) => !isDeleting && !open && setDepartmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the <strong>{departmentToDelete?.name}</strong> department.
              Any staff or operations associated with this department may be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete Department"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}