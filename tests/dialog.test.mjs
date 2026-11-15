// The kit dialog: a field only when it asks for a name, a free body under it, notes in order, and the main action's look.
import test from "node:test";
import assert from "node:assert/strict";
import { dialog } from "../stories/kit/pieces.js";

const rename = { title: "Rename checkout", value: "checkout", placeholder: "Name", primary: "Rename", state: "default", secondary: "Cancel" };
const count = (html, text) => html.split(text).length - 1;
const order = (html, ...parts) => parts.map((part) => html.indexOf(part));

test("A dialog with a value or a placeholder asks for a name, and one with neither shows only its body", () => {
  assert.equal(count(dialog(rename), "kanso-field"), 1);
  assert.equal(count(dialog({ ...rename, value: "" }), "kanso-dialog__placeholder"), 1);
  const list = dialog({ title: "Arrangements", body: '<div class="kanso-dialog__list"></div>', primary: "Save this tab" });
  assert.equal(count(list, "kanso-field"), 0);
  assert.equal(count(list, "kanso-dialog__list"), 1);
});

test("The body sits under the field and above the notes, and the footer comes last", () => {
  const html = dialog({ ...rename, body: '<div class="kanso-arrangement"></div>', note: "Taken", tone: "error" });
  const places = order(html, "kanso-field", "kanso-arrangement", "kanso-dialog__note", "kanso-dialog__footer");
  assert.ok(places.every((place) => place > 0));
  assert.deepEqual(places, [...places].sort((a, b) => a - b));
});

test("Notes come before the note, in order, and each wears its tone, a dim one with no modifier", () => {
  const html = dialog({ ...rename, notes: [{ text: "Each program is kept." }, { text: "Ask first.", tone: "muted" }], note: "This replaces web and api.", tone: "error" });
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

test("A rename dialog with no body, notes or kind draws the same markup as before", () => {
  assert.equal(dialog({ ...rename, scope: "acme-shop", note: "Taken", tone: "error" }),
    '<div class="kanso-dialog kanso-popover"><div class="kanso-dialog__header"><span class="kanso-dialog__title">Rename checkout</span></div>'
    + '<div class="kanso-dialog__scope">acme-shop</div>'
    + '<div class="kanso-field kanso-control--focus kanso-dialog__section" tabindex="0">checkout<span class="kanso-caret"></span></div>'
    + '<div class="kanso-dialog__note kanso-dialog__note--error">Taken</div>'
    + '<div class="kanso-dialog__footer"><span class="kanso-button kanso-button--quiet kanso-text--fg" tabindex="0" title="Cancel">Cancel</span>'
    + '<span class="kanso-button kanso-button--solid" tabindex="0" title="Rename">Rename</span></div></div>');
});
