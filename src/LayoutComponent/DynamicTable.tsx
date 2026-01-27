import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search,Download, Settings, Plus, ChevronLeft, ChevronRight, Edit2, Trash2,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CustomInputField } from "@/CustomComponent/InputComponents/CustomInputField";
import AddNewModal from "./AddNewModal";
import { useAppState } from "@/globalState/hooks/useAppState";
/**
 * Types
 */
type RowData = Record<string, any>;

type Option = {
  label: string;
  value: string;
};

// Then update HeaderDef to use it
type HeaderDef = {
  field: string;
  label: string;
  input?: boolean;
  view?: boolean;
  type?: string;
  require?: boolean;
  options?: Option[]; // Use Option[] instead of tuple type
};


type DynamicTableProps = {
  headers?: HeaderDef[];
  data?: RowData[];
  title?: string;
  searchable?: boolean;
  sortable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
  exportEnabled?: boolean;
  settingsEnabled?: boolean;
  onAddNew?: (() => void) | null;
  master?: string; // used to call API endpoints like `/api/${master}`
  setCurrentScreen?: (screen: string) => void;
};


/**
 * Helper: basic API wrappers (replace with your hooks if needed)
 */
const apiPost = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json };
};

const apiPut = async (url: string, body: any) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json };
};

const apiDelete = async (url: string, body?: any) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, ...json };
};


