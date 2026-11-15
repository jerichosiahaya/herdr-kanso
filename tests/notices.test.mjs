// kanso-chrome's notices: the out of memory and update notices read as the Notifications page draws them.
import test from "node:test";
import assert from "node:assert/strict";
import { load, clone } from "./helpers.mjs";

const notices = () => load("kanso-chrome/notices.js", ["updateAvailable", "alreadyUpdating", "upToDate", "updated", "checkFailed", "installFailed", "outOfMemory"]);
const fixWord = (n) => n.action?.args?.label ?? null;

test("Update available names the version, leads with the update's icon as a fact and offers Update", async () => {
  const { updateAvailable } = await notices();
  const n = clone(updateAvailable("3.31.0", "3.30.0"));
  assert.equal(n.title, "kansō 3.31.0 is available");
  assert.equal(n.body, "You have 3.30.0.", "the version you have is in the tooltip");
  assert.deepEqual([n.level, n.icon, fixWord(n), n.action.name], ["info", "refresh", "Update", "kanso-tabs.update"]);
  assert.equal(n.timeout, 30000, "it stays up long enough to act on");
});

test("Already updating and up to date are facts with the update's icon and no fix", async () => {
  const { alreadyUpdating, upToDate } = await notices();
  const busy = clone(alreadyUpdating()), current = clone(upToDate("3.31.0"));
  assert.equal(busy.title, "kansō is already being updated");
  assert.equal(current.title, "kansō is up to date");
  assert.equal(current.body, "You have 3.31.0, the newest release.");
  for (const n of [busy, current]) assert.deepEqual([n.level, n.icon, n.action], ["info", "refresh", undefined]);
});

test("Installed leads with the update's icon in done, and the key notes are its tooltip", async () => {
  const { updated } = await notices();
  const n = clone(updated("3.31.0", "kansō's keys updated."));
  assert.equal(n.title, "kansō updated to 3.31.0");
  assert.equal(n.body, "kansō's keys updated.");
  assert.deepEqual([n.level, n.icon], ["success", "refresh"]);
  assert.equal(updated("3.31.0", "").body, undefined, "no notes, no detail");
});

test("Check failed and install failed are failures, each with its fix", async () => {
  const { checkFailed, installFailed } = await notices();
  const check = clone(checkFailed()), install = clone(installFailed("permission denied"));
  assert.equal(check.title, "GitHub could not be reached");
  assert.deepEqual([check.level, fixWord(check), check.action.name], ["error", "Refresh", "kanso-tabs.check"]);
  assert.equal(install.title, "kansō was not updated");
  assert.equal(install.body, "permission denied", "the tool's words are the tooltip");
  assert.deepEqual([install.level, fixWord(install), install.action.name], ["error", "Update", "kanso-tabs.update"]);
});

test("Out of memory is a failure whose fix is Restart", async () => {
  const { outOfMemory } = await notices();
  const n = clone(outOfMemory());
  assert.equal(n.title, "Herdr's mod runtime is out of memory");
  assert.match(n.body, /your terminals and agents stay in herdr-core/);
  assert.deepEqual([n.level, fixWord(n), n.action.name], ["error", "Restart", "kanso-chrome.restart"]);
});
