'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function ThreeBackground({ contained = false }: { contained?: boolean }) {
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
    // SCENE & CAMERA
    // ---------------------------------------
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    // Posisi awal kamera
    const initialCameraPos = isMobile ? new THREE.Vector3(0, 1, 18) : new THREE.Vector3(0, 0, 14);
    camera.position.copy(initialCameraPos);

    // ---------------------------------------
    // RENDERER
    // ---------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Tone mapping disesuaikan agar warna hitam lebih pekat (tidak milky)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95; 
    
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // ENVIRONMENT
    // ---------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // ---------------------------------------
    // LIGHTS (Diton-down agar tidak terlalu terang)
    // ---------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const light1 = new THREE.PointLight(0x7c3aed, 150, 25);
    light1.position.set(6, 6, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x3b82f6, 100, 25);
    light2.position.set(-8, -5, 5);
    scene.add(light2);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.3);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);

    // ---------------------------------------
    // WEBSITE GROUP (Mockup Monitor)
    // ---------------------------------------
    const website = new THREE.Group();
    scene.add(website);

    if (isMobile) {
      website.scale.set(0.65, 0.65, 0.65);
      website.position.y = 1.2;
    }

    // Material Kaca Modern (Glassmorphism) - Lebih transparan
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.95,
      thickness: 0.5,
      transparent: true,
      opacity: 0.4, // Dikurangi agar tidak menutupi konten
      side: THREE.DoubleSide,
    });

    // Material Layar OLED Gelap (Matte, tidak memantulkan cahaya berlebihan)
    const screenBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x020205, // Lebih gelap
      roughness: 0.8,  // Lebih matte (tidak mengkilap)
      metalness: 0.2,
    });

    // Frame monitor
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(8, 5, 0.25),
      new THREE.MeshPhysicalMaterial({
        color: 0x111827,
        metalness: 0.8,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
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

    // Hero block (Dihapus emissive agar tidak glowing)
    const hero = new THREE.Mesh(
      new THREE.PlaneGeometry(6.2, 1),
      new THREE.MeshStandardMaterial({ 
        color: 0x4338ca,
        roughness: 0.6,
        metalness: 0.1
      })
    );
    hero.position.set(0, 0.8, 0.14);
    website.add(hero);

    // Tombol CTA (Dihapus emissive agar tidak glowing)
    const button = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 0.45),
      new THREE.MeshStandardMaterial({ 
        color: 0x8b5cf6,
        roughness: 0.4,
        metalness: 0.2
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
      
      // Garis aksen (dibuat lebih subtle)
      const accent = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 0.25),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
      );
      accent.position.set(-2.8, cardStartY + i * -cardSpacing, 0.15);
      website.add(accent);
    }

    // Logo dot
    const logo = new THREE.Mesh(
      new THREE.CircleGeometry(0.12, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 })
    );
    logo.position.set(-3.3, 1.9, 0.15);
    website.add(logo);

    // Scan line (Dibuat sangat subtle agar tidak mengganggu baca)
    const scanLine = new THREE.Mesh(
      new THREE.PlaneGeometry(7.2, 0.04),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.15, // Sangat rendah
        blending: THREE.AdditiveBlending,
      })
    );
    scanLine.position.z = 0.16;
    website.add(scanLine);

    // Stand monitor
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 1.2, 0.2),
      new THREE.MeshPhysicalMaterial({
        color: 0x2d3748,
        metalness: 0.8,
        roughness: 0.4,
      })
    );
    stand.position.y = -3.1;
    website.add(stand);

    // Base monitor
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.2, 0.12, 64),
      new THREE.MeshPhysicalMaterial({
        color: 0x374151,
        metalness: 0.8,
        roughness: 0.4,
      })
    );
    base.position.y = -3.75;
    website.add(base);

    // ---------------------------------------
    // FLOATING PARTICLES (Dengan drift horizontal)
    // ---------------------------------------
    const particles = new THREE.Group();
    scene.add(particles);

    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
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

      particle.userData.speedY = 0.002 + Math.random() * 0.004;
      particle.userData.speedX = (Math.random() - 0.5) * 0.002; // Drift horizontal
      particle.userData.offset = Math.random() * Math.PI * 2;
      particle.userData.twinkleSpeed = 1 + Math.random() * 2;

      particles.add(particle);
      particleList.push(particle);
    }

    // ---------------------------------------
    // GLOW RING (Dibuat lebih subtle)
    // ---------------------------------------
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.02, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
        transparent: true,
        opacity: 0.1, // Dikurangi
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
        roughness: 0.4,
        metalness: 0.6,
        wireframe: true,
        transparent: true,
        opacity: 0.5, // Dikurangi agar tidak terlalu ramai
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
    // MOUSE PARALLAX & STATE
    // ---------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalisasi nilai antara -1 dan 1
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
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ---------------------------------------
    // CLOCK + ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      if (isPaused) {
        frameId = requestAnimationFrame(animate);
        return;
      }
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // 1. Animasi Mengambang yang Lebih Organik (Kombinasi Sin & Cos)
      const floatY = Math.sin(t * 0.8) * 0.15 + Math.cos(t * 1.2) * 0.05;
      website.position.y = (isMobile ? 1.2 : 0) + floatY;
      
      // 2. Smooth Parallax menggunakan Lerp (Linear Interpolation)
      const targetRotationY = mouseX * 0.25; // Dikurangi sedikit agar tidak terlalu ekstrem
      const targetRotationX = -mouseY * 0.15;
      
      website.rotation.y = THREE.MathUtils.lerp(website.rotation.y, targetRotationY, 0.03);
      website.rotation.x = THREE.MathUtils.lerp(website.rotation.x, targetRotationX, 0.03);
      website.rotation.z = THREE.MathUtils.lerp(website.rotation.z, Math.sin(t * 0.5) * 0.01, 0.05);

      // 3. Camera Parallax (Memberikan efek kedalaman yang premium)
      const targetCamX = mouseX * 0.3;
      const targetCamY = -mouseY * 0.3 + (isMobile ? 1 : 0);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.02);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.02);
      camera.lookAt(0, 0, 0);

      // 4. Scan line yang sangat subtle
      const scanY = 2.2 - ((t * 0.8) % 4.4); // Gerakan lebih lambat
      scanLine.position.y = scanY;
      
      // Fade in/out di ujung layar
      const opacity = scanY < -1.5 ? Math.max(0, (scanY + 2.2) / 0.7) : 0.15;
      (scanLine.material as THREE.MeshBasicMaterial).opacity = opacity;

      // 5. Ring rotation
      ring.rotation.z += 0.001;
      ring.rotation.x = (Math.PI / 2) + Math.sin(t * 0.3) * 0.05;

      // 6. Flying objects dengan gerakan yang lebih smooth
      flyingMeshes.forEach((mesh) => {
        mesh.position.y =
          mesh.userData.basePosition.y +
          Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) *
            mesh.userData.floatAmplitude;
        
        // Parallax ringan pada objek terbang
        mesh.position.x = mesh.userData.basePosition.x + mouseX * 0.3;
        mesh.position.z = mesh.userData.basePosition.z + mouseY * 0.2;

        mesh.rotation.x += mesh.userData.spinSpeed * 0.005;
        mesh.rotation.y += mesh.userData.spinSpeed * 0.008;
      });

      // 7. Particles dengan drift horizontal
      particleList.forEach((p) => {
        p.position.y += p.userData.speedY;
        p.position.x += p.userData.speedX; // Menambahkan gerakan menyamping
        
        // Reset posisi jika keluar batas
        if (p.position.y > 7) {
          p.position.y = -7;
          p.position.x = (Math.random() - 0.5) * 20;
        }
        if (Math.abs(p.position.x) > 12) {
          p.position.x = (Math.random() - 0.5) * 20;
        }

        (p.material as THREE.MeshBasicMaterial).opacity = 
          0.2 + Math.sin(t * p.userData.twinkleSpeed + p.userData.offset) * 0.2;
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
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={contained ? 'absolute inset-0 pointer-events-none' : 'fixed inset-0 -z-10 pointer-events-none'}
      aria-hidden="true"
    />
  );
}
