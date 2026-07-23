"use client";

import { useEffect, useRef, useState } from "react";

interface ModelViewerProps {
  src: string;
  format?: "stl" | "glb" | "3mf";
  className?: string;
}

/**
 * Lazy three.js viewer: initializes only when scrolled into view,
 * tears down renderer + geometry on unmount.
 */
export default function ModelViewer({ src, format = "stl", className = "" }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    // Above-the-fold viewers load immediately; the observer handles the rest.
    if (el.getBoundingClientRect().top < window.innerHeight + 200) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!visible || !mount) return;

    let disposed = false;
    let frameId = 0;
    let renderer: import("three").WebGLRenderer | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const disposables: { dispose(): void }[] = [];

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      let object: import("three").Object3D;
      if (format === "glb") {
        const { GLTFLoader } = await import(
          "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const gltf = await new GLTFLoader().loadAsync(src);
        object = gltf.scene;
      } else if (format === "3mf") {
        const { ThreeMFLoader } = await import(
          "three/examples/jsm/loaders/3MFLoader.js"
        );
        object = await new ThreeMFLoader().loadAsync(src);
        object.rotation.x = -Math.PI / 2; // CAD Z-up → three Y-up
      } else {
        const { STLLoader } = await import(
          "three/examples/jsm/loaders/STLLoader.js"
        );
        const geometry = await new STLLoader().loadAsync(src);
        geometry.computeVertexNormals();
        disposables.push(geometry);
        const material = new THREE.MeshStandardMaterial({
          color: 0xb8b0a0,
          metalness: 0.15,
          roughness: 0.55,
        });
        disposables.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = -Math.PI / 2; // CAD Z-up → three Y-up
        object = mesh;
      }
      if (disposed) return;

      // Center the object and size the camera to fit it
      const holder = new THREE.Group();
      holder.add(object);
      const box = new THREE.Box3().setFromObject(holder);
      const center = box.getCenter(new THREE.Vector3());
      object.position.sub(center);
      const radius = box.getSize(new THREE.Vector3()).length() / 2 || 1;

      const scene = new THREE.Scene();
      scene.add(holder);

      const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 0.9);
      scene.add(hemi);
      const key = new THREE.DirectionalLight(0xffe0b0, 2.2);
      key.position.set(1, 1.4, 1);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x9ab0ff, 0.8);
      rim.position.set(-1.2, 0.4, -1);
      scene.add(rim);

      const camera = new THREE.PerspectiveCamera(
        40,
        mount.clientWidth / Math.max(mount.clientHeight, 1),
        radius / 100,
        radius * 20
      );
      camera.position.set(radius * 1.6, radius * 1.1, radius * 2.1);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      mount.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
      controls.enablePan = false;
      // Stop the turntable once the visitor takes over
      controls.addEventListener("start", () => {
        controls.autoRotate = false;
      });

      resizeObserver = new ResizeObserver(() => {
        if (!renderer) return;
        camera.aspect = mount.clientWidth / Math.max(mount.clientHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      });
      resizeObserver.observe(mount);

      const animate = () => {
        if (disposed) return;
        frameId = requestAnimationFrame(animate);
        controls.update();
        renderer!.render(scene, camera);
      };
      animate();
      setLoaded(true);
    })().catch((e: unknown) => {
      if (!disposed) setError(e instanceof Error ? e.message : String(e));
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      disposables.forEach((d) => d.dispose());
      if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, [visible, src, format]);

  return (
    <div
      ref={mountRef}
      className={`relative overflow-hidden rounded-lg border border-neutral-800 bg-[#0d0d0d] ${className}`}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-neutral-600">
          loading model…
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center font-mono text-xs text-neutral-600">
          couldn&apos;t load model ({error})
        </div>
      )}
      {loaded && (
        <div className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px] text-neutral-700">
          drag to rotate · scroll to zoom
        </div>
      )}
    </div>
  );
}
