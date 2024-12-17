import React from "react";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import DetailElements from "@/components/DetailProductForm";

// Metadata untuk halaman
export const metadata: Metadata = {
  title: "Next.js Form Elements Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Form Elements page for NextAdmin Dashboard Kit",
};

// Komponen Server yang menerima params dari route dinamis
const DetailProduct = async ({ params }: { params: { id: string } }) => {
  // Mengambil productId dari params
  const { id } = await params;

  // Fetch data produk berdasarkan productId
  const res = await fetch(`http://localhost:3000/api/products/${id}`);
  const productData = await res.json();

  // Pastikan untuk menangani error jika fetch gagal
  if (!res.ok) {
    console.log(res)
    throw new Error("Data produk tidak ditemukan");
  }

  return (
    <DefaultLayout>
      <DetailElements productData={productData} />
    </DefaultLayout>
  );
};

export default DetailProduct;
