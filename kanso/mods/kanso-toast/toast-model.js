// What a toast draws from the notification it is given: its lead, its one sentence's tooltip, its fix word and the command a click runs.

// A level's dot; an icon or the check takes the state's colour, a fact muted.
const DOT = { warning: "working", info: "accent" };
const TONE = { success: "done", warning: "working", info: "muted" };
const CHECK = "check";
// A name in kanso-chrome's icons; anything else (a path on any system) is Herdr's own picture.
const KIT_NAME = /^[a-z0-9-]+$/;

/** mark: the blocked mark; image: Herdr's own picture; glyph: a kit icon in `tone`; dot: a dot in `tone`. */
export const leadOf = ({ level, icon } = {}) => {
  if (level === "error") return { kind: "mark" };
  if (icon && !KIT_NAME.test(icon)) return { kind: "image", icon };
  if (icon) return { kind: "glyph", icon, tone: TONE[level] ?? TONE.info };
  if (level === "success") return { kind: "glyph", icon: CHECK, tone: TONE.success };
  return { kind: "dot", tone: DOT[level] ?? DOT.info };
};

/** The detail; without one, the title, for when its one line is cut. */
export const tipOf = ({ title, body } = {}) => body || title || "";

/** The word on the fix, carried in the action's args by whoever posts it. */
export const fixOf = ({ action } = {}) => action?.args?.label ?? null;

/** The action's command and its args without the fix word, or null without one. */
export const commandOf = ({ action } = {}) => {
  if (!action?.name) return null;
  return { name: action.name, args: Object.fromEntries(Object.entries(action.args ?? {}).filter(([key]) => key !== "label")) };
};
