// Kanso's panel kit: a status bar item, its mark or icon with its words, and the item of an agent waiting for you. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-status.js.
import { div, svg } from "gpui-kit";
import { h_flex } from "gpui-base";
import { G, R, W, ICON_INLINE, glyphOf, toneColor } from "./ui.js";
import { mark } from "./ui-mark.js";
import { PENDING, pendingDot } from "./ui-state.js";

const leadOf = (c, status, icon) => {
  if (status) return mark(c, { status, size: "sm" });
  return icon ? svg(glyphOf(icon)).size(ICON_INLINE).flex_none() : null;
};

// A click goes where the item's fact lives. Under the pointer the wash; an item in a state keeps its colour.
const pressable = (el, c, { tip, onClick, tone }) => el.cursor_pointer().rounded(R.sm).mx(-G.xs).px(G.xs)
  .hover((s) => (tone ? s.bg(c.w7) : s.bg(c.w7).text_color(c.text)))
  .on_click((_e, cx) => onClick(cx))
  .when(Boolean(tip), (item) => item.tooltip(tip));

const frame = (id, c, { tip, onClick, tone = null }) => {
  const el = h_flex().id(id).items_center().gap(G.sm).when(Boolean(tone), (item) => item.text_color(toneColor(c, tone)));
  return onClick ? pressable(el, c, { tip, onClick, tone }) : el.when(Boolean(tip), (item) => item.tooltip(tip));
};

/** `mark`: an agent state drawn as its mark, else `icon`, a name in kanso-chrome's icons; `tone`: a tone name for an item in that state;
 * `pending`: drawn at once at the pending opacity with a breathing dot; `open`: its menu is open; `onClick` and `tip`: where it goes and what it says. */
export const statusItem = (id, c, { icon = null, mark: status = null, text = null, tone = null, pending = false, open = false, tip = null, onClick = null } = {}) => {
  const lead = leadOf(c, status, icon);
  return frame(id, c, { tip, onClick, tone }).flex_none()
    .when(open, (el) => el.rounded(R.sm).mx(-G.xs).px(G.xs).bg(c.w12))
    .when(pending, (el) => el.opacity(PENDING))
    .when(Boolean(lead), (el) => el.child(lead))
    .when(text != null && text !== "", (el) => el.child(div().child(String(text))))
    .when(pending, (el) => el.child(pendingDot(`${id}-pending`, c)));
};

/** Who waits: the blocked mark, the name, the question trimmed to its width, and +`more` for the others; neither the name nor +N folds. */
export const needsItem = (id, c, { name, question = null, more = 0, tip = null, onClick = null } = {}) => frame(id, c, { tip, onClick }).flex_initial().min_w(0)
  .child(mark(c, { status: "blocked", size: "sm" }))
  .child(div().flex_none().font_medium().text_color(c.text).child(name))
  .when(Boolean(question), (el) => el.child(div().max_w(W.question).min_w(0).truncate().child(question)))
  .when(more > 0, (el) => el.child(div().flex_none().text_color(c.dim).child(`+${more}`)));
