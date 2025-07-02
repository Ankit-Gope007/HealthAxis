// components/LottieAnimation.js
import React from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/PageLoadingAnimation.json';

const PageLoadingAnimation = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default PageLoadingAnimation;