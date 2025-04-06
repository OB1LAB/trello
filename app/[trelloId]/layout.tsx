"use client";
import React from "react";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";
import useUserStore from "@/modules/useUserStore/useUserStore";
import { Button } from "rsuite";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isAuth, setIsModalAuth] = useUserStore((store) => [
    store.isAuth,
    store.setIsModalAuthOpen,
  ]);
  const isTrelloLoading = useSelectTrelloStore((store) => store.isLoading);
  if (!isAuth) {
    return (
      <div className="trelloAuth">
        <div>Для продолжения вам нужно</div>
        <Button
          appearance="primary"
          color="blue"
          onClick={() => setIsModalAuth(true)}
        >
          Авторизация
        </Button>
      </div>
    );
  }
  if (isTrelloLoading) {
    return <div>Загрузка...</div>;
  }
  return children;
};

export default Layout;
