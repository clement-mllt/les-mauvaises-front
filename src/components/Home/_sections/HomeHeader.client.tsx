import React from 'react';
import style from "@/app/styles/components/Homepage.module.scss";

export const HomeHeader = (data: any) => {
  const videoURL = data?.header_video?.url;

  return (
    <div className={`${style.headerVideoContainer} navStop`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        src={videoURL || "http://localhost:1337/uploads/HEADER_2_ea12d1bb33.mp4"}
      />
    </div>
  );
};
