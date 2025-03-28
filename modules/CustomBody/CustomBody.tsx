"use client";
import { ToastContainer } from "react-toastify";
import { CustomProvider } from "rsuite";
import localFont from "next/font/local";
import React from "react";
import NavBar from "@/modules/NavBar/NavBar";
import ModalSelectTrello from "@/modules/ModalSelectTrello/ModalSelectTrello";
import ModalAuth from "@/modules/ModalAuth/ModalAuth";

const NTSomicFont = localFont({ src: "NTSomic.woff2" });

export default function CustomBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className={NTSomicFont.className}>
      <header>
        <NavBar />
      </header>
      <main>
        <CustomProvider theme="dark">{children}</CustomProvider>
        <ModalSelectTrello />
        <ModalAuth />
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
