'use client';

import { useEffect, useState } from 'react';

let cached: boolean | null = null;

/**
 * True when the browser is compositing on the CPU with no GPU acceleration.
 *
 * Detected from the WebGL renderer string — a machine running SwiftShader,
 * the "Microsoft Basic Render Driver", llvmpipe or any paravirtual/software
 * adapter (Chrome with hardware acceleration off, a blocklisted GPU, a VM/RDP
 * session, a crashed GPU process) reports one of those names. On such setups
 * every composited frame, video decode and WebGL draw runs on the CPU, so the
 * heavy atmosphere effects must step aside or the whole page drops to ~15fps.
 *
 * The probe context is created at most once and the answer memoized.
 */
export function isSoftwareRenderer(): boolean {
  if (cached !== null) return cached;
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      cached = true; // no WebGL at all → assume the worst
      return cached;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '')
      : '';
    cached =
      /swiftshader|basic render|llvmpipe|software|microsoft basic|paravirtual/i.test(
        renderer,
      );
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return cached;
  } catch {
    cached = false; // can't tell → don't degrade everyone
    return cached;
  }
}

/**
 * React binding for {@link isSoftwareRenderer}. Starts `false` (SSR + first
 * paint assume a capable GPU) and flips after mount, so capable machines never
 * pay for the probe and software renderers downgrade a frame later.
 */
export function useLowPerf(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    setLow(isSoftwareRenderer());
  }, []);
  return low;
}
