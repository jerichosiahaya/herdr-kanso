// The Menu: a heading, items of a control's height with their icon, a separator, and an item that asks twice.
import test from "node:test";
import assert from "node:assert/strict";
import { load, gpuiHost, numberArguments } from "./helpers.mjs";

const kit = async () => ({
  ...await load("kanso-panel/ui.js", ["tokens", "G", "H", "R", "T", "W"], gpuiHost()),
  ...await load("kanso-panel/ui-menu.js", ["menu"], gpuiHost()),
});
const calls = (el, name) => el.calls.filter((call) => call[0] === name);
const arg = (el, name) => calls(el, name).at(-1)?.[1];
const night = { background: "#1b1b19", foreground: "#d8d4cb", hover: "#232321", selected: "#2b2b28", dim: "#6b6860", muted: "#949086", accent: "#7d9cd4", popover: "#222220", border: "#33332f" };

test("A Menu is a popover 252 wide, 4 inside, radius 8, with its heading dim in the meta size", async () => {
  const { menu, tokens, G, R, T, W } = await kit();
  const c = tokens(night);
  const el = menu("m", { title: "checkout", items: [{ icon: "pin", label: "Pin" }] }, c);
  assert.equal(arg(el, "w"), W.menu);
  assert.equal(W.menu, 252);
  assert.equal(arg(el, "p"), G.xs);
  assert.equal(arg(el, "rounded"), R.card);
  assert.equal(arg(el, "bg"), c.popover);
  assert.equal(arg(el, "border_color"), c.border);
  const [heading] = el.kids;
  assert.equal(arg(heading, "text_size"), T.body);
  assert.equal(arg(heading, "text_color"), c.dim);
  assert.equal(arg(heading, "child"), "checkout");
});

test("An item is a control tall, its icon muted, its words in the body size; a click runs it", async () => {
  const { menu, tokens, G, H, R, T } = await kit();
  const c = tokens(night);
  const done = [];
  const el = menu("m", { items: [{ icon: "pin", label: "Pin", onClick: () => done.push("pin") }, { separator: true }, { label: "Hide this" }] }, c);
  const [pin, line, hide] = el.kids;
  assert.equal(pin.tag, "m-0");
  assert.equal(arg(pin, "h"), H.control);
  assert.equal(arg(pin, "px"), G.sm);
  assert.equal(arg(pin, "rounded"), R.control);
  assert.equal(arg(pin, "accessibility_label"), "Pin");
  assert.equal(arg(pin.kids[0], "text_color"), c.muted);
  assert.equal(arg(pin.kids[1], "text_size"), T.value);
  arg(pin, "on_click")({}, {});
  assert.deepEqual(done, ["pin"]);
  assert.equal(calls(line, "border_t_1").length, 1, "a separator is a hairline");
  assert.equal(hide.tag, "m-2", "items keep their place in the list");
});

test("An armed item is filled with the accent and reads Press again", async () => {
  const { menu, tokens } = await kit();
  const c = tokens(night);
  const [close] = menu("m", { items: [{ icon: "close", label: "Close", armed: true, verb: "close checkout" }] }, c).kids;
  assert.equal(arg(close, "bg"), c.accent);
  assert.equal(arg(close, "accessibility_label"), "Press again to close checkout");
  assert.equal(arg(close.kids[1], "text_color"), c.accentText);
});

test("The Menu draws every size from the tokens", () => {
  assert.deepEqual(numberArguments("kanso-panel/ui-menu.js"), []);
  assert.deepEqual(numberArguments("kanso-panel/ui-header.js"), []);
});
