'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------------------------------------
    // SCENE
    // ---------------------------------------
    const scene = new THREE.Scene();

    // ---------------------------------------
    // CAMERA
    // ---------------------------------------
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);

    // ---------------------------------------
    // RENDERER
    // ---------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // LIGHTS
    // ---------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const light1 = new THREE.PointLight(0x7c3aed, 120);
    light1.position.set(6, 6, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x3b82f6, 80);
    light2.position.set(-8, -5, 5);
    scene.add(light2);

    // ---------------------------------------
    // WEBSITE GROUP (mockup monitor)
    // ---------------------------------------
    const website = new THREE.Group();
    scene.add(website);

    // Frame monitor
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 0.25),
      new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.9,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0,
      })
    );
    website.add(frame);

    // Layar
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(7.4, 4.4),
      new THREE.MeshBasicMaterial({ color: 0x0f172a })
    );
    screen.position.z = 0.13;
    website.add(screen);

    // Header bar
    const header = new THREE.Mesh(
      new THREE.PlaneGeometry(7.4, 0.55),
      new THREE.MeshBasicMaterial({ color: 0x312e81 })
    );
    header.position.set(0, 1.92, 0.14);
    website.add(header);

    // Hero block
    const hero = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 1),
      new THREE.MeshBasicMaterial({ color: 0x4338ca })
    );
    hero.position.set(0, 0.8, 0.14);
    website.add(hero);

    // Tombol CTA
    const button = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.45),
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6 })
    );
    button.position.set(0, -0.2, 0.14);
    website.add(button);

    // Content cards
    for (let i = 0; i < 4; i++) {
      const card = new THREE.Mesh(
        new THREE.PlaneGeometry(6.2, 0.45),
        new THREE.MeshBasicMaterial({ color: 0x1e293b })
      );
      card.position.set(0, -1 + i * -0.65, 0.14);
      website.add(card);
    }

    // Logo dot
    const logo = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    logo.position.set(-3.2, 1.92, 0.15);
    website.add(logo);

    // AI scan line
    const scanLine = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.08),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
      })
    );
    scanLine.position.z = 0.16;
    website.add(scanLine);

    // Glow di belakang layar
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 7),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.12,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glow.position.z = -0.8;
    website.add(glow);

    // Stand monitor
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 1.3, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: 0x2d3748,
        metalness: 1,
        roughness: 0.25,
      })
    );
    stand.position.y = -3.2;
    website.add(stand);

    // Base monitor
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.5, 0.15, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x374151,
        metalness: 1,
        roughness: 0.25,
      })
    );
    base.position.y = -3.95;
    website.add(base);

    // ---------------------------------------
    // FLOATING PARTICLES (ambient)
    // ---------------------------------------
    const particles = new THREE.Group();
    scene.add(particles);

    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
    });

    const particleList: THREE.Mesh[] = [];

    for (let i = 0; i < 60; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.03, 8, 8),
        particleMaterial
      );

      particle.position.set(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      );

      particle.userData.speed = 0.002 + Math.random() * 0.003;
      particle.userData.offset = Math.random() * Math.PI * 2;

      particles.add(particle);
      particleList.push(particle);
    }

    // ---------------------------------------
    // GLOW RING
    // ---------------------------------------
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(5.5, 0.03, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.3,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.z = -1.5;
    scene.add(ring);

    // ---------------------------------------
    // FLYING OBJECTS (di samping monitor)
    // ---------------------------------------
    const flyingObjects = new THREE.Group();
    scene.add(flyingObjects);

    const flyingPalette = [0x6366f1, 0xa855f7, 0xec4899, 0x2dd4bf];
    const flyingMeshes: THREE.Mesh[] = [];

    // Posisi dasar tiap objek: sengaja disebar di kiri & kanan monitor
    // (monitor lebarnya ~8, jadi mulai dari x ±5 ke luar) dan macam-macam
    // ketinggian/kedalaman biar ga baris lurus.
    const flyingSpots: [number, number, number][] = [
      [-7.5, 2.2, -1],
      [-6.5, -1.8, 1.5],
      [-8, -3.5, -2],
      [7.5, 2.5, -1.5],
      [6.8, -1.5, 1],
      [8.2, -3.2, -1],
      [-5.5, 4, 0.5],
      [5.8, 4.2, -0.5],
    ];

    flyingSpots.forEach(([x, y, z], i) => {
      const geometry =
        i % 3 === 0
          ? new THREE.IcosahedronGeometry(0.35 + Math.random() * 0.2, 0)
          : i % 3 === 1
          ? new THREE.OctahedronGeometry(0.3 + Math.random() * 0.15, 0)
          : new THREE.TorusGeometry(0.28, 0.09, 8, 24);

      const material = new THREE.MeshBasicMaterial({
        color: flyingPalette[i % flyingPalette.length],
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const basePosition = new THREE.Vector3(x, y, z);
      mesh.position.copy(basePosition);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData.basePosition = basePosition;
      mesh.userData.floatSpeed = 0.6 + Math.random() * 0.6;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatAmplitude = 0.3 + Math.random() * 0.2;
      mesh.userData.spinSpeed = 0.3 + Math.random() * 0.5;

      flyingObjects.add(mesh);
      flyingMeshes.push(mesh);
    });

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
    // CLOCK + ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Monitor melayang + miring mengikuti mouse
      website.position.y = Math.sin(t * 1.2) * 0.25;
      website.rotation.y += (mouseX * 0.4 - website.rotation.y) * 0.05;
      website.rotation.x += (-mouseY * 0.25 - website.rotation.x) * 0.05;
      website.rotation.z = Math.sin(t * 0.8) * 0.02;

      // Glow di belakang layar berdenyut pelan
      (glow.material as THREE.MeshBasicMaterial).opacity =
        0.08 + Math.sin(t * 2) * 0.03;

      // Scan line AI menyapu turun lalu looping dari atas lagi
      scanLine.position.y = 2 - ((t * 1.5) % 4);

      // Warna layar "bernapas" pelan
      (screen.material as THREE.MeshBasicMaterial).color.setHSL(
        0.63,
        0.45,
        0.12 + Math.sin(t * 2) * 0.02
      );

      // Ring cahaya berputar pelan
      ring.rotation.z += 0.003;

      // Objek terbang di samping monitor: melayang naik-turun + berputar,
      // sedikit ikut parallax mouse biar terasa hidup di ruang 3D
      flyingMeshes.forEach((mesh) => {
        mesh.position.y =
          mesh.userData.basePosition.y +
          Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) *
            mesh.userData.floatAmplitude;
        mesh.position.x =
          mesh.userData.basePosition.x + mouseX * 0.3;

        mesh.rotation.x += mesh.userData.spinSpeed * 0.01;
        mesh.rotation.y += mesh.userData.spinSpeed * 0.015;
      });

      // Partikel melayang naik, looping balik ke bawah
      particleList.forEach((p) => {
        p.position.y += p.userData.speed;
        if (p.position.y > 6) {
          p.position.y = -6;
        }
      });

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

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
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
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
