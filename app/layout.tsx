import type { Metadata, Viewport } from "next";
import "react-toastify/dist/ReactToastify.css";
import "rsuite/dist/rsuite.min.css";
import "./globals.scss";
import CustomBody from "@/modules/CustomBody/CustomBody";
import React from "react";

export const metadata: Metadata = {
  title: "Trello",
  description: "Панель для распределения задач между командой",
  openGraph: {
    title: "Trello",
    description: "Панель для распределения задач между командой",
    siteName: "OB1LAB",
    locale: "ru_RU",
    type: "website",
    images: "https://trello.ob1lab.ru/mood.png",
    url: "https://trello.ob1lab.ru/",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ff00ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <CustomBody>{children}</CustomBody>
    </html>
  );
}
