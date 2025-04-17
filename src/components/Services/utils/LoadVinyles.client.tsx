"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Map partagée pour stocker les données associées à chaque canvas
export const canvasActionMap = new Map<
  HTMLCanvasElement,
  {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    model: THREE.Object3D;
    mixer: THREE.AnimationMixer;
    action: THREE.AnimationAction;
    action1?: THREE.AnimationAction;
    isOpen: boolean | 'open' | 'back';
    initialRotation?: { x: number; y: number; z: number };
  }
>();

interface LoadVinylesProps {
  /**
   * Sélecteur CSS pour le conteneur
   */
  place: string;
  /**
   * URL ou chemin vers le fichier GLTF
   */
  path: string;
}

export const LoadVinyles: React.FC<LoadVinylesProps> = ({ place, path }) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.querySelector(place) as HTMLElement;
    if (!element) {
      console.error("LoadVinyles: aucun élément trouvé pour selector", place);
      return;
    }
    containerRef.current = element;

    // Scène
    const scene = new THREE.Scene();

    // Caméra orthographique
    const width = element.clientWidth;
    const height = element.clientHeight;
    const aspect = width / height;
    const frustumSize = 0.35;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      100
    );
    camera.position.set(0, 0, 0.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    element.appendChild(renderer.domElement);

    // Lumière ambiante
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // AnimationMixer et horloge
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();
    let frameId: number;

    // Chargement GLTF
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Ajustement des textures
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat.map) {
              mat.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              mat.map.magFilter = THREE.LinearFilter;
              mat.map.minFilter = THREE.LinearMipmapLinearFilter;
              mat.map.needsUpdate = true;
            }
          }
        });

        // Centrage du modèle
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Création du mixer et des animations
        mixer = new THREE.AnimationMixer(model);
        const [clip0, clip1] = gltf.animations;
        const action0 = mixer.clipAction(clip0);
        action0.play();
        let action1: THREE.AnimationAction | undefined;
        if (clip1) {
          action1 = mixer.clipAction(clip1);
        }

        // Stockage des données dans la map
        const canvas = renderer.domElement as HTMLCanvasElement;
        canvasActionMap.set(canvas, {
          scene,
          camera,
          renderer,
          model,
          mixer,
          action: action0,
          action1,
          isOpen: false,
        });

        // Boucle d'animation
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          if (mixer) {
            const delta = clock.getDelta();
            mixer.update(delta);
          }
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("LoadVinyles: erreur de chargement GLTF", error);
      }
    );

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const a = w / h;
      renderer.setSize(w, h);
      camera.left = (-frustumSize * a) / 2;
      camera.right = (frustumSize * a) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      canvasActionMap.clear();
    };
  }, [place, path]);

  return null;
};
