"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import style from "@/app/styles/components/Services.module.scss";
import { MadeSoulmaze, LesMauvaises } from "@/utils/fonts";

gsap.registerPlugin(Draggable);

export function ServicesPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const place = containerRef.current;
    if (!place) return;

    // --- Scène, caméra, renderer ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      place.clientWidth / place.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.3, 0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(place.clientWidth, place.clientHeight);
    place.appendChild(renderer.domElement);

    // Lumières
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(0, 5, 0);
    scene.add(dirLight);

    const loader = new GLTFLoader();
    let model1: THREE.Object3D, model2: THREE.Object3D;

    // Fonctions
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    function makeModelDraggable() {
      let lastMouseX = 0;
      Draggable.create(renderer.domElement, {
        type: "x",
        bounds: place,
        onPress(event) {
          lastMouseX = event.clientX;
        },
        onDrag(event) {
          const deltaX = (event.clientX - lastMouseX) * 0.0015;
          model1.rotation.y += deltaX;
          lastMouseX = event.clientX;

          // Si on bascule au-delà de -0.45rad
          if (model1.rotation.y <= -0.45) {
            model1.rotation.y = -0.45;
            // Démarrage de l'animation de model2
            let elapsed = 0;
            const interval = setInterval(() => {
              if (elapsed >= 4000) {
                clearInterval(interval);
                window.location.href = "/contact/";
              } else {
                model2.rotation.y += 0.001;
                elapsed += 16;
              }
            }, 16);
          }
        },
      });
    }

    // Chargement séquentiel des deux modèles
    loader.load(
      "/glbModels/services/recordplayerLonger.glb",
      (gltf) => {
        model1 = gltf.scene;
        model1.position.set(0.15, 0, -0.15);
        scene.add(model1);

        loader.load(
          "/glbModels/services/diskBasDePage.glb",
          (gltf2) => {
            model2 = gltf2.scene;
            model2.scale.set(1.25, 1.25, 1.25);
            model2.position.set(-0.05, 0, 0.02);
            scene.add(model2);

            animate();
            makeModelDraggable();
          },
          undefined,
          (err) => console.error("Erreur 2e modèle : ", err)
        );
      },
      undefined,
      (err) => console.error("Erreur 1er modèle : ", err)
    );

    // Cleanup au démontage
    return () => {
      renderer.dispose();
      place.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className={style.servicesPlayerContainer}>
      <div className={style.playerContainerText}>
        <div className={`${style.playerContainerTitle} ${MadeSoulmaze.className}`}>
          <p>et si on</p>
          <p>écrivait</p>
          <p>ensemble</p>
        </div>
        <div className={`${style.playerContainerSubTitle} ${LesMauvaises.className}`}>
          <p>le titre</p>
          <p>qui te correspond</p>
        </div>
      </div>

      <div ref={containerRef} className={style.playerContainerModel}>
        {/** le <canvas> Three.js sera injecté ici automatiquement **/}
      </div>
    </section>
  );
}
