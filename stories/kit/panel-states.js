// The panels' named states: each one a preset of its panel's props, the catalog draws its record from it.
import { settings } from './panels.js';
import { keyLayer } from './samples.js';
import { sampleAreas, sampleCustomPanel, sampleFound, sampleHerdrKeys, sampleHidden, sampleKeyGroups, sampleMaintainers, samplePlaces, sampleReleases, sampleTaken } from './panel-samples.js';

// Settings: each page with its samples, then each state as what changes on it.
const shows = (extra) => ({ page: 'pieces', hidden: sampleHidden, areas: sampleAreas, ...extra });
const picked = (area, extra = {}) => shows({ view: 'area', area, ...extra });
const withPanel = { ...sampleAreas, Panels: { ...sampleAreas.Panels, pieces: [...sampleAreas.Panels.pieces, sampleCustomPanel] } };
const keys = (extra) => ({ page: 'keys', os: 'mac', layer: keyLayer('mac', 'alt cmd'), picked: 'h', groups: sampleKeyGroups, herdr: sampleHerdrKeys, practice: 'Vim keys', ...extra });
// An open group: its rows at rest, the first one in the given state.
const opened = (group, first = {}) => keys({ open: group, groups: { ...sampleKeyGroups, [group]: sampleKeyGroups[group].map((item, index) => (index ? item : { ...item, ...first })) } });
const news = (extra) => ({ page: 'news', newer: sampleReleases.newer, installed: sampleReleases.installed, older: sampleReleases.older, ...extra });
const credits = (extra) => ({ page: 'credits', places: samplePlaces, maintainers: sampleMaintainers, ...extra });

export const settingsViews = {
  'What you hid': [shows({}), 'Opens on what you hid, one press each to show again.'],
  'A hidden row under the pointer': [shows({ hover: 'Minimap' }), 'Where it lives, and Show.'],
  'Nothing hidden': [shows({ hidden: [] }), 'Nothing is hidden.'],
  ...Object.fromEntries(Object.keys(sampleAreas).map((area) => [`${area} picked`, [picked(area), `Browse the window: the ${area.toLowerCase()} area’s pieces, each with its switch.`]])),
  'From a piece’s right-click': [picked('Status bar', { selected: 'Memory low' }), 'Settings for this… lands on its area with its row washed.'],
  'Just switched': [picked('Status bar', { pending: 'Reviews waiting' }), 'On at once, with the breathing dot until it is written.'],
  Changed: [picked('Pane header', { changed: 'reset' }), 'A choice differs from its default: Reset all.'],
  'After Reset all': [picked('Pane header', { changed: 'undo' }), 'Reset all can be taken back until the page changes.'],
  'Panels in order': [picked('Panels', { areas: withPanel }), 'A panel another mod adds sits with the others; each moves up or down.'],
  'Find, matches': [shows({ view: 'find', query: sampleFound.query, found: sampleFound }), 'Matches across areas, each with where it lives.'],
  'Find, nothing': [shows({ view: 'find', query: 'zzz' }), 'Find matches no piece.'],
  Keys: [keys({}), 'The keyboard of one layer with the picked key, then kansō’s groups and Herdr’s.'],
  ...Object.fromEntries(Object.keys(sampleKeyGroups).map((group) => [group, [opened(group), `The ${group.toLowerCase()} group’s keys.`]])),
  'Key, capture': [opened('Vim keys', { state: 'capture' }), 'A click on a row waits for the new key.'],
  'Key, changed': [opened('Vim keys', { state: 'changed' }), 'A key differs from the one kansō ships: Reset.'],
  'Key, unbound': [opened('Vim keys', { state: 'unbound' }), 'A key was removed.'],
  'Key, taken': [opened('Vim keys', { state: 'taken', taken: sampleTaken }), 'The key already does something: a second press takes it.'],
  'Key, not saved': [opened('Vim keys', { state: 'failed', source: 'keys.json: EACCES: permission denied' }), 'keys.json refused the write.'],
  'Numbered keys, capture': [opened('Moving along the strip', { state: 'capture', chords: ['⌘N'] }), 'A numbered family waits for a key with a digit; N takes its place.'],
  'Numbered keys, no digit': [opened('Moving along the strip', { state: 'no digit', chords: ['⌘N'] }), 'The key had no digit; N takes the digit’s place.'],
  'A newer release': [news({}), 'Stable Mode, a newer release out: its node carries the one action.'],
  'Older releases open': [news({ unfolded: [sampleReleases.installed] }), 'Older opens in place.'],
  'Dawn Mode': [news({ channel: 'dawn', newer: sampleReleases.dawn }), 'Dawn Mode, on a newer build.'],
  'Back on Stable Mode': [news({ newer: null, stay: 'Your Dawn Mode build stays until Stable Mode passes it.' }), 'Back on Stable Mode from a beta.'],
  'Up to date': [news({ newer: null }), 'The installed release is the newest.'],
  Checking: [news({ newer: null, checking: true }), 'A check is running.'],
  'Checks off': [news({ auto: false }), 'Automatic checks are off.'],
  Updating: [news({ installing: true }), 'The update is installing.'],
  'First read': [news({ reading: true }), 'The changelog is being read.'],
  'GitHub not answering': [news({ read: '14:02' }), 'The last copy, with when it was read.'],
  'Nothing kept': [news({ failure: { text: 'Can’t read what’s new', source: 'GitHub not answering, and no copy was kept', fix: 'Refresh' } }), 'Nothing to show.'],
  Credits: [credits({}), 'Where kansō comes from, and who maintains it.'],
  'A place under the pointer': [credits({ hover: 'Herdr' }), 'What it is, and the open mark.'],
};

export const panelPages = {
  'Panels/Settings': {
    args: { view: 'What you hid' },
    markup: ({ view }) => settings(settingsViews[view][0]),
    states: Object.entries(settingsViews).map(([label, [, caption]]) => ({ label, args: { view: label }, caption })),
  },
};

export const panelPlaygrounds = {
  'Panels/Settings': { ...panelPages['Panels/Settings'], argTypes: { view: { name: 'what it shows', control: { type: 'select' }, options: Object.keys(settingsViews) } } },
};
