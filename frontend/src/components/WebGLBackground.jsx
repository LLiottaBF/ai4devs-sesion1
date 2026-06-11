import { useEffect, useRef } from 'react';

const VERT_SRC = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAG_SRC = `
  precision mediump float;
  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 pointer = u_pointer / u_resolution;

    float t = u_time * 0.15;
    vec2 drift = uv + vec2(t * 0.3, t * 0.2);
    drift += (pointer - 0.5) * 0.04;

    float n = noise(drift * 3.0) * 0.5
            + noise(drift * 6.0) * 0.25
            + noise(drift * 12.0) * 0.125;

    float bloom = smoothstep(0.45, 0.75, n);

    vec3 base  = vec3(0.98, 0.98, 1.0);
    vec3 haze  = vec3(0.88, 0.90, 0.98);
    vec3 color = mix(base, haze, bloom * 0.55);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function WebGLBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const quad = new Float32Array([-1,-1, 1,-1, -1,1, 1,1]);
    const buf  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes  = gl.getUniformLocation(program, 'u_resolution');
    const uPtr  = gl.getUniformLocation(program, 'u_pointer');

    let pointer = { x: canvas.width / 2, y: canvas.height / 2 };
    let rafId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer = {
        x: (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - r.left,
        y: canvas.height - ((e.clientY ?? e.touches?.[0]?.clientY ?? 0) - r.top),
      };
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uPtr, pointer.x, pointer.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          display: 'block',
        }}
        aria-hidden="true"
      />
      {/* CSS fallback shown when canvas is hidden */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(to bottom right, #ffffff, #f8fafc, #e2e8f0)',
          zIndex: -1,
        }}
      />
    </>
  );
}
