"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Settings2, MoreHorizontal, Pencil, EyeOff, Eye, PlusCircle, FolderPlus, Files, ChevronRight } from "lucide-react";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { useFetchCategories } from "@/hooks/categories/actions";
import { Sops, updateSops } from "@/services/sops";
import { Category, updateCategory } from "@/services/categories";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function HRSopsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: session } = useSession();
  const { data: sopsData, isLoading, refetch: refetchSops } = useFetchAuthSops({
    search,
    page,
    page_size: pageSize
  });
  const { data: categoriesData, isLoading: isCategoriesLoading, refetch: refetchCategories } = useFetchCategories();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<Sops | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [togglingSop, setTogglingSop] = useState<Sops | null>(null);
  const [togglingCategory, setTogglingCategory] = useState<Category | null>(null);

  const [isToggling, setIsToggling] = useState(false);

  const headers = useAxiosAuth()

  const handleToggleActive = async () => {
    if (!togglingSop) return;
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!togglingSop.is_active));
      
      await updateSops(togglingSop.reference, formData, headers);
      toast.success(`SOP ${togglingSop.is_active ? 'deactivated' : 'activated'} successfully`);
      refetchSops();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to update category status");
    } finally {
      setIsToggling(false);
      setTogglingCategory(null);
    }
  };

  return (
    <div className="p-8 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#004d40]">SOP & Category Management</h1>
          <p className="text-zinc-500">Manage Standard Operating Procedures and Categories for Tamarind Group</p>
        </div>
        
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-[#004d40] hover:bg-[#00332b] text-white rounded-full px-6 shadow-md transition-all gap-2">
                <PlusCircle className="w-4 h-4" />
                Management Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsCreateOpen(true)} className="cursor-pointer">
                <Plus className="mr-2 h-4 w-4" />
                Upload New SOP
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateCategoryOpen(true)} className="cursor-pointer">
                <FolderPlus className="mr-2 h-4 w-4" />
                Create New Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* SOPs Section - 3/4 Width */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Files className="w-5 h-5 text-[#004d40]" />
            <h2 className="text-xl font-bold text-[#004d40]">All SOPs</h2>
          </div>
          
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <SOPSTable 
              data={sopsData?.results} 
              isLoading={isLoading} 
              onEdit={setEditingSop} 
              onToggle={setTogglingSop} 
              search={search}
              onSearch={(val) => {
                setSearch(val);
                setPage(1); // Reset to page 1 on new search
              }}
              page={page}
              onPageChange={setPage}
              totalCount={sopsData?.count || 0}
              pageSize={pageSize}
            />
          </div>
        </div>

        {/* Categories Section - 1/4 Width */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <PlusCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-bold text-[#004d40]">Categories</h2>
          </div>
          
          <div className="space-y-3">
            {isCategoriesLoading ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))
            ) : categoriesData && categoriesData.length > 0 ? (
              categoriesData.map((category: Category) => (
                <Card key={category.id} className="border-zinc-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <Link 
                          href={`/hr/sops/${category.reference}`}
                          className="text-sm text-[#004d40] hover:underline truncate uppercase tracking-tight"
                        >
                          {category.name}
                        </Link>
                        <Badge 
                          variant="outline" 
                          className={category.is_active ? "text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border-emerald-200" : "text-[9px] px-1.5 py-0 bg-red-50 text-red-700 border-red-200"}
                        >
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setEditingCategory(category)}
                          className="h-6 w-6 text-zinc-400 hover:text-emerald-600"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setTogglingCategory(category)}
                          className={`h-6 w-6 ${category.is_active ? 'text-zinc-400 hover:text-amber-600' : 'text-zinc-400 hover:text-emerald-600'}`}
                        >
                          {category.is_active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-[11px] text-zinc-500 truncate mb-1 leading-tight">{category.description}</p>
                    )}
                    <p className="text-[9px] text-zinc-400 font-medium">Ref: {category.reference}</p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-8 text-center">
                <p className="text-xs text-zinc-500">No categories created yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}

      {/* Create SOP Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40]">New SOP Document</DialogTitle>
            <DialogDescription>
              Upload a new Standard Operating Procedure to the Elimu system.
            </DialogDescription>
          </DialogHeader>
          <CreateSop
            onSuccess={() => {
              setIsCreateOpen(false);
              refetchSops();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit SOP Dialog */}
      <Dialog open={!!editingSop} onOpenChange={(open) => !open && setEditingSop(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40]">Edit SOP</DialogTitle>
            <DialogDescription>
              Update the details or replace the document for this SOP.
            </DialogDescription>
          </DialogHeader>
          {editingSop && (
            <UpdateSop 
              sopData={editingSop} 
              onSuccess={() => {
                setEditingSop(null);
                refetchSops();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40]">New Category</DialogTitle>
            <DialogDescription>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40]">Edit Category</DialogTitle>
            <DialogDescription>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglingSop?.is_active ? "Deactivate SOP?" : "Activate SOP?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {togglingSop?.is_active 
                ? "This will hide the SOP from employees, but it will remain accessible to HR administrators." 
                : "This will make the SOP visible to all employees again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleActive}
              disabled={isToggling}
              className={togglingSop?.is_active ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglingCategory?.is_active ? "Deactivate Category?" : "Activate Category?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {togglingCategory?.is_active 
                ? "This will hide the category and its grouping, which might affect how employees find SOPs." 
                : "This will restore the category visibility."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleCategory}
              disabled={isToggling}
              className={togglingCategory?.is_active ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
