# Social network tool — EPD interview prototype

Throwaway UI prototype for the social network inventory tool that will go into
the RoQua EPD app. No backend, no persistence: everything lives in memory and a
page reload starts over.

The interview follows the researcher's Network Canvas protocol in
`docs/Case studies network survey (1).netcanvas` (a zip with a `protocol.json`),
ported to `src/protocol.ts`:

1. Name the people in the network
2. Relationship type
3. How long you have known each other
4. Face-to-face contact frequency
5. Digital contact frequency
6. to 10. Five statements about the relationship (personal matters, emotional
   support, being yourself, costs energy, gives energy)
11. Practical or material support
12. Sociogram: place people on a canvas and draw who has contact with whom

Network Canvas groups the frequency and perception prompts into one stage each;
here every prompt is its own step so Next always moves one question forward.

## Running

```bash
bun install
bun dev
```

## What to look at

Stages 2 to 11 all have the same shape: sort every person into one of a few
columns. The prototype has three interaction designs for that, switchable with
the floating bar at the bottom, the ← / → keys, or `?variant=`:

- **A** — drag people into columns, the Network Canvas way. People are sorted
  one by one: only the first in the queue can be dragged. Clicking a column or
  pressing its number (1-9, 0 for the tenth) places that person too.
- **B** — one person at a time, answered with buttons or the same number
  hotkeys. Picking an answer jumps to the next person who has none yet.
- **C** — a table with a row per person and a radio button per option.

Name entry and the sociogram have one design each. On the sociogram, drag to
move, click two people in turn to toggle a tie, Tab to a person and use the
arrow keys and Enter for the same without a mouse. The list under the canvas
is the same data without the canvas.

"Voorbeeldnamen laden" on the first stage fills in five names to skip typing.
The "Data" panel at the bottom of the sidebar shows the network as JSON.

`/vragen` lists the open questions for the researcher, with links into the
relevant steps, so the prototype and the questions travel as one link.

## Deploy

Static build to `dist/`, served by Vercel (`vercel.json`): `bun run build`.
