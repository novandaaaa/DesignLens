'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Background 3D ambient khusus objek terbang (tanpa monitor mockup).
 * Cocok dipakai di halaman yang lebih ringan seperti login/register,
 * di mana yang ingin ditonjolkan cuma atmosfer melayang-nya saja.
 */
export default function ThreeFloatingObjects() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // ---------------------------------------
    // SCENE, CAMERA, RENDERER
    // ---------------------------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // FLYING OBJECTS
    // ---------------------------------------
    const palette = [0x6366f1, 0xa855f7, 0xec4899, 0x2dd4bf];
    const group = new THREE.Group();
    scene.add(group);

    const shapeCount = 14;
    const meshes: THREE.Mesh[] = [];
    const minDistance = 3.5;

    // Hitung area yang benar-benar terlihat kamera pada tiap kedalaman,
    // supaya objek menyebar sampai ke pojok layar, bukan cuma di tengah.
    const vFov = (camera.fov * Math.PI) / 180;
    const aspect = container.clientWidth / container.clientHeight;

    const getSpreadPosition = (): THREE.Vector3 => {
      let attempts = 0;
      let candidate: THREE.Vector3;

      do {
        const z = (Math.random() - 0.5) * 10;
        const distanceFromCamera = camera.position.z - z;
        const visibleHeight = 2 * distanceFromCamera * Math.tan(vFov / 2);
        const visibleWidth = visibleHeight * aspect;
        const coverage = 1.15;

        candidate = new THREE.Vector3(
          (Math.random() - 0.5) * visibleWidth * coverage,
          (Math.random() - 0.5) * visibleHeight * coverage,
          z
        );
        attempts++;
      } while (
        attempts < 20 &&
        meshes.some((m) => m.userData.basePosition.distanceTo(candidate) < minDistance)
      );

      return candidate;
    };

    for (let i = 0; i < shapeCount; i++) {
      const geometry =
        i % 3 === 0
          ? new THREE.IcosahedronGeometry(0.5 + Math.random() * 0.35, 0)
          : i % 3 === 1
          ? new THREE.OctahedronGeometry(0.45 + Math.random() * 0.3, 0)
          : new THREE.TorusGeometry(0.4, 0.13, 8, 24);

      const material = new THREE.MeshBasicMaterial({
        color: palette[i % palette.length],
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const basePosition = getSpreadPosition();
      mesh.position.copy(basePosition);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData.basePosition = basePosition;
      mesh.userData.spinSpeed = 0.4 + Math.random() * 0.6;
      mesh.userData.floatSpeed = 0.8 + Math.random() * 0.8;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatAmplitude = 0.4 + Math.random() * 0.3;

      meshes.push(mesh);
      group.add(mesh);
    }

    // ---------------------------------------
    // MOUSE PARALLAX
    // ---------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ---------------------------------------
    // RESIZE
    // ---------------------------------------
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ---------------------------------------
    // ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      meshes.forEach((mesh) => {
        if (!prefersReducedMotion) {
          mesh.rotation.x += mesh.userData.spinSpeed * 0.015;
          mesh.rotation.y += mesh.userData.spinSpeed * 0.02;

          mesh.position.y =
            mesh.userData.basePosition.y +
            Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) *
              mesh.userData.floatAmplitude;
        }
      });

      group.rotation.y += (mouseX * 0.25 - group.rotation.y) * 0.06;
      group.rotation.x += (mouseY * 0.12 - group.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };
    animate();

    // ---------------------------------------
    // CLEANUP
    // ---------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      meshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
