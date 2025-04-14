import React from 'react'
import style from "@/app/styles/components/Homepage.module.scss";
import Image from 'next/image';


export default function TvSection(data: any)  {

  const videoURL = data?.header_video?.url;


  return (
    <div className={`${style.TvSection}`}>
        <Image src={"/cleinOeilAssets/clément\ porte\ télé.png"} height={1000} width={1000} alt='clement porte télé'/>
        <Image src={"/cleinOeilAssets/télé\ Clément.png"} height={1000} width={1000} alt='clement porte télé'/>
        <video
        muted
        loop
        playsInline
        src={videoURL || "http://localhost:1337/uploads/HEADER_2_ea12d1bb33.mp4"}
      />

    </div>
  )
}
