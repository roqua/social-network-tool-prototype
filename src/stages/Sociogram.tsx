// Final stage: free positioning on an empty canvas, plus member-to-member
// ties. Drag a node to move it; click one node then another to toggle a tie.
// Keyboard: Tab to a node, arrows nudge it, Enter selects it for a tie.
// The list below the canvas is the same data without the canvas.
import { useRef, useState, type DragEvent, type PointerEvent } from "react";
import type { Stage } from "../protocol";
import { hasTie, type Member, type Network } from "../network";
import type { NetworkActions } from "../Interview";

const W = 1000;
const H = 640;
const R = 28;

// Where a person lands when placed without dragging: spread around the centre
// so successive placements don't stack.
function defaultPosition(placedCount: number) {
  const angle = placedCount * 2.4;
  return { x: 0.5 + 0.22 * Math.cos(angle) * (H / W), y: 0.5 + 0.22 * Math.sin(angle) };
}

export function Sociogram({
  stage,
  network,
  actions,
}: {
  stage: Extract<Stage, { type: "sociogram" }>;
  network: Network;
  actions: NetworkActions;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const drag = useRef<{ id: string; moved: boolean } | null>(null);
  const [pair, setPair] = useState<{ from: string; to: string }>({ from: "", to: "" });

  const placed = network.members.filter((m): m is Member & { position: { x: number; y: number } } => !!m.position);
  const unplaced = network.members.filter((m) => !m.position);
  const byId = (id: string) => network.members.find((m) => m.id === id);

  // Convert a screen point to normalised canvas coordinates.
  const toCanvas = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    return { x: Math.min(1, Math.max(0, pt.x / W)), y: Math.min(1, Math.max(0, pt.y / H)) };
  };

  const onPointerDown = (e: PointerEvent, id: string) => {
    drag.current = { id, moved: false };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return;
    drag.current.moved = true;
    actions.setPosition(drag.current.id, toCanvas(e.clientX, e.clientY));
  };
  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) clickNode(drag.current.id);
    drag.current = null;
  };

  const clickNode = (id: string) => {
    if (!selected) setSelected(id);
    else if (selected === id) setSelected(null);
    else {
      actions.toggleTie(selected, id);
      setSelected(null);
    }
  };

  const nudge = (m: Member & { position: { x: number; y: number } }, dx: number, dy: number) =>
    actions.setPosition(m.id, { x: Math.min(1, Math.max(0, m.position.x + dx)), y: Math.min(1, Math.max(0, m.position.y + dy)) });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    actions.setPosition(e.dataTransfer.getData("text/plain"), toCanvas(e.clientX, e.clientY));
  };

  return (
    <section>
      <p className="prompt">{stage.prompt}</p>
      <p className="hint">
        Sleep personen het veld in en verplaats ze. Klik op twee personen na elkaar om een verbinding te maken of te verwijderen.
        {selected && <strong> {byId(selected)?.name} is geselecteerd, kies de tweede persoon.</strong>}
      </p>

      <svg
        ref={svgRef}
        className="sociogram"
        viewBox={`0 0 ${W} ${H}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={(e) => e.target === e.currentTarget && setSelected(null)}
      >
        {network.ties.map((t) => {
          const a = byId(t.from)?.position;
          const b = byId(t.to)?.position;
          if (!a || !b) return null;
          return <line key={`${t.from}-${t.to}`} className="tie" x1={a.x * W} y1={a.y * H} x2={b.x * W} y2={b.y * H} />;
        })}
        {placed.map((m) => (
          <g
            key={m.id}
            className={`node ${selected === m.id ? "selected" : ""}`}
            transform={`translate(${m.position.x * W} ${m.position.y * H})`}
            tabIndex={0}
            role="button"
            aria-label={m.name}
            onPointerDown={(e) => onPointerDown(e, m.id)}
            onKeyDown={(e) => {
              const step = 0.02;
              if (e.key === "ArrowLeft") nudge(m, -step, 0);
              else if (e.key === "ArrowRight") nudge(m, step, 0);
              else if (e.key === "ArrowUp") nudge(m, 0, -step);
              else if (e.key === "ArrowDown") nudge(m, 0, step);
              else if (e.key === "Enter" || e.key === " ") clickNode(m.id);
              else return;
              e.preventDefault();
            }}
          >
            <circle r={R} />
            <text dy="0.35em">{m.name}</text>
          </g>
        ))}
      </svg>

      {unplaced.length > 0 && (
        <div className="tray">
          <span className="hint">Nog niet geplaatst:</span>
          {unplaced.map((m) => (
            <button
              key={m.id}
              className="chip"
              draggable
              onDragStart={(e) => e.dataTransfer.setData("text/plain", m.id)}
              onClick={() => actions.setPosition(m.id, defaultPosition(placed.length))}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      <div className="ties">
        <h3>Verbindingen</h3>
        {network.ties.length === 0 ? (
          <p className="hint">Nog geen verbindingen.</p>
        ) : (
          <ul>
            {network.ties.map((t) => (
              <li key={`${t.from}-${t.to}`}>
                {byId(t.from)?.name} — {byId(t.to)?.name}
                <button className="icon" onClick={() => actions.toggleTie(t.from, t.to)} aria-label="Verbinding verwijderen">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="tie-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (pair.from && pair.to && pair.from !== pair.to && !hasTie(network, pair.from, pair.to)) actions.toggleTie(pair.from, pair.to);
            setPair({ from: "", to: "" });
          }}
        >
          <select value={pair.from} onChange={(e) => setPair({ ...pair, from: e.target.value })} aria-label="Eerste persoon">
            <option value="">Persoon…</option>
            {network.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <span>heeft contact met</span>
          <select value={pair.to} onChange={(e) => setPair({ ...pair, to: e.target.value })} aria-label="Tweede persoon">
            <option value="">Persoon…</option>
            {network.members
              .filter((m) => m.id !== pair.from)
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
          <button type="submit" disabled={!pair.from || !pair.to}>
            Toevoegen
          </button>
        </form>
      </div>
    </section>
  );
}
