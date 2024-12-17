"use client";
import { useState } from "react";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableCategory from "@/components/Tables/TableCategory";
import TableShelves from "@/components/Tables/TableShelves";
import AddPopupDialog from "@/components/Dialog/AddPopupDialog";

const FormElements = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<"category" | "shelve">(
    "category"
  );

  // Buka dialog
  const handleOpenDialog = (content: "category" | "shelve") => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  // Tutup dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // API call untuk menyimpan data
  const handleSaveData = async (data: { name?: string; location?: string }) => {
    try {
      const apiUrl =
        dialogContent === "category"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/racks`;

      const response = await axios.post(apiUrl, data);

      if (response.status === 201) {
        alert(`${dialogContent === "category" ? "Category" : "Shelve"} added successfully`);
        // Refresh data jika diperlukan
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    } finally {
      setDialogOpen(false); // Tutup dialog
    }
  };

  return (
    <>
      <Breadcrumb pageName="Shelves & Categories" />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => handleOpenDialog("category")}
          className="mr-4 rounded bg-primary px-4 py-2 text-white"
        >
          Add Category
        </button>
        <button
          onClick={() => handleOpenDialog("shelve")}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Add Shelve
        </button>
      </div>

      <div className="grid xl:grid-cols-2 gap-9 sm:grid-cols-1">
        <TableCategory />
        <TableShelves />
      </div>

      {/* Dialog */}
      <AddPopupDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        content={dialogContent}
        onSave={handleSaveData} // Pass API handler
      />
    </>
  );
};

export default FormElements;
