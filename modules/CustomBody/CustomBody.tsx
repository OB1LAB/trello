"use client";
import { ToastContainer } from "react-toastify";
import { CustomProvider } from "rsuite";
import localFont from "next/font/local";
import React from "react";

const NTSomicFont = localFont({ src: "NTSomic.woff2" });

export default function CustomBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={NTSomicFont.className}>
      <main>
        <CustomProvider theme="dark">{children}</CustomProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeButton={false}
          pauseOnHover={true}
          theme="dark"
        />
      </main>
    </body>
  );
}
