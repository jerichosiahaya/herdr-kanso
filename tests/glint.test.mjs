// The glint: a working name lit by windows that cross it, the dots counting after it, and on battery the dots alone.
import test from "node:test";
import assert from "node:assert/strict";
import { load, chain, gpuiHost, numberArguments } from "./helpers.mjs";

const host = (battery = false) => ({ ...gpuiHost(), div: () => chain("div"), shared: (key) => (key === "kanso.battery" ? battery : null) });
const kit = async (battery) => ({
  ...await load("kanso-panel/ui.js", ["tokens", "G", "GLINT", "GLINT_MS", "GLINT_STAGGER", "DOTS_MS", "OPACITY"], host(battery)),
  ...await load("kanso-panel/ui-glint.js", ["glint"], host(battery)),
});
const night = { foreground: "#d8d4cb", background: "#1b1b19", dim: "#6b6862", muted: "#949086" };
const all = (el) => [el, ...el.kids.flatMap(all)];
const calls = (el, name) => all(el).flatMap((kid) => kid.calls.filter((call) => call[0] === name));

test("A working name glints with three windows at the kit's widths, strengths and pace, and its dots count after it", async () => {
  const { glint, tokens, G, GLINT, GLINT_MS, GLINT_STAGGER, DOTS_MS, OPACITY } = await kit(false);
  const c = tokens(night);
  const el = glint("Atlas", c, "a");
  const loops = calls(el, "loop");
  assert.equal(loops.length, 6, "each window and its copy of the text move");
  const periods = new Set(loops.map(([, , policy]) => policy.period));
  assert.equal(periods.size, 1);
  const period = [...periods][0];
  assert.ok(period >= GLINT_MS && (period - GLINT_MS) % GLINT_STAGGER === 0, String(period));
  assert.deepEqual(calls(el, "opacity").map(([, share]) => share), [OPACITY.glintFaint, OPACITY.glintMid, 1]);
  assert.deepEqual(calls(el, "w").map(([, width]) => width), [GLINT.wide, GLINT.mid, GLINT.narrow, G.lg]);
  assert.deepEqual(JSON.parse(JSON.stringify(calls(el, "frames"))), [["frames", ["", ".", "..", "..."], DOTS_MS]]);
  const paces = new Set(["a", "b", "c", "d", "e", "f", "g"].map((seed) => calls(glint("x", c, seed), "loop")[0][2].period));
  assert.ok(paces.size > 1, "names side by side do not glint in step");
});

test("On battery a working name stands still in full ink and only the dots step", async () => {
  const { glint, tokens, DOTS_MS } = await kit(true);
  const c = tokens(night);
  const el = glint("Atlas", c, "a");
  assert.equal(calls(el, "loop").length, 0);
  assert.ok(calls(el, "text_color").some(([, ink]) => ink === c.text));
  assert.deepEqual(calls(el, "frames").map(([, , ms]) => ms), [DOTS_MS]);
});

test("The glint takes every size and pace from the tokens", () => {
  assert.deepEqual(numberArguments("kanso-panel/ui-glint.js"), []);
});
