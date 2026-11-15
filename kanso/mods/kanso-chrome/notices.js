// Every notice the chrome and the updater send: one sentence, the detail kanso-toast shows on hover, the update's icon and the fix word.
const UPDATE_ICON = "refresh";
// An offer stays up long enough to be acted on.
const OFFER_MS = 30000;
const fix = (name, label) => ({ name, args: { label } });
const UPDATE = fix("kanso-tabs.update", "Update");

export const updateAvailable = (version, have) => ({ title: `kansō ${version} is available`, body: `You have ${have}.`, level: "info", icon: UPDATE_ICON, action: UPDATE, timeout: OFFER_MS });
export const alreadyUpdating = () => ({ title: "kansō is already being updated", body: "Another window or the other Update button started it; it finishes on its own.", level: "info", icon: UPDATE_ICON });
export const upToDate = (have) => ({ title: "kansō is up to date", body: `You have ${have}, the newest release.`, level: "info", icon: UPDATE_ICON });
export const updated = (version, notes) => ({ title: `kansō updated to ${version}`, body: notes || undefined, level: "success", icon: UPDATE_ICON });
export const checkFailed = () => ({ title: "GitHub could not be reached", body: "kansō could not check for updates.", level: "error", action: fix("kanso-tabs.check", "Refresh") });
export const installFailed = (why) => ({ title: "kansō was not updated", body: why, level: "error", action: UPDATE });
export const outOfMemory = () => ({ title: "Herdr's mod runtime is out of memory", body: "Panels and bars won't load again until the window restarts; your terminals and agents stay in herdr-core.",
  level: "error", action: fix("kanso-chrome.restart", "Restart") });
