import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://cost-benefit-optimization.vercel.app"),
  title: "Cost-Benefit Optimization of Order Stacking, Wahid Tawsif Ratul",
  description:
    "Applied analytics at a regional food-delivery platform: finding optimal ML order-assignment stacking levels via cost-benefit analysis, covariance, Pearson correlation, and multi-linear regression on operational KPIs. BigQuery, R, Tableau.",
  openGraph: {
    title: "Cost-Benefit Optimization of Order Stacking",
    description: "Where algorithmic order stacking stops paying for itself, cost vs. customer experience, modeled.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cost-Benefit Optimization of Order Stacking",
    description: "Order-stacking optimization via cost-benefit analytics.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}<Analytics /></body>
    </html>
  );
}
