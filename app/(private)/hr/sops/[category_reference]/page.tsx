"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Files, Folder, Plus, Settings2, MoreHorizontal, Pencil, EyeOff, Eye, Search } from "lucide-react";
import { useFetchCategory } from "@/hooks/categories/actions";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { Sops, updateSops } from "@/services/sops";
import { addSOPToCategory } from "@/services/categories";
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

import SOPSTable from "@/components/sops/SOPSTable";
import UpdateSop from "@/forms/sops/UpdateSop";

export default function CategoryDetailPage() {
  const params = useParams();
  const category_reference = params.category_reference as string;
  
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data: category, isLoading: isCategoryLoading, refetch: refetchCategory } = useFetchCategory(category_reference);
  const { data: sopsData, isLoading: isSopsLoading, refetch: refetchSops } = useFetchAuthSops({
    category: category_reference,
    search,
    page,
    page_size: pageSize
  });

  const { data: allSopsData } = useFetchAuthSops({
    page_size: 100 // Get a bunch for selection
  });

  const [isAddSopOpen, setIsAddSopOpen] = useState(false);
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
      refetchSops();
    } catch (e) {
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
      refetchSops();
    } catch (e) {
      toast.error((e as any)?.response?.data?.detail || "Failed to add SOPs to category");
    } finally {
      setIsAddingSops(false);
    }
  };

  const availableSops = allSopsData?.results.filter(
    (sop) => !category?.sops.includes(sop.title) && 
    sop.title.toLowerCase().includes(addSearch.toLowerCase())
  ) || [];

  return (
    <div className="p-8 mx-auto space-y-8">
      <div className="space-y-4">
        <Link 
          href="/hr/sops" 
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-[#004d40] transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all SOPs
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            {isCategoryLoading ? (
              <Skeleton className="h-10 w-64 mb-2" />
            ) : (
              <div className="flex items-center gap-3">
                <Folder className="w-8 h-8 text-[#004d40]" />
                <h1 className="text-3xl font-bold text-[#004d40] uppercase">{category?.name}</h1>
                <Badge variant="outline" className={category?.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                  {category?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            )}
            {isCategoryLoading ? (
              <Skeleton className="h-4 w-96" />
            ) : (
              <p className="text-zinc-500 mt-1">{category?.description || "No description provided for this category."}</p>
            )}
          </div>
          
          <Dialog open={isAddSopOpen} onOpenChange={setIsAddSopOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#004d40] hover:bg-[#00332b] text-white rounded-full px-6 shadow-md transition-all gap-2">
                <Plus className="w-4 h-4" />
                Add SOP to Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl text-[#004d40]">Add SOPs to {category?.name}</DialogTitle>
                <DialogDescription>
                  Select from existing SOPs to add to this category.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="relative">
                  <Input 
                    placeholder="Filter SOPs..." 
                    value={addSearch}
                    onChange={(e) => setAddSearch(e.target.value)}
                    className="pl-8"
                  />
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-xl p-3 bg-zinc-50">
                  {availableSops.length > 0 ? (
                    availableSops.map((sop) => (
                      <div key={sop.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-zinc-100">
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
                        />
                        <Label 
                          htmlFor={`sop-${sop.id}`}
                          className="text-sm font-medium leading-none cursor-pointer flex-1 py-1"
                        >
                          {sop.title}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-zinc-500 text-sm">
                      {allSopsData ? "No matching available SOPs found." : "Loading SOPs..."}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsAddSopOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleAddSopsToCategory}
                  disabled={selectedSops.length === 0 || isAddingSops}
                  className="bg-[#004d40] hover:bg-[#00332b]"
                >
                  {isAddingSops ? "Adding..." : `Add ${selectedSops.length} selected`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Files className="w-5 h-5 text-[#004d40]" />
          <h2 className="text-xl font-bold text-[#004d40]">SOPs in this Category</h2>
        </div>
        
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
          <SOPSTable 
            data={sopsData?.results} 
            isLoading={isSopsLoading} 
            onEdit={setEditingSop} 
            onToggle={setTogglingSop} 
            search={search}
            onSearch={(val) => {
              setSearch(val);
              setPage(1);
            }}
            page={page}
            onPageChange={setPage}
            totalCount={sopsData?.count || 0}
            pageSize={pageSize}
          />
        </div>
      </div>

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
    </div>
  );
}