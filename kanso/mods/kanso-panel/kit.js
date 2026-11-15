// Kanso's panel kit with the Storybook's signatures, so a composition runs as it is in both: a piece takes its props and returns a drawing.
import { row as drawRow } from "./ui-row.js";

// The Storybook names Lucide icons `lu-<name>`; the app's icons drop the prefix.
const appIcon = (icon) => icon?.replace(/^lu-/, "");
const withIcon = (part) => (part?.icon ? { ...part, icon: appIcon(part.icon) } : part);
const appProps = ({ icon, flag, detail, action, actions = [], ...props }) => ({
  ...props, icon: appIcon(icon), flag: appIcon(flag), action: withIcon(action), actions: actions.map(withIcon),
  detail: Array.isArray(detail) ? detail.map(withIcon) : withIcon(detail),
});

// `more`: what only the app gives: the handlers, and props the design does not draw yet.
export const row = (props) => (id, c, more = {}) => drawRow(id, c, { ...appProps(props), ...more });
