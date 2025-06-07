// components/LottieAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/heroPage.json'

const heroAnimation = () => {
  return (
    <div style={{ width: 700, height: 700 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default heroAnimation;