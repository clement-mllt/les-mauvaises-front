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

    // Fonction de mise à jour de la position de la vidéo lors du scroll
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      // Vérifiez qu'il y a bien un scroll possible
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      console.log("scrollY:", scrollY, "maxScroll:", maxScroll, "progress:", progress);
      
      if (videoElement.duration) {
        // Multipliez par un facteur (ici 10) pour accélérer la progression de la vidéo
        const newTime = progress * (videoElement.duration * 2);
        // Limiter currentTime à la durée de la vidéo pour ne pas la dépasser
        videoElement.currentTime = Math.min(newTime, videoElement.duration);
        console.log("videoElement.currentTime:", videoElement.currentTime);
      }
    };

    // Fonction appelée quand les métadonnées de la vidéo sont chargées
    const onLoadedMetadata = () => {
      videoElement.pause();
      window.addEventListener('scroll', handleScroll);
    };

    // Si les métadonnées sont déjà chargées, on appelle directement la fonction
    if (videoElement.readyState >= 1) {
      onLoadedMetadata();
    } else {
      videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    // Nettoyage de l'écouteur lors du démontage
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
