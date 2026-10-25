export type Mode = "idle" | "sound" | "light" | "map" | "code";

const warm = (a: number) => `rgba(255,217,160,${a})`;
const white = (a: number) => `rgba(242,240,236,${a})`;

// a small signal-flow graph for software: nodes and the routes between them
const nodes = [[.16, .28], [.4, .2], [.64, .34], [.86, .22], [.28, .64], [.54, .72], [.8, .62]];
const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 2], [5, 6], [2, 6]];

type Scene = (ctx: CanvasRenderingContext2D, W: number, H: number, t: number, a: number) => void;

export const scenes: Record<Mode, Scene> = {
  idle(ctx, W, H, t, a) {
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const y = H * (.2 + i * .3) + Math.sin(t * .0004 + i) * 30;
      ctx.strokeStyle = white(.04 * a);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  },
  sound(ctx, W, H, t, a) {
    ctx.lineWidth = 1.2;
    for (let k = 0; k < 5; k++) {
      ctx.strokeStyle = warm((.5 - k * .09) * a);
      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const p = x / W;
        const env = Math.sin(p * Math.PI);
        const y = H * .55 + env * (Math.sin(p * 18 + t * .004 + k) * 60 + Math.sin(p * 47 - t * .007) * 22 + Math.sin(p * 5 + t * .001 * k) * 40) * (1 - k * .15);
        if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  },
  light(ctx, W, H, t, a) {
    const n = 3;
    for (let i = 0; i < n; i++) {
      const ox = W * (i + .5) / n;
      const ang = Math.sin(t * .0004 + i * 1.9) * .3;
      const len = H * 1.1, spread = .07;
      const g = ctx.createLinearGradient(ox, 0, ox, len);
      g.addColorStop(0, warm(.12 * a)); g.addColorStop(.8, warm(0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(ox, -4);
      ctx.lineTo(ox + Math.sin(ang - spread) * len, Math.cos(ang - spread) * len);
      ctx.lineTo(ox + Math.sin(ang + spread) * len, Math.cos(ang + spread) * len);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = warm(.6 * a);
      ctx.beginPath(); ctx.arc(ox, 0, 2, 0, Math.PI * 2); ctx.fill();
    }
  },
  map(ctx, W, H, t, a) {
    // a facade grid, keystoned and breathing, like a projector warp
    const cx = W / 2, cy = H / 2, s = Math.min(W, H) * .42;
    const k = Math.sin(t * .0008) * .18;
    const quad = [[cx - s * (1 + k), cy - s * .7], [cx + s * (1 - k), cy - s * .7], [cx + s * (1 + k * .5), cy + s * .7], [cx - s * (1 - k * .5), cy + s * .7]];
    const lerp = (p: number[], q: number[], u: number) => [p[0] + (q[0] - p[0]) * u, p[1] + (q[1] - p[1]) * u];
    const pt = (u: number, v: number) => lerp(lerp(quad[0], quad[1], u), lerp(quad[3], quad[2], u), v);
    const line = (p: number[], q: number[]) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
    const N = 12, M = 8;
    ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++) { ctx.strokeStyle = warm((i % 4 ? .14 : .4) * a); line(pt(i / N, 0), pt(i / N, 1)); }
    for (let j = 0; j <= M; j++) { ctx.strokeStyle = warm((j % 4 ? .14 : .4) * a); line(pt(0, j / M), pt(1, j / M)); }
    // a lit window sweeping across the facade
    const ci = Math.floor((t * .002) % N), cj = Math.floor((t * .0013) % M);
    const cell = [pt(ci / N, cj / M), pt((ci + 1) / N, cj / M), pt((ci + 1) / N, (cj + 1) / M), pt(ci / N, (cj + 1) / M)];
    ctx.fillStyle = warm(.25 * a);
    ctx.beginPath(); cell.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
    ctx.fillStyle = warm(.9 * a);
    [[0, 0], [1, 0], [1, 1], [0, 1]].forEach(([u, v]) => { const [x, y] = pt(u, v); ctx.fillRect(x - 3, y - 3, 6, 6); });
  },
  code(ctx, W, H, t, a) {
    // faint dot grid, then routed edges with packets travelling along them
    const g = 32;
    ctx.fillStyle = white(.07 * a);
    for (let x = g / 2; x < W; x += g) for (let y = g / 2; y < H; y += g) ctx.fillRect(x, y, 1, 1);
    const P = nodes.map(([x, y]) => [Math.round(x * W / g) * g + g / 2, Math.round(y * H / g) * g + g / 2]);
    ctx.lineWidth = 1;
    edges.forEach(([i, j], k) => {
      const [ax, ay] = P[i], [bx, by] = P[j];
      ctx.strokeStyle = warm(.22 * a);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, ay); ctx.lineTo(bx, by); ctx.stroke();
      const dx = bx - ax, dy = by - ay, L = Math.abs(dx) + Math.abs(dy);
      const d = ((t * .00025 + k * .37) % 1) * L;
      const px = Math.abs(dx) >= d ? ax + Math.sign(dx) * d : bx;
      const py = Math.abs(dx) >= d ? ay : ay + Math.sign(dy) * (d - Math.abs(dx));
      ctx.fillStyle = warm(.85 * a);
      ctx.fillRect(px - 2, py - 2, 4, 4);
    });
    P.forEach(([x, y]) => {
      ctx.fillStyle = "#050505"; ctx.fillRect(x - 6, y - 6, 12, 12);
      ctx.strokeStyle = warm(.6 * a); ctx.strokeRect(x - 6.5, y - 6.5, 13, 13);
    });
  },
};
