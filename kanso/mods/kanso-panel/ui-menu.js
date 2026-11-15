// Kanso's panel kit: the Menu, an optional heading and its items, drawn one way wherever one opens. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-menu.js.
import { div, svg } from "gpui-kit";
import { v_flex, Button } from "gpui-base";
import { G, H, R, T, W, ICON_ROW, glyphOf } from "./ui.js";
import { armedLook, pressAgain } from "./ui-button.js";

const heading = (title, c) => div().px(G.sm).pt(G.sm).pb(G.xs).text_size(T.body).text_color(c.dim).truncate().child(title);
const separator = (c) => div().m(G.xs).border_t_1().border_color(c.border);
const lead = (icon, ink) => (icon ? svg(glyphOf(icon)).size(ICON_ROW).flex_none().text_color(ink) : div().size(ICON_ROW).flex_none());

function item(id, { icon = null, label, hint = null, armed = false, verb = null, selected = false, onClick = null }, c) {
  const look = armed ? armedLook(c) : { fill: selected ? c.selected : null, ink: c.text, hover: c.w7, press: c.selected };
  const words = armed ? pressAgain(verb ?? String(label).toLowerCase()) : label;
  return Button.new(id).w_full().h(H.control).flex_none().items_center().gap(G.sm).px(G.sm).rounded(R.control).cursor_pointer()
    .accessibility_label(words)
    .when(Boolean(look.fill), (el) => el.bg(look.fill))
    .hover((s) => s.bg(look.hover)).active((s) => s.bg(look.press))
    .when(Boolean(onClick), (el) => el.on_click((_e, cx) => onClick(cx)))
    .child(lead(icon, armed ? look.ink : c.muted))
    .child(div().flex_1().min_w(0).truncate().text_size(T.value).text_color(look.ink).child(words))
    .when(Boolean(hint), (el) => el.child(div().flex_none().text_size(T.body).text_color(c.dim).child(hint)));
}

const entry = (id, line, c) => {
  if (line.separator) return separator(c);
  if (line.heading) return heading(line.heading, c);
  return item(id, line, c);
};

/** A Menu. `items`: { icon, label, hint, armed, verb, selected, onClick }, { heading }, or { separator: true }. `armed` asks twice, in the button's words. */
export const menu = (id, { title = null, items = [] }, c) => v_flex().id(id).w(W.menu).p(G.xs).rounded(R.card).bg(c.popover).border_1().border_color(c.border).shadow_md()
  .when(Boolean(title), (el) => el.child(heading(title, c)))
  .children(items.map((line, i) => entry(`${id}-${i}`, line, c)));
