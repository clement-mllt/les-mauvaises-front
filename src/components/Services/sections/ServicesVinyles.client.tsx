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
      const canvasList = document.querySelectorAll<HTMLCanvasElement>("canvas");
      canvasList.forEach((canvas, index) => {
        canvas.id = `canvas-${index + 1}`;
      });

      const canvasMoveArray = [
        { name: "canvas-1", x: "50%", y: "50%" },
        { name: "canvas-2", x: "-50%", y: "50%" },
        { name: "canvas-3", x: "50%", y: "-50%" },
        { name: "canvas-4", x: "-50%", y: "-50%" },
      ];

      // Gestion du click sur canvas
      function onCanvasClick(event: MouseEvent) {
        const target = event.target as HTMLCanvasElement;
        if (!target || target.tagName !== "CANVAS") return;
        const data = canvasActionMap.get(target);
        const canvasData = canvasMoveArray.find((c) => c.name === target.id);
        const parent = target.parentElement;
        if (!data || !canvasData || !parent) {
          console.warn(
            "Aucune donnée trouvé pour ce canvas ou element parent manquant"
          );
          return;
        }

        // Premier clic
        if (!data.isOpen) {
          data.isOpen = "open";
          const tl = gsap.timeline();
          tl.to(parent, {
            x: canvasData.x,
            y: canvasData.y,
            zIndex: 10,
            duration: 0.5,
          })
            .to(target, { scale: 2, duration: 1 }, "<")
            .to(
              data.camera.position,
              { x: -0.23, y: 0, z: 1, duration: 1 },
              "<"
            )
            .to(
              data.model.rotation,
              { y: data.model.rotation.y - 0.4, duration: 0.5 },
              "<"
            )
            .to(target, { backdropFilter: "blur(10px)" });
          data.action.play();
          if (data.action1) data.action1.play();
          setTimeout(() => (data.action.paused = true), 3500);

          // Deuxième clic
        } else if (data.isOpen === "open") {
          data.isOpen = "back";
          const tl = gsap.timeline({ defaults: { duration: 1 } });
          tl.to(data.camera.position, { x: -0.1, y: 0, z: 0.3 })
            .add(() => (data.action.paused = false))
            .to(data.model.rotation, { y: -3 });
          setTimeout(() => (data.action.paused = true), 2000);

          // Troisième clic
        } else {
          data.isOpen = false;
          const tl = gsap.timeline();
          tl.to(target, { backdropFilter: "blur(0px)", duration: 0.5 })
            .to(
              data.model.rotation,
              { y: data.initialRotation.y, duration: 0.5 },
              "<"
            )
            .to(data.camera.position, { x: 0, y: 0, z: 0.5, duration: 1 }, "<")
            .to(target, { scale: 1, duration: 1 }, "<")
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
                  if (data.action1) {
                    data.action1.reset();
                  }
                },
              },
              "<"
            );
        }
      }
      window.addEventListener("click", onCanvasClick);

      // Hover / mouvement souris
      function onCanvasMouseOver(event: MouseEvent) {
        const canvas = event.target as HTMLCanvasElement;
        const data = canvasActionMap.get(canvas);
        if (!data || !data.action1) return;
        data.initialRotation = {
          x: data.model.rotation.x,
          y: data.model.rotation.y,
          z: data.model.rotation.z,
        };
        data.action1.stop();
        data.action1.setLoop(THREE.LoopOnce);
        data.action1.clampWhenFinished = true;
        data.action1.timeScale = 1;
        data.action1.play();
      }
      function onCanvasMouseMove(event: MouseEvent) {
        const canvas = event.target as HTMLCanvasElement;
        const data = canvasActionMap.get(canvas);
        if (!data) return;
        const rect = canvas.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const factor = data.isOpen ? 1e-9 : 1e-5;
        data.model.rotation.y += dx * factor;
        data.model.rotation.x += dy * factor;
      }
      function onCanvasMouseLeave(event: MouseEvent) {
        const canvas = event.target as HTMLCanvasElement;
        const data = canvasActionMap.get(canvas);
        if (!data || !data.action1) return;
        data.action1.stop();
        data.action1.setLoop(THREE.LoopOnce);
        data.action1.clampWhenFinished = true;
        data.action1.time = data.action1.getClip().duration;
        data.action1.timeScale = -1;
        data.action1.play();
        gsap.to(data.model.rotation, {
          x: data.initialRotation.x,
          y: data.initialRotation.y,
          z: data.initialRotation.z,
          duration: 0.8,
          ease: "power2.out",
        });
      }
      window.addEventListener("mouseover", onCanvasMouseOver);
      window.addEventListener("mousemove", onCanvasMouseMove);
      window.addEventListener("mouseleave", onCanvasMouseLeave);

      // Cleanup
      return () => {
        clearTimeout(initTimeout);
        window.removeEventListener("click", onCanvasClick);
        window.removeEventListener("mouseover", onCanvasMouseOver);
        window.removeEventListener("mousemove", onCanvasMouseMove);
        window.removeEventListener("mouseleave", onCanvasMouseLeave);
      };
    }, 500);

    return () => window.clearTimeout(initTimeout);
  }, []);

  return (
    <div className={style.servicesVinyles}>
      {/** Pour chaque service on crée *un seul* div-wrapper … */}
      <div className={`${style.servicesVinylesPlace} site`}>
        {/** … et on y insère directement le loader 3D */}
        <LoadVinyles
          place=".site"
          path="/glbModels/services/DEVOK.glb"
        />
      </div>

      <div className={`${style.servicesVinylesPlace} com`}>
        <LoadVinyles
          place=".com"
          path="/glbModels/services/COMOK.glb"
        />
      </div>

      <div className={`${style.servicesVinylesPlace} da`}>
        <LoadVinyles
          place=".da"
          path="/glbModels/services/DAOK.glb"
        />
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
