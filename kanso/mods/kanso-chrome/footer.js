// The sidebar footer: kansō's update row, Settings and its one menu, Add computer; in the rail, chrome squares.
import { svg } from "gpui-kit";
import { h_flex, v_flex, Popover } from "gpui-base";
import { G, R, ICON_CHROME, CHROME_SQUARE, glyphOf } from "./ui.js";
import { row } from "./ui-row.js";
import { menu } from "./ui-menu.js";
import { mark } from "./ui-mark.js";
import { stateBlock } from "./ui-state.js";

const inkOf = (c, quiet) => (quiet ? c.muted : c.text);
const chromeGlyph = (icon, ink) => svg(glyphOf(icon)).size(ICON_CHROME).flex_none().text_color(ink);

const line = (c, { key, icon, name, chrome, quiet, onClick }) => row(`footer-${key}`, c, {
  ...(chrome ? { start: [chromeGlyph(icon, inkOf(c, quiet))] } : { icon }), name, dimmed: quiet, onClick,
});

const square = (c, { key, icon, name, quiet, onClick }) => h_flex().id(`footer-${key}`).size(CHROME_SQUARE).flex_none()
  .items_center().justify_center().rounded(R.control).cursor_pointer().tooltip(name)
  .hover((s) => s.bg(c.subtle)).active((s) => s.bg(c.selected))
  .when(Boolean(onClick), (el) => el.on_click((_e, cx) => onClick(cx)))
  .child(chromeGlyph(icon, inkOf(c, quiet)));

const refusal = (c, { why, retry, font }) => stateBlock("footer-refused", {
  mark: mark(c, { status: "blocked" }), what: "kansō didn't update", why, fixes: [{ label: "Update", onClick: retry }], font,
}, c).mt(G.hair).mb(G.sm);

const withMenu = (trigger, c, { open, onOpenChange, items }) => {
  const pop = Popover.new("footer-settings-menu").trigger(trigger).anchor("bottom_left").open(open)
    .on_open_change((value, cx) => onOpenChange(value, cx));
  return open ? pop.content(menu("footer-settings-list", { title: "Settings", items }, c)) : pop;
};

/** `rows`: footerRows, each with its onClick; `settings`: { open, onOpenChange, items } for its menu; `refused`: { why, retry, font } or null. */
export function sidebarFooter(c, { collapsed, rows, settings, refused = null }) {
  const draw = collapsed ? square : line;
  const drawn = rows.flatMap((entry) => {
    const el = draw(c, entry);
    if (entry.key === "settings") return [withMenu(el, c, settings)];
    return entry.key === "kanso-update" && refused && !collapsed ? [el, refusal(c, refused)] : [el];
  });
  return v_flex().size_full().bg(c.chrome).pt(G.sm).pb(G.md).gap(G.hair).justify_end()
    .when(collapsed, (el) => el.items_center())
    .when(!collapsed, (el) => el.px(G.lg))
    .children(drawn);
}
