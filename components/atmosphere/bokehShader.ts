/**
 * KADRAJ — procedural bokeh.
 *
 * Real out-of-focus highlights are not blurry dots: a lens renders them as a
 * soft disc with a brighter rim (the aperture edge). That rim is what makes
 * this read as depth of field rather than a blurred circle, so it is modelled
 * explicitly below.
 *
 * PERFORMANCE CONTRACT — do not undo this:
 * Orb positions arrive as uniforms, already drifted and parallaxed on the CPU
 * (28 trig calls per FRAME). An earlier version hashed and drifted inside the
 * fragment shader, which meant ~112 MILLION sin() calls per second at 1080p
 * and froze mid-range GPUs. Keep trigonometry and hashing out of this file.
 */

export const BOKEH_MAX_ORBS = 16;

export const bokehVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const bokehFragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3  uOrbs[${BOKEH_MAX_ORBS}];    // xy = centre, z = radius
  uniform vec2  uOrbMeta[${BOKEH_MAX_ORBS}]; // x = intensity, y = tint mix
  uniform int   uCount;
  uniform float uAspect;
  uniform vec3  uDeep;
  uniform vec3  uNeon;

  varying vec2 vUv;

  void main() {
    // Aspect-corrected so orbs stay circular, never egg-shaped.
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

    vec3 col = vec3(0.0);

    for (int i = 0; i < ${BOKEH_MAX_ORBS}; i++) {
      if (i >= uCount) break;

      vec3 orb = uOrbs[i];
      float size = orb.z;
      float d = length(p - orb.xy);

      // Cheap reject: skip the maths for orbs nowhere near this pixel.
      if (d > size * 1.15) continue;

      float disc = smoothstep(size, size * 0.55, d);
      float rim =
        smoothstep(size * 1.02, size * 0.9, d) -
        smoothstep(size * 0.9, size * 0.72, d);

      vec3 tint = mix(uDeep, uNeon, uOrbMeta[i].y);
      col += tint * (disc * 0.05 + rim * 0.16) * uOrbMeta[i].x;
    }

    // Alpha follows luminance so the orbs sit on the void without a grey box.
    float a = clamp(max(col.r, max(col.g, col.b)) * 1.6, 0.0, 1.0);
    gl_FragColor = vec4(col, a);
  }
`;
