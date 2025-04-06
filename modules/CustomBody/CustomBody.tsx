"use client";
import { ToastContainer } from "react-toastify";
import { CustomProvider } from "rsuite";
import localFont from "next/font/local";
import React from "react";
import NavBar from "@/modules/NavBar/NavBar";
import ModalSelectTrello from "@/modules/ModalSelectTrello/ModalSelectTrello";
import ModalAuth from "@/modules/ModalAuth/ModalAuth";
import ModalChangePassword from "@/modules/ModalChangePassword/ModalChangePassword";
import ModalUserManager from "@/modules/ModalUserManager/ModalUserManager";
import useUserStore from "@/modules/useUserStore/useUserStore";

const NTSomicFont = localFont({ src: "NTSomic.woff2" });

export default function CustomBody({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthLoading = useUserStore((store) => store.isAuthLoading);
  return (
    <body className={NTSomicFont.className}>
      <header>
        <NavBar />
      </header>
      <main>
        <ModalSelectTrello />
        <ModalAuth />
        <ModalChangePassword />
        <ModalUserManager />
        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeButton={false}
          pauseOnHover={true}
          theme="dark"
        />
        {isAuthLoading ? (
          <div>Авторизация...</div>
        ) : (
          <CustomProvider theme="dark">{children}</CustomProvider>
        )}
      </main>
    </body>
  );
}
