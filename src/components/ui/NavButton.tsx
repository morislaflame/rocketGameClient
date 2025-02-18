import styles from './MainUi.module.css';

type NavButtonProps = {
  img: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const NavButton = ({ img, onClick }: NavButtonProps) => {
  return (
    <div className={styles.navButton} onClick={onClick}>
      {img}
    </div>
  );
};

export default NavButton;
