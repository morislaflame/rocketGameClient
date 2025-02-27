import styles from './MainUi.module.css'

const MainBadge = ( {img, alt, text} : {img: string, alt: string, text: number} ) => {
  return (
    <div className={styles.balanceBadge}>
          <img
            className={styles.badgeImg}
            src={img}
            alt={alt}
          />
          <span className={styles.badgeText}>{text}</span>
    </div>
  );
};

export default MainBadge;