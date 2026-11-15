// The sidebar's session row: the Storybook's session row composition, with what the sidebar knows and does.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { load, chain, gpuiHost } from "./helpers.mjs";
import { sessionRow } from "../stories/kit/session-row.js";

const night = { foreground: "#d8d4cb", background: "#1b1b19", hover: "#232321", selected: "#2b2b28", accent: "#da627d", dim: "#6b6862", muted: "#949086", blocked: "#ca938b", working: "#c4b07e", done: "#98ad8f" };
const sidebar = async (ran = []) => {
  const host = { ...gpuiHost(), image: () => chain("image"), svg: (path) => { const el = chain("svg"); el.calls.push(["svg", path]); return el; },
    run: (name, args) => ran.push([name, args]), openOverlay: (o) => ran.push(["overlay", o.props.title]) };
  return {
    ...await load("kanso-spaces/agents.js", ["sessionProps", "sessionHandlers", "agentSession", "sessionHeight"], host),
    ...await load("kanso-spaces/ui.js", ["tokens", "H"], host),
  };
};
const all = (el) => [el, ...el.kids.flatMap(all)];
const ids = (el) => all(el).flatMap((kid) => kid.calls.filter((call) => call[0] === "id").map((call) => call[1]).concat(kid.tag && kid.tag.includes("-") ? [kid.tag] : []));
const texts = (el) => all(el).flatMap((kid) => kid.calls.filter((call) => call[0] === "child" && typeof call[1] === "string").map((call) => call[1]));
const tips = (el) => all(el).flatMap((kid) => kid.calls.filter((call) => call[0] === "tooltip").map((call) => call[1]));
const handler = (el, name, arg) => el.calls.filter((call) => call[0] === name && (arg === undefined || call[1] === arg)).map((call) => call.at(-1))[0];
const plain = (value) => JSON.parse(JSON.stringify(value));
const claude = { icon: "programs/claude.svg", tint: true };
const atlas = { address: "t1", pane: "p1", status: "working", program: claude, name: "Atlas" };

test("The sidebar's copy of the session row is the Storybook's, byte for byte", () => {
  assert.equal(readFileSync(new URL("../kanso/mods/kanso-spaces/session-row.js", import.meta.url), "utf8"), readFileSync(new URL("../stories/kit/session-row.js", import.meta.url), "utf8"));
});

test("A session shows its program, name, activity, how long on this step, time, project, commands and mark, as its story does", async () => {
  const { sessionProps } = await sidebar();
  const props = sessionProps(atlas, 1, { hovered: false }, {
    label: "Atlas", activity: "Reviewing step 01", step: { time: "14m", stuck: true }, time: "20m", directory: "kansō", wordTip: "Can't read it",
    tasks: [{ command: "npm test", time: "2m" }],
  });
  assert.deepEqual(plain(props), {
    program: claude, name: "Atlas", status: "working", activity: "Reviewing step 01", step: { time: "14m", stuck: true }, time: "20m", place: "kansō", placeTip: "Can't read it",
    depth: 1, guides: [], current: false, pinned: false, pinnable: false, commands: 0, commandsTip: null, tools: [], refresh: false, drop: null, hover: false, focus: false, dimmed: false,
  }, "a working session lists no commands, as today");
  const done = sessionProps({ ...atlas, status: "done", pin: 1, focused: true, address: "dark/t1" }, 1, { hovered: true, pin: () => {}, kbd: true }, { tasks: [{ command: "npm test", time: "2m" }], oneLine: true, activity: "x" });
  assert.equal(done.activity, null, "a narrow sidebar keeps one line");
  assert.deepEqual([done.place, done.pinned, done.pinnable, done.current, done.hover, done.focus, done.commands, done.commandsTip], ["dark", true, true, true, true, true, 1, "npm test · 2m"]);
  assert.equal(sessionProps({ ...atlas, address: "dark/t1" }, 1, null, { noMachine: true }).place, null);
});

