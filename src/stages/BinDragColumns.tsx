// Variant A: mirrors Network Canvas. People are sorted one by one: only the
// first person in the queue can be dragged into a column, the rest wait
// dimmed behind them. Because there is always exactly one active person, the
// columns can have number hotkeys and can simply be clicked.
import type { DragEvent } from "react";
import { OTHER, type Member } from "../network";
import type { BinStageProps } from "./BinStage";
import { hotkeyLabel, useNumberHotkeys } from "../useNumberHotkeys";

export function BinDragColumns({ stage, network, actions }: BinStageProps) {
  const { prompt } = stage;

  const bins: { value: number | typeof OTHER; label: string }[] = [
    ...prompt.options,
    ...(prompt.other ? [{ value: OTHER as typeof OTHER, label: prompt.other.label }] : []),
  ];
  const queue = network.members.filter((m) => m.attributes[prompt.variable] === undefined);
  const active = queue[0];

  const place = (memberId: string, value: number | typeof OTHER | undefined) => {
    actions.setAttribute(memberId, prompt.variable, value);
    if (value !== OTHER && prompt.other) actions.setAttribute(memberId, prompt.other.commentVariable, undefined);
  };

  useNumberHotkeys(bins.length, (index) => active && place(active.id, bins[index]!.value));

  const dropHandlers = (value: number | typeof OTHER | undefined) => ({
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      place(e.dataTransfer.getData("text/plain"), value);
    },
  });

  const chip = (m: Member, draggable = true) => (
    <span
      key={m.id}
      className={`chip ${draggable ? "" : "dimmed"}`}
      draggable={draggable}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", m.id)}
      aria-disabled={!draggable}
    >
      {m.name}
    </span>
  );

  return (
    <section>
      <p className="prompt">{prompt.text}</p>

      <div className={`tray ${queue.length === 0 ? "empty" : ""}`} {...dropHandlers(undefined)}>
        {queue.length === 0 ? <span className="hint">Iedereen is ingedeeld.</span> : queue.map((m, i) => chip(m, i === 0))}
      </div>
      {active && (
        <p className="hint">
          Sleep <strong>{active.name}</strong> naar een kolom, klik op de kolom, of druk op het cijfer van de kolom.
        </p>
      )}

      <div className="columns" style={{ gridTemplateColumns: `repeat(${bins.length}, minmax(0, 1fr))` }}>
        {bins.map((bin, i) => {
          const inBin = network.members.filter((m) => m.attributes[prompt.variable] === bin.value);
          return (
            <div
              key={String(bin.value)}
              className={`column ${active ? "targetable" : ""}`}
              {...dropHandlers(bin.value)}
              onClick={() => active && place(active.id, bin.value)}
              role={active ? "button" : undefined}
              tabIndex={active ? 0 : undefined}
              onKeyDown={(e) => active && e.key === "Enter" && place(active.id, bin.value)}
            >
              <h3>
                <kbd>{hotkeyLabel(i)}</kbd> {bin.label}
              </h3>
              <div className="column-body">
                {inBin.map((m) => (
                  <div key={m.id} className="column-member">
                    {chip(m)}
                    {bin.value === OTHER && prompt.other && (
                      <input
                        className="comment"
                        placeholder={prompt.other.commentPrompt}
                        value={String(m.attributes[prompt.other.commentVariable] ?? "")}
                        onChange={(e) => actions.setAttribute(m.id, prompt.other!.commentVariable, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
