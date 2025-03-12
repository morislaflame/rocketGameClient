// src/components/RocketComponents/TapToLaunchOverlay.tsx
import { forwardRef } from "react";
import styles from "../mainComponents.module.css";

const TapToLaunchOverlay = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className={styles.tapToLaunch}
      style={{
        position: "absolute",
        top: "15%",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: 500,
        color: "rgb(178 177 177)",
        textShadow: "0 0 5px rgba(0,0,0,0.5)",
        zIndex: 10,
        willChange: "transform, opacity",
      }}
    >
      Tap to launch
    </div>
  );
});

export default TapToLaunchOverlay;
