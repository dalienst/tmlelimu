"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Files, Folder, Plus, Settings2, MoreHorizontal, Pencil, EyeOff, Eye, Search, ArrowLeft, Loader2, Building2 } from "lucide-react";
import { useFetchCategory } from "@/hooks/categories/actions";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { Sops, updateSops } from "@/services/sops";
import { addSOPToCategory, removeSOPFromCategory } from "@/services/categories";
import toast from "react-hot-toast";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";

import SOPSTable from "@/components/sops/SOPSTable";
import UpdateSop from "@/forms/sops/UpdateSop";
import UpdateCategory from "@/forms/categories/UpdateCategory";

export default function CategoryDetailPage({ params }: { params: Promise<{ category_reference: string }> }) {
  const router = useRouter();
  const { category_reference } = use(params);
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: category, isLoading: isCategoryLoading, refetch: refetchCategory } = useFetchCategory(category_reference);
  
  // All SOPs for the selection dialog
  const { data: allSopsData } = useFetchAuthSops({
    page_size: 100 
  });

  const [isAddSopOpen, setIsAddSopOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedSops, setSelectedSops] = useState<string[]>([]);
  const [isAddingSops, setIsAddingSops] = useState(false);
  const [addSearch, setAddSearch] = useState("");

  const [editingSop, setEditingSop] = useState<Sops | null>(null);
  const [togglingSop, setTogglingSop] = useState<Sops | null>(null);
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
      refetchCategory(); // Category contains the nested SOPs
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
    }
  };

  const handleAddSopsToCategory = async () => {
    if (selectedSops.length === 0) return;
    setIsAddingSops(true);
    try {
      await addSOPToCategory(category_reference, { sops: selectedSops }, headers);
      toast.success("SOPs added to category successfully");
      setIsAddSopOpen(false);
      setSelectedSops([]);
      refetchCategory();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to add SOPs to category");
    } finally {
      setIsAddingSops(false);
    }
  };

  const availableSops = allSopsData?.results.filter(
    (sop) => !category?.sops_detail.some(s => s.title === sop.title) && 
    sop.title.toLowerCase().includes(addSearch.toLowerCase())
  ) || [];

  if (isCategoryLoading) {
    return (
      <div className="p-8 mx-auto space-y-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] w-full lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-[400px] w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-8 mx-auto text-center space-y-4">
        <Folder className="mx-auto h-12 w-12 text-zinc-300" />
        <h2 className="text-2xl font-bold text-zinc-700">Category Not Found</h2>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  // Filter category.sops_detail based on search/page locally
  const filteredCategorySops: Sops[] = category.sops_detail
    .filter(sop => sop.title.toLowerCase().includes(search.toLowerCase()))
    .map(sop => ({
      id: sop.reference,
      title: sop.title,
      description: "", 
      file: "", 
      is_active: sop.is_active,
      created_at: sop.created_at,
      updated_at: sop.updated_at,
      reference: sop.reference,
      created_by: "",
      updated_by: "",
      code: sop.code || "",
      departments: [],
      categories: [],
    }));

  return (
    <div className="p-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-zinc-100">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#004d40] uppercase tracking-tight">{category.name}</h1>
            <Badge variant="outline" className={category.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full' : 'bg-red-50 text-red-700 border-red-200 uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full'}>
              {category.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="text-zinc-500 font-medium">SOP Category Details</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsUpdateOpen(true)}
          className="border-[#004d40]/20 text-[#004d40] hover:bg-emerald-50 rounded-full px-6"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Category
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Category Information */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#004d40]" />
              Category Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Description</h3>
                <p className="text-zinc-700 leading-relaxed font-medium">
                  {category.description || "No description provided for this category."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 text-center">Reference Code</h3>
                  <p className="text-zinc-900 font-mono font-bold text-center bg-zinc-50 py-2 rounded-lg border border-zinc-100">
                    {category.code || "UNCATEGORIZED"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1 text-center">Creation Date</h3>
                  <p className="text-[#004d40] font-bold text-center bg-emerald-50/50 py-2 rounded-lg border border-emerald-100">
                    {new Date(category.created_at).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Associated SOPs Table Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                <Files className="h-5 w-5 text-[#004d40]" />
                Associated SOPs ({category.sops_detail.length})
              </h2>
            </div>
            
            <SOPSTable 
              data={filteredCategorySops} 
              isLoading={false} 
              onEdit={setEditingSop} 
              onToggle={setTogglingSop} 
              search={search}
              onSearch={setSearch}
              page={page}
              onPageChange={setPage}
              totalCount={filteredCategorySops.length}
              pageSize={pageSize}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-amber-600" />
              Management
            </h2>
            
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 flex flex-col gap-4">
              <p className="text-sm font-medium text-emerald-800 leading-snug">
                Organize your SOPs by adding existing ones to this category or removing them as needed.
              </p>
              
              <Button 
                onClick={() => setIsAddSopOpen(true)}
                className="w-full bg-[#004d40] hover:bg-[#00332b] text-white rounded-full font-bold shadow-md shadow-emerald-200/50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add SOP to Category
              </Button>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <div className="text-center p-4 rounded-xl bg-zinc-50 border border-transparent">
                 <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Created By</p>
                 <p className="text-sm font-bold text-zinc-800">{category.created_by || "System Admin"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add SOP Dialog */}
      <Dialog open={isAddSopOpen} onOpenChange={setIsAddSopOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#004d40]">Add SOPs to {category.name}</DialogTitle>
            <DialogDescription className="font-medium">
              Select available SOPs to associate with this category.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative group">
              <Input 
                placeholder="Filter available SOPs..." 
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl border-zinc-200 focus:border-[#004d40] transition-all bg-zinc-50 group-focus-within:bg-white"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#004d40]" />
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 border border-zinc-100 rounded-2xl p-4 bg-zinc-50/50">
              {availableSops.length > 0 ? (
                availableSops.map((sop) => (
                  <div key={sop.id} className="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-zinc-100 group shadow-sm hover:shadow-md">
                    <Checkbox 
                      id={`sop-${sop.id}`} 
                      checked={selectedSops.includes(sop.title)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSops([...selectedSops, sop.title]);
                        } else {
                          setSelectedSops(selectedSops.filter(id => id !== sop.title));
                        }
                      }}
                      className="rounded-md border-zinc-300 data-[state=checked]:bg-[#004d40] data-[state=checked]:border-[#004d40]"
                    />
                    <Label 
                      htmlFor={`sop-${sop.id}`}
                      className="text-sm font-bold text-zinc-700 leading-none cursor-pointer flex-1 py-1"
                    >
                      {sop.title}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Files className="mx-auto h-8 w-8 text-zinc-300" />
                  <p className="text-zinc-500 font-bold text-sm">
                    {allSopsData ? "No matching available SOPs found." : "Loading availability..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsAddSopOpen(false)} className="rounded-full font-bold">Cancel</Button>
            <Button 
              onClick={handleAddSopsToCategory}
              disabled={selectedSops.length === 0 || isAddingSops}
              className="bg-[#004d40] hover:bg-[#00332b] text-white rounded-full font-bold px-8 shadow-lg shadow-emerald-200/50"
            >
              {isAddingSops && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAddingSops ? "Adding..." : `Add Selected (${selectedSops.length})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit SOP Dialog */}
      <Dialog open={!!editingSop} onOpenChange={(open) => !open && setEditingSop(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#004d40]">Edit SOP Details</DialogTitle>
            <DialogDescription className="font-medium">
              Update information for &quot;{editingSop?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          {editingSop && (
            <UpdateSop 
              sopData={editingSop} 
              onSuccess={() => {
                setEditingSop(null);
                refetchCategory();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Update Category Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#004d40]">Edit Category Details</DialogTitle>
            <DialogDescription className="font-medium">
              Update general information for {category.name}.
            </DialogDescription>
          </DialogHeader>
          <UpdateCategory 
            categoryData={category}
            onSuccess={() => { setIsUpdateOpen(false); refetchCategory(); }}
          />
        </DialogContent>
      </Dialog>

      {/* Toggle SOP Confirmation Alert */}
      <AlertDialog open={!!togglingSop} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingSop(null);
      }}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-zinc-900">
              {togglingSop?.is_active ? "Deactivate SOP?" : "Activate SOP?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {togglingSop?.is_active 
                ? "This will hide the SOP from employees, but it will remain accessible to HR administrators." 
                : "This will make the SOP visible to all employees again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isToggling} className="rounded-full border-zinc-200 font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleActive}
              disabled={isToggling}
              className={togglingSop?.is_active 
                ? "bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold px-8 shadow-lg shadow-amber-200/50" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold px-8 shadow-lg shadow-emerald-200/50"}
            >
              {isToggling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}