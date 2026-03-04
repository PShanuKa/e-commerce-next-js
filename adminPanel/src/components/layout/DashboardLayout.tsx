import { type ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  title: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, children }: DashboardLayoutProps) => (
  <div className="min-h-screen bg-gray-50 flex">
    <Sidebar />
    <div className="flex-1 ml-60 flex flex-col min-h-screen">
      <Header title={title} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export default DashboardLayout;
