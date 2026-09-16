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
The client is not a node: the network is about them. (To confirm; Network
Canvas also leaves ego out of the sociogram.)

**Edge**:
An undirected tie between two nodes of the same network, answering "wie heeft
contact met wie?". One kind, no attributes. Whether a tie needs anything more
is an open question.

## Lifecycle

- A social network starts editable and stays so until it is marked **final**.
- A final network is read-only. It becomes available to choose in Petra (a
  research project; its custom frontend selects a final network to work with).
- A final network can be **duplicated** into a new, editable network on the
  same dossier. Nodes and edges are copied. Copied nodes keep the UUID of
  their original and get a fresh primary key.

The UUID therefore identifies the same person across successive networks of
one dossier, so change over time can be followed; the primary key identifies a
row in one network.

## Interaction decisions

- Sorting people into categories uses the column layout from Network Canvas
  (intake requirement). Clicking a column and the number keys place a person
  as well, covering the mouse-only gap in Network Canvas.
- The "Anders ..." category asks a required follow-up in a modal on placement,
  as Network Canvas does. Not built in the prototype yet.
- One question per screen. Network Canvas pages through the prompts of a
  stage one at a time; the prototype lists each prompt as its own step.
