import React from 'react'
import style from "@/app/styles/components/Services.module.scss";
import { MadeSoulmaze, LesMauvaises, Quicksand } from "@/utils/fonts";
import Image from 'next/image';


export const ServicesHeader = () => {
  return (
    <div className={style.servicesHeader}>

    <div className={style.servicesHeaderTitle}>
        <div className={LesMauvaises.className}>des artistes au services d'autres artistes</div>
        <div className={MadeSoulmaze.className}>services</div>
        <div className={Quicksand.className}>Création de sites web, stratégie digitale et contenus percutants : on conçoit des concepts qui marquent les esprits. Spécialistes du creative content, on transforme tes idées en expériences numériques percutantes et sur-mesure. Ici, chaque projet est unique, pensé pour faire vibrer ton audience et révéler tout le potentiel de ta présence en ligne</div>
    </div>
    <div className={style.servicesHeaderImage}>
        <Image src={"/servicesAssets/Vinyle\ def.png"} alt="services" width={525} height={780} />
    </div>
</div>
  )
}
