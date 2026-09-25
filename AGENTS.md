# Agent instructions

This repo is a throwaway prototype. The real version gets built later in the
RoQua EPD app, and what we learn here must survive the prototype.

## Keep the requirements list up to date

`docs/spec.md` is the list of requirements for the real version. Whenever a
change here settles how the tool should behave (a rule, a constraint, an
interaction decision, something the researcher or intake asked for), add it
to `docs/spec.md` in the same commit. Write it as a requirement for the real
version, not as a description of the prototype code, and say why when the
reason isn't obvious.

Leave out what only matters for the prototype (demo data, in-memory state,
the deploy). Open questions go on the `/vragen` page, not in the spec; move
them into the spec once they're answered.
