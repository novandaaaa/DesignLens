import * as THREE from 'three';

/**
 * Kumpulan "ikon" 3D wireframe yang temanya nyambung ke produk DesignLens AI
 * (evaluasi UI/UX + community review) — dipakai gantiin bentuk generik
 * (icosahedron/octahedron/torus polos) supaya objek yang melayang di
 * background terasa related sama konsep website-nya, bukan dekorasi acak.
 *
 * Semua factory return THREE.Object3D supaya bisa langsung di-posisikan,
 * di-rotasi, dan disimpan userData-nya seperti mesh biasa.
 */

function wireframeFromGeometry(
  geometry: THREE.BufferGeometry,
  color: number,
  opacity: number
): THREE.LineSegments {
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  return new THREE.LineSegments(edges, material);
}

/** Kaca pembesar — merepresentasikan AI Review / proses inspeksi desain */
export function createMagnifyingGlass(color: number, opacity = 0.6): THREE.Object3D {
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.045, 8, 32),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
  );
  group.add(ring);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.045, 0.4, 8),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
  );
  handle.position.set(0.32, -0.32, 0);
  handle.rotation.z = Math.PI / 4;
  group.add(handle);

  return group;
}

/** Mini jendela browser — merepresentasikan "website" itu sendiri */
export function createBrowserWindow(color: number, opacity = 0.6): THREE.Object3D {
  const group = new THREE.Group();

  const frame = wireframeFromGeometry(
    new THREE.BoxGeometry(0.7, 0.5, 0.02),
    color,
    opacity
  );
  group.add(frame);

  const headerLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.015),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: opacity * 0.8 })
  );
  headerLine.position.set(0, 0.16, 0.011);
  group.add(headerLine);

  [-0.28, -0.21, -0.14].forEach((x) => {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.02, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    dot.position.set(x, 0.21, 0.012);
    group.add(dot);
  });

  return group;
}

/** Bubble chat — merepresentasikan komentar & diskusi komunitas */
export function createChatBubble(color: number, opacity = 0.6): THREE.Object3D {
  const shape = new THREE.Shape();
  const w = 0.5;
  const h = 0.34;
  const r = 0.08;

  shape.moveTo(-w / 2 + r, -h / 2);
  shape.lineTo(w / 2 - r, -h / 2);
  shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  shape.lineTo(w / 2, h / 2 - r);
  shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  shape.lineTo(-w / 2 + r, h / 2);
  shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  shape.lineTo(-w / 2, -h / 2 + 0.14);
  shape.lineTo(-w / 2 - 0.11, -h / 2 - 0.09);
  shape.lineTo(-w / 2 + 0.08, -h / 2 + 0.02);
  shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  return wireframeFromGeometry(geometry, color, opacity);
}

/** Bintang — merepresentasikan skor/rating penilaian */
export function createStarBadge(color: number, opacity = 0.6): THREE.Object3D {
  const shape = new THREE.Shape();
  const points = 5;
  const outerR = 0.28;
  const innerR = 0.12;

  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  return wireframeFromGeometry(geometry, color, opacity);
}

/** Badge centang — merepresentasikan review yang sudah disetujui/lulus */
export function createCheckBadge(color: number, opacity = 0.6): THREE.Object3D {
  const group = new THREE.Group();

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.035, 8, 32),
    new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity })
  );
  group.add(ring);

  const checkShape = new THREE.Shape();
  checkShape.moveTo(-0.12, 0);
  checkShape.lineTo(-0.03, -0.1);
  checkShape.lineTo(0.14, 0.12);
  checkShape.lineTo(0.09, 0.16);
  checkShape.lineTo(-0.03, 0);
  checkShape.lineTo(-0.07, 0.05);
  checkShape.closePath();

  const check = new THREE.Mesh(
    new THREE.ExtrudeGeometry(checkShape, { depth: 0.02, bevelEnabled: false }),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
  );
  group.add(check);

  return group;
}

/** Palet warna kecil — merepresentasikan kategori penilaian "Color" */
export function createColorSwatch(_color: number, opacity = 0.6): THREE.Object3D {
  const group = new THREE.Group();
  const palette = [0xec4899, 0xa855f7, 0x2dd4bf];
  const offsets: [number, number][] = [
    [-0.12, 0.06],
    [0.12, 0.06],
    [0, -0.1],
  ];

  palette.forEach((c, i) => {
    const dot = new THREE.Mesh(
      new THREE.CircleGeometry(0.11, 24),
      new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: Math.min(opacity + 0.15, 1) })
    );
    dot.position.set(offsets[i][0], offsets[i][1], i * 0.002);
    group.add(dot);
  });

  return group;
}

/** Kursor panah — merepresentasikan interaksi/UX pengguna */
export function createCursorPointer(color: number, opacity = 0.6): THREE.Object3D {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.32);
  shape.lineTo(0, -0.28);
  shape.lineTo(0.09, -0.14);
  shape.lineTo(0.16, -0.2);
  shape.lineTo(0.22, -0.1);
  shape.lineTo(0.15, -0.04);
  shape.lineTo(0.26, -0.02);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false });
  return wireframeFromGeometry(geometry, color, opacity);
}

/** Daftar semua factory, dipakai bergiliran (round-robin) saat generate objek */
export const iconFactories = [
  createMagnifyingGlass,
  createBrowserWindow,
  createChatBubble,
  createStarBadge,
  createCheckBadge,
  createColorSwatch,
  createCursorPointer,
];
