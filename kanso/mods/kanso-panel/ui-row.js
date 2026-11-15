// Kanso's panel kit: the row, one named item in a list with its facts, its mark and its tools. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-row.js.
import { div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { G, H, R, T, ICON_ROW, ICON_INLINE, CLEAR, glyphOf } from "./ui.js";
import { button } from "./ui-button.js";
import { chip } from "./ui-chip.js";
import { mark } from "./ui-mark.js";
import { PENDING, pendingDot } from "./ui-state.js";

// Each step in is the lead icon and its gap; the guide of a deeper row runs under its parent's icon.
const indent = (depth) => G.sm * (depth + 1) + ICON_ROW * depth;
const GUIDE = indent(1) + ICON_ROW / 2;

const glyph = (icon, side, ink) => svg(glyphOf(icon)).size(side).flex_none().text_color(ink);
// A tool's press stays on the tool: the row under it does not run its own click.
const alone = (onClick) => onClick && ((cx) => { cx.stop_propagation(); onClick(cx); });

const fact = (c) => (part) => (typeof part === "string" ? div().flex_none().child(part)
  : h_flex().flex_none().items_center().gap(G.xs)
    .when(Boolean(part.icon), (el) => el.child(glyph(part.icon, ICON_INLINE, c.dim)))
    .child(div().child(part.text)));

const detailOf = (c, detail) => {
  const facts = [detail ?? []].flat().filter(Boolean);
  return facts.length ? h_flex().min_w(0).overflow_hidden().items_center().gap(G.sm).whitespace_nowrap().text_color(c.dim).children(facts.map(fact(c))) : null;
};

const tool = (id, c) => ({ label, onClick, ...rest }, i) => button(`${id}-tool-${i}`, label, alone(onClick), c, { kind: "icon", size: "sm", ...rest });
const actionOf = (id, c, { label, onClick, ...rest }) => button(`${id}-action`, label, alone(onClick), c, { size: "sm", ...rest });

const groundOf = (c, { current, hover }) => {
  if (current) return c.selected;
  return hover ? c.subtle : null;
};

// The one line: lead icon, name, facts, then the right side, the mark last.
const lineOf = (id, c, { icon, name, detail, meta, count, flag, status, heading, dimmed, pending, actions, action, tools, ink }) => h_flex()
  .w_full().min_w(0).items_center().gap(G.sm).children([
    icon ? glyph(icon, ICON_ROW, ink) : null,
    div().min_w(0).truncate().text_color(ink).when(heading, (el) => el.font_semibold()).child(name),
    detailOf(c, detail),
    div().flex_1(),
    meta && !tools ? div().flex_none().whitespace_nowrap().text_size(T.body).text_color(dimmed ? c.muted : c.dim).child(String(meta)) : null,
    flag && !tools ? glyph(flag, ICON_ROW, c.dim) : null,
    tools ? h_flex().flex_none().items_center().gap(G.hair).my(-G.xs).children(actions.map(tool(id, c))) : null,
    count ? chip(c, { label: count }) : null,
    action ? actionOf(id, c, action) : null,
    pending ? pendingDot(`${id}-pending`, c) : null,
    mark(c, { status }),
  ].filter(Boolean));

/** `icon`, `flag`: names in kanso-chrome's icons, or paths; `detail`: a fact or a list of them, each a string or { icon, text }; `chip`: a count;
 * `mark`: a state the mark draws; `second`: the dim second line; `heading`: a group's name; `depth`: 0, 1 or 2; `current`: the open item;
 * `selected`: the keyboard's pick; `dimmed`: muted; `pending`: a write not yet confirmed; `hover`, `focus`: show `actions`, the tools
 * ({ icon, label, onClick }) that take the meta's and the flag's place; `action`: one small button always shown ({ label, onClick, kind }).
 * `onClick(cx)`, `onHover(hovered, cx)`, `onKey(event, cx)`; `focusHandle`: the handle the row tracks for the keyboard. */
export function row(id, c, {
  icon = null, name, detail = null, meta = null, chip: count = null, flag = null, mark: status = "none", second = null, heading = false, depth = 0,
  selected = false, current = false, dimmed = false, pending = false, hover = false, focus = false, actions = [], action = null,
  onClick = null, onHover = null, onKey = null, focusHandle = null,
} = {}) {
  const ink = dimmed ? c.muted : c.text;
  const tools = (hover || focus) && actions.length > 0;
  const ground = groundOf(c, { current, hover });
  const nested = depth > 1;
  const line = lineOf(id, c, { icon, name, detail, meta, count, flag, status, heading, dimmed, pending, actions, action, tools, ink });
  // The ring is a border kept clear at rest, so a focus or a pick never moves the content.
  return h_flex().id(id).relative().min_w(0).mx(-G.sm).items_center().rounded(R.control)
    .border_2().border_color(selected || focus ? c.accent : CLEAR)
    .pl(indent(depth) - G.hair).pr(G.sm - G.hair).text_size(T.value).text_color(ink)
    .when(Boolean(second), (el) => el.py(G.sm - G.hair))
    .when(!second, (el) => el.h(H.line))
    .when(Boolean(ground), (el) => el.bg(ground))
    .hover((s) => s.bg(current ? c.selected : c.subtle))
    .active((s) => s.bg(c.selected))
    .when(pending, (el) => el.opacity(PENDING))
    .when(nested, (el) => el.child(div().absolute().top_0().bottom_0().left(GUIDE).border_l_1().border_color(c.w12)))
    .when(Boolean(onClick), (el) => el.cursor_pointer().on_click((_e, cx) => onClick(cx)))
    .when(Boolean(onHover), (el) => el.on_hover(onHover))
    .when(Boolean(onKey), (el) => el.on_key_down(onKey))
    .when(Boolean(focusHandle), (el) => el.track_focus(focusHandle).focus((s) => s.border_color(c.accent)))
    .child(second ? v_flex().w_full().min_w(0).gap(G.sm).child(line)
      .child(div().w_full().min_w(0).truncate().text_size(T.body).text_color(c.dim).child(second)) : line);
}
