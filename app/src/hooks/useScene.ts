import { useEffect, useRef } from "react";
import * as THREE from "three";

const CLOUD_COUNT = 800;
const CLOUD_RADIUS = 500;
const ICOSAHEDRON_RADIUS = 120;
const INNER_RADIUS = 60;

export function useScene(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const scrollProgressRef = useRef(0);
  const mousePosRef = useRef({ x: 0.5, y: 0.5 });
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mainGroup: THREE.Group;
    icosahedron: THREE.LineSegments;
    innerSpinner: THREE.LineSegments;
    cloudMesh: THREE.InstancedMesh;
    rafId: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xe2dcd1, 1);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 0, 400);

    // Main group for rotation
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Icosahedron wireframe
    const icoGeo = new THREE.IcosahedronGeometry(ICOSAHEDRON_RADIUS, 1);
    const edgesGeo = new THREE.EdgesGeometry(icoGeo);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: 0x4a4a4a,
      transparent: true,
      opacity: 0.6,
    });
    const icosahedron = new THREE.LineSegments(edgesGeo, icoMaterial);
    mainGroup.add(icosahedron);

    // Inner spinner (smaller icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(INNER_RADIUS, 0);
    const innerEdges = new THREE.EdgesGeometry(innerGeo);
    const innerMaterial = new THREE.LineBasicMaterial({
      color: 0x5b8def,
      transparent: true,
      opacity: 0.5,
    });
    const innerSpinner = new THREE.LineSegments(innerEdges, innerMaterial);
    mainGroup.add(innerSpinner);

    // Cloud of geometric shapes using InstancedMesh
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const cloudMaterial = new THREE.MeshBasicMaterial({
      color: 0x4a4a4a,
      transparent: true,
      opacity: 0.15,
    });
    const cloudMesh = new THREE.InstancedMesh(
      boxGeo,
      cloudMaterial,
      CLOUD_COUNT
    );

    const dummy = new THREE.Object3D();
    for (let i = 0; i < CLOUD_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = CLOUD_RADIUS * Math.cbrt(Math.random());
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      dummy.scale.setScalar(0.5 + Math.random() * 1.5);
      dummy.updateMatrix();
      cloudMesh.setMatrixAt(i, dummy.matrix);
    }
    mainGroup.add(cloudMesh);

    // Ambient particles
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 600;
      positions[i + 1] = (Math.random() - 0.5) * 600;
      positions[i + 2] = (Math.random() - 0.5) * 600;
    }
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0xe2dcd1,
      size: 2,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particlesGeo, particlesMaterial);
    mainGroup.add(particles);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      mainGroup,
      icosahedron,
      innerSpinner,
      cloudMesh,
      rafId: 0,
    };

    // Render loop
    let time = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetCameraY = 0;
    let currentCameraY = 0;

    const animate = () => {
      time += 1;

      // Auto-rotation for inner spinner
      innerSpinner.rotation.y -= 0.005;
      innerSpinner.rotation.x += 0.002;

      // Pulse inner spinner opacity
      innerMaterial.opacity = 0.5 + Math.sin(time * 0.0015) * 0.3;

      // Icosahedron slow rotation
      icosahedron.rotation.y += 0.001;

      // Camera scroll mapping
      const scrollProgress = scrollProgressRef.current;
      targetCameraY = Math.pow(scrollProgress, 2.5) * 800;

      // Lerp camera
      currentCameraY += (targetCameraY - currentCameraY) * 0.05;
      camera.position.y = currentCameraY;
      camera.lookAt(0, currentCameraY, 0);

      // Mouse tracking / auto-rotation
      if (isTouchDevice) {
        targetRotY = time * 0.002;
        targetRotX = Math.sin(time * 0.001) * 0.2;
      } else {
        targetRotY = (mousePosRef.current.x - 0.5) * Math.PI;
        targetRotX = (mousePosRef.current.y - 0.5) * Math.PI * 0.5;
      }

      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;

      mainGroup.rotation.x = currentRotX;
      mainGroup.rotation.y = currentRotY;

      // Slowly rotate particles
      particles.rotation.y += 0.0003;

      renderer.render(scene, camera);
      sceneRef.current!.rafId = requestAnimationFrame(animate);
    };

    sceneRef.current.rafId = requestAnimationFrame(animate);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.rafId);
      }
      renderer.dispose();
      icoGeo.dispose();
      edgesGeo.dispose();
      icoMaterial.dispose();
      innerGeo.dispose();
      innerEdges.dispose();
      innerMaterial.dispose();
      boxGeo.dispose();
      cloudMaterial.dispose();
      particlesGeo.dispose();
      particlesMaterial.dispose();
    };
  }, [canvasRef]);

  return { scrollProgressRef, mousePosRef };
}
