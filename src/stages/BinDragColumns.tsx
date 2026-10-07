// Mirrors Network Canvas. People are sorted one by one: only the first person
// in the queue can be dragged into a column, the rest wait dimmed behind them.
// Because there is always exactly one active person, the columns can have
// number hotkeys and can simply be clicked. Clicking a name that is already
// sorted selects it instead, so the same column click or hotkey re-sorts it.
// Placing someone in the "other" column asks the follow-up question in a
// modal; the placement only happens once it is answered.
import { useState, type DragEvent, type KeyboardEvent, type MouseEvent } from "react";
import { OTHER, type Member } from "../network";
import type { BinStageProps } from "./BinStage";
import { binsOf } from "../protocol";
import { colorScale, memberColor, memberStyle } from "../colors";
import { Legend } from "../Legend";
import { Dialog } from "../Dialog";
import { hotkeyLabel, useNumberHotkeys } from "../useNumberHotkeys";
import { Instructions } from "../Instructions";

export function BinDragColumns({ stage, network, actions }: BinStageProps) {
  const { prompt } = stage;

  const bins = binsOf(prompt);
  const scale = colorScale(stage.colorBy);
  const color = (m: Member) => (scale ? memberColor(scale, m) : undefined);
  const queue = network.members.filter((m) => m.attributes[prompt.variable] === undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = network.members.find((m) => m.id === selectedId);
  const active = selected ?? queue[0];
  const [askingOther, setAskingOther] = useState<Member | null>(null);

  const place = (memberId: string, value: number | typeof OTHER | undefined) => {
    if (value === OTHER && prompt.other) {
      setAskingOther(network.members.find((m) => m.id === memberId) ?? null);
      return;
    }
    actions.setAttribute(memberId, prompt.variable, value);
    if (value !== OTHER && prompt.other) actions.setAttribute(memberId, prompt.other.commentVariable, undefined);
    setSelectedId(null);
  };
  const placeInOther = (memberId: string, answer: string) => {
    actions.setAttribute(memberId, prompt.variable, OTHER);
    actions.setAttribute(memberId, prompt.other!.commentVariable, answer);
    setAskingOther(null);
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
      className={`chip ${draggable ? "" : "dimmed"} ${m.id === selectedId ? "selected" : ""} ${scale && !color(m) ? "no-value" : ""}`}
      style={memberStyle(scale, m)}
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
      <Instructions stage={stage} />

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
                      <span className="comment">{String(m.attributes[prompt.other.commentVariable] ?? "")}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {scale && <Legend scale={scale} members={network.members} />}

      {askingOther && prompt.other && (
        <OtherDialog
          key={askingOther.id}
          member={askingOther}
          question={prompt.other.commentPrompt}
          initial={String(askingOther.attributes[prompt.other.commentVariable] ?? "")}
          onSave={(answer) => placeInOther(askingOther.id, answer)}
          onCancel={() => setAskingOther(null)}
        />
      )}
    </section>
  );
}

// The answer is required, as in Network Canvas. Cancelling leaves the person
// where they were.
function OtherDialog({
  member,
  question,
  initial,
  onSave,
  onCancel,
}: {
  member: Member;
  question: string;
  initial: string;
  onSave: (answer: string) => void;
  onCancel: () => void;
}) {
  const [answer, setAnswer] = useState(initial);

  return (
    <Dialog onCancel={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answer.trim()) onSave(answer.trim());
        }}
      >
        <p className="hint">{member.name}</p>
        <h2>{question}</h2>
        <textarea autoFocus rows={3} value={answer} onChange={(e) => setAnswer(e.target.value)} aria-label={question} />
        <div className="actions">
          <button type="button" onClick={onCancel}>
            Annuleren
          </button>
          <button type="submit" className="primary" disabled={!answer.trim()}>
            Opslaan
          </button>
        </div>
      </form>
    </Dialog>
  );
}
