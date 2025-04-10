import React from 'react'
import style from "@/app/styles/components/Homepage.module.scss";
import {MadeSoulmaze, LesMauvaises, Quicksand} from "@/utils/fonts";

export const HomeCuriosity = () => {
  return (
    <div className={`${style.homeCuriosity}  navStop`}>
        <div className={`${style.texteCuriosity}`}>
            <p className={`${style.title} ${MadeSoulmaze.className}`}>la curiosité</p>
            <p className={`${style.subTitle} ${MadeSoulmaze.className}`}>est un vilain défaut</p>
            <p className={`${style.text} ${Quicksand.className}`}>est ce que tu assume autant que nous ?</p>
        </div>
        
        <div className={`${style.iconesCuriosity}`}>
            <img src="http://localhost:1337/uploads/DEMON_ROSE_81706c98f2.png" alt="" />
            <img src="http://localhost:1337/uploads/ANGE_VERT_843f436194.png" alt="" />
        </div>
    </div>
  )
}
