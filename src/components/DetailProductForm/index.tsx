import React from "react";
import { Product } from "@/types/product";

interface DetailElementsProps {
  productData: Product;
}

const DetailElements: React.FC<DetailElementsProps> = ({ productData }) => {
  const {
    name,
    category,
    rack,
    stock,
    pricePurchase,
    priceSell,
    imageUrl,
  } = productData;

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
            <h3 className="font-semibold text-dark dark:text-white">Product Details</h3>
          </div>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Product Name</label>
              <input
                type="text"
                value={name}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Category</label>
              <input
                type="text"
                value={category.name}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Rack</label>
              <input
                type="text"
                value={rack.location}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Stock</label>
              <input
                type="number"
                value={stock}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Purchase Price</label>
              <input
                type="text"
                value={pricePurchase.toLocaleString()}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            <div className="mb-4.5">
              <label className="block text-lg font-semibold text-dark dark:text-white">Selling Price</label>
              <input
                type="text"
                value={priceSell.toLocaleString()}
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary dark:disabled:bg-dark mb-2"
                disabled
              />
            </div>
            {imageUrl && (
              <div className="mb-4.5">
                <label className="block text-lg font-semibold text-dark dark:text-white">Product Image</label>
                <div className="mt-2">
                  <img
                    src={imageUrl}
                    alt="Product Image"
                    className="w-full rounded-md object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailElements;
