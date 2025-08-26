// components/Loading.tsx
import React, { useEffect, useState } from 'react';
import { PageLoader } from '@/components/ui/global-loader';

const Loading: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="loading-container w-full h-screen flex items-center justify-center flex-col">
        <div className="relative w-20 h-20">
          <div className="w-20 h-20 border-2 border-foreground rounded-full bg-background"></div>
          <div className="absolute top-6 left-6 w-3 h-5 bg-foreground rounded-full"></div>
          <div className="absolute top-6 right-6 w-3 h-5 bg-foreground rounded-full"></div>
        </div>
      </div>
    );
  }

  return <PageLoader />;
};

export default Loading;
