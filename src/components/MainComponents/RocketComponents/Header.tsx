import { observer } from "mobx-react-lite";
import { Context, IStoreContext } from "@/store/StoreProvider";
import { useContext, useEffect } from "react";
import MainBadge from "../../ui/MainBadge";
import styles from './RocketComponents.module.css';
import { getPlanetImg } from "@/utils/getPlanetImg";
import { getTriesImg } from "@/utils/getPlanetImg";
import ShopDrawer from "../ShopComponents/ShopDrawer";

const Header: React.FC = observer(() => {
  const { user } = useContext(Context) as IStoreContext;

  useEffect(() => {
    if (!user.user?.balance) {
      try {
        user.fetchMyInfo();
      } catch (error) {
        console.error("Error during fetching my info:", error);
      }
    }
  }, [user]);

  return (
    <header className={styles.header}>
        <MainBadge img={getPlanetImg()} alt="Planet" text={user?.user?.balance ?? 0} />
        <div className='flex flex-row gap-2 items-center'>
          <ShopDrawer />
          <MainBadge img={getTriesImg()} alt="Tries" text={user?.user?.attempts ?? 0} />
        </div>
    </header>
  );
});

export default Header;