'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
    camera.position.set(0, 0, 14);

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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // ENVIRONMENT
    // ---------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // ---------------------------------------
    // LIGHTS
    // ---------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const light1 = new THREE.PointLight(0x7c3aed, 250, 25);
    light1.position.set(8, 8, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x06b6d4, 200, 25);
    light2.position.set(-8, -6, 6);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xec4899, 150, 20);
    light3.position.set(0, -8, 4);
    scene.add(light3);

    // ---------------------------------------
    // HOLOGRAPHIC CORE GROUP
    // ---------------------------------------
    const holographicCore = new THREE.Group();
    scene.add(holographicCore);

    // Material kaca modern
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.95,
      thickness: 0.8,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });

    // === CENTRAL CORE (Icosahedron dengan wireframe) ===
    const coreGeometry = new THREE.IcosahedronGeometry(1.8, 1);
    const core = new THREE.Mesh(coreGeometry, glassMaterial);
    holographicCore.add(core);

    const coreWireframe = new THREE.Mesh(coreGeometry, wireframeMaterial);
    coreWireframe.scale.setScalar(1.02);
    holographicCore.add(coreWireframe);

    // === INNER ENERGY SPHERE ===
    const innerSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 32, 32),
      new THREE.MeshStandardMaterial({
        color: 0x7c3aed,
        emissive: 0x7c3aed,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.6,
        toneMapped: false,
      })
    );
    holographicCore.add(innerSphere);

    // === ORBITAL RINGS ===
    const ringColors = [0x8b5cf6, 0x06b6d4, 0xec4899];
    const rings: THREE.Mesh[] = [];

    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(2.8 + i * 0.4, 0.03, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: ringColors[i],
        emissive: ringColors[i],
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.7,
        toneMapped: false,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + i * 0.4;
      ring.rotation.y = i * 0.5;
      holographicCore.add(ring);
      rings.push(ring);
    }

    // === FLOATING GLASS PANELS (dengan type yang benar) ===
    const panelGroup = new THREE.Group();
    holographicCore.add(panelGroup);

    type PanelData = {
      pos: [number, number, number];
      rot: [number, number, number];
      size: [number, number, number];
    };

    const panelPositions: PanelData[] = [
      { pos: [3.5, 1.5, 0], rot: [0, -0.3, 0], size: [2.2, 1.2, 0.1] },
      { pos: [-3.2, -1, 0.5], rot: [0, 0.4, 0], size: [2, 1, 0.1] },
      { pos: [0, 3.5, -0.5], rot: [-0.3, 0, 0], size: [2.5, 0.9, 0.1] },
      { pos: [0, -3.2, 0.8], rot: [0.25, 0, 0], size: [2.3, 0.8, 0.1] },
    ];

    panelPositions.forEach((panelData) => {
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(...panelData.size),
        glassMaterial
      );
      panel.position.set(...panelData.pos);
      panel.rotation.set(...panelData.rot);
      panelGroup.add(panel);

      // Glowing edge untuk setiap panel
      const edgeGeometry = new THREE.EdgesGeometry(
        new THREE.BoxGeometry(...panelData.size)
      );
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.6,
      });
      const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
      edges.position.set(...panelData.pos);
      edges.rotation.set(...panelData.rot);
      panelGroup.add(edges);
    });

    // === FLOATING PARTICLES AROUND CORE ===
    const particleCount = isMobile ? 40 : 80;
    const particles = new THREE.Group();
    holographicCore.add(particles);

    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    type ParticleData = {
      mesh: THREE.Mesh;
      orbitRadius: number;
      orbitSpeed: number;
      angle: number;
    };

    const particleData: ParticleData[] = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 8, 8),
        particleMaterial
      );

      const orbitRadius = 3 + Math.random() * 3;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 6;

      particle.position.set(
        Math.cos(angle) * orbitRadius,
        y,
        Math.sin(angle) * orbitRadius
      );

      particles.add(particle);
      particleData.push({
        mesh: particle,
        orbitRadius,
        orbitSpeed: 0.3 + Math.random() * 0.5,
        angle,
      });
    }

    // === ENERGY BEAMS ===
    const beamCount = 6;
    const beams: THREE.Mesh[] = [];

    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2;
      const beamHeight = 6 + Math.random() * 2;
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, beamHeight, 8),
        new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
        })
      );
      beam.position.set(
        Math.cos(angle) * 4.5,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * 4.5
      );
      holographicCore.add(beam);
      beams.push(beam);
    }

    // === GLOW EFFECT DI BELAKANG ===
    const glowGeometry = new THREE.SphereGeometry(5, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    holographicCore.add(glowSphere);

    // ---------------------------------------
    // FLOATING OBJECTS (di sekeliling core)
    // ---------------------------------------
    const flyingObjects = new THREE.Group();
    scene.add(flyingObjects);

    const flyingPalette = [0x6366f1, 0xa855f7, 0xec4899, 0x2dd4bf, 0xfbbf24];
    const flyingMeshes: THREE.Mesh[] = [];

    const flyingSpots: [number, number, number][] = isMobile
      ? []
      : [
          [-9, 3, -2],
          [-8.5, -2.5, 1.5],
          [-10, -4, -1],
          [9, 3.5, -1.5],
          [8.5, -2, 1],
          [10, -3.5, -1],
          [-7, 5, 0.5],
          [7.5, 5.2, -0.5],
          [-6, -5.5, 0.8],
          [6.5, -5, -0.8],
        ];

    flyingSpots.forEach(([x, y, z], i) => {
      const geometry =
        i % 4 === 0
          ? new THREE.OctahedronGeometry(0.35 + Math.random() * 0.15, 0)
          : i % 4 === 1
          ? new THREE.TetrahedronGeometry(0.3 + Math.random() * 0.1, 0)
          : i % 4 === 2
          ? new THREE.IcosahedronGeometry(0.28 + Math.random() * 0.12, 0)
          : new THREE.TorusGeometry(0.25, 0.08, 8, 24);

      const material = new THREE.MeshStandardMaterial({
        color: flyingPalette[i % flyingPalette.length],
        emissive: flyingPalette[i % flyingPalette.length],
        emissiveIntensity: 1.2,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
        toneMapped: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const basePosition = new THREE.Vector3(x, y, z);
      mesh.position.copy(basePosition);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      mesh.userData.basePosition = basePosition;
      mesh.userData.floatSpeed = 0.6 + Math.random() * 0.6;
      mesh.userData.floatOffset = Math.random() * Math.PI * 2;
      mesh.userData.floatAmplitude = 0.3 + Math.random() * 0.3;
      mesh.userData.spinSpeed = 0.5 + Math.random() * 0.6;

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
    // ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      if (isPaused) return;
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // HOLOGRAPHIC CORE ANIMATION
      core.rotation.y += 0.005;
      core.rotation.z += 0.002;
      coreWireframe.rotation.y -= 0.003;
      coreWireframe.rotation.x += 0.001;

      // Inner sphere breathing effect
      const breatheScale = 1 + Math.sin(t * 2) * 0.05;
      innerSphere.scale.setScalar(breatheScale);
      (innerSphere.material as THREE.MeshStandardMaterial).emissiveIntensity =
        1.5 + Math.sin(t * 3) * 0.3;

      // Rings rotation
      rings.forEach((ring, i) => {
        ring.rotation.z += 0.005 * (i + 1);
        ring.rotation.x += 0.002 * (i + 1);
      });

      // Panel floating animation
      panelGroup.position.y = Math.sin(t * 0.8) * 0.3;
      panelGroup.rotation.y += 0.002;

      // Particles orbiting
      particleData.forEach((data) => {
        data.angle += data.orbitSpeed * 0.01;
        data.mesh.position.x = Math.cos(data.angle) * data.orbitRadius;
        data.mesh.position.z = Math.sin(data.angle) * data.orbitRadius;
        data.mesh.position.y += Math.sin(t * 2 + data.angle) * 0.01;

        // Twinkle effect
        (data.mesh.material as THREE.MeshBasicMaterial).opacity =
          0.4 + Math.sin(t * 3 + data.angle * 2) * 0.3;
      });

      // Energy beams pulsing
      beams.forEach((beam, i) => {
        beam.scale.y = 1 + Math.sin(t * 3 + i * 0.5) * 0.2;
        (beam.material as THREE.MeshBasicMaterial).opacity =
          0.3 + Math.sin(t * 2 + i * 0.8) * 0.2;
      });

      // Glow sphere pulsing
      (glowSphere.material as THREE.MeshBasicMaterial).opacity =
        0.06 + Math.sin(t * 1.5) * 0.03;

      // Mouse parallax untuk core
      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.3;
      holographicCore.rotation.y +=
        (targetRotationY - holographicCore.rotation.y) * 0.05;
      holographicCore.rotation.x +=
        (targetRotationX - holographicCore.rotation.x) * 0.05;

      // Floating objects animation
      flyingMeshes.forEach((mesh) => {
        mesh.position.y =
          mesh.userData.basePosition.y +
          Math.sin(
            t * mesh.userData.floatSpeed + mesh.userData.floatOffset
          ) *
            mesh.userData.floatAmplitude;

        mesh.position.x = mesh.userData.basePosition.x + mouseX * 0.4;
        mesh.position.z = mesh.userData.basePosition.z + mouseY * 0.3;

        mesh.rotation.x += mesh.userData.spinSpeed * 0.015;
        mesh.rotation.y += mesh.userData.spinSpeed * 0.02;
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
        if (
          child instanceof THREE.Mesh ||
          child instanceof THREE.LineSegments
        ) {
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