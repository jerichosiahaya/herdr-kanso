// The kit dialog: the title, the body its use composes, notes in order, then Cancel before the one primary.
import test from "node:test";
import assert from "node:assert/strict";
import { dialog, input } from "../stories/kit/pieces.js";

const rename = { title: "Rename checkout", body: input({ text: "checkout", label: "Name", focus: true }), primary: "Rename", secondary: "Cancel" };
const count = (html, text) => html.split(text).length - 1;
const fields = (html) => html.match(/class="kanso-field[ "]/g)?.length ?? 0;
const order = (html, ...parts) => parts.map((part) => html.indexOf(part));

test("A dialog draws no field of its own: a field is part of the body its use gives", () => {
  assert.equal(fields(dialog(rename)), 1);
  const list = dialog({ title: "Arrangements", body: '<div class="kanso-dialog__list"></div>', primary: "Save this tab" });
  assert.equal(fields(list), 0);
  assert.equal(count(list, "kanso-dialog__list"), 1);
});

test("The body sits under the title and above the notes, and the footer comes last", () => {
  const html = dialog({ ...rename, notes: [{ text: "Taken", tone: "error" }] });
  const places = order(html, "kanso-dialog__title", "kanso-dialog__body", "kanso-dialog__note", "kanso-dialog__footer");
  assert.ok(places.every((place) => place > 0));
  assert.deepEqual(places, [...places].sort((a, b) => a - b));
});

test("Notes keep their order and each wears its tone, a dim one with no modifier", () => {
  const html = dialog({ ...rename, notes: [{ text: "Each program is kept." }, { text: "Ask first.", tone: "muted" }, { text: "This replaces web and api.", tone: "error" }] });
  assert.equal(count(html, '<div class="kanso-dialog__note'), 3);
  assert.ok(html.includes('<div class="kanso-dialog__note">Each program is kept.</div>'));
  assert.ok(html.includes('<div class="kanso-dialog__note kanso-dialog__note--muted">Ask first.</div>'));
  assert.ok(html.includes('<div class="kanso-dialog__note kanso-dialog__note--error">This replaces web and api.</div>'));
  const places = order(html, "Each program is kept.", "Ask first.", "This replaces web and api.");
  assert.deepEqual(places, [...places].sort((a, b) => a - b));
});

test("The main action is solid unless the dialog asks for another look, and the other action is quiet", () => {
  const solid = dialog(rename);
  assert.ok(solid.includes('class="kanso-button kanso-button--solid" tabindex="0" title="Rename"'));
  assert.ok(solid.includes('class="kanso-button kanso-button--quiet kanso-text--fg" tabindex="0" title="Cancel"'));
  assert.ok(dialog({ ...rename, kind: "tonal" }).includes('class="kanso-button kanso-button--tonal" tabindex="0" title="Rename"'));
});

test("Cancel alone keeps the footer, and a dialog with nothing to press has none", () => {
  assert.equal(count(dialog({ ...rename, primary: null }), "kanso-dialog__footer"), 1);
  assert.equal(count(dialog({ title: "Wake", notes: [{ text: "That is no longer asleep" }] }), "kanso-dialog__footer"), 0);
});

test("A rename dialog draws its title, its field in the body and Cancel before Rename", () => {
  assert.equal(dialog({ ...rename, scope: "acme-shop", notes: [{ text: "Taken", tone: "error" }] }),
    '<div class="kanso-dialog kanso-popover" role="dialog"><div class="kanso-dialog__header"><span class="kanso-dialog__title">Rename checkout</span></div>'
    + '<div class="kanso-dialog__scope">acme-shop</div>'
    + `<div class="kanso-dialog__body">${rename.body}</div>`
    + '<div class="kanso-dialog__note kanso-dialog__note--error">Taken</div>'
    + '<div class="kanso-dialog__footer"><span class="kanso-button kanso-button--quiet kanso-text--fg" tabindex="0" title="Cancel">Cancel</span>'
    + '<span class="kanso-button kanso-button--solid" tabindex="0" title="Rename">Rename</span></div></div>');
});
