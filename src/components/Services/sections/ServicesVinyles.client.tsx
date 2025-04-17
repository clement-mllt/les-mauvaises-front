"use client";

import React, { useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
  LoadVinyles,
  canvasActionMap,
} from "@/components/Services/utils/LoadVinyles.client";
import style from "@/app/styles/components/Services.module.scss";

export function ServicesVinyles() {
  useEffect(() => {
    const initTimeout = window.setTimeout(() => {
      // 1️⃣ Handlers
      function onCanvasClick(this: HTMLCanvasElement, event: MouseEvent) {
        const data = canvasActionMap.get(this);
        if (!data) return;
        const id = this.id;
        const canvasMoveArray = [
          { name: "canvas-1", x: "50%", y: "50%" },
          { name: "canvas-2", x: "-50%", y: "50%" },
          { name: "canvas-3", x: "50%", y: "-50%" },
          { name: "canvas-4", x: "-50%", y: "-50%" },
        ];
        const canvasData = canvasMoveArray.find((c) => c.name === id);
        const parent = this.parentElement;
        if (!canvasData || !parent) return;

        if (!data.isOpen) {
          data.isOpen = "open";
          const tl = gsap.timeline();
          tl.to(parent, {
            x: canvasData.x,
            y: canvasData.y,
            zIndex: 10,
            duration: 0.5,
          })
            .to(this, { scale: 2, duration: 1 }, "<")
            .to(
              data.camera.position,
              { x: -0.23, y: 0, z: 0.5, duration: 1 },
              "<"
            )
            .to(
              data.model.rotation,
              { y: data.model.rotation.y - 0.4, duration: 0.5 },
              "<"
            )
            .to(this, { backdropFilter: "blur(10px)" });
          data.action.play();
          if (data.action1) data.action1.play();
          setTimeout(() => (data.action.paused = true), 3500);
        } else if (data.isOpen === "open") {
          data.isOpen = "back";
          const tl = gsap.timeline({ defaults: { duration: 1 } });
          tl.to(data.camera.position, { x: -0.1, y: 0, z: 0.5 })
            .add(() => (data.action.paused = false))
            .to(data.model.rotation, { y: -3 });
          setTimeout(() => (data.action.paused = true), 2000);
        } else {
          data.isOpen = false;
          const tl = gsap.timeline();
          tl.to(this, { backdropFilter: "blur(0px)", duration: 0.5 })
            .to(
              data.model.rotation,
              { y: data.initialRotation.y, duration: 0.5 },
              "<"
            )
            .to(data.camera.position, { x: 0, y: 0, z: 0.5, duration: 1 }, "<")
            .to(this, { scale: 1, duration: 1 }, "<")
            .to(
              parent,
              {
                x: 0,
                y: 0,
                zIndex: 1,
                duration: 0.5,
                onComplete() {
                  data.model.rotation.set(0, 0, 0);
                  data.action.reset();
                  data.action.stop();
                  if (data.action1) data.action1.reset();
                },
              },
              "<"
            );
        }
      }

      function onCanvasMouseOver(this: HTMLCanvasElement, event: MouseEvent) {
        const data = canvasActionMap.get(this);
        if (!data || !data.action1) return;
        data.initialRotation = { ...data.model.rotation };

        data.action1.reset();
        data.action1.setLoop(THREE.LoopOnce, 1);
        data.action1.clampWhenFinished = true;
        data.action1.timeScale = 1;
        data.action1.play();
      }

      function onCanvasMouseMove(this: HTMLCanvasElement, event: MouseEvent) {
        const data = canvasActionMap.get(this);
        if (!data) return;
        const { left, top, width, height } = this.getBoundingClientRect();
        const dx = event.clientX - (left + width / 2);
        const dy = event.clientY - (top + height / 2);
        const factor = data.isOpen ? 1e-9 : 1e-5;
        data.model.rotation.y += dx * factor;
        data.model.rotation.x += dy * factor;
      }

      function onCanvasMouseLeave(this: HTMLCanvasElement, event: MouseEvent) {
        const data = canvasActionMap.get(this);
        if (!data || !data.action1) return;
        const currentTime = data.action1.time;

        data.action1.paused = false;
        data.action1.timeScale = -1;
        data.action1.setLoop(THREE.LoopOnce, 0);
        data.action1.clampWhenFinished = true;
        data.action1.play();

        setTimeout(() => {
          data.action1.paused = true;
          data.action1.time = 0;
          data.model.scale.set(1, 1, 1);
          data.model.traverse((child) => {
            if ((child as THREE.Mesh).material) {
              (child as THREE.Mesh).material.visible = true;
            }
          });
        }, currentTime * 1000);

        console.log(data.initialRotation);
        console.log(data.model.rotation);

        gsap.to(data.model.rotation, {
          x: data.initialRotation?.x ?? 0,
          y: data.initialRotation?.y ?? 0,
          z: data.initialRotation?.z ?? 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // 2️⃣ Attache chaque listener directement au <canvas>
      const canvasList = document.querySelectorAll<HTMLCanvasElement>("canvas");
      canvasList.forEach((canvas, index) => {
        canvas.id = `canvas-${index + 1}`;
        canvas.addEventListener("click", onCanvasClick);
        canvas.addEventListener("mouseover", onCanvasMouseOver);
        canvas.addEventListener("mousemove", onCanvasMouseMove);
        canvas.addEventListener("mouseleave", onCanvasMouseLeave);
      });

      // 3️⃣ Cleanup
      return () => {
        clearTimeout(initTimeout);
        canvasList.forEach((canvas) => {
          canvas.removeEventListener("click", onCanvasClick);
          canvas.removeEventListener("mouseover", onCanvasMouseOver);
          canvas.removeEventListener("mousemove", onCanvasMouseMove);
          canvas.removeEventListener("mouseleave", onCanvasMouseLeave);
        });
      };
    }, 500);

    return () => window.clearTimeout(initTimeout);
  }, []);

  return (
    <div className={style.servicesVinyles}>
      <div className={`${style.servicesVinylesPlace} site`}>
        <LoadVinyles place=".site" path="/glbModels/services/DEVOK.glb" />
      </div>
      <div className={`${style.servicesVinylesPlace} com`}>
        <LoadVinyles place=".com" path="/glbModels/services/COMOK.glb" />
      </div>
      <div className={`${style.servicesVinylesPlace} da`}>
        <LoadVinyles place=".da" path="/glbModels/services/DAOK.glb" />
      </div>
      <div className={`${style.servicesVinylesPlace} maintenance`}>
        <LoadVinyles
          place=".maintenance"
          path="/glbModels/services/MAINTENANCEOK.glb"
        />
      </div>
    </div>
  );
}
