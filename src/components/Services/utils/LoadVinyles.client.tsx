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
  /** Sélecteur CSS pour le conteneur */
  place: string;
  /** URL ou chemin vers le fichier GLTF */
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

    // Caméra perspective
    const width = element.clientWidth;
    const height = element.clientHeight;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio * 2);
    renderer.setSize(width, height);
    element.appendChild(renderer.domElement);

    // Lumières
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();
    let frameId: number;

    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Ajuste textures
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat.map) {
              mat.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
              mat.map.needsUpdate = true;
            }
            mat.needsUpdate = true;
          }
        });

        // Centrage et mise à l'échelle
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);

        // Ajustement automatique de la caméra
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        // Placement sans zoom supplémentaire
        camera.position.set(0, 0, cameraZ * 0.8);
        camera.lookAt(0, 0, 0);

        // Mixer et animations
        mixer = new THREE.AnimationMixer(model);
        const [clip0, clip1] = gltf.animations;
        const action0 = mixer.clipAction(clip0);
        let action1: THREE.AnimationAction | undefined;
        
        if (clip1) action1 = mixer.clipAction(clip1);

        // Stockage
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

        // Boucle animation
        const animate = () => {
          frameId = requestAnimationFrame(animate);
          if (mixer) mixer.update(clock.getDelta());
          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => console.error("Erreur GLTF : ", error)
    );

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      canvasActionMap.clear();
    };
  }, [place, path]);

  return null;
};
