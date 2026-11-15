// The kit a composition imports: the same pieces under the same name in the Storybook and the app, the app's drawing what its own piece draws.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { load, chain, gpuiHost } from "./helpers.mjs";
import * as storybookKit from "../stories/kit/kit.js";
import * as storybookPieces from "../stories/kit/pieces.js";

const host = () => ({ ...gpuiHost(), svg: (path) => { const el = chain("svg"); el.calls.push(["svg", path]); return el; } });
const kits = async () => ({
  ...await load("kanso-panel/ui.js", ["tokens"], host()),
  ...await load("kanso-panel/ui-row.js", ["row"], host()),
  app: await load("kanso-panel/kit.js", ["row"], host()),
});
const night = { foreground: "#d8d4cb", background: "#1b1b19", hover: "#232321", selected: "#2b2b28", accent: "#da627d", dim: "#6b6862", muted: "#949086", blocked: "#ca938b", working: "#c4b07e", done: "#98ad8f" };
// A drawing as plain data: handlers compare by kind, since each draw makes new ones.
const drawn = (el) => ({ tag: el.tag, calls: el.calls.map((call) => call.map((arg) => (typeof arg === "function" ? "handler" : arg?.calls ? "element" : arg))), kids: el.kids.map(drawn) });
const svgs = (el) => [...el.calls.filter((call) => call[0] === "svg").map((call) => call[1]), ...el.kids.flatMap(svgs)];
const exported = (source) => [...source.matchAll(/^export const (\w+)/gm)].map((match) => match[1]);

test("A row from the shared kit draws what the app's row draws with the same props", async () => {
  const { row, tokens, app } = await kits();
  const c = tokens(night);
  const props = { icon: "file", name: "checkout.ts", detail: ["src/api", { icon: "branch", text: "main" }], meta: "4m", mark: "working", depth: 1, current: true, hover: true, chip: 2, actions: [{ icon: "pin", label: "Pin to the top" }] };
  assert.deepEqual(drawn(app.row(props)("r", c)), drawn(row("r", c, props)));
});

test("A row from the shared kit takes the Storybook's Lucide icon names and draws the app's icons", async () => {
  const { row, tokens, app } = await kits();
  const c = tokens(night);
  const tools = (prefix) => ({
    icon: `${prefix}file`, name: "a", flag: `${prefix}pin`, detail: { icon: `${prefix}folder`, text: "src" }, hover: true,
    actions: [{ icon: `${prefix}pin`, label: "Pin" }, { icon: `${prefix}ellipsis`, label: "More" }], action: { kind: "icon", icon: `${prefix}power`, label: "Turn on" },
  });
  const shared = svgs(app.row(tools("lu-"))("r", c));
  assert.deepEqual(shared, svgs(row("r", c, tools(""))));
  assert.ok(shared.every((path) => !path.includes("lu-")), shared.join(", "));
});

test("What the app gives when it draws a shared piece wins over the composition's props", async () => {
  const { tokens, app } = await kits();
  const hits = [];
  const el = app.row({ name: "a", meta: "4m" })("r", tokens(night), { meta: "now", onClick: () => hits.push("row") });
  const texts = (node) => [...node.calls.filter((call) => call[0] === "child" && typeof call[1] === "string").map((call) => call[1]), ...node.kids.flatMap(texts)];
  assert.ok(texts(el).includes("now") && !texts(el).includes("4m"));
  el.calls.filter((call) => call[0] === "on_click").forEach(([, handler]) => handler({}, {}));
  assert.deepEqual(hits, ["row"]);
});

test("The Storybook's shared kit is its pieces, and the app's has only Storybook pieces, the rest listed until they come", () => {
  assert.deepEqual(Object.keys(storybookKit).sort(), Object.keys(storybookPieces).sort());
  const app = exported(readFileSync(new URL("../kanso/mods/kanso-panel/kit.js", import.meta.url), "utf8"));
  const storybook = Object.entries(storybookKit).filter(([, value]) => typeof value === "function").map(([name]) => name);
  assert.deepEqual(app.filter((name) => !storybook.includes(name)), [], "the app's shared kit exports only Storybook pieces");
  const { kit } = JSON.parse(readFileSync(new URL("./kit-parity.json", import.meta.url), "utf8"));
  assert.deepEqual(kit, storybook.filter((name) => !app.includes(name)).sort(), "tests/kit-parity.json `kit` lists every Storybook piece the app's shared kit lacks");
});
