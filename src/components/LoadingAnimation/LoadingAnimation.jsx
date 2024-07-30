import React from "react";
import Lottie from "lottie-react";
import animationData from "../../Assets/golfloaderanimation.json"; // Adjust the path as needed
import "./LoadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <Lottie
        animationData={animationData}
        loop={true}
        className="lottie-animation"
      />
      {/* <div className="loading-text">Teeing Off!</div> */}
    </div>
  );
};

export default LoadingAnimation;
