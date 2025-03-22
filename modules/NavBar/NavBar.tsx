import useUserStore from "@/modules/useUserStore/useUserStore";
import { Button, Nav, Navbar } from "rsuite";
import Link from "next/link";
import styles from "./NavBar.module.scss";
import Avatar from "@rsuite/icons/legacy/Avatar";

const NavBar = () => {
  const isAuth = useUserStore((store) => store.isAuth);
  const userName = useUserStore((store) => store.userName);
  if (isAuth) {
    return (
      <Navbar className={styles.nav}>
        <Nav vertical>
          <Nav.Item>Trello</Nav.Item>
          <Nav.Menu title={userName} icon={<Avatar />}>
            <Nav.Item>
              <Button appearance="primary" color="red">
                Выход
              </Button>
            </Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    );
  }
  return (
    <Navbar className={styles.nav}>
      <Nav>
        <Nav.Item>Авторизоваться</Nav.Item>
      </Nav>
    </Navbar>
  );
};

export default NavBar;
