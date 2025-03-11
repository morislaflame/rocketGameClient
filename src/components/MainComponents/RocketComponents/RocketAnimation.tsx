// src/components/RocketComponents/RocketAnimation.tsx
import React from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import rocketBlured from "../../../assets/rocketblured.svg";
import rocketAnimation from "../../../assets/Rocket.json";
import styles from "../mainComponents.module.css";

type RocketAnimationProps = {
  rocketContainerRef: React.RefObject<HTMLDivElement>;
  lottieRef: React.RefObject<LottieRefCurrentProps>;
  handleLaunchClick: () => void;
  handleLottieComplete: () => void;
  isLaunching: boolean;
  setShowAlert: (value: boolean) => void;
};

const RocketAnimation: React.FC<RocketAnimationProps> = ({
  rocketContainerRef,
  lottieRef,
  handleLaunchClick,
  handleLottieComplete,
  isLaunching,
  setShowAlert,
}) => {
  return (
    <div
      className="flex flex-col flex-1 items-center justify-end relative"
      style={{
        cursor: isLaunching ? "default" : "pointer",
        willChange: "transform",
      }}
    >
      <img
        src={rocketBlured}
        alt="Rocket"
        className={styles.rocketBluredLeft}
        onClick={() => setShowAlert(true)}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div
        ref={rocketContainerRef}
        onClick={handleLaunchClick}
        onContextMenu={(e) => e.preventDefault()}
        style={{ position: "absolute", bottom: "30%" }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={rocketAnimation}
          loop={false}
          autoplay={false}
          onComplete={handleLottieComplete}
          style={{
            width: 240,
            height: 240,
            transform: "rotate(-45deg)",
            pointerEvents: "none",
          }}
        />
      </div>
      <img
        src={rocketBlured}
        alt="Rocket"
        className={styles.rocketBluredRight}
        onClick={() => setShowAlert(true)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default RocketAnimation;
