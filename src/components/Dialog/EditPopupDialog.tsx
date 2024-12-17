import React, { useState } from "react";

interface EditPopupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: "category" | "shelve";
  onSave: (data: { name?: string; location?: string }) => void;
  initialValue?: string; 
}

const EditPopupDialog: React.FC<EditPopupDialogProps> = ({
  isOpen,
  onClose,
  content,
  onSave,
  initialValue = "",
}) => {
  const [inputValue, setInputValue] = useState(initialValue); 

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (content === "category") {
        onSave({ name: inputValue });
      } else if (content === "shelve") {
        onSave({ location: inputValue });
      }
      setInputValue(initialValue);
      onClose();
    } [initialValue]
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
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
          Old Category Name
          </label>
          <input
            type="text"
            value={initialValue} 
            disabled
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
          />
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

export default EditPopupDialog;
