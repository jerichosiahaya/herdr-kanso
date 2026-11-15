// Kanso's panel kit: the row, one named item in a list with its facts, its mark and its tools. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-row.js.
import { div, svg } from "gpui-kit";
import { h_flex, v_flex } from "gpui-base";
import { G, H, R, T, ICON_ROW, ICON_INLINE, CLEAR, glyphOf, toneColor } from "./ui.js";
import { button } from "./ui-button.js";
import { chip } from "./ui-chip.js";
import { keyHint } from "./ui-key-hint.js";
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

const groundOf = (c, { current, hover, title }) => {
  if (current) return c.selected;
  return hover && !title ? c.subtle : null;
};

const nameOf = ({ name, heading, title, ink }) => div().min_w(0).truncate().text_color(ink)
  .when(heading || title, (el) => el.font_semibold())
  .when(title, (el) => el.text_size(T.page))
  .child(name);

// Meta and flag give way to the tools while they show.
const asideOf = (c, { meta, flag, dimmed }) => [
  meta ? div().flex_none().whitespace_nowrap().text_size(T.body).text_color(dimmed ? c.muted : c.dim).child(String(meta)) : null,
  flag ? glyph(flag, ICON_ROW, c.dim) : null,
];

const controlsOf = (id, c, { actions, count, action, tools, keys }) => [
  actions.length ? h_flex().flex_none().items_center().gap(G.hair).my(-G.xs).children(actions.map(tool(id, c))) : null,
  count ? chip(c, { label: count }) : null,
  action ? actionOf(id, c, action) : null,
  ...tools,
  ...keys.map((key) => keyHint(c, key)),
];

const ringOf = (c, { selected, focus }) => (selected || focus ? c.accent : CLEAR);
const heightOf = ({ title, second }) => {
  if (second) return null;
  return title ? H.row : H.line;
};

const guideOf = (c, depth) => (depth > 1 ? div().absolute().top_0().bottom_0().left(GUIDE).border_l_1().border_color(c.w12) : null);

const wire = (el, c, { onClick, onHover, onKey, focusHandle }) => el
  .when(Boolean(onClick), (e) => e.cursor_pointer().on_click((_e, cx) => onClick(cx)))
  .when(Boolean(onHover), (e) => e.on_hover(onHover))
  .when(Boolean(onKey), (e) => e.on_key_down(onKey))
  .when(Boolean(focusHandle), (e) => e.track_focus(focusHandle).focus((s) => s.border_color(c.accent)));

// `start`, `tools`: drawn elements before the icon and always at the end; `actions`: tools shown with `hover` or `focus`; `keys`: key hint props.
export function row(id, c, {
  icon = null, tone = null, name, detail = null, meta = null, chip: count = null, flag = null, mark: status = "none", second = null, heading = false, title = false,
  depth = 0, selected = false, current = false, dimmed = false, pending = false, hover = false, focus = false, actions = [], action = null, start = [], tools = [], keys = [],
  onClick = null, onHover = null, onKey = null, focusHandle = null,
} = {}) {
  const ink = dimmed ? c.muted : c.text;
  const shown = hover || focus;
  const ground = groundOf(c, { current, hover, title });
  const height = heightOf({ title, second });
  const line = h_flex().w_full().min_w(0).items_center().gap(G.sm).when(Boolean(second && title), (el) => el.h(H.row)).children([
    ...start,
    icon ? glyph(icon, ICON_ROW, tone ? toneColor(c, tone) : ink) : null,
    nameOf({ name, heading, title, ink }),
    detailOf(c, detail),
    div().flex_1(),
    ...(shown && actions.length ? [] : asideOf(c, { meta, flag, dimmed })),
    ...controlsOf(id, c, { actions: shown ? actions : [], count, action, tools, keys }),
    pending ? pendingDot(`${id}-pending`, c) : null,
    mark(c, { status }),
  ].filter(Boolean));
  // The ring is a border kept clear at rest, so a focus or a pick never moves the content.
  return wire(h_flex().id(id).relative().min_w(0).mx(-G.sm).items_center().rounded(R.control)
    .border_2().border_color(ringOf(c, { selected, focus }))
    .pl(indent(depth) - G.hair).pr(G.sm - G.hair).text_size(T.value).text_color(ink)
    .when(Boolean(second && !title), (el) => el.py(G.sm - G.hair))
    .when(Boolean(height), (el) => el.h(height))
    .when(Boolean(ground), (el) => el.bg(ground))
    .when(!title, (el) => el.hover((s) => s.bg(current ? c.selected : c.subtle)).active((s) => s.bg(c.selected)))
    .when(pending, (el) => el.opacity(PENDING))
    .children([guideOf(c, depth)].filter(Boolean))
    .child(second ? v_flex().w_full().min_w(0).gap(G.sm).child(line)
      .child(div().w_full().min_w(0).truncate().text_size(T.body).text_color(c.dim).child(second)) : line), c, { onClick, onHover, onKey, focusHandle });
}
