import React from 'react';
import { LoaderFive } from "@/components/ui/loader";

const LoadingScreen = ({ message = "LOADING..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-[9999]">
      <div className="font-mono">
        <LoaderFive text={message} />
      </div>
    </div>
  );
};

export default LoadingScreen;