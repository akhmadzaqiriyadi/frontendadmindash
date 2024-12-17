"use client";
import Link from "next/link";
import { Product } from "@/types/product";
import SearchForm from "@/components/Header/SearchForm";
import { useState, useEffect } from "react";
import axios from "axios";

interface SearchFormProps {
  query: string;
  onSearch: (query: string) => void;
}

const TableTwo = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]); // For categories
  const [racks, setRacks] = useState<any[]>([]); // For racks
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Selected category
  const [selectedRack, setSelectedRack] = useState<string | null>(null); // Selected rack

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching categories and racks
        const [categoryResponse, rackResponse, productResponse] =
          await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/racks`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
          ]);

        setCategories(categoryResponse.data);
        setRacks(rackResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleRackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRack(e.target.value);
  };

  // Filter products based on search query, selected category, and selected rack
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category.name === selectedCategory
      : true;
    const matchesRack = selectedRack
      ? product.rack.location === selectedRack
      : true;
    return matchesSearch && matchesCategory && matchesRack;
  });

  const deleteProduct = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing!");
      return;
    }

    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this product?",
      );
      if (!confirmed) return;

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-row items-center justify-between px-4 py-6 md:px-6 xl:px-9">
        <h4 className="text-3xl font-bold text-dark dark:text-white">
          List Products
        </h4>
        <div>
          {/* Filter Section */}
          <div className="-z-999 flex items-center gap-x-4">
            <SearchForm query={searchQuery} onSearch={handleSearch} />
            <button className="flex gap-x-2 font-semibold hover:text-primary">
              <Link href="/admin/products/add-product">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plus-circle"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                  <path d="M12 8v8" />
                </svg>
              </Link>
              Add Product
            </button>
          </div>
          <div className="flex justify-end gap-x-4 pt-4">
            <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
              <select
                className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
                value={selectedCategory || ""}
                onChange={handleCategoryChange}
              >
                <option value="" className="text-dark-5 dark:text-dark-6">
                  All Categories
                </option>
                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.name}
                    className="text-dark-5 dark:text-dark-6"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 text-dark-4 dark:text-dark-6">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.69149 7.09327C3.91613 6.83119 4.31069 6.80084 4.57277 7.02548L9.99936 11.6768L15.4259 7.02548C15.688 6.80084 16.0826 6.83119 16.3072 7.09327C16.5319 7.35535 16.5015 7.74991 16.2394 7.97455L10.4061 12.9745C10.172 13.1752 9.82667 13.1752 9.59261 12.9745L3.75928 7.97455C3.4972 7.74991 3.46685 7.35535 3.69149 7.09327Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>

            <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
              <select
                className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
                value={selectedRack || ""}
                onChange={handleRackChange}
              >
                <option value="" className="text-dark-5  dark:text-dark-6">
                  All Racks
                </option>
                {racks.map((rack) => (
                  <option
                    key={rack.id}
                    value={rack.location}
                    className="text-dark-5 dark:text-dark-6"
                  >
                    {rack.location}
                  </option>
                ))}
              </select>
              <span className="absolute right-0.5 top-1/2 z-10 -translate-y-1/2 pr-2 text-dark-4 dark:text-dark-6">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.69149 7.09327C3.91613 6.83119 4.31069 6.80084 4.57277 7.02548L9.99936 11.6768L15.4259 7.02548C15.688 6.80084 16.0826 6.83119 16.3072 7.09327C16.5319 7.35535 16.5015 7.74991 16.2394 7.97455L10.4061 12.9745C10.172 13.1752 9.82667 13.1752 9.59261 12.9745L3.75928 7.97455C3.4972 7.74991 3.46685 7.35535 3.69149 7.09327Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Product Name</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Rack</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="font-medium">Stock</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="font-medium">Price Sell</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Action</p>
        </div>
      </div>

      {filteredProducts.map((product) => (
        <div
          className="grid grid-cols-7 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={product.id}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md">
                {product.imageUrl && (
                  <div
                    style={{
                      width: "60px",
                      aspectRatio: "1/1",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}
              </div>
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {product.name}
              </p>
            </div>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.category.name}
            </p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.rack.location}
            </p>
          </div>
          <div className="col-span-1 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {product.stock}
            </p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="text-body-sm font-medium text-green">
              Rp.{product.priceSell.toFixed(2)}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-center space-x-3.5 md:col-span-1">
            <button className="hover:text-primary">
              <Link href={`/admin/products/${product.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-eye"
                >
                  <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
            </button>
            <button className="hover:text-primary">
              <Link href={`/admin/products/edit-product/${product.id}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pencil"
                >
                  <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                  <path d="m15 5 4 4" />
                </svg>
              </Link>
            </button>
            <button
              className="hover:text-red-600"
              onClick={() => deleteProduct(product.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trash-2"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TableTwo;
