'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

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
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    // ---------------------------------------
    // RENDERER - Optimized
    // ---------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // ---------------------------------------
    // LIGHTS
    // ---------------------------------------
    scene.add(new THREE.AmbientLight(0xf9f9fd, 0.4));

    const light1 = new THREE.PointLight(0x8a2be1, 80, 15);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x1f1e2e, 60, 15);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // ---------------------------------------
    // NETWORK CONSTELLATION (Nodes + Connections)
    // ---------------------------------------
    const nodeCount = isMobile ? 15 : 25;
    const connectionDistance = 3.5;
    const nodes: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    // Generate random node positions
    for (let i = 0; i < nodeCount; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      );
      nodes.push(position);

      // Node sphere
      const nodeGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const nodeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf9f9fd,
        transparent: true,
        opacity: 0.8,
      });
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.copy(position);
      nodeMesh.userData = {
        basePosition: position.clone(),
        floatSpeed: 0.3 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
      };
      scene.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }

    // Connection lines (BufferGeometry untuk performa)
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i < j && node.distanceTo(otherNode) < connectionDistance) {
          linePositions.push(
            node.x, node.y, node.z,
            otherNode.x, otherNode.y, otherNode.z
          );

          // Gradient color based on distance
          const distance = node.distanceTo(otherNode);
          const opacity = 1 - distance / connectionDistance;
          lineColors.push(0.87, 0.84, 0.18, opacity); // Golden Yellow
          lineColors.push(0.22, 0.71, 0.85, opacity); // Cyan
        }
      });
    });

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
    });

    const connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(connectionLines);

    // ---------------------------------------
    // FLOATING GEOMETRIC ACCENTS
    // ---------------------------------------
    const accentCount = isMobile ? 3 : 6;
    const accents: THREE.Mesh[] = [];
    const accentColors = [0x8a2be1, 0x1f1e2e, 0xf9f9fd, 0x8a2be1];

    for (let i = 0; i < accentCount; i++) {
      // Variasi bentuk geometri
      let geometry: THREE.BufferGeometry;
      const shapeType = i % 4;

      if (shapeType === 0) {
        geometry = new THREE.OctahedronGeometry(0.4, 0);
      } else if (shapeType === 1) {
        geometry = new THREE.TetrahedronGeometry(0.35, 0);
      } else if (shapeType === 2) {
        geometry = new THREE.IcosahedronGeometry(0.3, 0);
      } else {
        geometry = new THREE.TorusGeometry(0.3, 0.1, 8, 16);
      }

      const material = new THREE.MeshStandardMaterial({
        color: accentColors[i % accentColors.length],
        roughness: 0.3,
        metalness: 0.7,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );

      mesh.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.015,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        floatSpeed: 0.4 + Math.random() * 0.4,
        floatOffset: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      };

      scene.add(mesh);
      accents.push(mesh);
    }

    // ---------------------------------------
    // AMBIENT PARTICLES (sangat sedikit)
    // ---------------------------------------
    const particleCount = isMobile ? 15 : 30;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // ---------------------------------------
    // MOUSE PARALLAX
    // ---------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ---------------------------------------
    // RESIZE
    // ---------------------------------------
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ---------------------------------------
    // ANIMATE
    // ---------------------------------------
    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Network nodes floating
      nodeMeshes.forEach((node) => {
        node.position.y =
          node.userData.basePosition.y +
          Math.sin(t * node.userData.floatSpeed + node.userData.floatOffset) * 0.2;
      });

      // Connection lines subtle rotation
      connectionLines.rotation.y = Math.sin(t * 0.1) * 0.05;
      connectionLines.rotation.x = Math.cos(t * 0.08) * 0.03;

      // Floating accents rotation & movement
      accents.forEach((accent) => {
        accent.rotation.x += accent.userData.rotSpeedX;
        accent.rotation.y += accent.userData.rotSpeedY;
        accent.position.y =
          accent.userData.baseY +
          Math.sin(t * accent.userData.floatSpeed + accent.userData.floatOffset) * 0.3;
      });

      // Particles slow drift
      particles.rotation.y = t * 0.02;
      particles.rotation.x = t * 0.01;

      // Camera parallax (smooth)
      camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

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

      // Dispose nodes
      nodeMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      // Dispose lines
      lineGeometry.dispose();
      lineMaterial.dispose();

      // Dispose accents
      accents.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });

      // Dispose particles
      particleGeometry.dispose();
      particleMaterial.dispose();

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
