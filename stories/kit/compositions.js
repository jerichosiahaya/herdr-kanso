// The kit's compositions: each one only calls pieces with its own props and draws no markup.
import { avatar, button, chip, dawn, setting, toggle, failureLine, glyph, grow, list, mark, menu, phrase, pieceLines, plus, row, stack, statusItem, tabSkeleton, tabs, windowControls } from './pieces.js';

const tool = (icon, label) => button({ label, kind: 'icon', size: 'lg', icon });
const more = (open) => stack({ variant: 'toolbar group', open }, tool(open ? 'lu-chevron-up' : 'lu-chevron-down', open ? 'Fewer tools' : 'More tools'), open ? [tool('lu-arrow-up-down', 'Sort'), tool('lu-search', 'Search')] : null);
export const toolbar = ({ column = false, open = false } = {}) => column
  ? stack({ variant: 'toolbar', column }, tool('lu-panel-left', 'Show sidebar'), tool('lu-plus', 'New'), more(open))
  : stack({ variant: 'toolbar' }, tool('lu-plus', 'New'), grow(), tool('lu-arrow-up-down', 'Sort'), tool('lu-search', 'Search'), tool('lu-panel-left', 'Hide sidebar'));

// Sidebar compositions: each one is the Row, Tab, Menu, Avatar, Mark, Chip or Button in its own configuration.
const icon = (name, label) => ({ icon: name, label });

export const sessionRow = ({ program = 'p-claude', name, activity = null, time = null, place = null, status = 'working', depth = 1, current = false, pinned = false, commands = 0, hover = false, focus = false, dimmed = false }) => row({
  icon: program, name, second: activity, detail: place, meta: time, mark: status, depth, current, dimmed, hover, focus,
  glint: status === 'working', flag: pinned ? 'lu-pin' : null, chip: commands, actions: [icon('lu-pin', 'Pin to the top'), icon('lu-ellipsis', 'More')],
});

export const projectRow = ({ name, folder = null, branch = null, sync = null, open = false, status = 'blocked', count = 0, hover = false, focus = false }) => row({
  name, heading: true, current: open, hover, focus, detail: [folder, branch && { icon: 'lu-git-branch', text: branch }, sync],
  mark: count ? status : 'none', meta: count || null, actions: [icon('lu-plus', phrase('New agent in', name)), icon('lu-ellipsis', 'More')],
});

export const computerStates = ['on', 'off', 'unreachable'];
export const computerRow = ({ name, remote = true, state = 'on', status = 'blocked', count = 0, hover = false, focus = false }) => row({
  icon: remote ? 'lu-server' : 'lu-monitor', name, heading: true, hover, focus,
  mark: count && state === 'on' ? status : 'none', meta: { off: 'Off', unreachable: 'Unreachable' }[state] ?? (count || null),
  action: state === 'off' ? { kind: 'icon', ...icon('lu-power', phrase('Turn', name, 'on')) } : state === 'unreachable' ? { kind: 'icon', ...icon('lu-refresh-cw', 'Refresh') } : null,
  actions: state === 'on' && remote ? [icon('lu-power', 'Turn off'), icon('lu-plus', phrase('New project on', name)), icon('lu-arrow-right-left', 'Sync')] : [],
});

export const section = ({ title, status = 'none', count = 0 }) => row({ name: title, heading: true, mark: status, meta: count || null });

export const asleep = ({ names = [], open = false } = {}) => list(row({ name: 'Asleep', heading: true, mark: 'asleep', meta: open ? null : phrase(names.length) }),
  open ? names.map((name) => row({ name, depth: 1, dimmed: true, action: { label: 'Wake', kind: 'quiet' } })) : null);

export const views = [
  { key: 'spaces', label: 'Projects', icon: 'lu-folder' },
  { key: 'agents', label: 'Status', icon: 'lu-activity' },
  { key: 'threads', label: 'Threads', icon: 'lu-message-square' },
];
// Collapsed, one button for the current view opens the menu of all three.
export const viewSwitch = ({ view = 'spaces', column = false, open = false } = {}) => {
  if (!column) return stack({ variant: 'view switch' }, tabs({ items: views, value: view, size: 'sm', track: true, label: true }));
  const current = views.find((item) => item.key === view) ?? views[0];
  const list = open ? stack({ variant: 'view menu' }, menu({ items: views.map((item) => ({ ...item, selected: item.key === current.key })) })) : null;
  return stack({ variant: 'view switch' }, button({ label: current.label, kind: 'icon', size: 'lg', icon: current.icon, active: open }), list);
};

