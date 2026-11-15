// The sidebar footer as data: its rows in their words, and the Settings menu's entries.
import { parseRelease } from "./release.js";

export const KANSO_SETTINGS = "kanso-tabs.settings";

// A Dawn Mode build is a prerelease: its row names the build, not kansō.
export const updateLabel = (version, busy) => {
  if (busy) return "Updating kansō";
  return parseRelease(version)?.channel ? `Update to ${version}` : `Update kansō to ${version}`;
};

/** kansō's update while one is offered (quiet once pressed), Settings, and Add computer unless it is switched off. */
export const footerRows = ({ update = null, busy = false, machine = true } = {}) => [
  ...(update ? [{ key: "kanso-update", icon: "refresh-cw", name: updateLabel(update, busy), chrome: true, quiet: busy }] : []),
  { key: "settings", icon: "settings", name: "Settings", quiet: true },
  ...(machine ? [{ key: "machine", icon: "server", name: "Add computer", quiet: true }] : []),
];

/** The chord bound to kansō settings, or null. `bindings`: Herdr's keys(). */
export const settingsChord = (bindings) => bindings.find((binding) => binding.action === KANSO_SETTINGS)?.keys ?? null;

/** kansō settings with its key, Herdr settings and, while Herdr has `ready` waiting, its update after a line. */
export const settingsEntries = ({ ready = null, hint = null } = {}) => [
  { key: "kanso", icon: "sliders-vertical", label: "kansō settings", hint },
  { key: "herdr", icon: "panels-top-left", label: "Herdr settings" },
  ...(ready ? [{ separator: true }, { key: "update-herdr", icon: "refresh-cw", label: `Update Herdr to ${ready}`, verb: "restart Herdr" }] : []),
];
