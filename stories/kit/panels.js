// The panels: each one only calls pieces and compositions with its own props and draws no markup.
import { button, dialog, emptyState, failureBlock, input, list, phrase, release, row, setting, skeletonOf, stack, tabs, toggle, windowMap } from './kit.js';
import { channelSettings, keyboardExplorer, shortcutRow } from './compositions.js';

// Settings: one window, its four pages as Tabs beside the title; Esc closes it.
export const settingsPages = [{ key: 'pieces', label: 'What shows' }, { key: 'keys', label: 'Keys' }, { key: 'news', label: 'What’s new' }, { key: 'credits', label: 'Credits' }];
const findField = (query) => input({ label: 'Find', icon: 'lu-search', ...(query ? { text: query, focus: true } : {}) });
const heading = (name, extra = {}) => row({ name, heading: true, ...extra });

// What shows. A piece's row: its name, where it lives when found, the needed choice in words, its switch; off is dimmed.
const orderTools = [{ label: 'Move up', icon: 'lu-chevron-up' }, { label: 'Move down', icon: 'lu-chevron-down' }];
const pieceRow = ({ name, on = true, when = null, where = null, order = false, selected = false, pending = false }) => row({
  name, detail: where, meta: on ? when : null, dimmed: !on, current: selected, pending, actions: order ? orderTools : [], tools: [toggle({ checked: on, label: name })],
});
const hiddenRow = (hover) => ([name, where]) => row({ name, hover: hover === name, detail: hover === name ? where : null, action: hover === name ? { label: 'Show', kind: 'quiet' } : null });
const hiddenList = ({ hidden, hover }) => list(heading('Hidden by you', { action: hidden.length ? { label: 'Show all', kind: 'quiet' } : null }),
  hidden.length ? hidden.map(hiddenRow(hover)) : emptyState({ icon: 'lu-eye', text: 'Nothing hidden' }));
// The map names each area; Hidden by you and Behind the scenes sit under it.
const areaPicker = ({ area }) => stack({ variant: 'column' }, windowMap({ picked: area }), ['Hidden by you', 'Behind the scenes'].map((name) => row({ name, current: area === name })));
const areaList = ({ name, stops, pieces, order, selected, pending, changed }) => stack({ variant: 'column' },
  heading(name, { second: stops, action: changed ? { label: changed === 'undo' ? 'Back to the defaults' : 'Reset all', kind: 'quiet' } : null }),
  pieces.map((item) => pieceRow({ ...item, order, selected: item.name === selected, pending: item.name === pending })));
const foundList = ({ rows }) => rows.length
  ? stack({ variant: 'column' }, heading('Find'), rows.map(([name, where, on = true]) => pieceRow({ name, where, on })))
  : emptyState({ icon: 'lu-search', text: 'No piece matches' });
export const whatShows = ({ view = 'hidden', query = null, hidden = [], hover = null, area = null, areas = {}, found = { rows: [] }, selected = null, pending = null, changed = null }) => view === 'hidden'
  ? list(stack({ variant: 'line' }, findField(query), button({ label: 'Browse the window', kind: 'quiet' })), hiddenList({ hidden, hover }))
  : list(findField(query), stack({ variant: 'columns' }, areaPicker({ area: view === 'find' ? null : area }),
    view === 'find' ? foundList(found) : areaList({ name: area, ...areas[area], selected, pending, changed })));

// Keys: the keyboard of one layer and the picked key, then kansō's groups folded to a line; an open group lists its Shortcut rows in place.
const groupRow = (name, actions) => row({ name, chip: phrase(actions.length) });
// The group the dōjō practises ends with the way there.
const practiceRow = () => row({ name: 'Practice them', action: { label: 'hjkl dōjō', kind: 'quiet' } });
const groupBlock = (open, practice) => ([name, actions]) => (name === open
  ? list(groupRow(name, actions), actions.map((item) => shortcutRow(item)), name === practice ? practiceRow() : null)
  : groupRow(name, actions));
const herdrKeys = (count) => row({ name: 'Herdr’s keys', chip: phrase(count), flag: 'lu-external-link' });
export const settingsKeys = ({ query = null, os, layer, picked, groups = {}, herdr = 0, open = null, practice = null }) => list(findField(query), keyboardExplorer({ os, layer, picked }),
  open ? list(Object.entries(groups).map(groupBlock(open, practice)), herdrKeys(herdr)) : stack({ variant: 'columns' }, Object.entries(groups).map(groupBlock(open, practice)), herdrKeys(herdr)));

// What's new: the channel, the checks, then the releases from the newest; the installed one is where you are.
const checks = ({ auto = true, checking = false }) => setting({ label: 'Check for kansō updates', control: toggle({ checked: auto, label: 'Check for kansō updates' }),
  link: button({ label: checking ? 'Checking…' : 'Check for updates', kind: 'quiet', size: 'sm', spin: checking }) });
const releases = ({ newer, installed, older, installing = false, unfolded = [] }) => stack({ variant: 'timeline' },
  newer ? release({ ...newer, node: 'newer', action: phrase(installing ? 'Updating to' : 'Update to', newer.version) }) : null,
  release({ ...installed, node: 'here', changes: [] }),
  unfolded.length ? unfolded.map((item) => release({ ...item, node: 'newer' })) : release({ version: phrase(older.from, 'to', older.to), node: 'older' }));
const stale = ({ read }) => setting({ label: phrase('Read', read, '· GitHub not answering'), control: button({ label: 'Refresh', kind: 'quiet', size: 'sm' }) });
export const whatsNew = ({ channel = 'stable', art = true, auto, checking, reading = false, failure = null, read = null, stay = null, ...timeline }) => list(
  channelSettings({ channel, art }), checks({ auto, checking }),
  stay ? setting({ label: stay }) : null,
  read ? stale({ read }) : null,
  reading ? skeletonOf({ shape: 'line', count: 4 }) : failure ? failureBlock(failure) : releases(timeline));

// Credits: where kansō comes from, each one opening its page; then who maintains it.
const placeRow = (hover) => ({ name, note, url }) => row({ name, hover: hover === name, detail: hover === name ? note : null, meta: hover === name ? url : null, flag: hover === name ? 'lu-external-link' : null });
export const credits = ({ places = [], maintainers = [], hover = null }) => list(places.map(placeRow(hover)), row({ name: 'Maintained by', detail: maintainers }));

const pageBody = { pieces: whatShows, keys: settingsKeys, news: whatsNew, credits };
export const settings = ({ page = 'pieces', ...props }) => dialog({
  title: 'kansō settings', size: 'window',
  tools: [tabs({ items: settingsPages, value: page, size: 'sm', track: true, label: true })],
  body: pageBody[page](props),
});
