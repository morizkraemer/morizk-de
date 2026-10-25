"use client";

import { useEffect, useRef, useState } from "react";
import { scenes, type Mode } from "./stage";

const CUES: { mode: Exclude<Mode, "idle">; name: string }[] = [
  { mode: "sound", name: "Sound" },
  { mode: "light", name: "Light" },
  { mode: "map", name: "Videomapping" },
  { mode: "code", name: "Software" },
];

export default function Cues() {
  const [mode, setMode] = useState<Mode>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<Mode>("idle");
  const blendRef = useRef(0);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const cv = canvasRef.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, raf = 0, t = 0;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      scenes[modeRef.current](ctx, W, H, t, reduce ? 1 : Math.min(1, blendRef.current));
    };
    const loop = (now: number) => {
      t = now; blendRef.current += .05;
      draw();
      raf = requestAnimationFrame(loop);
    };

    addEventListener("resize", resize);
    resize();
    if (reduce) { t = 4000; draw(); redrawRef.current = draw; }
    else raf = requestAnimationFrame(loop);
    return () => { removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);

  const select = (m: Mode) => {
    modeRef.current = m; blendRef.current = 0;
    setMode(m);
    redrawRef.current();
  };

  return (
    <>
      <canvas ref={canvasRef} className="stage" aria-hidden="true" />
      <ul className="cues" onMouseLeave={() => select("idle")}>
        {CUES.map(c => (
          <li key={c.mode}>
            <button
              type="button"
              className="cue"
              aria-pressed={mode === c.mode}
              onMouseEnter={() => select(c.mode)}
              onFocus={() => select(c.mode)}
              onClick={() => select(mode === c.mode && matchMedia("(hover: none)").matches ? "idle" : c.mode)}
            >
              <span className="name">{c.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
