"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, EyeOff, Eye, MoreHorizontal, Files, PlusCircle, FolderPlus, Pencil, Search, ArrowUpDown, MoreVertical, ExternalLink, Download } from "lucide-react";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { Sops, SopsMinified, updateSops } from "@/services/sops";
import { Category, updateCategory } from "@/services/categories";
import { createSOPReadRecord } from "@/services/sopsreadrecords";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";

import CreateSop from "@/forms/sops/CreateSop";
import UpdateSop from "@/forms/sops/UpdateSop";
import CreateCategory from "@/forms/categories/CreateCategory";
import UpdateCategory from "@/forms/categories/UpdateCategory";
import SOPSTable from "@/components/sops/SOPSTable";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { useFetchAccount } from "@/hooks/accounts/actions";

export default function TeamSopsPage() {
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: manager, isLoading, refetch: refetchAccount } = useFetchAccount();
  const managedDept = manager?.departments_headed?.[0];
  const sops = managedDept?.sops || [];
  const staff = managedDept?.staff || [];

  const filteredSops = useMemo(() => {
    return sops.filter((s: any) => {
      const matchesSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                            s.code.toLowerCase().includes(search.toLowerCase()) ||
                            s.description.toLowerCase().includes(search.toLowerCase());
      const matchesRead = readFilter === 'all' ? true : 
                          readFilter === 'read' ? s.has_read : !s.has_read;
      return matchesSearch && matchesRead;
    });
  }, [sops, search, readFilter]);

  // Client-side pagination
  const paginatedSops = filteredSops.slice((page - 1) * pageSize, page * pageSize);

  const { data: categoriesData, isLoading: isCategoriesLoading, refetch: refetchCategories } = useFetchCategories();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<SopsMinified | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [togglingSop, setTogglingSop] = useState<SopsMinified | null>(null);
  const [togglingCategory, setTogglingCategory] = useState<Category | null>(null);

  const [isToggling, setIsToggling] = useState(false);

  const headers = useAxiosAuth();

  const handleToggleActive = async () => {
    if (!togglingSop) return;
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!togglingSop.is_active));

      await updateSops(togglingSop.reference, formData, headers);
      toast.success(`SOP ${togglingSop.is_active ? 'deactivated' : 'activated'} successfully`);
      refetchAccount();
    } catch (e) {
      toast.error((e as any)?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
    }
  };

  const handleMarkAsRead = async (sop: Sops | SopsMinified) => {
    try {
      await createSOPReadRecord(headers, { sop: sop.title });
      toast.success("SOP marked as read successfully!");
      refetchAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to mark SOP as read.");
    }
  };

  const handleToggleCategory = async () => {
    if (!togglingCategory) return;
    setIsToggling(true);
    try {
      await updateCategory(togglingCategory.reference, { is_active: !togglingCategory.is_active }, headers);
      toast.success(`Category ${togglingCategory.is_active ? 'deactivated' : 'activated'} successfully`);
      refetchCategories();
    } catch (e) {
      toast.error((e as any)?.response?.data?.detail || "Failed to update category status");
    } finally {
      setIsToggling(false);
      setTogglingCategory(null);
    }
  };

  return (
    <div className="p-8 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Management Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#004d40]">Team SOP Library</h1>
          <p className="text-zinc-500 font-medium mt-1">
            Managing standard operating procedures and documentation for your teams
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#004d40] hover:bg-[#00332b] text-white rounded px-6 shadow-md transition-all gap-2 h-11">
                <PlusCircle className="w-4 h-4" />
                Management Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded shadow-xl border-zinc-100">
              <DropdownMenuItem onClick={() => setIsCreateOpen(true)} className="cursor-pointer font-medium py-2">
                <Plus className="mr-2 h-4 w-4 text-emerald-600" />
                Upload New SOP
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateCategoryOpen(true)} className="cursor-pointer font-medium py-2">
                <FolderPlus className="mr-2 h-4 w-4 text-amber-600" />
                Create New Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SOPs Section - 3/4 Width */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Files className="w-5 h-5 text-[#004d40]" />
            <h2 className="text-xl font-semibold text-[#004d40]">Operational Documents</h2>
          </div>

          <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
            <SOPSTable
              data={paginatedSops}
              isLoading={isLoading}
              onEdit={setEditingSop}
              onToggle={setTogglingSop}
              search={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1);
              }}
              page={page}
              onPageChange={setPage}
              detailBasePath="/manager/sops"
              totalCount={filteredSops.length}
              pageSize={pageSize}
              onMarkAsRead={handleMarkAsRead}
              readFilter={readFilter}
              onReadFilterChange={setReadFilter}
              showReaders={true}
              departmentStaff={staff}
            />
          </Card>
        </div>

        {/* Categories Section - 1/4 Width */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-semibold text-[#004d40]">Categories</h2>
          </div>

          <div className="space-y-4">
            {isCategoriesLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded" />
              ))
            ) : categoriesData && categoriesData.length > 0 ? (
              categoriesData.map((category: Category) => (
                <Card key={category.id} className="border-zinc-100 overflow-hidden hover:shadow-lg transition-all rounded group">
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-[#004d40] group-hover:text-amber-600 transition-colors truncate uppercase tracking-tight">
                          {category.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={category.is_active 
                            ? "text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-100 font-semibold rounded" 
                            : "text-[9px] px-1.5 py-0 bg-red-50 text-red-700 border-red-100 font-semibold rounded"}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                          className="h-7 w-7 text-zinc-400 hover:text-emerald-600 rounded"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setTogglingCategory(category)}
                          className={`h-7 w-7 rounded ${category.is_active ? 'text-zinc-400 hover:text-amber-600' : 'text-zinc-400 hover:text-emerald-600'}`}
                        >
                          {category.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-[11px] text-zinc-500 line-clamp-2 mb-2 leading-relaxed italic">{category.description}</p>
                    )}
                    <p className="text-[9px] text-zinc-400 font-semibold tracking-widest uppercase opacity-60">REF: {category.reference.slice(0, 8)}</p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-100 rounded p-12 text-center">
                <p className="text-xs text-zinc-400 font-medium">No categories created.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Create SOP Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">New SOP Document</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Upload a new Standard Operating Procedure to the Elimu system.
            </DialogDescription>
          </DialogHeader>
          <CreateSop
            onSuccess={() => {
              setIsCreateOpen(false);
              refetchAccount();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit SOP Dialog */}
      <Dialog open={!!editingSop} onOpenChange={(open) => !open && setEditingSop(null)}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">Edit SOP</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Update the details or replace the document for this SOP.
            </DialogDescription>
          </DialogHeader>
          {editingSop && (
            <UpdateSop
              sopData={editingSop}
              onSuccess={() => {
                setEditingSop(null);
                refetchAccount();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent className="sm:max-w-md rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">New Category</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Create a new category for grouping your Standard Operating Procedures.
            </DialogDescription>
          </DialogHeader>
          <CreateCategory
            onSuccess={() => {
              setIsCreateCategoryOpen(false);
              refetchCategories();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="sm:max-w-md rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">Edit Category</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Update the name or description of this category.
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <UpdateCategory
              categoryData={editingCategory}
              onSuccess={() => {
                setEditingCategory(null);
                refetchCategories();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle SOP Confirmation Alert */}
      <AlertDialog open={!!togglingSop} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingSop(null);
      }}>
        <AlertDialogContent className="rounded">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              {togglingSop?.is_active ? "Deactivate SOP?" : "Activate SOP?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {togglingSop?.is_active
                ? "This will hide the SOP from employees, but it will remain accessible to administrators."
                : "This will make the SOP visible to all employees again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling} className="rounded">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleActive}
              disabled={isToggling}
              className={togglingSop?.is_active 
                ? "bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"}
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Toggle Category Confirmation Alert */}
      <AlertDialog open={!!togglingCategory} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingCategory(null);
      }}>
        <AlertDialogContent className="rounded">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              {togglingCategory?.is_active ? "Deactivate Category?" : "Activate Category?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {togglingCategory?.is_active
                ? "This will hide the category and its grouping, which might affect how employees find SOPs."
                : "This will restore the category visibility."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling} className="rounded">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleCategory}
              disabled={isToggling}
              className={togglingCategory?.is_active 
                ? "bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"}
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}