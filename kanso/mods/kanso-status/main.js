// Derived from the `workspace-status` mod shipped with Herdr (Apache-2.0, https://github.com/herdrdev/herdr-app).
// Modified by 0OZ: no background or top border.
// Modified by José Gutiérrez (minimalistic, 0oz design fork): renamed from oz-status.
// Modified by jlopezlira (Kanso, https://github.com/jlopezlira/herdr-kanso): renamed from mn-status; one quiet line; who is waiting and what they ask (a click goes there, as Cmd+J); low memory from the guard's file; stand-ins that show only while their home is out of sight.
import { View, div, svg } from "gpui-kit";
import { h_flex } from "gpui-base";
import { spaces, agents, terminals, machines, theme, run, window, props, shared, appHome, readTextFile } from "herdr";
import { G, R, T, ICON_INLINE, glyphOf, tokens } from "./ui.js";
import { mark } from "./ui-mark.js";
import { iconButton } from "./ui-button.js";
import { stateLine, PENDING, pendingDot } from "./ui-state.js";
import { afterMount, aliasText, tryOrAsync } from "./pure.js";
import { paths } from "./platform-paths.js";
import { MEMORY_MS, PALETTE_COMMAND, computerOf, computerShown, needsItem, questionOf, memoryLow, workingItem, paletteTip } from "./model.js";
import { pieces, shown } from "./pieces.js";

const GUARD_NOW = ["data", "kanso-guard", "now.json"];
const SIDEBAR_COLLAPSED = "sidebar.collapsed";

// One item of the bar: its mark or icon, 8 to its words.
const item = () => h_flex().gap(G.sm).items_center().min_w(0);
// A click on an item goes where its fact lives; the hover is the row's wash.
const act = (el, c, id, tip, command) => el.id(id).cursor_pointer().tooltip(tip).rounded(R.sm).mx(-G.xs).px(G.xs)
  .hover((s) => s.bg(c.w7).text_color(c.text)).on_click(() => run(command));

const computerItem = (computer, c) => computer.fix
  ? stateLine("status-computer", mark(c, { status: "blocked" }), computer.words, c, { label: computer.fix, onClick: () => run(computer.command) }).tooltip(computer.tooltip)
  : item().when(computer.pending, (el) => el.opacity(PENDING))
    .child(svg(glyphOf(computer.icon)).size(ICON_INLINE).flex_none())
    .child(div().truncate().child(computer.words))
    .when(computer.pending, (el) => el.child(pendingDot("status-computer-pending", c)));

const needsYou = (needs, c) => act(item(), c, "needs-you", needs.tooltip, needs.command)
  .child(mark(c, { status: needs.mark, size: "sm" }))
  .child(div().flex_none().font_medium().text_color(c[needs.nameTone]).child(needs.name))
  .when(Boolean(needs.question), (row) => row.child(div().max_w(needs.questionWidth).min_w(0).truncate().text_color(c[needs.questionTone]).child(needs.question)))
  .when(Boolean(needs.more), (row) => row.child(div().flex_none().text_color(c[needs.moreTone]).child(needs.more)));

const memoryItem = (low, c) => act(item().flex_none().text_color(c[low.tone]), c, "status-memory", low.tooltip, low.command).child(low.words);

const workingCount = (working, c) => act(item().flex_none(), c, "status-working", working.tooltip, working.command)
  .child(mark(c, { status: working.mark, size: "sm" }))
  .child(working.words);

export default class WorkspaceStatus extends View {
  init(_props, cx) {
    if (props()?.side === "left") return;
    afterMount(cx, () => this.readMemory(cx));
    cx.timer.every(MEMORY_MS, (cx) => this.readMemory(cx));
  }

  // The guard already writes this file. The bar only reads it.
  readMemory(cx) {
    if (this.reading) return;
    this.reading = true;
    cx.spawn(async (readCx) => {
      const text = await tryOrAsync(() => readTextFile(paths.join(appHome(), ...GUARD_NOW)));
      this.reading = false;
      const next = text ?? null;
      const stamp = JSON.stringify(memoryLow(next));
      if (next === this.memoryText && stamp === this.memoryStamp) return;
      this.memoryText = next;
      this.memoryStamp = stamp;
      readCx.notify();
    });
  }

  render() {
    const c = tokens(theme());
    // Two copies share the row (the strip's minimap sits between): side says which half this one draws.
    const side = props()?.side;
    const left = side !== "right", right = side !== "left";
    const map = pieces(shared);
    const space = left ? spaces().find((s) => s.active) : null;
    const computer = left && shown("status.computer", true, map)
      ? computerOf(space, machines(), aliasText(shared("kanso.alias"), space?.machine || "")) : null;
    const list = right ? agents() : [];
    const byAgent = new Map(list.map((agent) => [agent.address, agent]));
    const byTerm = new Map((right ? terminals() : []).map((term) => [term.address, term]));
    const rows = right ? (shared("kanso.needs-you")?.rows ?? []) : [];
    const questions = Object.fromEntries(rows.flatMap((row) => {
      const agent = byAgent.get(row?.address);
      return row?.status === "blocked" ? [[row.address, questionOf({
        msg: byTerm.get(row.address)?.report?.msg, title: agent?.title, name: row.name, program: agent?.program,
      })]] : [];
    }));
    const needs = needsItem(rows, questions);
    const low = right ? memoryLow(this.memoryText) : null;
    const working = workingItem(list);
    return h_flex().size_full().px(G.md).gap(G.lg).items_center().text_size(T.body).text_color(c.muted)
      .when(right && !left, (el) => el.justify_end())
      .when(computerShown(computer, shared(SIDEBAR_COLLAPSED)), (el) => el.child(computerItem(computer, c)))
      .when(left && right, (el) => el.child(div().flex_1()))
      .when(Boolean(needs), (el) => el.child(needsYou(needs, c)))
      .when(Boolean(low), (el) => el.child(memoryItem(low, c)))
      .when(right && shown("status.agents", working.count > 0, map), (el) => el.child(workingCount(working, c)))
      .when(right && shown("status.palette", true, map), (el) => el.child(iconButton("palette", "command", paletteTip(window()?.platform), () => run(PALETTE_COMMAND), c, { size: "sm" })));
  }
}
