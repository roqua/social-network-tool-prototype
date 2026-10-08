# Social network tool: spec notes

Working notes for the social network inventory in the RoQua EPD area.
Terms follow `roqua/CONTEXT.md`; decisions come from the intake with the
researcher. Open questions live on the prototype's `/vragen` page.

## Domain model

**Social Network**:
One inventory of a client's network, belonging to a dossier. Has many nodes
and many edges. Dutch: sociaal netwerk.
_Avoid_: meting (in RoQua a measurement is a plan step within a protocol).

**Node**:
One person in the client's network, as named by the client (a first name or a
description such as "buurvrouw"). Carries the answers to the protocol's
questions about that person (relationship type, contact frequency, the
perception statements, material support) and a position on the sociogram.
Has a regular primary key and a UUID; see duplication below for why both.
Names are unique within a network, ignoring case and surrounding spaces:
they are how the client tells people apart on every later step. Two people
called Henk become "Henk (werk)" and "Henk (buurman)".
A network has at most 25 nodes. The maximum belongs in the interview's
configuration, so a study can set its own.
A newly named person goes on top of the list, right under the input, so the
client sees what they just added. Every later step goes through people in
the order they were named, first named first. The order can't be changed by
hand.
The client is not a node: the network is about them, as in Network Canvas,
which leaves ego out of the sociogram too.

**Edge**:
An undirected tie between two nodes of the same network, answering "wie heeft
contact met wie?". One kind, no attributes. Whether a tie needs anything more
is an open question.

## Lifecycle

- A social network is created by giving it a **name**, chosen by the
  professional (for example the moment in the treatment). The name is what
  the index and Petra show.
- A social network starts editable and stays so until it is marked **final**.
- A final network is read-only. It becomes available to choose in Petra (a
  research project; its custom frontend selects a final network to work with).
- A final network can be **duplicated** into a new, editable network on the
  same dossier. The copy gets its own name. Nodes and edges are copied.
  Copied nodes keep the UUID of their original and get a fresh primary key.

The UUID identifies the same person across successive networks of one
dossier, so change over time can be followed; the primary key identifies a row
in one network.

## Interaction decisions

- Sorting people into categories uses the column layout from Network Canvas
  (intake requirement). Clicking a column and the number keys place a person
  as well, covering the mouse-only gap in Network Canvas.
- The "Anders ..." category asks a required follow-up in a modal on placement,
  as Network Canvas does. The person is only placed once it is answered;
  cancelling leaves them where they were. The answer shows under the name in
  the column, and placing them in "Anders ..." again edits it.
- Moving on from a step while people are still unanswered is allowed, but
  first warns and names who is left. This holds for every step after name
  entry, including the sociogram (people not yet placed).
- Every step can have a longer instruction text under its question, set in
  the interview's configuration. So far only the sociogram needs one.
- Every step after the relationship question colours people by their
  relationship type, on the columns as well as the sociogram, with a legend
  of the categories in use (researcher's request). People without an answer
  are drawn hollow. Which question a step colours by is set per step in the
  interview's configuration; the categories, their order and their colours
  come from that question.
- Relationship colours (researcher's scheme): shades of blue for family,
  kind #264B9A, ouder #4A7BB7, broer of zus #6EA6CD, ander familielid
  #98CAE1; then partner #A50026, vriend #DD3D2D, kennis #F67E4B, collega
  #FDB366, begeleider #FEDA8B, and #EAECCC for "Anders ...". Names are
  written in black or white, whichever contrasts more with the colour, since
  the scheme runs from dark to very pale.
- One question per screen. Network Canvas pages through the prompts of a
  stage one at a time; the prototype lists each prompt as its own step.
- The name input has a visible label ("Naam of omschrijving") with the
  example ("bijv. 'Henk' of 'buurvrouw'") as a hint under it, not as
  placeholder text: a placeholder disappears as soon as the client starts
  typing and is hard to read.
