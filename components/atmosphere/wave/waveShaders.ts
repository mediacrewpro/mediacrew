// GLSL for the wave field. A full-screen quad sums a ring buffer of ripple
// sources — each an expanding, damped ring — into a caustic light layer, the
// "light across a pool" read. All the physics is per-fragment on the GPU; the
// CPU only maintains the (tiny) source list.

/** How many ripples can be alive at once (ring buffer + shader loop bound). */
export const WAVE_MAX_SOURCES = 24;

export const waveVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Plane is already in clip space (-1..1), draw it as a full-screen quad.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const waveFragmentShader = /* glsl */ `
  precision highp float;

  #define MAX_SOURCES ${WAVE_MAX_SOURCES}

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAspect;
  uniform int   uCount;
  uniform float uIntensity;
  uniform vec3  uCyan;
  // xy = origin (uv), z = birth time (s), w = strength 0..1 (0 = empty slot)
  uniform vec4  uSources[MAX_SOURCES];

  // --- Wave constants (physically-motivated, all tunable) ------------------
  const float LIFE  = 2.4;   // seconds before a ripple has fully calmed
  const float SPEED = 0.26;  // ring propagation, screen-heights per second
  const float DAMP  = 1.7;   // temporal attenuation
  const float FREQ  = 44.0;  // ripple band frequency inside the ring

  void main() {
    // Aspect-correct so ripples stay circular, not oval.
    vec2 p = vUv; p.x *= uAspect;

    float light = 0.0;

    for (int i = 0; i < MAX_SOURCES; i++) {
      if (i >= uCount) break;
      vec4 s = uSources[i];
      if (s.w <= 0.001) continue;

      float age = uTime - s.z;
      if (age < 0.0 || age > LIFE) continue;

      vec2 c = s.xy; c.x *= uAspect;
      float d = distance(p, c);

      float radius = age * SPEED;                 // ring expands with time
      float width  = mix(0.010, 0.034, s.w);      // faster hit → wider wave
      float ring   = exp(-pow((d - radius) / width, 2.0));
      float decay  = exp(-age * DAMP) * (1.0 - age / LIFE); // attenuation
      float band   = 0.55 + 0.45 * cos((d - radius) * FREQ); // inner ripples

      light += ring * decay * band * s.w;
    }

    // A barely-there living surface so the "water" is never dead-flat.
    float g = 0.5 + 0.5 * sin(p.x * 7.0 + uTime * 0.25) * cos(p.y * 6.0 - uTime * 0.2);
    float sheen = pow(g, 6.0) * 0.015;

    float e = light * uIntensity;

    // Transparent cyan highlights warming to soft white at the crests.
    vec3 col = mix(uCyan, vec3(1.0), clamp(e * 0.9, 0.0, 1.0));
    // Kept deliberately low — noticed emotionally, not consciously.
    float alpha = clamp(e * 0.26 + sheen, 0.0, 0.55);

    gl_FragColor = vec4(col, alpha);
  }
`;
