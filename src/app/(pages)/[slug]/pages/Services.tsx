'use client'

import React from 'react'
import style from "@/app/styles/components/Services.module.scss";
import { MadeSoulmaze, LesMauvaises, Quicksand } from "@/utils/fonts";
import { gsap } from "gsap";
import Image from 'next/image';
import { ServicesVinyles } from '@/components/Services/sections/ServicesVinyles.client';
import { ServicesPlayer } from '@/components/Services/sections/ServicesPlayer.client';
import { ServicesHeader } from '@/components/Services/sections/ServicesHeader.client';


export default function Services() {
  return (
    <section className={style.servicesContainer}>
        <ServicesHeader />
        <ServicesVinyles />
        <ServicesPlayer />       
    </section>
  )
}
