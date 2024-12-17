import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableTransaction from "@/components/Tables/TableTransaction";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const AccountsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Transaction" />

      <div className="flex flex-col gap-10">
        <TableTransaction />
      </div>
    </DefaultLayout>
  );
};

export default AccountsPage;
