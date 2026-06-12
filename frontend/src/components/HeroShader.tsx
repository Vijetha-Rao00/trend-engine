import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  void main() {
    // Center coordinates at (0,0)
    vec2 p = vUv - 0.5;
    
    // Guard against divide-by-zero to prevent NaN values that cause GPU blackouts
    float aspect = uResolution.y > 0.0 ? uResolution.x / uResolution.y : 1.0;
    p.x *= aspect;
    
    // Circle parameters to sweep a diagonal upward curve across the card
    vec2 circleCenter = vec2(0.15, -0.9);
    float radius = 1.05;
    
    // Increased motion speeds (time parameters) and displacement scale
    float shimmer = sin(uTime * 2.8) * 0.008;
    float timeShift = cos(uTime * 1.8) * 0.035;
    
    // Kinetic flowing ripple overlay along the diagonal arc
    float ripple = sin(p.x * 4.0 - uTime * 2.2) * 0.012;
    
    // RGB channel distances with ripple and time displacement
    float distR = abs(length(p - (circleCenter + vec2(0.02 + timeShift, 0.02))) - (radius + shimmer + ripple));
    float distG = abs(length(p - circleCenter) - (radius + ripple));
    float distB = abs(length(p - (circleCenter - vec2(0.02 - timeShift, 0.02))) - (radius - shimmer + ripple));
    
    // Intensified hot white core line layers (brighter numerators)
    float rCore = 0.0065 / (distR + 0.005);
    float gCore = 0.0065 / (distG + 0.005);
    float bCore = 0.0065 / (distB + 0.005);
    
    // Magnified soft neon blooms (wider and more luminous)
    float warmBloom = 0.065 / (distR + 0.09);
    float coolBloom = 0.05 / (distB + 0.14);
    
    // Richer composite pigment mapping
    vec3 warmColor = vec3(1.0, 0.46, 0.12) * warmBloom;
    vec3 whiteCore = vec3(1.0, 1.0, 1.0) * gCore;
    vec3 coolColor = (vec3(0.12, 0.52, 1.0) * coolBloom) + (vec3(0.06, 0.42, 1.0) * bCore * 1.6);
    
    // Compile composite layers with a global 1.35x brightness multiplier
    vec3 finalColor = (warmColor + whiteCore + coolColor) * 1.35;
    float vignette = smoothstep(1.3, 0.4, length(p));
    
    gl_FragColor = vec4(finalColor * vignette, 1.0);
  }
`;

export const HeroShader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use window fallbacks if the container has not completed its first layout pass
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    
    // Expand near and far boundaries to [-1, 1] to prevent GPU mesh clipping
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(width, height) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
};