"use client";

import { useEffect, useState, memo } from "react";
import axios from "axios";
import SearchForm from "@/components/Header/SearchForm";
import { Product } from "@/types/product";

const ProductCard = memo(({ product, onIncrement, onDecrement, selected, onSelect, quantity }: any) => {
  return (
    <div className="flex flex-col rounded-lg border border-stroke bg-white p-4 shadow-1 transition hover:shadow-lg dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <div className="flex items-center justify-between">
        <input
          type="checkbox"
          checked={selected.has(product.id)}
          onChange={() => onSelect(product.id)}
          className="h-5 w-5 rounded border-gray-300 accent-primary"
        />
        <p className="text-sm text-gray-500">Rack: {product.rack.location}</p>
      </div>
      <img
        src={product.imageUrl || "/images/placeholder.png"}
        alt={product.name}
        className="mx-auto my-3 rounded-lg h-32 w-32 object-cover"
      />
      <h3 className="text-lg font-semibold text-dark-5 dark:text-dark-6">{product.name}</h3>
      <p className="text-body-sm font-medium text-green">Rp.{product.priceSell.toFixed(2)}</p>
      <p className="text-sm text-dark-6">Category: {product.category.name}</p>
      <p className="text-sm text-dark-6">
        Stock: <span className="font-medium">{product.stock}</span>
      </p>
      <div className="mt-4 flex items-center justify-end">
        <button
          onClick={() => onDecrement(product.id)}
          className="rounded-l bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          -
        </button>
        <span className="bg-gray-100 px-4 py-1 text-center">{quantity || 0}</span>
        <button
          onClick={() => onIncrement(product.id)}
          className="rounded-r bg-gray-200 px-3 py-1 hover:bg-gray-300"
        >
          +
        </button>
      </div>
    </div>
  );
});

const AddTransactionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [racks, setRacks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRack, setSelectedRack] = useState<string>("");
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trxType, setTrxType] = useState<"in" | "out">("in");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryResponse, rackResponse, productResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/racks`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
        ]);
        setCategories(categoryResponse.data);
        setRacks(rackResponse.data);
        setProducts(productResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => setSearchQuery(query);
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value);
  const handleRackChange = (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRack(e.target.value);

  const handleIncrement = (id: number) => {
    setQuantities((prev) => {
      const currentStock = products.find((p) => p.id === id)?.stock || 0;
      return { ...prev, [id]: Math.min((prev[id] || 0) + 1, currentStock) };
    });
  };

  const handleDecrement = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  };

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.name === selectedCategory;
    const matchesRack = !selectedRack || product.rack.location === selectedRack;
    return matchesSearch && matchesCategory && matchesRack;
  });

  const displayedProducts = Array.from(
    new Set([
      ...filteredProducts,
      ...products.filter((p) => selected.has(p.id)),
    ])
  );

  const totalQuantity = Array.from(selected).reduce(
    (total, id) => total + (quantities[id] || 0),
    0
  );

  const totalPrice = Array.from(selected).reduce(
    (total, id) =>
      total + (quantities[id] || 0) * (products.find((p) => p.id === id)?.priceSell || 0),
    0
  );

  const handleCheckout = async () => {
    const transactionData = {
      trxType,
      notes,
      details: Array.from(selected).map((id) => ({
        productId: id,
        qty: quantities[id] || 0,
      })),
    };

    try {
        // Fetch token from localStorage or cookies
        const token = localStorage.getItem("authToken") || document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        alert("Authentication token is missing. Please login again.");
        return;
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, transactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      alert("Transaction successfully submitted!");
      setSelected(new Set());
      setQuantities({});
      setNotes("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Failed to submit transaction.");
    }
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="h-full rounded-[10px] border border-stroke bg-white py-12 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:py-16 lg:pt-5">
      {/* List Products */}
      <div className="flex flex-row items-center justify-between px-4 md:px-6 xl:px-9 mb-6 mt-2">
        <h4 className="text-3xl font-bold text-dark dark:text-white">List Products</h4>
        <div className="flex items-center gap-x-4">
          <SearchForm query={searchQuery} onSearch={handleSearch} />
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="appearance-none rounded-[7px] border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRack}
            onChange={handleRackChange}
            className="rounded-[7px] border border-stroke bg-transparent py-3 pl-4 pr-8 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
          >
            <option value="">All Racks</option>
            {racks.map((rack) => (
              <option key={rack.id} value={rack.location}>
                {rack.location}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mx-auto px-6 sm:px-6 lg:px-8">
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                selected={selected}
                onSelect={handleCheckboxChange}
                quantity={quantities[product.id]}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found for the selected filters.</p>
        )}
      </div>
      {/* Bottom Bar */}
      <div className="fixed bottom-0 right-0 w-full bg-white border-t border-stroke dark:bg-gray-dark dark:border-dark-3 p-4 z-50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-body-2xlg font-medium text-dark dark:text-white">
              Total Quantity: <span className="font-bold">{totalQuantity}</span>
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              Total Price:{" "}
              <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
            </p>
          </div>
          <button
            className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
            onClick={() => setIsDialogOpen(true)}
            disabled={selected.size === 0 || totalQuantity === 0}
          >
            Checkout
          </button>
        </div>
      </div>
      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-dark">
            <h3 className="mb-4 text-lg font-semibold text-dark dark:text-white">Transaction Details</h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-dark dark:text-white">Transaction Type</label>
              <select
                value={trxType}
                onChange={(e) => setTrxType(e.target.value as "in" | "out")}
                className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
              >
                <option value="in">In</option>
                <option value="out">Out</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-dark dark:text-white">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded border border-stroke bg-transparent py-2 px-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2"
              />
            </div>
            <div className="flex justify-end gap-x-2">
              <button
                className="rounded bg-gray-300 px-4 py-2 text-dark hover:bg-gray-400"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                onClick={handleCheckout}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTransactionPage;
