# Social network tool — EPD interview prototype

Throwaway UI prototype for the social network inventory tool that will go into
the RoQua EPD app. No backend, no persistence: everything lives in memory and a
page reload brings back the example networks.

The index at `/` lists the dossier's networks. A network stays editable
("Concept") until it is made final; a final network is read-only, is what
Petra will offer to choose from, and can only be duplicated into a new draft.
A new network starts by giving it a name (`/nieuw`); duplicating goes through
the same page. The interview itself lives at `/netwerk/:id`.

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
columns, the Network Canvas way. People are sorted one by one: only the first
in the queue can be dragged. Clicking a column or pressing its number (1-9, 0
for the tenth) places that person too, which is what Network Canvas' mouse-only
version lacked. The prototype started with two more designs for this (one
person at a time, and a table); they were dropped once the intake settled on
columns as a requirement.

Name entry and the sociogram have one design each. On the sociogram, drag to
move, click two people in turn to toggle a tie, Tab to a person and use the
arrow keys and Enter for the same without a mouse. The list under the canvas
is the same data without the canvas.

The example data has two final networks, fully answered, and one draft with
five names and nothing else. A new network starts empty; "Voorbeeldnamen
laden" on the first stage fills in the five names.
The "Data" panel at the bottom of the sidebar shows the network as JSON.

`/vragen` lists the open questions for the researcher, with links into the
relevant steps, so the prototype and the questions travel as one link.

## Deploy

Static build to `dist/`, served by Vercel (`vercel.json`): `bun run build`.