export const sidebarFooter = ({ update = null } = {}) => stack({ variant: 'footer' }, update ? row({ icon: 'lu-refresh-cw', name: update }) : null, row({ icon: 'lu-settings', name: 'Settings' }), row({ icon: 'lu-server', name: 'Add computer' }));

export const tile = ({ initial = null, tone = 'teal', status = 'none', count = 0, open = false }) => stack({ variant: 'rail tile', on: open },
  initial ? avatar({ initial, tone, size: 'md' }) : mark({ status, size: 'lg' }), count ? chip({ label: count, quiet: true, tone: status === 'blocked' ? 'blocked' : null }) : null);

// Status bar compositions: a computer stands in for its sidebar row; the rest are the bar's Menus and Buttons.
export const computerItemStates = ['on', 'unreachable', 'pending'];
// Unreachable is said in words with Refresh; folded, the name gives way to its icon.
export const computerItem = ({ name, remote = true, state = 'on', folded = false }) => state === 'unreachable'
  ? failureLine({ text: phrase("Can't reach", name), fix: 'Refresh', detail: phrase('ssh: connect to host', name, 'port 22: Operation timed out') })
  : statusItem({ icon: remote ? 'lu-server' : 'lu-monitor', text: folded ? null : name, pending: state === 'pending' });

export const stepperMenu = () => menu({ title: 'Panes per view', items: [{ icon: 'lu-move-horizontal', label: 'Even out', hint: '⌘⇧0' }, ...pieceLines] });
// The command palette's only pointer door; its key is in the tooltip.
export const paletteDoor = () => button({ label: 'Command palette ⌘K', kind: 'icon', size: 'sm', icon: 'lu-command' });
export const layoutPaused = () => failureLine({ text: 'Layout paused', fix: 'Resume', detail: 'layout write refused 3 times' });

// A failing row's right-click Menu: the source's words, the fixes, Explain, then the piece lines.
export const failureMenu = ({ source, fixes = [], agent = null }) => menu({ title: source, items: [...fixes.map((label) => ({ label })), ...(agent ? [{ icon: 'lu-bot', label: phrase('Explain to', agent) }] : []), ...pieceLines] });

// While you were away: what nothing in view says, four rows then +N more; nothing new takes no space.
const awayRow = (hover, focus) => ({ icon: lead, tone = null, subject, fact: what, detail = null, age }, index) => row({ icon: lead, tone, name: subject, detail: what, second: detail, meta: age, hover: index === hover, focus: index === focus });
export const activity = ({ events = [], max = 4, hover = -1, focus = -1 } = {}) => events.length ? stack({ variant: 'away' },
  row({ name: 'While you were away', heading: true, action: { label: 'Dismiss these', kind: 'icon', icon: 'lu-x' } }),
  events.slice(0, max).map(awayRow(hover, focus)), events.length > max ? button({ label: phrase(plus(events.length - max), 'more'), kind: 'quiet', size: 'sm' }) : null) : null;
export const activityMenu = () => menu({ title: 'While you were away', items: [{ icon: 'lu-x', label: 'Dismiss these' }, ...pieceLines] });

// Edges: the panes past each side, one icon Button per pane, the panes of one column grouped; a click goes there, the name is the tooltip.
// Past max columns the farthest fold behind +N, a Menu; a lit pane (its Needs you hovered) takes the active fill, or +N when it is folded.
const chevrons = { left: 'lu-chevron-left', right: 'lu-chevron-right' };
const paneButton = ({ program = 'p-claude', name, lit = false }) => button({ label: name, kind: 'icon', size: 'sm', icon: program, active: lit });
export const edge = ({ side = 'right', columns = [], drop = false, max = 4, overflow = false } = {}) => {
  const shown = columns.slice(0, max), folded = columns.slice(max).flat();
  const more = folded.length ? stack({ variant: 'edge more' }, button({ label: plus(folded.length), kind: 'quiet', size: 'sm', active: overflow || folded.some((pane) => pane.lit) }),
    overflow ? stack({ variant: 'edge menu', [side]: true }, menu({ items: folded.map(({ program = 'p-claude', name }) => ({ icon: program, label: name })) })) : null) : null;
  return stack({ variant: 'edge', target: drop }, glyph(chevrons[side]), shown.map((panes) => stack({ variant: 'edge column' }, panes.map(paneButton))), more);
};