const DynamicTable: React.FC<DynamicTableProps> = ({
  headers = [],
  data = [],
  title = "Dynamic Table",
  searchable = true,
  sortable = true,
  striped = true,
  hoverable = true,
  className = "",
  exportEnabled = false,
  settingsEnabled = false,
  onAddNew = null,
  master = "",
  setCurrentScreen = () => {},
}) => {
  // --- Data & UI state (merged hooks)
  const [tableData, setTableData] = useState<RowData[]>(data || []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  // Modal + editing state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<RowData | null>(null);
  const [itemToDelete, setItemToDelete] = useState<RowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
   const { userData } = useAppState();
  // keep tableData in sync when parent passes new data
  useEffect(() => {
    setTableData(Array.isArray(data) ? data : []);
  }, [data]);

  // --- Sorting handler
  const handleSort = (key: string) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // --- Processed data (search + sort)
  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchable && searchTerm.trim().length > 0) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          val === null || val === undefined ? false : String(val).toLowerCase().includes(q)
        )
      );
    }
    if (sortConfig.key && sortable) {
      const k = sortConfig.key;
      filtered.sort((a, b) => {
        const aVal = a[k];
        const bVal = b[k];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bVal == null) return sortConfig.direction === "asc" ? -1 : 1;
        // try numeric compare else string
        if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
          return sortConfig.direction === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return filtered;
  }, [tableData, searchTerm, sortConfig, searchable, sortable]);

  // --- Pagination
  const totalPages = Math.max(1, Math.ceil(processedData.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  // --- CRUD operations (basic; replace with your real API hooks)
  const API_BASE = import.meta.env.VITE_API_URL || ""; // adjust as needed
  const handleAddSave = async (formData: RowData) => {
    setIsLoading(true);
    try {
      if (master) {
        formData.created_by=userData[0]?.ecno || "system";
        const resp = await apiPost(`${API_BASE}/api/common_master/${master}`, formData);
        if (resp.status >= 200 && resp.status < 300) {
          // if server returns full new dataset or created item, integrate it
          if (resp.data && Array.isArray(resp.data)) setTableData(resp.data);
          else if (resp.data) setTableData((p) => [...p, resp.data]);
        }
        toast.success(resp?.data[0]?.Message || resp?.message || "Item added");
      } else {
        // local-only fallback
        const created = { ...formData, id: Date.now() };
        setTableData((p) => [...p, created]);
        toast.success("Item added (local)");
      }
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSave = async (formData: RowData) => {
    if (!editingItem) return;
    setIsLoading(true);
    try {
      if (master) {
        const resp = await apiPut(`${API_BASE}/api/${master}`, { ...editingItem, ...formData });
        if (resp.status >= 200 && resp.status < 300) {
          // optimistic update: merge
          setTableData((prev) =>
            prev.map((it) => ((it.id ?? it.Sno) === (editingItem.id ?? editingItem.Sno) ? { ...it, ...formData } : it))
          );
        }
        toast.success(resp?.message || "Item updated");
      } else {
        setTableData((prev) =>
          prev.map((it) => ((it.id ?? it.Sno) === (editingItem.id ?? editingItem.Sno) ? { ...it, ...formData } : it))
        );
        toast.success("Item updated (local)");
      }
      setShowEditModal(false);
      setEditingItem(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (master) {
        const resp = await apiDelete(`${API_BASE}/api/${master}`, itemToDelete);
        // if API returns new dataset
        if (resp.status === 201 && resp.data && Array.isArray(resp.data)) {
          setTableData(resp.data);
        } else {
          // fallback remove locally
          setTableData((prev) =>
            prev.filter((it) => (it.id ?? it.Sno) !== (itemToDelete.id ?? itemToDelete.Sno))
          );
        }
        toast.success(resp?.message || "Item deleted");
      } else {
        setTableData((prev) =>
          prev.filter((it) => (it.id ?? it.Sno) !== (itemToDelete.id ?? itemToDelete.Sno))
        );
        toast.success("Item deleted (local)");
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const debug = (v: any) => {
  console.log(v);
  return null;
};

  // --- Export helper (CSV)
  const handleExportCSV = () => {
    const csvHeaders = headers.map((h) => h.label);
    const rows = tableData.map((row) => headers.map((h) => JSON.stringify(row[h.field] && row[h.field]?.view|| "")));
    const csv = [csvHeaders, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Render subcomponents inline for single-file convenience

  const TableHeader: React.FC<{
    title: string;
    searchable: boolean;
    searchTerm: string;
    onSearchChange: (v: string) => void;
    exportEnabled: boolean;
    settingsEnabled: boolean;
    onAddNew: (() => void) | null;
  }> = ({ title, searchable, searchTerm, onSearchChange, exportEnabled, settingsEnabled, onAddNew }) => {
    return (
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {searchable && (
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search records..."
                className="pl-10"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center gap-2 flex-shrink-0">
            {exportEnabled && (
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
            {settingsEnabled && (
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            )}
            <Button
              onClick={() => {
                if (onAddNew) onAddNew();
                else setShowAddModal(true);
              }}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const DataTable: React.FC<{
  headers: HeaderDef[];
  data: RowData[];
  sortConfig: { key: string | null; direction: "asc" | "desc" };
  striped?: boolean;
  hoverable?: boolean;
  sortable?: boolean;
  onSort: (k: string) => void;
  onEdit: (r: RowData) => void;
  onDelete: (r: RowData) => void;
}> = ({ headers, data, sortConfig, striped = true, hoverable = true, sortable = true, onSort, onEdit, onDelete }) => {
  return (
    <table className="w-full min-w-[600px] table-auto">
      <thead className="bg-gray-50 border-b">
        <tr>
          {headers.map((h) => (
            <th
              key={h.field}
              className={`text-left px-4 py-3 text-sm font-medium ${sortable && h.view !== false ? "cursor-pointer" : ""}`}
              onClick={() => (sortable && h.view !== false ? onSort(h.field) : undefined)}
            >
              <div className="flex items-center gap-2">
                <span>{h.label}</span>
                {sortConfig.key === h.field && (
                  <span className="text-xs">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
          ))}
          {/* Actions column header */}
          <th className="text-left px-4 py-3 text-sm font-medium">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={row.id ?? row.Sno ?? idx}
            className={`${striped && idx % 2 === 0 ? "bg-white" : "bg-white/50"} ${
              hoverable ? "hover:bg-gray-100" : ""
            }`}
          >
            {headers.map((h) => (
              <td key={h.field} className="px-4 py-3 text-sm">
                {row[h.field] ?? ""}
              </td>
            ))}
            {/* Actions column cells */}
            <td className="px-4 py-3 text-sm">
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onEdit(row)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDelete(row)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


  const TablePagination: React.FC<{
    currentPage: number;
    totalPages: number;
    startIndex: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (n: number) => void;
  }> = ({ currentPage, totalPages, startIndex, itemsPerPage, totalItems, onPageChange }) => {
    const getPageNumbers = () => {
      const pages: (number | "...")[] = [];
      const maxVisiblePages = 5;
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
          pages.push("...");
          pages.push(totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-6 border-t px-6 pb-6">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <Button variant="outline" size="sm" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
                  ...
                </span>
              ) : (
                <Button
                  key={`page-${page}`}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => onPageChange(Number(page))}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          <Button variant="outline" size="sm" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  };

  // Simple Add/Edit form modal
  // const TableModals: React.FC = () => {
  //   // form state shared by add & edit
  //   const [formState, setFormState] = useState<RowData>({});

  //   useEffect(() => {
  //     if (showEditModal && editingItem) setFormState({ ...editingItem });
  //     if (showAddModal) setFormState({});
  //   }, [showAddModal, showEditModal, editingItem]);

  //   const formHeaders = headers.filter((h) => h.input !== false); // default show inputs if input not explicitly false

  //   return (
  //     <>
  //       {/* Add Modal */}
  //       {showAddModal && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  //           <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6">
  //             <div className="flex items-center justify-between mb-4">
  //               <h4 className="text-lg font-semibold">Add New</h4>
  //               <Button variant="ghost" onClick={() => setShowAddModal(false)}>
  //                 Close
  //               </Button>
  //             </div>
        

  //              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                {formHeaders.map((h) => (
  //                 <div key={h.field}>
  //                   <CustomInputField field={h.field} label={h.label}  />
  //                   <label className="block text-sm font-medium mb-1">{h.label}</label>
  //                    <Input
  //                      value={formState[h.field] ?? ""}
  //                      onChange={(e) => setFormState((s) => ({ ...s, [h.field]: e.target.value }))}
  //                   />
  //                  </div>
  //                ))}
  //              </div>

  //             <div className="mt-6 flex justify-end gap-2">
  //               <Button variant="outline" onClick={() => setShowAddModal(false)}>
  //                 Cancel
  //               </Button>
  //               <Button onClick={() => handleAddSave(formState)} disabled={isLoading}>
  //                 {isLoading ? "Saving..." : "Save"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Edit Modal */}
  //       {showEditModal && editingItem && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  //           <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6">
  //             <div className="flex items-center justify-between mb-4">
  //               <h4 className="text-lg font-semibold">Edit</h4>
  //               <Button variant="ghost" onClick={() => { setShowEditModal(false); setEditingItem(null); }}>
  //                 Close
  //               </Button>
  //             </div>

  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               {formHeaders.map((h) => (
  //                 <div key={h.field}>
  //                   <label className="block text-sm font-medium mb-1">{h.label}</label>
  //                   <Input
  //                     value={formState[h.field] ?? ""}
  //                     onChange={(e) => setFormState((s) => ({ ...s, [h.field]: e.target.value }))}
  //                   />
  //                 </div>
  //               ))}
  //             </div>

  //             <div className="mt-6 flex justify-end gap-2">
  //               <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingItem(null); }}>
  //                 Cancel
  //               </Button>
  //               <Button onClick={() => handleEditSave(formState)} disabled={isLoading}>
  //                 {isLoading ? "Saving..." : "Save"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}

  //       {/* Delete Confirmation */}
  //       {showDeleteModal && itemToDelete && (
  //         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
  //           <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
  //             <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
  //             <p className="text-sm text-muted-foreground mb-6">
  //               Are you sure you want to delete{" "}
  //               <span className="font-medium">{String(itemToDelete.name ?? itemToDelete.title ?? itemToDelete.id ?? "this item")}</span>?
  //             </p>

  //             <div className="flex justify-end gap-2">
  //               <Button variant="outline" onClick={() => { setShowDeleteModal(false); setItemToDelete(null); }}>
  //                 Cancel
  //               </Button>
  //               <Button onClick={handleDeleteConfirm} disabled={isDeleting}>
  //                 {isDeleting ? "Deleting..." : "Delete"}
  //               </Button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
  // };
const TableModals: React.FC = () => {
  const [formState, setFormState] = useState<RowData>({});

  useEffect(() => {
    if (showEditModal && editingItem) setFormState({ ...editingItem });
    if (showAddModal) setFormState({});
  }, [showAddModal, showEditModal, editingItem]);

  // Filter headers that should appear in forms (input !== false)
  const formHeaders = headers.filter((h) => h.input !== false);

  // Handler for CustomInputField changes
  const handleFieldChange = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Add New</h4>
              <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formHeaders.map((h) => (
                <CustomInputField
                  key={h.field}
                  field={h.field}
                  label={h.label}
                  type={h.type || "text"}
                  require={h.require || false}
                  options={h.options || []}
                  value={formState[h.field] || ""}
                  onChange={(value) => handleFieldChange(h.field, value)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleAddSave(formState)} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-5xl bg-white rounded-lg shadow p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Edit</h4>
              <Button 
                variant="ghost" 
                onClick={() => { 
                  setShowEditModal(false); 
                  setEditingItem(null); 
                }}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formHeaders.map((h) => (
                <CustomInputField
                  key={h.field}
                  field={h.field}
                  label={h.label}
                  type={h.type || "text"}
                  require={h.require || false}
                  options={h.options || []}
                  value={formState[h.field] || ""}
                  onChange={(value) => handleFieldChange(h.field, value)}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => { 
                  setShowEditModal(false); 
                  setEditingItem(null); 
                }}
              >
                Cancel
              </Button>
              <Button onClick={() => handleEditSave(formState)} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation - No changes needed */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-4">Confirm Delete</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium">
                {String(itemToDelete.name ?? itemToDelete.title ?? itemToDelete.id ?? "this item")}
              </span>?
            </p>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => { 
                  setShowDeleteModal(false); 
                  setItemToDelete(null); 
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteConfirm} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

  // --- Empty state simple component
  const EmptyState: React.FC<{ onClearSearch: () => void; onAddNew: () => void; searchTerm: string }> = ({
    onClearSearch,
    onAddNew,
    searchTerm,
  }) => {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold mb-2">No records found</h3>
        {searchTerm ? (
          <p className="text-sm text-muted-foreground mb-6">
            No results for <span className="font-medium">"{searchTerm}"</span>
            <Button variant="link" onClick={onClearSearch} className="ml-2">
              Clear
            </Button>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">There are no records to show.</p>
        )}
        <div className="flex justify-center gap-2">
          <Button onClick={onAddNew}>Add new</Button>
        </div>
      </div>
    );
  };

  // --- Top-level empty data view
  if (paginatedData.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="mx-auto mt-2 space-y-6 max-w-6xl p-4">
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
            <Button
              onClick={() => setCurrentScreen("main")}
              className="inline-flex items-center gap-2 text-white transition-colors w-fit mb-4 p-2 rounded-md hover:bg-green-300"
              title="Back to Main Screen"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Main</span>
            </Button>

            <TableHeader
              title={title}
              searchable={searchable}
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              exportEnabled={exportEnabled}
              settingsEnabled={settingsEnabled}
              onAddNew={onAddNew}
            />

            <div className="mt-6">
              <EmptyState onClearSearch={() => setSearchTerm("")} onAddNew={() => setShowAddModal(true)} searchTerm={searchTerm} />
            </div>

            <TableModals />
          </div>
        </div>
      </div>
    );
  }

  // --- Normal render
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="mx-auto mt-2 space-y-6  p-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            <Button
              onClick={() => setCurrentScreen("main")}
              className="inline-flex items-center gap-2 text-white transition-colors w-fit mb-4 p-2 rounded-md hover:bg-green-300"
              title="Back to Main Screen"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Main</span>
            </Button>

            <TableHeader
              title={title}
              searchable={searchable}
              searchTerm={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              exportEnabled={exportEnabled}
              settingsEnabled={settingsEnabled}
              onAddNew={onAddNew}
            />
          </div>

          <div className="overflow-hidden p-6">
            <div className="overflow-x-auto">
              <DataTable
                headers={headers.filter(h => h.view !== false)}
                data={paginatedData}
                sortConfig={sortConfig}
                striped={striped}
                hoverable={hoverable}
                sortable={sortable}
                onSort={(k) => handleSort(k)}
                onEdit={(row) => {
                  setEditingItem(row);
                  setShowEditModal(true);
                }}
                onDelete={(row) => {
                  setItemToDelete(row);
                  setShowDeleteModal(true);
                }}
              />
            </div>

            {totalPages > 1 && (
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                totalItems={processedData.length}
                onPageChange={(n) => setCurrentPage(n)}
              />
            )}
          </div>
        </div>
      </div>

      <TableModals />
    </div>
  );
};

export default DynamicTable;
