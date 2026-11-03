"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
export default function Sculpture() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      !ref.current ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      navigator.hardwareConcurrency <= 2
    )
      return;
    const host = ref.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    host.appendChild(renderer.domElement);
    const group = new THREE.Group();
    scene.add(group);
    const material = new THREE.MeshStandardMaterial({
      color: 0xc3a574,
      metalness: 0.85,
      roughness: 0.28,
    });
    const geometry = new THREE.TorusGeometry(1.48, 0.085, 12, 90);
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.set(i * 0.42, i * 0.63, i * 0.18);
      group.add(mesh);
    }
    scene.add(new THREE.HemisphereLight(0xf4f0e8, 0x252b30, 3));
    const light = new THREE.DirectionalLight(0xffe4b0, 7);
    light.position.set(3, 4, 5);
    scene.add(light);
    const resize = () => {
      const w = host.clientWidth,
        h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    let visible = false,
      frame = 0,
      pointer = 0;
    const move = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer = ((e.clientX - rect.left) / rect.width - 0.5) * 0.2;
    };
    host.addEventListener("pointermove", move);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(host);
    const draw = (t: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      group.rotation.y = t * 0.00012 + window.scrollY * 0.00008;
      group.rotation.x += (pointer - group.rotation.x) * 0.025;
      group.rotation.z = Math.sin(t * 0.0001) * 0.16;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(draw);
    const lost = (e: Event) => {
      e.preventDefault();
      host.classList.remove("rendered");
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    host.classList.add("rendered");
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", move);
      observer.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      host.classList.remove("rendered");
    };
  }, []);
  return (
    <div ref={ref} className="sculpture" aria-hidden="true">
      <div className="sculpture-fallback">
        {[0, 1, 2, 3, 4].map((i) => (
          <i
            key={i}
            style={{ transform: `rotate(${i * 32}deg) rotateY(${i * 20}deg)` }}
          />
        ))}
      </div>
    </div>
  );
}
