// src/components/RocketComponents/ResultBadge.tsx
import { forwardRef } from "react";
import styles from "../mainComponents.module.css";

type ResultBadgeProps = {
  result: number | string;
  planetImg: string;
};

const ResultBadge = forwardRef<HTMLDivElement, ResultBadgeProps>(({ result, planetImg }, ref) => {
  return (
    <div ref={ref} className={styles.resultBadge}>
      <img src={planetImg} alt="Planet" className={styles.resultIcon} />
      <span className={styles.resultText}>+{result}</span>
    </div>
  );
});

export default ResultBadge;
