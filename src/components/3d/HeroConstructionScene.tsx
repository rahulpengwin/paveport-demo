'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroConstructionScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      setIsLoading(false);
      return;
    }

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(16, 12, 18);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Group for entire construction world
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // 1. Concrete Foundation Slab
    const slabGeo = new THREE.BoxGeometry(14, 0.8, 14);
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x222a33,
      roughness: 0.85,
      metalness: 0.1,
    });
    const slab = new THREE.Mesh(slabGeo, concreteMat);
    slab.position.y = -0.4;
    slab.receiveShadow = true;
    worldGroup.add(slab);

    // 2. Concrete Structural Columns
    const colGeo = new THREE.BoxGeometry(0.8, 5, 0.8);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x36414e, roughness: 0.7 });
    const colPositions = [
      [-5, 2.5, -5],
      [5, 2.5, -5],
      [-5, 2.5, 5],
      [5, 2.5, 5],
    ];
    colPositions.forEach(([x, y, z]) => {
      const col = new THREE.Mesh(colGeo, colMat);
      col.position.set(x, y, z);
      col.castShadow = true;
      col.receiveShadow = true;
      worldGroup.add(col);
    });

    // 3. Steel TMT Rebar Grid / Reinforcement Cages (Fe550D)
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Amber accent steel
      roughness: 0.35,
      metalness: 0.85,
    });
    const rebarGroup = new THREE.Group();
    for (let i = -4; i <= 4; i += 1.5) {
      const rodGeoX = new THREE.CylinderGeometry(0.04, 0.04, 9, 8);
      const rodX = new THREE.Mesh(rodGeoX, steelMat);
      rodX.rotation.z = Math.PI / 2;
      rodX.position.set(0, 0.1, i);
      rodX.castShadow = true;
      rebarGroup.add(rodX);

      const rodGeoZ = new THREE.CylinderGeometry(0.04, 0.04, 9, 8);
      const rodZ = new THREE.Mesh(rodGeoZ, steelMat);
      rodZ.rotation.x = Math.PI / 2;
      rodZ.position.set(i, 0.15, 0);
      rodZ.castShadow = true;
      rebarGroup.add(rodZ);
    }
    rebarGroup.position.set(0, 0.05, 0);
    worldGroup.add(rebarGroup);

    // 4. Cement Bags on Wooden Pallet
    const palletMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const palletGeo = new THREE.BoxGeometry(2.4, 0.25, 2.4);
    const pallet = new THREE.Mesh(palletGeo, palletMat);
    pallet.position.set(-3, 0.12, 2);
    pallet.castShadow = true;
    pallet.receiveShadow = true;
    worldGroup.add(pallet);

    const cementMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.95 });
    const cementAccentMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.8 }); // UltraTech branding stripe
    const bagGeo = new THREE.BoxGeometry(0.9, 0.3, 0.6);

    for (let layer = 0; layer < 3; layer++) {
      for (let bx = -0.5; bx <= 0.5; bx += 1.0) {
        for (let bz = -0.5; bz <= 0.5; bz += 1.0) {
          const bag = new THREE.Mesh(bagGeo, layer === 2 ? cementAccentMat : cementMat);
          bag.position.set(-3 + bx * 0.95, 0.35 + layer * 0.32, 2 + bz * 0.7);
          bag.rotation.y = layer % 2 === 0 ? 0 : Math.PI / 2;
          bag.castShadow = true;
          bag.receiveShadow = true;
          worldGroup.add(bag);
        }
      }
    }

    // 5. Stylized Material Delivery Truck (Tata Ace mini-truck)
    const truckGroup = new THREE.Group();
    // Cab
    const cabGeo = new THREE.BoxGeometry(1.6, 1.4, 1.5);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.2 });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0, 1.1, 1.2);
    cab.castShadow = true;
    truckGroup.add(cab);

    // Windshield
    const glassGeo = new THREE.BoxGeometry(1.4, 0.6, 0.1);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.1, metalness: 0.9 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 1.3, 1.96);
    truckGroup.add(glass);

    // Bed
    const bedGeo = new THREE.BoxGeometry(1.7, 0.6, 2.2);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(0, 0.8, -0.6);
    bed.castShadow = true;
    truckGroup.add(bed);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const wheelPositions = [
      [-0.9, 0.35, 1.1],
      [0.9, 0.35, 1.1],
      [-0.9, 0.35, -1.0],
      [0.9, 0.35, -1.0],
    ];
    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      truckGroup.add(wheel);
    });

    truckGroup.position.set(3.5, 0, 1.5);
    truckGroup.rotation.y = -Math.PI / 4;
    worldGroup.add(truckGroup);

    // 6. Yellow Construction Tower Crane
    const craneGroup = new THREE.Group();
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.6 });
    // Mast
    const mastGeo = new THREE.BoxGeometry(0.4, 11, 0.4);
    const mast = new THREE.Mesh(mastGeo, craneMat);
    mast.position.set(-5.5, 5.5, -5.5);
    mast.castShadow = true;
    craneGroup.add(mast);

    // Jib
    const jibGeo = new THREE.BoxGeometry(0.3, 0.3, 11);
    const jib = new THREE.Mesh(jibGeo, craneMat);
    jib.position.set(-5.5, 10.8, -1.5);
    craneGroup.add(jib);

    // Hook Cable
    const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 4, 8);
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    cable.position.set(-5.5, 8.5, 1.5);
    craneGroup.add(cable);

    // Suspended load (Rebar bundle)
    const loadGeo = new THREE.BoxGeometry(0.6, 0.4, 2.0);
    const load = new THREE.Mesh(loadGeo, steelMat);
    load.position.set(-5.5, 6.3, 1.5);
    load.castShadow = true;
    craneGroup.add(load);

    worldGroup.add(craneGroup);

    // 7. Ambient Floating Dust / Sparkles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 45;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = Math.random() * 8 + 0.5;
      positions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    worldGroup.add(particles);

    // Lighting: Cinematic warm studio setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    sunLight.position.set(15, 25, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8); // Cool blue skylight fill
    fillLight.position.set(-15, 10, -10);
    scene.add(fillLight);

    const amberRimLight = new THREE.PointLight(0xf59e0b, 3, 20);
    amberRimLight.position.set(0, 4, 3);
    scene.add(amberRimLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    setIsLoading(false);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation + mouse parallax
      targetRotationY = mouseX * 0.4 + elapsedTime * 0.08;
      targetRotationX = mouseY * 0.15;

      worldGroup.rotation.y += (targetRotationY - worldGroup.rotation.y) * 0.03;
      worldGroup.rotation.x += (targetRotationX - worldGroup.rotation.x) * 0.03;

      // Subtle cable swinging
      cable.rotation.z = Math.sin(elapsedTime * 1.5) * 0.02;
      load.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full min-h-[460px] rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-950 border border-charcoal-800 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-construction-500/10 border border-construction-500/30 flex items-center justify-center text-construction-400 mb-4">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h4 className="text-lg font-bold text-white">Interactive Construction Blueprint</h4>
        <p className="text-xs text-charcoal-400 max-w-sm mt-1">
          Connected supply-chain network delivering cement, TMT steel, aggregates, and precast direct to job sites.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal-950/60 backdrop-blur-sm z-10 text-xs text-charcoal-400 font-mono">
          Loading 3D Construction Model...
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-charcoal-700/80 text-[10px] font-mono text-charcoal-400 pointer-events-none">
        3D Engine: Three.js WebGL &bull; Drag to rotate
      </div>
    </div>
  );
};

