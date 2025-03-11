import { observer } from "mobx-react-lite"
  import styles from "./mainComponents.module.css"
  import CurrentRaffle from "./RaffleComponents/CurrentRaffle"
import { useRef } from "react";
import { useLayoutEffect } from "react";
import { gsap } from 'gsap';

const Shop: React.FC = observer(() => { 
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className={styles.Container} ref={containerRef}>
      <CurrentRaffle />
    </div>
  )
})

export default Shop