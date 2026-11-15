// The kit's compositions: each one only calls pieces with its own props and draws no markup.
import { avatar, button, chip, chord, dawn, dialog, diffText, emptyState, facts, headerSegment, input, paneName, setting, toggle, failureBlock, failureLine, glyph, grow, keycap, keyPicked, list, mark, menu, phrase, pieceLines, plus, row, skeletonOf, stack, statusItem, tabSkeleton, tabs, toast, windowControls } from './kit.js';

const tool = (icon, label) => button({ label, kind: 'icon', size: 'lg', icon });
// + names what it adds in the view on show.
export const addLabels = { spaces: 'Add project', agents: 'New conversation', threads: 'New conversation' };
// A tool whose menu, open, hangs under it.
const menuTool = ({ variant, flags = {}, label, icon, open }) => stack({ variant, ...flags },
  button({ label, kind: 'icon', size: 'lg', icon, active: Boolean(open) }), open ? stack({ variant: 'toolbar menu' }, open) : null);
// Sort is quieter at its default.
const sortTool = ({ sorted, menu: open }) => menuTool({ variant: 'toolbar sort', flags: { sorted }, label: 'Sort', icon: 'lu-arrow-up-down', open });
// Collapsed, the bar contracts: + and Show sidebar stay, Sort and Search fold under a caret.
const more = (open, sort) => stack({ variant: 'toolbar group', open }, tool(open ? 'lu-chevron-up' : 'lu-chevron-down', open ? 'Fewer tools' : 'More tools'), open ? [sortTool(sort), tool('lu-search', 'Search')] : null);
export const toolbar = ({ view = 'spaces', column = false, open = false, sorted = false, sortMenu = null, addMenu = null } = {}) => {
  const add = menuTool({ variant: 'toolbar add', label: addLabels[view], icon: 'lu-plus', open: addMenu });
  const sort = { sorted, menu: sortMenu };
  return column
    ? stack({ variant: 'toolbar', column }, add, tool('lu-panel-left', 'Show sidebar'), more(open, sort))
    : stack({ variant: 'toolbar' }, add, grow(), sortTool(sort), tool('lu-search', 'Search'), tool('lu-panel-left', 'Hide sidebar'));
};

// Sidebar compositions: each one is the Row, Tab, Menu, Avatar, Mark, Chip or Button in its own configuration.
const icon = (name, label) => ({ icon: name, label });

export const sessionRow = ({ program = 'p-claude', name, activity = null, time = null, place = null, status = 'working', depth = 1, current = false, pinned = false, commands = 0, strong = false, late = false, hover = false, focus = false, dimmed = false }) => row({
  icon: program, name, second: activity, detail: place, meta: time, mark: status, depth, current, dimmed, strong, late, hover, focus,
  glint: status === 'working', flag: pinned ? 'lu-pin' : null, chip: commands, actions: [icon('lu-pin', 'Pin to the top'), icon('lu-ellipsis', 'More')],
});

