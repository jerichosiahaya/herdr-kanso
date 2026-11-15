// Kanso's panel kit: the sidebar's Header under the window's lights, its Toolbar 40 tall; collapsed, the rail's width with the Toolbar stacked. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-sidebar-header.js.
import { v_flex } from "gpui-base";
import { G, H } from "./ui.js";

/** `toolbar`: the drawn Toolbar, in its column form when `collapsed`. `mark`: what leads the rail, drawn by the caller. */
export const header = (id, { collapsed = false, mark = null }, toolbar) => v_flex().id(id).w_full().flex_none().px(G.sm).pb(G.xs)
  .when(collapsed, (el) => el.items_center().gap(G.sm).pt(G.hair))
  .when(Boolean(mark), (el) => el.child(mark))
  .child(collapsed ? toolbar : toolbar.h(H.row));
