"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface SelectCategoryProps {
  onCategorySelect: (categoryId: string) => void;
  defaultValue?: string;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId); // Kirimkan categoryId ke parent
  };

  return (
    <div className="mb-4">
      <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
        Category
      </label>
      <div className="relative z-20 rounded-[7px] bg-white dark:bg-dark-2">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="relative z-10 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
        >
          <option value="" className="text-dark-5 dark:text-dark-6">
            -- Select Category --
          </option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
              className="text-dark-5 dark:text-dark-6"
            >
              {category.name}
            </option>
          ))}
        </select>
        <span className="absolute right-4.5 top-1/2 z-10 -translate-y-1/2 text-dark-4 dark:text-dark-6">
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
  );
};

export default SelectCategory;