test("A sub-agent hangs one depth deeper from its parent by tree guides, and a terminal leads with the terminal's icon", async () => {
  const { sessionProps } = await sidebar();
  const sub = sessionProps({ address: "s1", status: "idle", sub: true }, 1, null, { lines: ["│", "└"] });
  assert.deepEqual(plain([sub.depth, sub.guides, sub.program]), [3, [null, "pass", "end"], "terminal"]);
  assert.deepEqual(plain(sessionProps({ address: "s2", status: "idle" }, 0, null, { lines: ["├"] }).guides), ["tee"]);
  assert.equal(sessionProps({ ...atlas, dozing: true }, 1, null, {}).status, "asleep");
  assert.equal(sessionProps({ ...atlas, dozing: true }, 1, null, {}).dimmed, true);
});

test("Each thing a session row did by hand still works: click, double-click to rename, drag and drop, right-click, pin, the menu, Settle and Refresh", async () => {
  const ran = [], hits = [];
  const { agentSession, tokens } = await sidebar(ran);
  const c = tokens(night);
  const row = {
    hovered: true, pin: () => hits.push("pin"), menu: () => hits.push("menu"), hover: () => hits.push("hover"),
    actions: [{ id: "settle", icon: "check", tip: "Settle", act: () => hits.push("settle") }],
    drag: { target: "before", down: () => hits.push("down"), up: () => hits.push("up") },
  };
  const el = agentSession({ ...atlas, status: "done" }, 1, c, row, { refresh: () => hits.push("refresh"), label: "Atlas" });
  assert.equal(handler(el, "id"), "space-agent-t1");
  const cx = { stop_propagation: () => hits.push("stopped"), notify: () => {} };
  handler(el, "on_click")({}, cx);
  assert.deepEqual(plain(ran.at(-1)), ["pane.focus", { pane: "p1" }]);
  handler(el, "on_mouse_down", "left")({ click_count: 2 }, cx);
  assert.deepEqual(plain(ran.at(-1)), ["overlay", "Rename terminal"]);
  handler(el, "on_mouse_down", "left")({ click_count: 1 }, cx);
  handler(el, "on_mouse_up", "left")({}, cx);
  handler(el, "on_mouse_down", "right")({}, cx);
  for (const tool of ["space-agent-t1-tool-0", "space-agent-t1-tool-1", "space-agent-t1-tool-2", "space-agent-t1-action"]) handler(all(el).find((kid) => kid.tag === tool), "on_click")({}, cx);
  assert.deepEqual(hits.filter((hit) => hit !== "stopped"), ["down", "up", "menu", "settle", "pin", "menu", "refresh"]);
  assert.deepEqual(tips(el).filter((tip) => ["Settle", "Pin to the top", "More", "Refresh"].includes(tip)).sort(), ["More", "Pin to the top", "Refresh", "Settle"]);
  assert.ok(all(el).some((kid) => kid.calls.some((call) => call[0] === "bg" && call[1] === c.accent)), "the drop line shows where it lands");
  const peek = await sidebar(ran);
  handler(peek.agentSession({ address: "t9", status: "idle" }, 0, c, null, {}), "on_click")({}, cx);
  assert.deepEqual(plain(ran.at(-1)), ["terminal.peek", { terminal: "t9" }]);
});

test("A session row is the Storybook composition drawn by the app kit, one line or the two-line height the list adds up", async () => {
  const { agentSession, sessionHeight, tokens, H } = await sidebar();
  const c = tokens(night);
  const one = agentSession({ ...atlas, status: "idle" }, 1, c, null, { label: "Atlas" });
  const two = agentSession({ ...atlas, status: "blocked" }, 1, c, null, { label: "Atlas", activity: "Run npm publish?", time: "2m" });
  assert.equal(handler(one, "h"), sessionHeight({}));
  assert.equal(handler(two, "h"), sessionHeight({ activity: "Run npm publish?" }));
  assert.deepEqual([sessionHeight({}), sessionHeight({ activity: "x" })], [H.line, H.two]);
  assert.deepEqual(texts(two), ["Atlas", "2m", "!", "Run npm publish?"], "name, time, the blocked mark, the question");
  assert.ok(typeof sessionRow({ name: "Atlas" }) === "string", "the same composition draws the Storybook's markup");
});
