import React from "react";
import FormElementsOne from "@/components/FormElementsOne";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Form Elements Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Form Elements page for NextAdmin Dashboard Kit",
};

const CategoriesShelves = () => {
  return (
    <DefaultLayout>
      <FormElementsOne />
    </DefaultLayout>
  );
};

export default CategoriesShelves;