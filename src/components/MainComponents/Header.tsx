import { observer } from "mobx-react-lite";
import { Context } from "../../main";
import { useContext, useEffect } from "react";
import MainBadge from "../ui/MainBadge";
import styles from './mainComponents.module.css';
import { getPlanetImg } from "@/utils/getPlanetImg";
import { getTriesImg } from "@/utils/getPlanetImg";

const Header: React.FC = observer(() => {
  const { user, game } = useContext(Context);

  useEffect(() => {
    try {
      user.fetchMyInfo();
    } catch (error) {
      console.error("Error during fetching my info:", error);
    }
  }, [user]);

  return (
    <header className={styles.header}>
        <MainBadge img={getPlanetImg()} alt="Planet" text={user?.user?.balance ?? 0} />
        <MainBadge img={getTriesImg()} alt="Tries" text='10' />
      </header>
  );
});

export default Header;