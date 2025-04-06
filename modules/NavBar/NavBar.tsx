import useUserStore from "@/modules/useUserStore/useUserStore";
import { Button, Nav, Sidenav } from "rsuite";
import styles from "./NavBar.module.scss";
import Avatar from "@rsuite/icons/legacy/Avatar";
import FolderOpen from "@rsuite/icons/legacy/FolderOpen";
import Edit2 from "@rsuite/icons/legacy/Edit2";
import Peoples from "@rsuite/icons/legacy/Peoples";
import { useEffect, useState } from "react";
import useSelectTrelloStore from "@/modules/ModalSelectTrello/useSelectTrelloStore";

const NavBar = () => {
  const setIsModalTrello = useSelectTrelloStore((store) => store.setIsModal);
  const [setIsModalAuth, setIsModalChangePassword, setIsModalManageUsers] =
    useUserStore((store) => [
      store.setIsModalAuthOpen,
      store.setIsModalChangePassword,
      store.setIsModalManageUsers,
    ]);
  const [openedKeys, setOpenedKeys] = useState<(string | number)[]>([]);
  const [isExpand, setIsExpand] = useState(false);
  const [isAuth, isAdmin] = useUserStore((store) => [
    store.isAuth,
    store.isAdmin,
  ]);
  const userName = useUserStore((store) => store.userName);
  const [isEdit, setIsEdit] = useUserStore((store) => [
    store.isEdit,
    store.setIsEdit,
  ]);
  const [checkAuth, logout] = useUserStore((store) => [
    store.checkAuth,
    store.logout,
  ]);
  useEffect(() => {
    checkAuth();
  }, []);
  if (isAuth) {
    return (
      <Sidenav
        openKeys={openedKeys}
        onOpenChange={setOpenedKeys}
        expanded={isExpand}
        className={styles.nav}
      >
        <Sidenav.Body>
          <Nav vertical={true}>
            <Nav.Item
              onClick={() => setIsModalTrello(true)}
              icon={<FolderOpen />}
            >
              Доски
            </Nav.Item>
            <Nav.Item
              onClick={() => setIsModalManageUsers(true)}
              icon={<Peoples />}
            >
              Юзер манагер
            </Nav.Item>
            <Nav.Item
              active={isEdit}
              onClick={() => setIsEdit(!isEdit)}
              icon={<Edit2 />}
            >
              Редактировать
            </Nav.Item>
            <Nav.Menu
              eventKey="profile"
              title={userName}
              icon={<Avatar />}
              onClick={(e) => {
                if (!isExpand) {
                  e.preventDefault();
                  setIsExpand(true);
                  setTimeout(() => {
                    setOpenedKeys([...openedKeys, "profile"]);
                  }, 200);
                }
              }}
            >
              <Nav.Item>
                <Button
                  style={{ marginBottom: "6px" }}
                  appearance="primary"
                  color="blue"
                  onClick={() => setIsModalChangePassword(true)}
                >
                  Изменить пароль
                </Button>
                <Button appearance="primary" color="red" onClick={logout}>
                  Выход
                </Button>
              </Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
        <Sidenav.Toggle
          onToggle={(value) => {
            setIsExpand(value);
            setOpenedKeys([]);
          }}
        />
      </Sidenav>
    );
  }
  return (
    <Sidenav expanded={isExpand} className={styles.nav}>
      <Sidenav.Body>
        <Nav>
          <Nav.Item icon={<Avatar />} onClick={() => setIsModalAuth(true)}>
            Авторизоваться
          </Nav.Item>
        </Nav>
      </Sidenav.Body>
      <Sidenav.Toggle onToggle={setIsExpand} />
    </Sidenav>
  );
};

export default NavBar;
