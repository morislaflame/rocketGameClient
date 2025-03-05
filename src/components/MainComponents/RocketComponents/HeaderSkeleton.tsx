import styles from './RocketComponents.module.css';
import BadgeSkeleton from "../../ui/BadgeSkeleton";

const HeaderSkeleton: React.FC = () => {

  return (
    <header className={styles.header}>
          <BadgeSkeleton />
          <BadgeSkeleton />
    </header>
  );
};

export default HeaderSkeleton;