// Closed, a kept project steps down; its folder gone, it says so; a pull running, the pending dot.
export const projectRow = ({ name, folder = null, branch = null, sync = null, open = false, closed = false, missing = false, pulling = false, status = 'blocked', count = 0, hover = false, focus = false }) => row({
  name, heading: true, current: open, dimmed: closed, pending: pulling, hover, focus, detail: missing ? 'Not found' : [folder, branch && { icon: 'lu-git-branch', text: branch }, sync],
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

export const asleep = ({ names = [], open = false, focus = null } = {}) => list(row({ name: 'Asleep', heading: true, mark: 'asleep', meta: open ? null : phrase(names.length) }),
  open ? names.map((name) => row({ name, depth: 1, dimmed: true, focus: name === focus, action: { label: 'Wake', kind: 'quiet' } })) : null);
// A rail group's list: each row with its project and mark, then the way to the project.
export const railMenu = ({ title, rows = [], project = false }) => menu({ title, items: [
  ...rows.map(({ name, place, status }) => ({ icon: status === 'asleep' ? 'lu-moon' : 'lu-terminal', label: name, hint: place })),
  ...(project ? [{ separator: true }, { icon: 'lu-chevron-right', label: 'Go to project' }] : [])] });
// Needs you, over the list: how many wait; opened, the queue takes the list's place.
export const needsControl = ({ label }) => stack({ variant: 'view switch' }, button({ label, kind: 'quiet', size: 'sm' }));

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

// The update's one icon: the footer row that runs it and every notice about it.
export const updateIcon = 'lu-refresh-cw';
export const sidebarFooter = ({ update = null } = {}) => stack({ variant: 'footer' }, update ? row({ icon: updateIcon, name: update }) : null, row({ icon: 'lu-settings', name: 'Settings' }));

export const tile = ({ initial = null, tone = 'teal', status = 'none', count = 0, open = false }) => stack({ variant: 'rail tile', on: open },
  initial ? avatar({ initial, tone, size: 'md' }) : mark({ status, size: 'lg' }), count ? chip({ label: count, quiet: true, tone: status === 'blocked' ? 'blocked' : null }) : null);

// Add computer: hosts from ~/.ssh/config, then a typed target; Add is optimistic and a refusal puts the failure block under its host.
const hostFix = { login: 'Sign in', unreachable: 'Add' };
const hostFailure = ({ name, state, words, agent }) => failureBlock({ text: state === 'login' ? phrase(name, 'needs a login') : phrase("Can't reach", name), source: words, fix: hostFix[state], agent });
const hostRow = ({ name, target, state = 'ready', words, mac = false, agent }) => list(
  row({ icon: 'lu-server', name, detail: target, mark: state === 'added' ? 'done' : 'none', meta: state === 'added' ? 'Added' : null, action: state === 'ready' ? { label: 'Add', kind: 'tonal' } : null }),
  hostFix[state] ? hostFailure({ name, state, words, agent }) : null,
  mac && state === 'added' ? row({ name: phrase(name, 'asks before agents read Documents'), depth: 1, dimmed: true, action: { label: phrase('Open the setting on', name), kind: 'tonal' } }) : null);
// A field a dialog names: its label as a heading Row, then the Field.
const labelled = (label, field) => [row({ name: label, heading: true }), input(field)];
export const addComputer = ({ hosts = [], typed, agent }) => dialog({
  title: 'Add computer',
  body: list(hosts.length ? [row({ name: 'From ~/.ssh/config', heading: true }), hosts.map((host) => hostRow({ ...host, agent }))] : emptyState({ icon: 'lu-server', text: '~/.ssh/config lists no hosts' }),
    labelled('Or how ssh reaches it', { text: typed, label: 'user@host', action: 'Add' })),
});

// One question, one field: a rename, a note; an emptied field shows what it falls back to.
export const promptDialog = ({ title, scope = null, text, fallback, action }) => dialog({
  title, scope, body: input({ text, label: fallback, focus: true, selected: Boolean(text) }), secondary: 'Cancel', primary: action,
});

// A refusal sits under the fields with its fix; the footer keeps Cancel only.
const refusal = (failure, agent) => (failure ? failureBlock({ ...failure, agent }) : null);
export const newProject = ({ folder, name, failure = null, agent }) => dialog({
  title: 'New project',
  body: list(labelled('Folder', { text: folder, label: 'None chosen', action: folder ? 'Change…' : 'Choose…', choose: true }),
    labelled('Name', { text: name, label: "Its folder's name", focus: !failure }), refusal(failure, agent)),
  secondary: 'Cancel', primary: failure ? null : 'Create', state: folder ? 'default' : 'disabled',
});

export const newWorktree = ({ project, branch, place = null, making = false, failure = null, agent }) => dialog({
  title: phrase('New worktree in', project),
  body: list(labelled('Branch', { text: branch, label: 'Branch name', focus: !failure, error: Boolean(failure) }), refusal(failure, agent)),
  notes: place && !failure ? [{ text: place }] : [],
  secondary: 'Cancel', primary: failure ? null : 'Create', state: making ? 'loading' : branch ? 'default' : 'disabled',
});

// A message is a paragraph, not a name: it takes more than a field's usual 80.
export const messageLimit = 2000;
// Send: the agents that can take a message, the one chosen on the selected ground, then the message.
const target = ({ name, project, status = 'working', chosen = false, unreachable = false }) => row({
  icon: 'p-claude', name, detail: project, current: chosen, dimmed: unreachable, meta: unreachable ? 'Unreachable' : null, mark: unreachable ? 'none' : status,
});
export const sendDialog = ({ agents = [], find = null, empty = null, message, to = null, sending = false, failure = null, agent }) => dialog({
  title: 'Send to an agent',
  body: list(find === null ? null : input({ text: find, label: 'Find an agent or a project', icon: 'lu-search', focus: true }),
    empty ? emptyState({ text: empty }) : agents.map(target),
    input({ text: message, label: 'Message', multiline: true, focus: find === null, limit: messageLimit }), refusal(failure, agent)),
  secondary: 'Cancel', primary: to && !failure ? to : null, state: sending ? 'loading' : message ? 'default' : 'disabled',
});

// Arrangements: each saved one a Row, another project's with that project as its fact; the chosen one shows Overwrite and Delete.
const arrangementRow = ({ name, from = null, chosen = false, armed = false, opening = false, focus = false }) => row({
  name, meta: opening ? 'Opening…' : from, current: chosen, focus, pending: opening,
  tools: chosen && !opening ? [button({ label: 'Overwrite', kind: 'quiet', size: 'sm' }), button({ label: 'Delete', kind: 'quiet', size: 'sm', armed, verb: 'delete' })] : [],
});
export const arrangements = ({ project, saved = [], reading = false, empty = null, failure = null, note = null, agent }) => dialog({
  title: 'Arrangements', scope: phrase('Opens in', project),
  body: list(reading ? skeletonOf({ shape: 'row', count: 3 }) : null, empty ? emptyState({ icon: 'lu-layers', text: empty }) : saved.map(arrangementRow), refusal(failure, agent)),
  notes: note ? [{ text: note, tone: 'error' }] : [],
  primary: reading || failure ? null : 'Save this tab', kind: 'tonal',
});
// Save this tab: the name, then each pane as it will come back, its program and the command it started with.
export const saveArrangement = ({ title, scope, name, panes = [], reading = false, armed = false, failure = null, agent }) => dialog({
  title, scope,
  body: list(input({ text: name, label: 'Name', focus: true }), reading ? skeletonOf({ shape: 'row', count: 2 }) : panes.map(row), refusal(failure, agent)),
  notes: reading ? [] : [{ text: "Each program is kept with the flags you started it with. A resumed session's id is left out, so each agent starts fresh." }],
  secondary: 'Back', primary: failure ? null : armed ? 'Overwrite' : 'Save', state: reading ? 'disabled' : armed ? 'armed' : 'default',
});

// Sleep: what stops and what will not come back the same, in one line; one press.
export const sleepDialog = ({ title, facts: lines = [], rows = [], reading = false, step = 'ready', action = 'Sleep', failure = null, agent }) => dialog({
  title,
  body: list(reading ? skeletonOf({ shape: 'row', count: 1 }) : null, rows.map(row), refusal(failure, agent)),
  notes: lines.map((text) => ({ text, tone: 'muted' })),
  primary: action && !failure ? action : null, state: reading ? 'disabled' : step === 'working' ? 'loading' : 'default',
});

// Status bar compositions: a computer stands in for its sidebar row; the rest are the bar's Menus and Buttons.
export const computerItemStates = ['on', 'unreachable', 'pending'];
// Unreachable is said in words with Refresh; folded, the name gives way to its icon.
export const computerItem = ({ name, remote = true, state = 'on', folded = false }) => state === 'unreachable'
  ? failureLine({ text: phrase("Can't reach", name), fix: 'Refresh', detail: phrase('ssh: connect to host', name, 'port 22: Operation timed out') })
  : statusItem({ icon: remote ? 'lu-server' : 'lu-monitor', text: folded ? null : name, pending: state === 'pending' });

export const stepperMenu = () => menu({ title: 'Panes per view', items: [{ icon: 'lu-move-horizontal', label: 'Even out', hint: '⌘⇧0' }, ...pieceLines] });
// The command palette's only pointer door; its key is in the tooltip.
export const paletteDoor = () => button({ label: 'Command palette ⌘⇧P', kind: 'icon', size: 'sm', icon: 'lu-command' });
export const layoutPaused = () => failureLine({ text: 'Layout paused', fix: 'Resume', detail: 'layout write refused 3 times' });

// While you were away: what nothing in view says, four rows then +N more; nothing new takes no space.
const awayRow = (hover, focus) => ({ icon: lead, tone = null, subject, fact: what, detail = null, age }, index) => row({ icon: lead, tone, name: subject, detail: what, second: detail, meta: age, hover: index === hover, focus: index === focus });
export const activity = ({ events = [], max = 4, hover = -1, focus = -1 } = {}) => events.length ? stack({ variant: 'away' },
  row({ name: 'While you were away', heading: true, action: { label: 'Dismiss these', kind: 'icon', icon: 'lu-x' } }),
  events.slice(0, max).map(awayRow(hover, focus)), events.length > max ? button({ label: phrase(plus(events.length - max), 'more'), kind: 'quiet', size: 'sm' }) : null) : null;
// An agent's menu: open it, name it, keep it, put it away, then the piece lines. A thread can also settle;
// a settled or snoozed thread offers only its way back. Snooze, Move and Copy each open their own Menu.
export const agentMenu = ({ name, thread = null, pinned = false, away = null, armed = false }) => menu({ title: thread ?? name, items: away ? [
  { icon: away === 'snoozed' ? 'lu-clock' : 'lu-check', label: away === 'snoozed' ? 'Wake' : 'Bring back' }, { label: 'Mark unread' }, { label: 'Rename…' }, { icon: 'lu-copy', label: 'Copy…' },
] : [
  { icon: 'lu-chevron-right', label: 'Open' }, { label: 'Rename…' }, { icon: 'lu-pin', label: pinned ? 'Unpin' : 'Pin to the top' }, { label: 'Mark unread' },
  ...(thread ? [{ icon: 'lu-check', label: 'Settle' }] : []),
  { icon: 'lu-clock', label: 'Snooze…' }, { label: 'Move to project…' }, { icon: 'lu-copy', label: 'Copy…' },
  { separator: true }, { icon: 'lu-moon', label: 'Sleep this agent' }, { icon: 'lu-moon', label: 'Sleep its tab' },
  { separator: true }, { icon: 'lu-x', label: 'Close agent', verb: phrase('close', name), armed },
  ...pieceLines] });
// An asleep row's menu: its way back, its id, then everything asleep.
export const asleepMenu = ({ title, more = 0, group }) => menu({ title, items: [
  { icon: 'lu-sun', label: 'Wake' }, ...(more ? [{ icon: 'lu-sun', label: phrase('Wake all', more, group) }] : []),
  { icon: 'lu-copy', label: 'Copy conversation id' }, { separator: true }, { icon: 'lu-moon', label: 'Everything asleep…' }] });
export const snoozeMenu = ({ name, times }) => menu({ title: phrase('Snooze', name), items: times.map(([label, hint]) => ({ label, hint })) });
export const moveMenu = ({ name, projects, home }) => menu({ title: phrase('Move', name, 'to'), items: [...projects.map((label) => ({ label })), { separator: true }, { icon: 'lu-undo', label: phrase('Back to', home) }] });
export const copyMenu = ({ folder, branch, id }) => menu({ title: 'Copy', items: [{ icon: 'lu-folder', label: 'Folder', hint: folder }, { icon: 'lu-git-branch', label: 'Branch', hint: branch }, { icon: 'lu-copy', label: 'Conversation id', hint: id }] });

// A refusal inside a menu: the failure block, first, with its fix and Explain.
const failureItems = (failure, agent) => (failure ? [{ failure: { ...failure, agent } }] : []);
// Open with: the editors that can open the file or folder, terminal editors after the rule; a refusal leads with its failure block.
const editorItem = (editor) => ({ icon: editor.terminal ? 'lu-terminal' : editor.icon, label: editor.name, hint: editor.key, selected: editor.chosen, mark: editor.failed ? 'blocked' : null });
export const openWithMenu = ({ target = null, editors = [], reading = false, none = null, failure = null, agent }) => menu({ title: target ? phrase('Open with ·', target) : 'Open with', items: [
  ...failureItems(failure, agent),
  ...(reading ? [{ loading: true }, { loading: true }] : []),
  ...(none ? [{ heading: none }] : []),
  ...editors.filter((editor) => !editor.terminal).map(editorItem),
  ...(editors.some((editor) => editor.terminal) ? [{ separator: true }, ...editors.filter((editor) => editor.terminal).map(editorItem)] : []),
] });
// Every + ends here: Terminal, the agents installed in the place by number, then the other ways in; the last used is where the keys start.
// The agents read in place; checking again keeps them with the working mark; a refusal takes their place.
const numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const grouped = (items) => (items.length ? [{ separator: true }, ...items] : []);
const installedItems = ({ agents, reading, failure, agent }) => (reading ? [{ loading: true }, { loading: true }] : failure ? failureItems(failure, agent)
  : agents.map(({ program, name, last }, index) => ({ icon: program, label: name, hint: numberKeys[index], selected: last })));
export const newInMenu = ({ place, agents = [], reading = false, checking = false, repository = true, failure = null, agent }) => menu({ items: [
  { heading: place, mark: checking ? 'working' : null }, { icon: 'lu-terminal', label: 'Terminal', hint: '⌘T' },
  ...grouped(installedItems({ agents, reading, failure, agent })),
  { separator: true }, { icon: 'lu-folder-plus', label: 'New project' },
  ...(repository ? [{ icon: 'lu-git-branch', label: 'New worktree…' }, { icon: 'lu-git-fork', label: 'Open worktree…' }] : []),
  { separator: true }, { icon: 'lu-panels-top-left', label: 'Arrange…', hint: '⌥⌘T' },
] });

// A computer's menu: name it, power it, sync it, start a project on it; off or unreachable, the way back leads; a refused act moves into its failure block.
const renameItem = { label: 'Rename…' };
const addComputerItem = { icon: 'lu-server', label: 'Add computer…' };
const refreshItem = { icon: 'lu-refresh-cw', label: 'Refresh' };
const signInItem = { label: 'Sign in…' };
const syncItem = (sync) => (sync === 'saving' ? { loading: true } : { icon: 'lu-arrow-right-left', label: 'Sync', hint: sync === 'on' ? 'on' : null });
const computerActs = {
  on: (sync) => [renameItem, { icon: 'lu-power', label: 'Turn off' }, syncItem(sync), { icon: 'lu-plus', label: 'New project' }, addComputerItem],
  off: () => [{ icon: 'lu-power', label: 'Turn on' }, renameItem, addComputerItem],
  unreachable: () => [refreshItem, signInItem, renameItem, addComputerItem],
  'sign in': () => [signInItem, { icon: 'lu-copy', label: 'Copy sign-in command' }, refreshItem],
};
export const computerMenuStates = Object.keys(computerActs);
export const computerMenu = ({ name, state = 'on', sync = 'off', failure = null, agent }) => menu({ title: name, items: [
  ...failureItems(failure, agent), ...computerActs[state](sync).filter((item) => item.label !== failure?.fix), ...pieceLines] });

// A project's menu: start in it, its worktrees, name it, put it away, remove it; asleep, its tabs wake first.
const worktreeItem = ({ branch, place }) => ({ icon: 'lu-git-branch', label: branch, hint: place });
const wakeItems = (asleep) => [{ icon: 'lu-sun', label: phrase('Wake', asleep[0]) }, ...(asleep.length > 1 ? [{ icon: 'lu-sun', label: phrase('Wake all', asleep.length) }] : [])];
const startItems = (worktrees) => [{ label: 'New conversation…' }, { icon: 'lu-git-branch', label: 'New in a worktree…' },
  ...(worktrees.length ? [{ heading: 'Worktrees' }, ...worktrees.map(worktreeItem)] : [])];
const keepItems = (tabs) => [renameItem, ...(tabs ? [{ icon: 'lu-moon', label: 'Sleep this tab…' }] : []), ...(tabs > 1 ? [{ icon: 'lu-moon', label: 'Sleep the project…' }] : []), ...(tabs ? [{ label: 'Project options…' }] : [])];
const removeItem = (tabs, armed) => ({ icon: 'lu-x', label: 'Remove project', verb: tabs ? phrase('remove, close', tabs, tabs === 1 ? 'tab' : 'tabs') : 'remove it', armed });
export const projectMenu = ({ name, worktrees = [], asleep = [], tabs = 0, kept = true, missing = false, gone = false, armed = false }) => menu({ title: name, items: gone ? [{ heading: 'This project is no longer here' }] : [
  ...(asleep.length ? wakeItems(asleep) : []),
  ...(missing ? [{ icon: 'lu-folder', label: 'Locate folder…' }] : [...startItems(worktrees), ...keepItems(tabs)]),
  ...(kept ? [] : [{ icon: 'lu-pin', label: 'Keep as a project' }]),
  removeItem(tabs, armed), ...pieceLines] });

// The footer's Settings: kansō's, Herdr's, and Herdr's update when one waits, which restarts it on the second press.
export const settingsMenu = ({ update = null, armed = false } = {}) => menu({ title: 'Settings', items: [
  { icon: 'lu-sliders-vertical', label: 'kansō settings', hint: '⌃⇧,' }, { icon: 'lu-panels-top-left', label: 'Herdr settings' },
  ...(update ? [{ icon: updateIcon, label: update, verb: 'restart Herdr', armed }] : [])] });

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

// Panel: only the container. Each look is a width; stale steps down all but the header; the header comes drawn, or none.
export const panelLooks = ['panel', 'narrow', 'window'];
export const panel = ({ look = 'panel', stale = false, header = null } = {}, ...body) => {
  if (!panelLooks.includes(look)) throw new Error(phrase('panel: unknown look', look));
  return stack({ variant: 'panel', narrow: look === 'narrow', window: look === 'window', stale }, header, body);
};
// Panel header: the Row in its title form, only the title required. A page heads a dashboard; a bar heads a document or a tool, compact over a rule.
export const panelHeaderForms = ['page', 'bar'];
export const panelHeader = ({ title, form = 'page', start = [], second = null, tools = [] }) => {
  if (!panelHeaderForms.includes(form)) throw new Error(phrase('panelHeader: unknown form', form));
  return stack({ variant: 'panel header', bar: form === 'bar' }, row({ start, name: title, title: true, second, tools }));
};
// The tools a panel may end with: Refresh, spinning while it reads, and Close where the panel closes.
export const panelRefresh = ({ reading = false } = {}) => button({ label: 'Refresh', kind: 'icon', icon: 'lu-refresh-cw', spin: reading });
export const panelClose = () => button({ label: 'Close', kind: 'icon', icon: 'lu-x' });
// A file opened from a panel goes back to its folder's list.
export const panelBack = () => button({ label: 'Markdown in this folder', kind: 'icon', icon: 'lu-chevron-left' });

// Cells

// Dawn Mode: the pill always says the mode at the right of the open header; the sky behind the lights is optional. Stable Mode shows nothing.
export const header = ({ collapsed = false, dawn: early = false, art = true, open = false, view = 'spaces' } = {}) => stack({ variant: 'header', collapsed },
  early && art ? dawn() : null, stack({ variant: 'header title' }, windowControls(), early && !collapsed ? chip({ label: 'Dawn Mode', pill: true }) : null),
  toolbar({ view, column: collapsed, open }));

// The channel in Settings · Updates: one press switches; Dawn Mode says it can break, and the sky can be turned off.
export const channels = [{ key: 'stable', label: 'Stable Mode' }, { key: 'dawn', label: 'Dawn Mode' }];
export const channelSettings = ({ channel = 'stable', art = true } = {}) => list(
  setting({ label: 'Updates', control: tabs({ items: channels, value: channel, size: 'sm', track: true, label: true }), note: channel === 'dawn' ? 'Dawn Mode gets changes first. It can break.' : null,
    link: channel === 'dawn' ? button({ label: 'Star on GitHub', kind: 'quiet', size: 'sm' }) : null }),
  channel === 'dawn' ? setting({ label: 'Dawn sky', control: toggle({ checked: art, label: 'Dawn sky' }) }) : null);

// The rows and tiles of the current view come in drawn; the sidebar only places them.
export const sidebar = ({ collapsed = false, dawn: early = false, art = true, view = 'spaces', switcher = true, menu: open = false, needs = null, rows = [], tiles = [], away = null } = {}) => collapsed
  ? stack({ variant: 'rail' }, header({ collapsed, dawn: early, art, view }), switcher ? viewSwitch({ view, column: true, open }) : null, stack({ variant: 'rail list' }, tiles), stack({ variant: 'rail footer' }, tool('lu-settings', 'Settings')))
  : stack({ variant: 'sidebar' }, header({ dawn: early, art, view }), switcher ? viewSwitch({ view }) : null, needs, stack({ variant: 'rows' }, rows), away, sidebarFooter());

// Two halves around the fixed slot of panes per view; each half folds its own items.
export const statusBar = ({ left = [], middle = null, right = [], popup = null } = {}) => stack({ variant: 'status bar', grid: true },
  stack({ variant: 'status bar left' }, left), stack({ variant: 'status bar middle' }, middle), stack({ variant: 'status bar right' }, right), popup ? stack({ variant: 'status bar popup' }, popup) : null);

// Keyboards by computer: the rows, each key's width in keys, and what each key is called; a chord joins its parts with join.
const modifierKeys = ['ctrl', 'alt', 'shift', 'cmd'];
const macRows = [
  [['\u0060'], ['1'], ['2'], ['3'], ['4'], ['5'], ['6'], ['7'], ['8'], ['9'], ['0'], ['-'], ['='], ['backspace', 1.6]],
  [['tab', 1.6], ['q'], ['w'], ['e'], ['r'], ['t'], ['y'], ['u'], ['i'], ['o'], ['p'], ['['], [']'], ['\\']],
  [['capslock', 1.9], ['a'], ['s'], ['d'], ['f'], ['g'], ['h'], ['j'], ['k'], ['l'], [';'], ["'"], ['enter', 1.7]],
  [['shift', 2.4], ['z'], ['x'], ['c'], ['v'], ['b'], ['n'], ['m'], [','], ['.'], ['/'], ['shift', 2.2]],
  [['ctrl', 1.3], ['alt', 1.3], ['cmd', 1.6], ['space', 5.3], ['cmd', 1.6], ['alt', 1.3], ['left'], ['up'], ['down'], ['right']],
];
const pcRows = [...macRows.slice(0, 4), [['ctrl', 1.3], ['cmd', 1.3], ['alt', 1.6], ['space', 5.3], ['alt', 1.6], ['ctrl', 1.3], ['left'], ['up'], ['down'], ['right']]];
const arrows = { space: null, left: '←', right: '→', up: '↑', down: '↓' };
const pcCaps = { ...arrows, backspace: 'Back', tab: 'Tab', capslock: 'Caps', enter: 'Enter', escape: 'Esc', shift: 'Shift', ctrl: 'Ctrl', alt: 'Alt' };
export const keyboards = {
  mac: { rows: macRows, caps: { ...arrows, backspace: '⌫', tab: '⇥', capslock: '⇪', enter: '↩', escape: 'esc', shift: '⇧', ctrl: '⌃', alt: '⌥', cmd: '⌘' }, join: null },
  windows: { rows: pcRows, caps: { ...pcCaps, cmd: 'Win' }, join: '+' },
  linux: { rows: pcRows, caps: { ...pcCaps, cmd: 'Super' }, join: '+' },
};
export const keyboardSystems = Object.keys(keyboards);
const named = (os, key) => Object.hasOwn(keyboards[os].caps, key);
const capOf = (os, key) => named(os, key) ? keyboards[os].caps[key] : key.toUpperCase();
export const keyNames = (os = 'mac') => [...new Set(keyboards[os].rows.flat().map(([key]) => key))];
// The held modifiers, then any key, as that computer writes a chord.
export const heldChord = ({ os = 'mac', held = [], key = null }) => chord(keyboards[os].join, ...modifierKeys.filter((mod) => held.includes(mod)).map((mod) => capOf(os, mod)), ...(key ? [capOf(os, key)] : []));

// Keyboard: the map of one layer. Holding or clicking a modifier picks the layer; a kansō key has ink, a Herdr key is quieter.
const keyState = { kanso: 'kanso', list: 'kanso', herdr: 'herdr', free: 'free' };
const keyAct = { kanso: 'Change', herdr: 'Herdr settings', free: 'Give it an action' };
export const keyboard = ({ os = 'mac', layer, picked = null, hover = null }) => stack({ variant: 'keyboard' },
  keyboards[os].rows.map((line) => stack({ variant: 'keyboard row' }, line.map(([key, units = 1]) => keycap({ label: capOf(os, key), units, hover: key === hover,
    state: layer.held.includes(key) ? 'held' : key === picked ? 'picked' : keyState[layer.keys[key]?.kind] ?? 'free' })))));
// The picked key: what it does here, or Nothing, with its one act; Lists opens the layer of every list and menu.
const pickedChord = ({ os, layer, picked }) => layer.keys[picked]?.chord
  ? phrase(...layer.keys[picked].chord.map((part) => named(os, part) ? keyboards[os].caps[part] : part))
  : heldChord({ os, held: layer.held, key: picked });
const layerLine = ({ os, layer }) => layer.lists ? layer.name
  : phrase(heldChord({ os, held: layer.held }), '·', Object.keys(layer.keys).length, Object.keys(layer.keys).length === 1 ? 'key' : 'keys');
export const pickedKey = ({ os = 'mac', layer, picked }) => keyPicked({ chord: pickedChord({ os, layer, picked }), meaning: layer.keys[picked]?.does ?? null,
  layer: layer.keys[picked]?.kind === 'herdr' ? 'Herdr\'s key' : layerLine({ os, layer }),
  actions: layer.lists ? [] : [button({ label: keyAct[layer.keys[picked]?.kind ?? 'free'], kind: 'quiet' }), button({ label: 'Lists', kind: 'quiet' })] });
export const keyboardExplorer = ({ os = 'mac', layer, picked, hover = null }) => stack({ variant: 'keyboard layout' }, keyboard({ os, layer, picked, hover }), pickedKey({ os, layer, picked }));

// Shortcut row: what a key does and its chords. A click captures on the row; Reset brings back what kansō ships.
export const shortcutRowStates = ['rest', 'selected', 'changed', 'unbound', 'capture', 'no digit', 'taken', 'failed'];
// Each state's keys, built only for that state: a row at rest needs no taken chord.
const recordingKeys = (chords) => (chords.length ? chords.map((text) => ({ text, recording: true })) : [{ text: 'New key', recording: true }]);
const shortcutKeys = ({ chords, state, taken }) => ({
  unbound: () => [{ text: 'No key', faint: true }],
  capture: () => recordingKeys(chords),
  'no digit': () => recordingKeys(chords),
  taken: () => [{ text: taken.chord, recording: true }],
}[state] ?? (() => chords.map((text) => ({ text }))))();
// What a capture says under the row: a key someone else has, or a numbered family's key with no digit.
const shortcutNotes = {
  taken: (taken) => phrase(taken.chord, 'already does', taken.name, '· Esc keeps yours'),
  'no digit': () => 'Press a key with a digit from 1 to 9: N takes its place.',
};
export const shortcutRow = ({ name, chords = [], state = 'rest', taken = null, hover = false, source = null, agent = null }) => list(
  row({ name, hover, current: ['selected', 'capture', 'no digit', 'taken'].includes(state), keys: shortcutKeys({ chords, state, taken }),
    meta: ['capture', 'no digit'].includes(state) ? 'Esc keeps · ⌫ removes' : null,
    second: shortcutNotes[state]?.(taken) ?? null,
    action: { changed: { label: 'Reset', kind: 'quiet' }, taken: { label: 'Take it', kind: 'quiet', armed: true, verb: 'take it' } }[state] ?? null }),
  state === 'failed' ? failureBlock({ text: phrase('Couldn\'t save', chords[0], 'for', name), source, fix: 'Change', agent }) : null);

// Notifications. A notice is a fact with a state and a home; where you are decides whether it is said, and how.
// The lead is the home's icon in the state's colour; an agent has no icon, so its mark; a failure is always the blocked mark.
export const noticeStates = ['waits', 'done', 'failed', 'fact'];
export const noticePlaces = ['home in view', 'window on screen', 'away'];
const noticeIcons = { ...Object.fromEntries(panelDoors.map(({ key, icon }) => [key, icon])), update: updateIcon };
export const noticeHomes = ['agent', ...Object.keys(noticeIcons)];
const noticeTone = { waits: 'blocked', done: 'done', failed: 'blocked', fact: 'muted' };
const noticeMark = { waits: 'blocked', done: 'done', failed: 'blocked', fact: 'idle' };
const noticeLead = ({ state, home }) => state === 'failed' || !noticeIcons[home] ? { mark: noticeMark[state] } : { icon: noticeIcons[home], tone: noticeTone[state] };
// The detail is the tool's words or the context, in the toast's tooltip. Away, the computer draws it: kansō only gives the words.
export const notice = ({ state = 'fact', home = 'agent', text, act = null, detail = null, place = 'window on screen' }) => place === 'window on screen'
  ? toast({ ...noticeLead({ state, home }), title: text, action: act, detail }) : null;
export const systemMessage = ({ text, detail = null, place = 'window on screen' }) => place === 'away' ? { title: text, body: detail } : null;
// Up to three on screen, the newest at the bottom.
export const toastStack = ({ notices = [], max = 3 }) => stack({ variant: 'toasts' }, notices.slice(-max).map((item) => notice(item)));

// Pane header: the program, the name, the place when it differs from the tab's, what changed, then the tools and the state's mark.
// Each look is a state: focus is the ground; blocked is the wash and the mark; a pin after the name; the header itself drags.
export const paneStates = ['none', 'working', 'blocked', 'done', 'idle'];
export const paneNameLimit = 40;
export const paneReaches = ['here', 'remote', 'unreachable'];
export const paneFolds = ['nothing', 'folder', 'branch', 'tools into ⋯', 'commits', 'files', 'verdict word', 'PR', 'close into ⋯'];
// A step of paneFolds is shown until the pane folds that far; the order lives only in paneFolds.
const shown = (fold, step) => fold < paneFolds.indexOf(step);
const paneMarks = { working: 'working', blocked: 'blocked', done: 'done' };
const paneTool = (icon, label) => button({ label, kind: 'icon', size: 'sm', icon });
const counted = (count, one, many) => phrase(count, count === 1 ? one : many);
const paneDigest = ({ files = 0, add = 0, del = 0, commits = 0, pr = null, failure = null }, fold, working) => stack({ variant: 'pane digest' },
  files && shown(fold, 'files') ? headerSegment({ act: true, tone: working ? 'dim' : null, title: 'Open the diff', parts: [{ text: counted(files, 'file', 'files') }, { text: diffText({ add, del }), tone: 'dim' }] }) : null,
  commits && shown(fold, 'commits') ? headerSegment({ act: true, tone: working ? 'dim' : null, title: phrase(counted(commits, 'commit', 'commits'), 'not on GitHub'), parts: [{ text: counted(commits, 'commit', 'commits') }] }) : null,
  pr && failure ? failureLine({ text: phrase('Can\'t read', pr.number), fix: 'Refresh', detail: failure }) : null,
  pr && !failure && shown(fold, 'PR') ? headerSegment({ act: true, parts: [{ text: pr.number, tone: 'muted' }, shown(fold, 'verdict word') && pr.verdict ? { text: phrase('·', pr.verdict), tone: pr.tone } : null],
    title: facts(shown(fold, 'commits') || !commits ? null : counted(commits, 'commit', 'commits'), shown(fold, 'files') || !files ? null : counted(files, 'file', 'files'), pr.verdict) }) : null);
// Under the pointer: split right, wider or narrower, close and ⋯. A focused agent that finished or idles keeps Sleep and Send out; otherwise they are in ⋯, and a blocked one has no Send.
const restsOut = ({ state, focused }) => focused && ['done', 'idle'].includes(state);
// ⋯ opens its Menu under itself, right-aligned to it; while it is open the tools stay out.
const paneTools = ({ name, state, focused, hover, armed, fold, more }) => stack({ variant: 'pane tools' },
  restsOut({ state, focused }) ? [paneTool('lu-moon', 'Sleep this agent'), paneTool('lu-send', 'Send to another agent')] : null,
  hover && shown(fold, 'tools into ⋯') ? [paneTool('lu-columns-2', 'Split right'), paneTool('lu-move-horizontal', 'Wider or narrower')] : null,
  hover && shown(fold, 'close into ⋯') ? button({ label: 'Close', kind: 'icon', size: 'sm', icon: 'lu-x', armed, verb: phrase('close', name) }) : null,
  hover ? stack({ variant: 'pane more' }, button({ label: 'More', kind: 'icon', size: 'sm', icon: 'lu-ellipsis', active: Boolean(more) }), more ? stack({ variant: 'pane menu' }, more) : null) : null);
export const paneHeader = ({ program = 'p-claude', name, state = 'none', focused = false, keyboard = false, hover = false, pinned = false, zoomed = false, menu: open = false, reach = 'here', held = false, armed = false, renaming = false, place = null, digest = {}, fold = 0 }) => stack(
  { variant: 'pane header', focus: focused, keyboard, blocked: state === 'blocked', unreachable: reach === 'unreachable', held },
  glyph(program),
  renaming ? input({ text: name, label: 'Name', inline: true, selected: true, limit: paneNameLimit }) : paneName({ name }),
  place?.folder && shown(fold, 'folder') ? headerSegment({ icon: 'lu-folder', parts: [{ text: place.folder }] }) : null,
  place?.branch && shown(fold, 'branch') ? headerSegment({ icon: 'lu-git-branch', parts: [{ text: place.branch }] }) : null,
  paneDigest(digest, fold, state === 'working'),
  pinned ? headerSegment({ icon: 'lu-pin', tone: 'dim', title: 'Pinned' }) : null,
  grow(),
  paneTools({ name, state, focused, hover: hover || open, armed, fold, more: open ? paneMenu({ name, state, pinned, zoomed, out: paneOut({ state, focused, fold }) }) : null }),
  reach === 'unreachable' || !paneMarks[state] ? null : mark({ status: paneMarks[state] }));
// One pane menu, on right-click and on ⋯: splits, pin, zoom, what an agent can do, where right-clicks go, close; ⋯ leaves out what the header already shows.
export const paneOut = ({ state, focused, fold }) => [...(restsOut({ state, focused }) ? ['Sleep this agent', 'Send to another agent…'] : []),
  ...(shown(fold, 'tools into ⋯') ? ['Split right', 'Wider or narrower'] : []), ...(shown(fold, 'close into ⋯') ? ['Close pane'] : [])];
const agentActs = ({ state, parent }) => [...(state === 'none' ? [] : [
  ...(state === 'blocked' ? [] : [{ icon: 'lu-send', label: 'Send to another agent…', hint: '⌥⌘S' }]),
  { icon: 'lu-search', label: 'Find in conversation', hint: '⌘F' }, { icon: 'lu-moon', label: 'Sleep this agent' }]),
  ...(parent ? [{ icon: 'lu-undo', label: phrase('Send back to', parent) }] : [])];
export const paneMenu = ({ name, state = 'none', pinned = false, zoomed = false, parent = null, program = false, armed = false, keyboard = false, out = [] }) => {
  const kept = (items) => items.filter((item) => !out.includes(item.label));
  return menu({ title: name, items: [
    ...kept([{ icon: 'lu-columns-2', label: 'Split right', hint: '⌘D', selected: keyboard }, { icon: 'lu-rows-2', label: 'Split down', hint: '⌘⇧D' }, { icon: 'lu-columns-2', label: 'Split left', hint: '⌥⌘⇧D' },
      { icon: 'lu-move-horizontal', label: 'Wider or narrower', hint: '⌘⇧↩' }, { icon: 'lu-pin', label: pinned ? 'Unpin' : 'Pin', hint: '⌥⌘P' },
      zoomed ? { icon: 'lu-minimize-2', label: 'Unzoom' } : { icon: 'lu-maximize-2', label: 'Zoom' }]),
    ...grouped(kept([...agentActs({ state, parent }), { icon: 'lu-external-link', label: 'Open with…' }])),
    { separator: true }, { icon: program ? 'lu-check' : null, label: 'Right-clicks go to the program' },
    ...grouped(kept([{ icon: 'lu-x', label: 'Close pane', hint: '⌘⇧W', verb: phrase('close', name), armed }])),
    ...pieceLines] });
};
