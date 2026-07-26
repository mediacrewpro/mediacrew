'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  BOKEH_MAX_ORBS,
  bokehFragmentShader,
  bokehVertexShader,
} from './bokehShader';

const fract = (x: number) => x - Math.floor(x);

type Seed = { bx: number; by: number; depth: number; tint: number };

/** Deterministic seeds — no Math.random(), so SSR and client agree. */
function makeSeeds(): Seed[] {
  return Array.from({ length: BOKEH_MAX_ORBS }, (_, i) => {
    const h1 = fract(Math.sin((i + 1) * 12.9898) * 43758.5453);
    const h2 = fract(Math.sin((i + 1) * 78.233) * 43758.5453);
    const h3 = fract(Math.sin((i + 1) * 3.7 + 11) * 43758.5453);
    return {
      bx: (h1 - 0.5) * 2.4,
      by: (h2 - 0.5) * 1.5,
      depth: h3,
      tint: fract(h3 * 7.1),
    };
  });
}

function BokehPlane({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const seeds = useMemo(makeSeeds, []);
  const time = useRef(0);
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uOrbs: {
        value: Array.from({ length: BOKEH_MAX_ORBS }, () => new THREE.Vector3()),
      },
      uOrbMeta: {
        value: Array.from({ length: BOKEH_MAX_ORBS }, () => new THREE.Vector2()),
      },
      uCount: { value: count },
      uAspect: { value: 1 },
      // Mirrors --color-deep and --color-neon in globals.css
      uDeep: { value: new THREE.Color('#0b3d4e') },
      uNeon: { value: new THREE.Color('#0adce4') },
    }),
    [count],
  );

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;

    time.current += delta;
    m.uniforms.uAspect.value = size.width / size.height;

    // Ease toward the pointer so the parallax has weight.
    mouse.current.lerp(state.pointer, 1 - Math.pow(0.001, delta));

    // Small screens carry fewer orbs — fragment cost scales with the loop.
    const active = size.width < 768 ? Math.min(8, count) : count;
    m.uniforms.uCount.value = active;

    // All drift + parallax happens HERE, once per frame — not per pixel.
    const t = time.current * 0.06;
    for (let i = 0; i < active; i++) {
      const s = seeds[i];
      const travel = 0.02 + s.depth * 0.09;
      m.uniforms.uOrbs.value[i].set(
        s.bx + Math.sin(t + i * 2.3) * 0.06 + mouse.current.x * travel,
        s.by + Math.cos(t * 0.8 + i * 1.7) * 0.05 + mouse.current.y * travel,
        0.015 + s.depth * 0.1,
      );
      m.uniforms.uOrbMeta.value[i].set(0.35 + s.depth * 0.65, s.tint);
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={bokehVertexShader}
        fragmentShader={bokehFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Bokeh({
  count = 14,
  active = true,
}: {
  count?: number;
  /** When false the canvas keeps its last frame instead of burning GPU. */
  active?: boolean;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <Canvas
      // No lighting, no depth sorting, no tone mapping: this is a flat quad.
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      // Bokeh is by definition out of focus. Rendering it at half resolution
      // costs a quarter of the fragments for detail nobody can resolve.
      dpr={0.5}
      style={{ pointerEvents: 'none' }}
      // 'demand' draws one frame then stops: shaders stay warm and the depth
      // is on screen, but the GPU idles until this actually becomes visible.
      frameloop={active && !reduced ? 'always' : 'demand'}
    >
      <BokehPlane count={count} />
    </Canvas>
  );
}
