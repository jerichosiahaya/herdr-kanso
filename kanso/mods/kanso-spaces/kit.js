// The kit with the Storybook's signatures: a piece takes its props and returns a drawing, `(id, c, more) => element`.
import { row as drawRow } from "./ui-row.js";

const HANDLERS = ["on", "onClick", "onHover", "onKey", "focusHandle"];
const appIcon = (icon) => icon?.replace(/^lu-/, "");
const withIcon = (part) => (part?.icon ? { ...part, icon: appIcon(part.icon) } : part);
const keyOf = ({ icon, label }) => (icon ? appIcon(icon) : label);
const drawn = (id, c, slot) => (part, i) => (typeof part === "function" ? part(`${id}-${slot}-${i}`, c) : part);

const given = (more) => {
  const unknown = Object.keys(more).filter((key) => !HANDLERS.includes(key));
  if (unknown.length) throw new Error(`kit: the app gives only handlers, not ${unknown.join(", ")}`);
  return Object.fromEntries(Object.entries(more).filter(([, value]) => value !== undefined));
};

const wired = (on) => (tool) => (tool && on[keyOf(tool)] ? { ...tool, onClick: on[keyOf(tool)] } : tool);
const unmatched = (on, tools) => Object.keys(on).filter((key) => !tools.some((tool) => tool && keyOf(tool) === key));

export const row = ({ icon, flag, detail, action, actions = [], start = [], tools = [], ...props }) => (id, c, more = {}) => {
  const { on: raw = {}, ...handlers } = given(more);
  const on = Object.fromEntries(Object.entries(raw).map(([key, fn]) => [appIcon(key), fn]));
  const own = actions.map(withIcon), lone = withIcon(action);
  const missing = unmatched(on, [...own, lone]);
  if (missing.length) throw new Error(`kit: ${id} has no tool ${missing.join(", ")}`);
  return drawRow(id, c, {
    ...props, ...handlers, icon: appIcon(icon), flag: appIcon(flag),
    detail: Array.isArray(detail) ? detail.map(withIcon) : withIcon(detail),
    actions: own.map(wired(on)), action: wired(on)(lone),
    start: start.map(drawn(id, c, "start")), tools: tools.map(drawn(id, c, "tools")),
  });
};
