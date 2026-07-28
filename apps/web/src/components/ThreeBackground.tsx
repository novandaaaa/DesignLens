'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------------------------------------
    // MOTION / DEVICE PREFERENCES
    // ---------------------------------------
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion) return;

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
    if (isMobile) {
  camera.position.set(0, 1, 18);
} else {
  camera.position.set(0, 0, 14);
}

    // ---------------------------------------
    // RENDERER (Dipindah ke atas sebelum environment)
    // ---------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Modern touch: Tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // ENVIRONMENT (Setelah renderer dibuat)
    // ---------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // ---------------------------------------
    // LIGHTS
    // ---------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const light1 = new THREE.PointLight(0x7c3aed, 200, 20);
    light1.position.set(6, 6, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x3b82f6, 150, 20);
    light2.position.set(-8, -5, 5);
    scene.add(light2);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    // ---------------------------------------
    // WEBSITE GROUP (Mockup Monitor Premium)
    // ---------------------------------------
    const website = new THREE.Group();
    scene.add(website);

    if (isMobile) {
  website.scale.set(0.65, 0.65, 0.65);
  website.position.y = 1.2;
} else {
  website.scale.set(1, 1, 1);
}

    // Material Kaca Modern (Glassmorphism)
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.9,
      thickness: 0.5,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
    });

    // Material Layar OLED Gelap
    const screenBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x050510,
      roughness: 0.2,
      metalness: 0.8,
    });

    // Frame monitor
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 0.25),
      new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    website.add(frame);

    // Layar Dasar
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(7.4, 4.4),
      screenBaseMaterial
    );
    screen.position.z = 0.13;
    website.add(screen);

    // Header bar
    const header = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.5),
      glassMaterial
    );
    header.position.set(0, 1.9, 0.14);
    website.add(header);

    // Hero block
    const hero = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 1),
      new THREE.MeshStandardMaterial({ 
        color: 0x4338ca,
        emissive: 0x4338ca,
        emissiveIntensity: 0.4,
        roughness: 0.4
      })
    );
    hero.position.set(0, 0.8, 0.14);
    website.add(hero);

    // Tombol CTA
    const button = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.45),
      new THREE.MeshStandardMaterial({ 
        color: 0x8b5cf6,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.6,
        roughness: 0.3
      })
    );
    button.position.set(0, -0.2, 0.14);
    website.add(button);

    // Content cards
    const cardCount = 3;
    const cardSpacing = 0.55;
    const cardStartY = -0.8;
    for (let i = 0; i < cardCount; i++) {
      const card = new THREE.Mesh(
        new THREE.PlaneGeometry(6.2, 0.45),
        glassMaterial
      );
      card.position.set(0, cardStartY + i * -cardSpacing, 0.14);
      website.add(card);
      
      // Garis aksen
      const accent = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 0.25),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
      );
      accent.position.set(-2.8, cardStartY + i * -cardSpacing, 0.15);
      website.add(accent);
    }

    // Logo dot
    const logo = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    logo.position.set(-3.3, 1.9, 0.15);
    website.add(logo);

    // AI scan line
    const scanLine = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.06),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      })
    );
    scanLine.position.z = 0.16;
    website.add(scanLine);
    
    // Scan line trail
    const scanTrail = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.4),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
      })
    );
    scanTrail.position.z = 0.15;
    website.add(scanTrail);

    // Glow di belakang layar
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 6),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glow.position.z = -0.5;
    website.add(glow);

    // Stand monitor
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 1.2, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: 0x2d3748,
        metalness: 0.9,
        roughness: 0.3,
      })
    );
    stand.position.y = -3.1;
    website.add(stand);

    // Base monitor
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.2, 0.12, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x374151,
        metalness: 0.9,
        roughness: 0.3,
      })
    );
    base.position.y = -3.75;
    website.add(base);

    // ---------------------------------------
    // FLOATING PARTICLES
    // ---------------------------------------
    const particles = new THREE.Group();
    scene.add(particles);

    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particleCount = isMobile ? 30 : 80;
    const particleList: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.02 + Math.random() * 0.03, 8, 8),
        particleMaterial
      );

      particle.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10
      );

      particle.userData.speed = 0.003 + Math.random() * 0.005;
      particle.userData.offset = Math.random() * Math.PI * 2;
      particle.userData.twinkleSpeed = 1 + Math.random() * 2;

      particles.add(particle);
      particleList.push(particle);
    }

    // ---------------------------------------
    // GLOW RING
    // ---------------------------------------
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.z = -2;
    scene.add(ring);

    // ---------------------------------------
    // FLYING OBJECTS
    // ---------------------------------------
    const flyingObjects = new THREE.Group();
    scene.add(flyingObjects);

    const flyingPalette = [0x6366f1, 0xa855f7, 0xec4899, 0x2dd4bf];
    const flyingMeshes: THREE.Mesh[] = [];

    const flyingSpots: [number, number, number][] = isMobile
      ? []
      : [
          [-7.5, 2.2, -1], [-6.5, -1.8, 1.5], [-8, -3.5, -2],
          [7.5, 2.5, -1.5], [6.8, -1.5, 1], [8.2, -3.2, -1],
          [-5.5, 4, 0.5], [5.8, 4.2, -0.5],
        ];

    flyingSpots.forEach(([x, y, z], i) => {
      const geometry =
        i % 3 === 0
          ? new THREE.IcosahedronGeometry(0.3 + Math.random() * 0.15, 0)
          : i % 3 === 1
          ? new THREE.OctahedronGeometry(0.25 + Math.random() * 0.1, 0)
          : new THREE.TorusGeometry(0.25, 0.08, 8, 24);

      const material = new THREE.MeshStandardMaterial({
        color: flyingPalette[i % flyingPalette.length],
        emissive: flyingPalette[i % flyingPalette.length],
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const basePosition = new THREE.Vector3(x, y, z);
      mesh.position.copy(basePosition);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData.basePosition = basePosition;
      mesh.userData.floatSpeed = 0.5 + Math.random() * 0.5;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatAmplitude = 0.2 + Math.random() * 0.3;
      mesh.userData.spinSpeed = 0.5 + Math.random() * 0.5;

      flyingObjects.add(mesh);
      flyingMeshes.push(mesh);
    });

    // ---------------------------------------
    // MOUSE PARALLAX
    // ---------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

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
    // VISIBILITY
    // ---------------------------------------
    let isPaused = false;
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        clock.getDelta();
        frameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ---------------------------------------
    // CLOCK + ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      if (isPaused) return;
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Monitor melayang + smooth lerp
      website.position.y = Math.sin(t * 1.0) * 0.2;
      
      targetRotationY = mouseX * 0.3;
      targetRotationX = -mouseY * 0.2;
      
      website.rotation.y += (targetRotationY - website.rotation.y) * 0.05;
      website.rotation.x += (targetRotationX - website.rotation.x) * 0.05;
      website.rotation.z = Math.sin(t * 0.8) * 0.015;

      // Glow berdenyut
      (glow.material as THREE.MeshBasicMaterial).opacity = 0.12 + Math.sin(t * 1.5) * 0.05;

      // Scan line
      const scanY = 2.2 - ((t * 1.2) % 4.4);
      scanLine.position.y = scanY;
      scanTrail.position.y = scanY + 0.15;
      
      const opacity = scanY < -1.5 ? Math.max(0, (scanY + 2.2) / 0.7) : 0.9;
      (scanLine.material as THREE.MeshBasicMaterial).opacity = opacity;
      (scanTrail.material as THREE.MeshBasicMaterial).opacity = opacity * 0.2;

      // Ring
      ring.rotation.z += 0.002;
      ring.rotation.x = (Math.PI / 2) + Math.sin(t * 0.5) * 0.1;

      // Flying objects
      flyingMeshes.forEach((mesh) => {
        mesh.position.y =
          mesh.userData.basePosition.y +
          Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) *
            mesh.userData.floatAmplitude;
        
        mesh.position.x = mesh.userData.basePosition.x + mouseX * 0.5;
        mesh.position.z = mesh.userData.basePosition.z + mouseY * 0.3;

        mesh.rotation.x += mesh.userData.spinSpeed * 0.01;
        mesh.rotation.y += mesh.userData.spinSpeed * 0.015;
      });

      // Particles
      particleList.forEach((p) => {
        p.position.y += p.userData.speed;
        if (p.position.y > 7) {
          p.position.y = -7;
          p.position.x = (Math.random() - 0.5) * 20;
        }
        (p.material as THREE.MeshBasicMaterial).opacity = 
          0.3 + Math.sin(t * p.userData.twinkleSpeed + p.userData.offset) * 0.3;
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);

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

      pmremGenerator.dispose();
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