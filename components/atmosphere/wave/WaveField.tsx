'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  WAVE_MAX_SOURCES,
  waveFragmentShader,
  waveVertexShader,
} from './waveShaders';

// --- Interaction tuning (no magic numbers in the hot path) -----------------
/** Minimum pointer travel (uv) between two injected ripples — spaces the trail. */
const MIN_STEP = 0.012;
/** Pointer speed (uv/s) that maps to a full-strength wave; below is a micro ripple. */
const SPEED_FOR_MAX = 2.2;
/** Floor so even the slowest drift leaves a delicate ripple. */
const MIN_STRENGTH = 0.14;
/** A click is a full, wide burst. */
const CLICK_STRENGTH = 1;

type Source = { x: number; y: number; t0: number; amp: number };

/**
 * WAVE SIMULATION + RENDER. A full-screen shader quad reads a ring buffer of
 * ripple sources; the INTERACTION MANAGER (window listeners) writes into it.
 * Everything heavy lives in the fragment shader — the CPU only bookkeeps ~24
 * little structs per frame.
 */
function WavePlane() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  // Ring buffer of sources, mirrored into the uniform each frame.
  const sources = useRef<Source[]>(
    Array.from({ length: WAVE_MAX_SOURCES }, () => ({
      x: 0,
      y: 0,
      t0: -999,
      amp: 0,
    })),
  );
  const writeIdx = useRef(0);
  const clock = useRef(0); // shared time base for injects fired between frames
  const last = useRef({ x: 0.5, y: 0.5, t: 0, has: false });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uCount: { value: WAVE_MAX_SOURCES },
      uIntensity: { value: 1 },
      uCyan: { value: new THREE.Color('#4fd9ff') },
      uSources: {
        value: Array.from(
          { length: WAVE_MAX_SOURCES },
          () => new THREE.Vector4(0, 0, -999, 0),
        ),
      },
    }),
    [],
  );

  // INTERACTION MANAGER — translate raw pointer events into ripple sources.
  useEffect(() => {
    const inject = (x: number, y: number, amp: number) => {
      const i = writeIdx.current;
      sources.current[i] = { x, y, t0: clock.current, amp };
      writeIdx.current = (i + 1) % WAVE_MAX_SOURCES;
    };

    const onMove = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight; // flip to uv space
      const l = last.current;
      if (!l.has) {
        last.current = { x, y, t: e.timeStamp, has: true };
        return;
      }
      const dx = x - l.x;
      const dy = y - l.y;
      const dist = Math.hypot(dx, dy);
      if (dist < MIN_STEP) return;

      const dt = Math.max((e.timeStamp - l.t) / 1000, 0.001);
      const speed = dist / dt;
      // Fast movement → stronger, wider waves; slow → delicate micro ripples.
      const amp = Math.min(
        1,
        Math.max(MIN_STRENGTH, speed / SPEED_FOR_MAX),
      );
      inject(x, y, amp);
      last.current = { x, y, t: e.timeStamp, has: true };
    };

    const onDown = (e: PointerEvent) => {
      inject(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
        CLICK_STRENGTH,
      );
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
    };
  }, []);

  useFrame((state) => {
    const m = material.current;
    if (!m) return;

    const t = state.clock.elapsedTime;
    clock.current = t;
    m.uniforms.uTime.value = t;
    m.uniforms.uAspect.value = size.width / size.height;
    // Scale the whole effect with the viewport so small screens stay calm.
    m.uniforms.uIntensity.value = Math.min(
      1.15,
      Math.max(0.6, size.width / 1440),
    );

    const arr = m.uniforms.uSources.value as THREE.Vector4[];
    const src = sources.current;
    for (let i = 0; i < WAVE_MAX_SOURCES; i++) {
      arr[i].set(src[i].x, src[i].y, src[i].t0, src[i].amp);
    }
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={waveVertexShader}
        fragmentShader={waveFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

/**
 * CURSOR-DRIVEN WATER OVERLAY. A calm sheet of crystal water laid over the whole
 * page; the pointer disturbs it into ripples that propagate and fade. Mounts
 * only on a capable, mouse-driven, motion-friendly setup — otherwise the site
 * is exactly as it was.
 */
export function WaveField() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Client-only (WebGL) + accessibility/perf gating, all in one gate.
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Software renderers can't afford a full-screen shader — skip them.
    let software = false;
    try {
      const gl = document.createElement('canvas').getContext('webgl');
      const ext = gl?.getExtension('WEBGL_debug_renderer_info');
      const r = ext ? String(gl?.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      software = !gl || /swiftshader|basic render|llvmpipe|software|microsoft basic/i.test(r);
    } catch {
      software = false;
    }
    setReady(fine && !reduced && !software);
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      // Above content, below the cursor; never intercepts input.
      style={{ position: 'fixed', inset: 0, zIndex: 45, pointerEvents: 'none' }}
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={1}
        style={{ pointerEvents: 'none' }}
      >
        <WavePlane />
      </Canvas>
    </div>
  );
}
