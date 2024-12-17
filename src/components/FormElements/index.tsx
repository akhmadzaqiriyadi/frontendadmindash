"use client";
import React, { useState } from "react";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectCategory from "@/components/FormElements/SelectGroup/SelectCategory";
import SelectRack from "@/components/FormElements/SelectGroup/SelectRack";
import uploadToImgbb from "@/utils/uploadToImgbb";
import { AxiosError } from "axios";

const FormElements = () => {
  const [productName, setProductName] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [selectedRackId, setSelectedRackId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handler for selecting rack
  const handleRackSelect = (rackId: string) => {
    setSelectedRackId(rackId);
  };

  // Handler for selecting category
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    }
  };

  // Submit form data
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input fields
    if (!productName.trim()) {
      alert("Product Name is required.");
      return;
    }

    if (!purchasePrice.trim()) {
      alert("Purchase Price is required.");
      return;
    }

    if (!sellingPrice.trim()) {
      alert("Selling Price is required.");
      return;
    }

    if (!stock.trim()) {
      alert("Stock is required.");
      return;
    }

    if (!selectedRackId) {
      alert("Please select a Rack.");
      return;
    }

    if (!selectedCategoryId) {
      alert("Please select a Category.");
      return;
    }

    if (!productImage) {
      alert("Product Image is required.");
      return;
    }

    setIsUploading(true);

    try {
      // Upload image to Imgbb
      const imageUrl = await uploadToImgbb(productImage);

      // Prepare payload
      const payload = {
        name: productName.trim(),
        categoryId: parseInt(selectedCategoryId),
        rackId: parseInt(selectedRackId),
        stock: parseInt(stock),
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        imageUrl,
      };

      // Fetch token from localStorage or cookies
      const token = localStorage.getItem("authToken") || document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("Authentication token is missing. Please login again.");
        return;
      }

      // Send request to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");

      // Reset form fields after successful submission
      setProductName("");
      setPurchasePrice("");
      setSellingPrice("");
      setStock("");
      setSelectedRackId("");
      setSelectedCategoryId("");
      setProductImage(null);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      // More detailed error logging
      console.error("Error response:", axiosError.response?.data);
      console.error("Error status:", axiosError.response?.status);
      console.error("Error headers:", axiosError.response?.headers);
      alert("Failed to upload product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Breadcrumb pageName="FormElements" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Product Form
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <InputGroup
                  label="Product"
                  type="text"
                  placeholder="Enter your product name"
                  customClasses="mb-4.5"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
                <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                  <InputGroup
                    label="Price Purchase"
                    type="text"
                    placeholder="Enter your Price Purchase"
                    customClasses="w-full xl:w-1/2"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />

                  <InputGroup
                    label="Price Sell"
                    type="text"
                    placeholder="Enter your Price Sell"
                    customClasses="w-full xl:w-1/2"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                  />
                </div>

                <InputGroup
                  label="Stock"
                  type="text"
                  placeholder="Enter product stock"
                  customClasses="mb-4.5"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4 mb-4.5">
                  <SelectCategory onCategorySelect={handleCategorySelect} />
                  <SelectRack onRackSelect={handleRackSelect} />
                </div>

                <div className="mb-4">
                  <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                    Attach Product Image
                  </label>
                  <input
                    type="file"
                    className="w-full cursor-pointer rounded-[7px] border-[1.5px] border-stroke px-3 py-[9px] outline-none transition"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>

                <button
                  className={`flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  type="submit"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormElements;