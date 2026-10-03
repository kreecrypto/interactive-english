"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { LessonScene } from "@/lib/lessons";

type Props = {
  sceneType: LessonScene;
  words: string[];
  activeIndex: number;
  onPick: (index: number) => void;
};

const colorPalette = [0xef4444, 0x3b82f6, 0xeab308, 0x22c55e, 0xa855f7];

function geometryFor(sceneType: LessonScene, index: number): THREE.BufferGeometry {
  if (sceneType === "colors") {
    return new THREE.SphereGeometry(0.58, 28, 20);
  }

  if (sceneType === "animals") {
    const options: THREE.BufferGeometry[] = [
      new THREE.SphereGeometry(0.62, 28, 20),
      new THREE.BoxGeometry(1.05, 0.8, 0.8),
      new THREE.ConeGeometry(0.62, 1.15, 20),
      new THREE.TorusGeometry(0.5, 0.2, 14, 28),
      new THREE.CapsuleGeometry(0.4, 0.65, 6, 14)
    ];
    return options[index % options.length];
  }

  const options: THREE.BufferGeometry[] = [
    new THREE.SphereGeometry(0.62, 28, 20),
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.ConeGeometry(0.65, 1.2, 24),
    new THREE.OctahedronGeometry(0.72)
  ];
  return options[index % options.length];
}

export function ThreeLessonScene({ sceneType, words, activeIndex, onPick }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      host.textContent = "อุปกรณ์นี้ไม่รองรับ WebGL แต่ยังเรียนคำศัพท์และฟังเสียงได้";
      host.classList.add("scene-fallback");
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f8fc);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 2.2, 7);
    camera.lookAt(0, 0, 0);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-canvas";
    host.replaceChildren(renderer.domElement);

    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x94a3b8, 2.4);
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(3.25, 3.25, 0.18, 64),
      new THREE.MeshStandardMaterial({ color: 0xe5e7eb, roughness: 0.9 })
    );
    platform.position.y = -1.05;
    scene.add(platform);

    const group = new THREE.Group();
    scene.add(group);

    const pickable: THREE.Mesh[] = [];

    words.forEach((word, index) => {
      const count = Math.max(words.length, 1);
      const angle = (index / count) * Math.PI * 2;
      const material = new THREE.MeshStandardMaterial({
        color: colorPalette[index % colorPalette.length],
        roughness: 0.55,
        metalness: 0.04,
        emissive: index === activeIndex ? 0x202020 : 0x000000
      });

      const mesh = new THREE.Mesh(geometryFor(sceneType, index), material);
      mesh.position.set(
        Math.cos(angle) * 2.1,
        Math.sin(angle * 0.7) * 0.32,
        Math.sin(angle) * 1.45
      );
      mesh.userData.index = index;
      mesh.userData.word = word;
      pickable.push(mesh);
      group.add(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.abs(dx) + Math.abs(dy) > 3) moved = true;

      group.rotation.y += dx * 0.008;
      group.rotation.x = THREE.MathUtils.clamp(group.rotation.x + dy * 0.004, -0.35, 0.35);
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      if (moved) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hit = raycaster.intersectObjects(pickable, false)[0];
      if (hit) onPick(Number(hit.object.userData.index));
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    let animationFrame = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const render = () => {
      animationFrame = window.requestAnimationFrame(render);
      if (!dragging && !reducedMotion.matches) group.rotation.y += 0.0015;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);

      group.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      platform.geometry.dispose();
      (platform.material as THREE.Material).dispose();
      renderer.dispose();
      host.replaceChildren();
    };
  }, [sceneType, words, activeIndex, onPick]);

  return <div ref={hostRef} className="three-stage" aria-label="Interactive 3D learning scene" />;
}
