import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import DashboardLayout from "@/components/layout/DashboardWrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Project Management App",
  description: "Modern full-stack project management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} font-sans min-h-screen antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100 font-sans">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