// Tab bar: the Tab primitive for the tabs, icon Buttons for everything else.
export const panelDoors = [
  { key: 'files', label: 'Files', icon: 'lu-file' }, { key: 'spend', label: 'Spend', icon: 'lu-chart-column' }, { key: 'pr', label: 'PR', icon: 'lu-git-pull-request' },
  { key: 'shipped', label: 'Shipped', icon: 'lu-trophy' }, { key: 'worktrees', label: 'Worktrees', icon: 'lu-git-fork' }, { key: 'ports', label: 'Ports', icon: 'lu-plug' },
  { key: 'containers', label: 'Containers', icon: 'lu-container' }, { key: 'memory', label: 'Memory', icon: 'lu-memory-stick' }, { key: 'images', label: 'Images', icon: 'lu-image' },
];
const door = (icon, label, active = false) => button({ label, kind: 'icon', icon, active });
export const tabBarStates = ['connected', 'connecting', 'unreachable'];
// Folded tabs go behind +N, a Menu with their marks; + and Arrange never fold.
export const tabBar = ({ items = [], value = null, folded = [], overflow = false, panels = panelDoors, panel = null, state = 'connected', windows = false } = {}) => {
  const connected = state === 'connected';
  const tabList = state === 'connecting' ? [tabSkeleton(), tabSkeleton()]
    : tabs({ items: items.map((item) => ({ closable: true, ...item })), value, size: 'md', disabled: state === 'unreachable', label: true });
  const more = folded.length && connected ? stack({ variant: 'tab bar more' }, button({ label: plus(folded.length), kind: 'quiet', active: overflow }),
    overflow ? stack({ variant: 'tab bar menu' }, menu({ items: folded.map((item) => ({ label: item.label, mark: item.mark })) })) : null) : null;
  const tools = connected ? [door('lu-plus', 'New tab'), door('lu-panels-top-left', 'Arrange')] : null;
  const right = connected ? panels.map((item) => door(item.icon, item.label, item.key === panel)) : null;
  const system = windows ? [door('lu-minus', 'Minimize'), door('lu-square', 'Maximize'), door('lu-x', 'Close')] : null;
  return stack({ variant: 'tab bar' }, tabList, more, tools, grow(), stack({ variant: 'tab bar doors' }, right, system));
};

// Cells

// Dawn Mode: the pill always says the mode at the right of the open header; the sky behind the lights is optional. Stable Mode shows nothing.
export const header = ({ collapsed = false, dawn: early = false, art = true, open = false } = {}) => stack({ variant: 'header', collapsed },
  early && art ? dawn() : null, stack({ variant: 'header title' }, windowControls(), early && !collapsed ? chip({ label: 'Dawn Mode', pill: true }) : null),
  toolbar({ column: collapsed, open }));

// The channel in Settings · Updates: one press switches; Dawn Mode says it can break, and the sky can be turned off.
export const channels = [{ key: 'stable', label: 'Stable Mode' }, { key: 'dawn', label: 'Dawn Mode' }];
export const channelSettings = ({ channel = 'stable', art = true } = {}) => list(
  setting({ label: 'Updates', control: tabs({ items: channels, value: channel, size: 'sm', track: true, label: true }), note: channel === 'dawn' ? 'Dawn Mode gets changes first. It can break.' : null,
    link: channel === 'dawn' ? button({ label: 'Star on GitHub', kind: 'quiet', size: 'sm' }) : null }),
  channel === 'dawn' ? setting({ label: 'Dawn sky', control: toggle({ checked: art, label: 'Dawn sky' }) }) : null);

// The rows and tiles of the current view come in drawn; the sidebar only places them.
export const sidebar = ({ collapsed = false, dawn: early = false, art = true, view = 'spaces', switcher = true, menu: open = false, rows = [], tiles = [], away = null } = {}) => collapsed
  ? stack({ variant: 'rail' }, header({ collapsed, dawn: early, art }), switcher ? viewSwitch({ view, column: true, open }) : null, stack({ variant: 'rail list' }, tiles), stack({ variant: 'rail footer' }, tool('lu-settings', 'Settings')))
  : stack({ variant: 'sidebar' }, header({ dawn: early, art }), switcher ? viewSwitch({ view }) : null, stack({ variant: 'rows' }, rows), away, sidebarFooter());

// Two halves around the fixed slot of panes per view; each half folds its own items.
export const statusBar = ({ left = [], middle = null, right = [], popup = null } = {}) => stack({ variant: 'status bar', grid: true },
  stack({ variant: 'status bar left' }, left), stack({ variant: 'status bar middle' }, middle), stack({ variant: 'status bar right' }, right), popup ? stack({ variant: 'status bar popup' }, popup) : null);
