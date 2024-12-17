import React, { useState } from "react";

interface AddPopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: "category" | "shelve";
  onSave: (data: { name?: string; location?: string }) => void;
}

const AddPopupDialog: React.FC<AddPopupDialogProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
}) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (content === "category") {
        onSave({ name: inputValue }); // Kirim data kategori
      } else if (content === "shelve") {
        onSave({ location: inputValue }); // Kirim data rak
      }
      setInputValue(""); // Reset input setelah submit
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 max-w-lg rounded-[10px] border border-stroke bg-white p-6 shadow-lg">
        <div className="flex justify-between border-b border-stroke pb-4">
          <h3 className="font-medium text-dark">
            {content === "category" ? "Add Category" : "Add Shelve"}
          </h3>
          <button onClick={onClose} className="text-dark">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-4">
          <label className="mb-2 block text-body-sm font-medium text-dark">
            {content === "category" ? "Category Name" : "Shelve Location"}
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              content === "category"
                ? "Enter category name"
                : "Enter shelve location"
            }
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full rounded bg-primary py-2 text-white"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPopupDialog;
