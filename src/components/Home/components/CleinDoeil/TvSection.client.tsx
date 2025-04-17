'use client'

import React, { useEffect, useRef } from 'react'
import style from "@/app/styles/components/Homepage.module.scss";
import Image from 'next/image';

export default function TvSection({ data, isTvStart }: { data: any; isTvStart: boolean }) {
  console.log(isTvStart, 'ICI');

  const videoURL = data?.header_video?.url;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (!isTvStart) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      console.log("scrollY:", scrollY, "maxScroll:", maxScroll, "progress:", progress);
      
      if (videoElement.duration) {
        const factor = 2;
        const newTime = progress * (videoElement.duration * factor);
        videoElement.currentTime = Math.min(newTime, videoElement.duration);
        console.log("videoElement.currentTime:", videoElement.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      videoElement.pause();
      window.addEventListener('scroll', handleScroll);
    };

    if (videoElement.readyState >= 1) {
      onLoadedMetadata();
    } else {
      videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isTvStart]);

  return (
    <div className={`${style.TvSection}`}>
      <Image
        src={"/cleinOeilAssets/clément porte télé.png"}
        className={`${style.TV1}`}
        height={1000}
        width={1000}
        alt="clement porte télé"
      />
      <Image
        src={"/cleinOeilAssets/télé Clément.png"}
        className={`${style.TV2}`}
        height={1000}
        width={1000}
        alt="clement porte télé"
      />
      <div className={`${style.videoContainer}`}>
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          src={videoURL || "http://localhost:1337/uploads/HEADER_2_ea12d1bb33.mp4"}
        />
      </div>
    </div>
  );
}
