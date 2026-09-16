// Mirrors Network Canvas. People are sorted one by one: only the first person
// in the queue can be dragged into a column, the rest wait dimmed behind them.
// Because there is always exactly one active person, the columns can have
// number hotkeys and can simply be clicked. Clicking a name that is already
// sorted selects it instead, so the same column click or hotkey re-sorts it.
import { useState, type DragEvent, type KeyboardEvent, type MouseEvent } from "react";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = network.members.find((m) => m.id === selectedId);
  const active = selected ?? queue[0];

  const place = (memberId: string, value: number | typeof OTHER | undefined) => {
    actions.setAttribute(memberId, prompt.variable, value);
    if (value !== OTHER && prompt.other) actions.setAttribute(memberId, prompt.other.commentVariable, undefined);
    setSelectedId(null);
  };
  const toggleSelected = (e: MouseEvent | KeyboardEvent, id: string) => {
    e.stopPropagation(); // the column underneath would otherwise place the active person
    setSelectedId((current) => (current === id ? null : id));
  };

  useNumberHotkeys(bins.length, (index) => active && place(active.id, bins[index]!.value));

  const dropHandlers = (value: number | typeof OTHER | undefined) => ({
    onDragOver: (e: DragEvent) => e.preventDefault(),
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      place(e.dataTransfer.getData("text/plain"), value);
    },
  });

  const chip = (m: Member, { draggable = true, placed = false } = {}) => (
    <span
      key={m.id}
      className={`chip ${draggable ? "" : "dimmed"} ${m.id === selectedId ? "selected" : ""}`}
      draggable={draggable}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", m.id)}
      aria-disabled={!draggable}
      {...(placed && {
        role: "button",
        tabIndex: 0,
        "aria-pressed": m.id === selectedId,
        onClick: (e: MouseEvent) => toggleSelected(e, m.id),
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSelected(e, m.id);
          }
        },
      })}
    >
      {m.name}
    </span>
  );

  return (
    <section>
      <p className="prompt">{prompt.text}</p>

      <div className={`tray ${queue.length === 0 ? "empty" : ""}`} {...dropHandlers(undefined)}>
        {queue.length === 0 ? <span className="hint">Iedereen is ingedeeld.</span> : queue.map((m, i) => chip(m, { draggable: i === 0 }))}
      </div>
      {selected ? (
        <p className="hint">
          <strong>{selected.name}</strong> is geselecteerd. Klik op een andere kolom of druk op het cijfer om te
          verplaatsen; klik nog eens op de naam om te annuleren.
        </p>
      ) : (
        active && (
          <p className="hint">
            Sleep <strong>{active.name}</strong> naar een kolom, klik op de kolom, of druk op het cijfer van de kolom.
          </p>
        )
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
                    {chip(m, { placed: true })}
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
