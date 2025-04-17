"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
import { gsap } from "gsap";
import style from "@/app/styles/components/Homepage.module.scss";

export function HomeRestaurant() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const flashScreen = document.createElement("div");
    flashScreen.classList.add("flash-screen");
    container.appendChild(flashScreen);

    // const currentColorIndex = localStorage.getItem("currentColorIndex");
    // const currentColor =
    //   currentColorIndex !== null
    //     ? (window as any).prepareAnimationHandler.colors[currentColorIndex]
    //     : "#ffffff";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.offsetWidth / container.offsetHeight,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environment = new RoomEnvironment(pmremGenerator);
    scene.environment = pmremGenerator.fromScene(environment).texture;

    const loader = new GLTFLoader();
    loader.load(
      "/glbModels/home/building4.glb",
      (gltf: any) => {
        const model = gltf.scene;
        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.scale.set(1, 1, 1);

        model.position.x -= 1.75;

        const door = model.getObjectByName("door");
        if (door) {
          door.rotation.z = Math.PI;

          const openDoor = () => {
            gsap.to(door.rotation, {
              z: Math.PI / 2.5,
              duration: 1.6,
              ease: "back.out",
            });
            gsap.to(camera.position, {
              z: camera.position.z - 9,
              duration: 1.5,
              ease: "back.in",
              onUpdate: () => {
                gsap.to(flashScreen, {
                  opacity: 1,
                  backgroundColor: currentColor,
                  delay: 1.2,
                  duration: 0.15,
                });
              },
              onComplete: () => {
                setTimeout(() => {
                  window.location.href = "/realisations";
                }, 500);
              },
            });
            gsap.to(camera.position, {
              y: -6,
              duration: 1.2,
              ease: "back.inOut",
            });
            gsap.to(camera.rotation, {
              x: Math.PI / 30,
              duration: 1.6,
              ease: "back.in",
            });
          };

          const closeDoor = () => {
            gsap.to(door.rotation, {
              z: Math.PI,
              duration: 1,
              ease: "power4.inOut",
            });
          };

          const clickHandler = () => {
            if (door.rotation.z === Math.PI) {
              openDoor();
            } else {
              closeDoor();
            }
          };

          container.addEventListener("click", clickHandler);

          container["clickHandler"] = clickHandler;
        } else {
          console.warn("Objet 'door' non trouvé dans le modèle !");
        }
      },
      undefined,
      (error) => {
        console.error("Erreur lors du chargement du modèle :", error);
      }
    );

    camera.position.y = -5;
    camera.position.z = 11.5;
    camera.rotation.x = Math.PI / 18;

    const handleResize = () => {
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container["clickHandler"]) {
        container.removeEventListener("click", container["clickHandler"]);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      pmremGenerator.dispose();
    };
  }, []);

  return (
    <div className={`${style.HomeRestaurant} navStop`}>
      <div
        className={`${style.canvaContainer}`}
        ref={containerRef}
        style={{ position: "relative", width: "100%", height: "100%" }}
      ></div>
    </div>
  );
}

export default HomeRestaurant;
