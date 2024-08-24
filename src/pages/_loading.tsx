// components/Loading.tsx
import React, { useEffect, useState } from 'react';

const Loading: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500); // Update progress every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const renderProgressBar = () => {
    const totalBars = 40;
    const filledBars = Math.floor((progress / 100) * totalBars);
    const emptyBars = totalBars - filledBars;

    return (
      <>
        {'='.repeat(filledBars)}
        {'-'.repeat(emptyBars)}
      </>
    );
  };

  return (
    <div className="loading-container w-full h-screen flex items-center justify-center flex-col">
      <p className="text-lg mb-4">Loading...</p>
      <pre className="text-base font-bold glow-text">
        [{renderProgressBar()}] {progress}%
      </pre>
    </div>
  );
};

export default Loading;
