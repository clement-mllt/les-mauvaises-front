import React from 'react'
import style from "@/app/styles/components/Homepage.module.scss";

import { AnimatedSection } from '../components/CleinDoeil/AnimatedSection.client';

export const HomeCleinDoeil = () => {
  return (
    <div className={`${style.homeCleinDoeil} navStop`}>
        <AnimatedSection />
            
    </div>
  )
}
