"use client";

import { useState } from "react";
import { Plus, Settings2, MoreHorizontal, Pencil, EyeOff, Eye } from "lucide-react";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { Sops, updateSops } from "@/services/sops";
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

import CreateSop from "@/forms/sops/CreateSop";
import UpdateSop from "@/forms/sops/UpdateSop";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";

export default function HRSopsPage() {
  const { data: session } = useSession();
  const { data: sopsData, isLoading, refetch: refetchSops } = useFetchAuthSops();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<Sops | null>(null);
  const [togglingSop, setTogglingSop] = useState<Sops | null>(null);

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
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
    }
  };

  return (
    <div className="p-8  mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#004d40]">SOP Management</h1>
          <p className="text-zinc-500">Manage Standard Operating Procedures for Tamarind Group</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#004d40] hover:bg-[#00332b] text-white rounded-full px-6 shadow-md transition-all gap-2">
              <Plus className="w-4 h-4" />
              Upload New SOP
            </Button>
          </DialogTrigger>
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
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50">
              <TableRow>
                <TableHead className="w-[30%]">Title</TableHead>
                <TableHead className="w-[30%]">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sopsData && sopsData.length > 0 ? (
                sopsData.map((sop: Sops) => (
                  <TableRow key={sop.id}>
                    <TableCell className="font-medium text-[#004d40]">
                      {sop.title}
                    </TableCell>
                    <TableCell className="text-zinc-500 truncate max-w-[300px]">
                      {sop.description}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={sop.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}
                      >
                        {sop.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {new Date(sop.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingSop(sop)}
                            className="cursor-pointer font-medium text-zinc-700"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit details
                          </DropdownMenuItem>
                          <a href={sop.file} target="_blank" rel="noreferrer">
                            <DropdownMenuItem className="cursor-pointer font-medium text-[#004d40]">
                              <Settings2 className="mr-2 h-4 w-4" />
                              View Document
                            </DropdownMenuItem>
                          </a>
                          <DropdownMenuItem
                            onClick={() => setTogglingSop(sop)}
                            className={sop.is_active ? "text-amber-600 focus:bg-amber-50 focus:text-amber-600 cursor-pointer font-medium" : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer font-medium"}
                          >
                            {sop.is_active ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {sop.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-zinc-500">
                    No Standard Operating Procedures found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
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
              onSuccess={() => setEditingSop(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle Confirmation Alert */}
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
