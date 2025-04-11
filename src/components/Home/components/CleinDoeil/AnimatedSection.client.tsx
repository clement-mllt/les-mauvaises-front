import React from 'react'
import style from "@/app/styles/components/Homepage.module.scss";
import Explosion from '@/components/Icons/Explosion';
import Favicon from '@/components/Icons/Favicon';
import FullScreenline from '@/components/Icons/FullScreenline';
import ShortCleinDoeil from '@/components/Icons/ShortCleinDoeil';
import Image from 'next/image';

export const AnimatedSection = () => {
  return (
    <div className={`${style.content}`}>
      <Image src={"/cleinOeilAssets/paper1.png"} width={800} height={800} quality={100}  alt='paper1'/>
        {/* <Explosion />
        <ShortCleinDoeil />
        <FullScreenline /> 
        <Favicon /> */}
    </div>
  )
}
