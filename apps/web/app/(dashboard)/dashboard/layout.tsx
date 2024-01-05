import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mailer",
  description: "Mailer starterkit",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header className="md:hidden" />
      <div className="flex h-screen overflow-hidden">
        <Sidebar className="w-60 py-0 hidden md:flex md:flex-col justify-between" />
        <main className="flex-1 pt-16 md:pt-0 overflow-x-hidden overflow-y-auto ">
          {children}
        </main>
      </div>
    </>
  );
}
