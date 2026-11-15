// Sample sidebar content for the stories: the rows and tiles of each view, drawn with the compositions.
import { asleep, computerRow, needsControl, panelBack, panelClose, panelRefresh, projectRow, railMenu, section, sessionRow, sidebar, tile } from './compositions.js';
import { button, emptyState, glyph, menu, skeletonOf, stack, statusItem } from './pieces.js';
import keyFile from '../../kanso/keys.json' with { type: 'json' };
import windowsKeyFile from '../../kanso/keys.windows.json' with { type: 'json' };
import { LIST_LAYER, describe, layer } from '../../kanso/mods/kanso-help/keymap.js';

const group = (...rows) => stack({ variant: 'row group' }, ...rows);
export const sampleRows = {
  spaces: ({ rowMenu = null } = {}) => [
    group(computerRow({ name: 'light', remote: false })),
    group(projectRow({ name: 'prjct' }), sessionRow({ program: 'lu-terminal', name: 'Orion', status: 'idle', hover: Boolean(rowMenu) }), rowMenu ? stack({ variant: 'row menu' }, rowMenu) : null),
    group(projectRow({ name: 'amtelser' }), sessionRow({ program: 'lu-terminal', name: 'Nova', activity: 'Run npm publish?', time: '2m', status: 'blocked' })),
    group(projectRow({ name: 'kansō', folder: 'herdr-kanso', branch: 'main', sync: '↓12', open: true }), sessionRow({ name: 'Atlas', activity: 'Reviewing step 01', time: '3m' }),
      sessionRow({ name: 'Juno', status: 'idle', depth: 2, current: true }), sessionRow({ program: 'p-codex', name: 'Iris', status: 'done', depth: 2 })),
    group(projectRow({ name: 'agile' })), group(asleep({ names: ['site', 'dojo'] })), group(computerRow({ name: 'dark', state: 'off' })),
  ],
  agents: () => [
    section({ title: 'Needs you', status: 'blocked' }), sessionRow({ program: 'lu-terminal', name: 'Nova', activity: 'Run npm publish?', time: '2m', place: 'amtelser', status: 'blocked', depth: 0 }),
    section({ title: 'Working' }), sessionRow({ name: 'Atlas', activity: 'Reviewing step 01', time: '3m', place: 'kansō', depth: 0 }),
    section({ title: 'Done' }), sessionRow({ program: 'p-codex', name: 'Iris', place: 'kansō', status: 'done', depth: 0 }),
    section({ title: 'Idle', count: 2 }), section({ title: 'Terminals', count: 1 }),
  ],
  threads: () => [
    section({ title: 'Pinned' }), sessionRow({ name: 'Review boards 01 to 04', activity: 'Reviewing step 01', time: '3m', current: true, depth: 0 }),
    section({ title: 'kansō' }), sessionRow({ name: 'Audit the app errors', activity: 'Allow network access?', time: '1m', status: 'blocked', depth: 0 }), sessionRow({ name: 'Sleep lost call', status: 'done', depth: 0 }),
    section({ title: 'Snoozed', count: 1 }), section({ title: 'Settled', count: 4 }),
  ],
};
export const sampleTiles = {
  spaces: () => [tile({ initial: 'A', tone: 'teal', status: 'blocked', count: 4, open: true }), tile({ initial: 'D', tone: 'yellow', status: 'working', count: 1 }), tile({ initial: 'B', tone: '', count: 1 })],
  agents: () => [tile({ status: 'blocked', count: 1 }), tile({ status: 'working', count: 3 }), tile({ status: 'done', count: 2 }), tile({ status: 'idle', count: 3 })],
  threads: () => [tile({ status: 'blocked', count: 1 }), tile({ status: 'working', count: 1 }), tile({ status: 'done', count: 1 })],
};
// A moment of the sidebar: only the rows it is about, the rest of the sample left out.
const kanso = (extra = {}) => projectRow({ name: 'kansō', folder: 'herdr-kanso', branch: 'main', open: true, ...extra });
const atlas = (extra = {}) => sessionRow({ name: 'Atlas', activity: 'Reviewing step 01', time: '3m', ...extra });
const juno = (extra = {}) => sessionRow({ name: 'Juno', status: 'idle', ...extra });
const iris = () => sessionRow({ program: 'p-codex', name: 'Iris', status: 'done' });
const under = (menuOf) => stack({ variant: 'row menu' }, menuOf());
const waiting = (name, place, time) => sessionRow({ program: 'lu-terminal', name, activity: 'Waiting for you', place, time, status: 'blocked', depth: 0 });
const thread = (name, extra = {}) => sessionRow({ name, depth: 0, ...extra });
const kansoThreads = (...rows) => [section({ title: 'kansō' }), thread('Review boards 01 to 04', { activity: 'Reviewing step 01', time: '3m' }), ...rows];
const needs = (label) => needsControl({ label });
export const sidebarMoments = {
  keyboard: () => ({ rows: [group(kanso(), atlas({ focus: true }), juno())] }),
  loading: () => ({ rows: [skeletonOf({ shape: 'row', count: 3 })] }),
  pinned: () => ({ rows: [group(kanso(), juno({ pinned: true }), atlas(), iris())] }),
  'running command': () => ({ rows: [group(kanso(), atlas({ commands: 1 }), juno())] }),
  'stuck step': () => ({ rows: [group(kanso(), atlas({ activity: 'Running tests', time: '24m', late: true }), juno())] }),
  'incoming message': () => ({ rows: [group(kanso(), atlas({ activity: 'Message from Juno', time: null, status: 'idle', strong: true }), juno())] }),
  unread: () => ({ rows: [group(kanso(), atlas(), juno({ strong: true }))] }),
  closed: () => ({ rows: [group(kanso(), atlas()), group(projectRow({ name: 'archive', closed: true }))] }),
  missing: () => ({ rows: [group(kanso(), atlas()), group(projectRow({ name: 'archive', closed: true, missing: true }))] }),
  'no projects': () => ({ rows: [group(computerRow({ name: 'light', remote: false })), emptyState({ icon: 'lu-folder', text: 'No projects on light yet', action: 'New project' })] }),
  'nothing running': () => ({ rows: [group(kanso({ hover: true })), group(projectRow({ name: 'agile' }))] }),
  ahead: () => ({ rows: [group(kanso({ sync: '↑3' }), atlas())] }),
  pulling: () => ({ rows: [group(kanso({ sync: '↓12', pulling: true }), atlas())] }),
  'wake selected': () => ({ rows: [group(kanso(), atlas()), group(asleep({ names: ['Orion', 'Nova'], open: true, focus: 'Orion' }))] }),
  'rail popup': () => ({ tiles: [...sampleTiles.spaces(), tile({ status: 'asleep', count: 2, open: true }),
    stack({ variant: 'rail menu' }, railMenu({ title: 'Asleep', rows: [{ name: 'Orion', place: 'kansō', status: 'asleep' }, { name: 'Nova', place: 'prjct', status: 'asleep' }] }))] }),
  'status empty': () => ({ rows: [emptyState({ icon: 'lu-activity', text: 'No agents running' })] }),
  'threads empty': () => ({ rows: [emptyState({ icon: 'lu-message-square', text: 'No conversations yet' })] }),
  'threads asleep': () => ({ rows: kansoThreads(asleep({ names: ['Audit the app errors', 'Sleep lost call'], open: true })) }),
  settled: () => ({ rows: kansoThreads(section({ title: 'Settled' }), thread('Sleep lost call', { status: 'done' })) }),
  snoozed: () => ({ rows: kansoThreads(section({ title: 'Snoozed' }), thread('Audit the app errors', { place: '14:30', status: 'idle' })) }),
  'needs you': () => ({ needs: needs('Needs you · 3'), rows: [waiting('Nova', 'amtelser', '9m'), waiting('Iris', 'prjct', '4m'), waiting('Atlas', 'devbox / kansō', '1m')] }),
  'needs you reading': () => ({ needs: needs('Needs you · 1'), rows: [waiting('Nova', 'amtelser', '3m'), skeletonOf({ shape: 'row', count: 1 })] }),
  'needs you unavailable': () => ({ needs: needs('Needs you · 1'), rows: [waiting('Nova', 'amtelser', '3m'), emptyState({ text: 'Queue unavailable' })] }),
  'nobody waiting': () => ({ needs: needs('Nobody is waiting'), rows: sampleRows.spaces() }),
};
// A row's open menu hangs under Orion, the row it was opened on.
export const sampleSidebar = ({ view = 'spaces', rowMenu = null, moment = null, ...args } = {}) => {
  const { rows = sampleRows[view]({ rowMenu }), tiles = sampleTiles[view](), needs: count = null } = moment ? sidebarMoments[moment]() : {};
  return sidebar({ ...args, view, needs: count, rows, tiles });
};

// The window at rest: the open project's tabs, its focused agent and what that agent's terminal shows, and the panel door it opens.
export const sampleWindow = {
  tabs: [{ key: 'Atlas', label: 'Atlas' }, { key: 'Juno', label: 'Juno' }],
  pane: { name: 'Juno', lines: [
    [{ text: '❯', tone: 'muted' }, ' Add the limits table to /admin'], '',
    [{ text: '●', tone: 'done' }, ' Read(src/admin/limits.ts)'], [{ text: '●', tone: 'done' }, ' Update(src/admin/limits.ts)'], '  The table reads each plan’s limits.', '',
    [{ text: '✻ Brewed for 38s', tone: 'dim' }],
  ] },
  door: 'worktrees',
  menuOn: 'Orion',
};

// Sample status bar content: what each panel item holds when its Menu opens.
const hide = [{ separator: true }, { icon: 'lu-eye-off', label: 'Hide this' }];
export const statusMenus = {
  servers: () => menu({ title: ':5173 vite · no pane', items: [{ icon: 'lu-external-link', label: 'Open in the browser' }, { icon: 'lu-copy', label: 'Copy localhost:5173' },
    { separator: true }, { icon: 'lu-square', label: 'Stop' }, { separator: true }, { icon: 'lu-plug', label: 'Open Ports' }, ...hide.slice(1)] }),
  containers: () => menu({ title: 'cart-db · exited 1', items: [{ icon: 'lu-power', label: 'Start' }, { icon: 'lu-terminal', label: 'Logs' },
    { separator: true }, { icon: 'lu-x', label: 'Remove' }, { separator: true }, { icon: 'lu-container', label: 'Open Containers' }, ...hide.slice(1)] }),
  reviews: () => menu({ title: '2 reviews requested', items: [{ icon: 'lu-git-pull-request', label: '#142 Checkout auth flow', hint: 'acme-shop' },
    { icon: 'lu-git-pull-request', label: '#87 Locale files', hint: 'docs-site' }, ...hide] }),
};
export const statusPanels = ({ open = '' } = {}) => [
  statusItem({ icon: 'lu-plug', tone: 'working', text: 1, open: open === 'servers' }),
  statusItem({ icon: 'lu-container', tone: 'blocked', text: 1, open: open === 'containers' }),
  statusItem({ icon: 'lu-git-pull-request', text: 2, open: open === 'reviews' }),
];

// The Keyboard's sample layers: kansō's own keys file for each computer, read by the app's keymap; of Herdr's keys, only ⌘T, the one the design names.
const bindingsOf = (file, herdr = []) => [...Object.entries(file).flatMap(([section, keys]) => Object.entries(keys).map(([chord, action]) => ({ section, keys: chord, action }))), ...herdr];
const keyFiles = {
  mac: bindingsOf(keyFile, [{ section: 'global', keys: 'cmd-t', action: 'tab.new' }]),
  windows: bindingsOf(windowsKeyFile),
  linux: bindingsOf(keyFile),
};
export const keyLayerMods = { mac: ['alt cmd', 'cmd', 'alt shift cmd', 'shift cmd', 'ctrl shift', 'lists'], windows: ['alt', 'alt shift', 'ctrl shift', 'ctrl', 'lists'], linux: ['alt cmd', 'cmd', 'alt shift cmd', 'shift cmd', 'ctrl shift', 'lists'] };
export const keyLayer = (os = 'mac', mods = 'alt cmd') => {
  const lists = mods === 'lists';
  const held = lists ? [] : mods.split(' ');
  const found = lists ? LIST_LAYER : layer(keyFiles[os], held);
  const keys = Object.fromEntries([...found].map(([key, does]) => [key, { kind: lists ? 'list' : does.section === 'global' ? 'herdr' : 'kanso', does: describe(does.action), ...(lists ? { chord: does.chord.split(' ') } : {}) }]));
  return { held, lists, name: lists ? 'Every list and menu · j k gg G Enter /' : null, keys };
};

// Every notice the app sends today, each as a state, a home and its words; the Notifications story offers them by name.
const updated = (detail) => ({ state: 'done', home: 'update', text: 'kansō updated to 3.31.0', detail });
const notUpdated = (detail) => ({ state: 'failed', home: 'update', text: 'kansō was not updated', act: 'Update', detail });
export const appNotices = {
  'Update available': { state: 'fact', home: 'update', text: 'kansō 3.31.0 is available', act: 'Update' },
  'Already updating': { state: 'fact', home: 'update', text: 'kansō is already being updated' },
  'Up to date': { state: 'fact', home: 'update', text: 'kansō is up to date' },
  Updated: updated(null),
  'Updated, keys updated': updated('kansō\'s keys updated.'),
  'Updated, kept your keys': updated('kansō\'s keys updated. Kept your own cmd-d, cmd-shift-w.'),
  'Updated, keys.json unreadable': updated('Your keys.json could not be read, so kansō\'s keys were left as they are.'),
  'Updated, new layout': updated('New layout; the one you had is in layouts/kanso.json.old-*.'),
  'Check failed': { state: 'failed', home: 'update', text: 'GitHub could not be reached', act: 'Refresh' },
  'Install failed': notUpdated('permission denied'),
  'Install failed, Windows tool missing': notUpdated('curl.exe is not on PATH; nothing was downloaded another way'),
  'Install failed, Windows folder not moved': notUpdated('could not put kanso-tabs in place: C:\\Users\\you\\AppData\\Roaming\\herdr-app\\mods\\kanso-tabs'),
  'Out of memory': { state: 'failed', home: 'memory', text: 'Herdr\'s mod runtime is out of memory', act: 'Restart' },
};

// Two notices already on screen when the story adds one.
export const sampleNotices = [
  { state: 'done', home: 'agent', text: 'docs finished: Added docs/limits.md and the table' },
  { state: 'waits', home: 'pr', text: '#142 · test / unit failed' },
];

// A sample panel's content, composed outside the shell: its tool, its section and rows, and the words of its empty, failed and stale reads.
export const samplePanel = {
  title: 'Worktrees',
  scope: 'This computer',
  read: 'Read 14:02 · devbox unreachable · next try 14:07',
  tool: () => button({ label: 'New worktree', kind: 'icon', icon: 'lu-plus' }),
  periods: ['Today', 'Month', '30 days', 'Year', 'All'],
  number: { value: '2.4 GB', unit: 'in 9 worktrees' },
  section: { name: 'acme-shop', meta: '1.6 GB' },
  rows: [
    { name: 'acme-shop-cart', meta: '310 MB', second: 'In a tab: cart-ui · today', mark: 'working' },
    { name: 'rate-limit-v1', meta: '412 MB', second: 'Merged · 3 d', mark: 'done' },
    { name: 'promo-banner', meta: '380 MB', second: '2 uncommitted changes · 6 d', mark: 'blocked' },
  ],
  empty: { icon: 'lu-git-fork', text: 'No worktrees' },
  failure: { text: "Can't list worktrees on devbox", source: 'git worktree list: timed out after 30 s', fix: 'Refresh', agent: 'migrate' },
};

// What real panels put in a header: before the title, nothing, ‹ or the program's mark; after it, the tools each one has.
const headerTool = (label, icon) => button({ label, kind: 'icon', icon });
export const samplePanelHeader = {
  starts: { none: () => [], back: () => [panelBack()], mark: () => [glyph('p-claude')] },
  tools: {
    none: () => [],
    refresh: () => [panelRefresh()],
    reading: () => [panelRefresh({ reading: true })],
    'share and refresh': () => [headerTool('Share', 'lu-share'), panelRefresh()],
    'pin and refresh': () => [headerTool('Stay on this agent', 'lu-pin'), panelRefresh()],
    document: () => [headerTool('Open with…', 'lu-external-link'), panelRefresh(), panelClose()],
  },
};

// The Sort menu of each view, in the app's words: its orders, the current one ticked, then what the sidebar shows.
const ticked = (label, on) => ({ label, icon: on ? 'lu-check' : undefined });
const sortShows = [ticked('What each agent is on', true), ticked('While you were away', true), ticked('Projects, Status and Threads', true)];
const sortMenu = (title, orders, current, extra = []) => menu({ items: [{ heading: title }, ...orders.map((label) => ticked(label, label === current)), ...extra, { separator: true }, { heading: 'Show' }, ...sortShows] });
// The hosts of a sample ~/.ssh/config, each as it stands after Add, and the agent that explains a refusal.
export const sampleHosts = [
  { name: 'dark', target: 'jj@10.0.4.12' },
  { name: 'mini', target: 'jj@mini.local', state: 'added', mac: true },
  { name: 'vps', target: 'root@203.0.113.9', state: 'login', words: 'root@203.0.113.9: Permission denied (publickey,password).' },
  { name: 'build', target: 'ci@build.internal', state: 'unreachable', words: 'ssh: connect to host build.internal port 22: Operation timed out' },
];
export const sampleAgent = 'Atlas';
// The menu + opens on Status and Threads: a project to start in, then the other ways in, then another computer.
export const sampleAddMenu = () => menu({ items: [{ heading: 'New conversation in' }, { label: 'kansō' }, { label: 'amtelser' }, { label: 'site', hint: 'dark' },
  { separator: true }, { label: 'New project with a conversation…', icon: 'lu-folder-plus' }, { label: 'Open a folder, no project…', icon: 'lu-file' }, { label: 'Add computer…', icon: 'lu-server' }] });
export const sampleSortMenus = {
  spaces: () => sortMenu('Agents, pinned first, then by', ['Last update', 'Needs you first', 'By kind', 'As on screen', 'Your order (drag)'], 'Last update'),
  agents: () => sortMenu('In each section, by', ['Latest change first', 'Longest in its state', 'Project'], 'Latest change first'),
  threads: () => sortMenu('Threads, pinned first, then by', ['Your last message', 'When it started'], 'Your last message', [ticked('Grouped by project', false)]),
};
// The agents Send can reach, as the approved board names them.
export const sampleTargets = [
  { name: 'tests', project: 'acme-shop', status: 'done' },
  { name: 'checkout', project: 'acme-shop' },
  { name: 'i18n', project: 'docs-site' },
];
export const sampleMessage = 'Review the changes on branch limits-docs in ~/acme-shop-docs. Its pull request is #141.';
// The arrangements of acme-shop and one from another project, as the approved board names them.
export const sampleArrangements = [{ name: 'web and api' }, { name: 'review pair' }, { name: 'i18n', from: 'docs-site' }];
// The checkout tab's panes as Save this tab captures them.
export const sampleCapture = [
  { icon: 'p-claude', name: 'checkout', detail: 'claude --model opus', second: 'new conversation' },
  { icon: 'p-codex', name: 'docs', detail: 'codex', second: 'new conversation' },
  { icon: 'lu-terminal', name: 'web', detail: 'pnpm dev' },
  { icon: 'lu-terminal', name: 'zsh', detail: '~/acme-shop' },
];
// What the agent menu's second Menus offer for checkout, as the approved board names them.
export const sampleSnooze = [['In 1 hour', '15:02'], ['In 3 hours', '17:02'], ['This evening', '18:00'], ['Tomorrow', 'Thu 9:00'], ['Monday', 'Mon 9:00']];
export const sampleMove = { projects: ['docs-site', 'reports'], home: 'acme-shop' };
export const sampleAsleepRow = { title: 'billing, asleep since 14:02', more: 3, group: 'in review' };
export const sampleCopy = { folder: '~/acme-shop-checkout', branch: 'checkout-v2', id: '9f2c…' };
// The editors Open with finds for a file, a folder, a picture and a remote file, and the agents installed in a project.
const editor = (name, extra = {}) => ({ name, ...extra });
export const sampleEditors = {
  file: [editor('Preview', { icon: 'lu-eye' }), editor('Cursor', { icon: 'lu-code' }), editor('Visual Studio Code', { icon: 'lu-code' }), editor('In a split', { terminal: true }), editor('Neovim', { terminal: true })],
  folder: [editor('Cursor', { icon: 'lu-code' }), editor('Visual Studio Code', { icon: 'lu-code' }), editor('Zed', { icon: 'lu-code' }), editor('In a split', { terminal: true }), editor('Neovim', { terminal: true }), editor('Vim', { terminal: true })],
  picture: [editor('Images', { icon: 'lu-image' }), editor('Preview', { icon: 'lu-eye' }), editor('Cursor', { icon: 'lu-code' })],
  remote: [editor('Preview', { icon: 'lu-eye' }), editor('In a split', { terminal: true }), editor('Neovim', { terminal: true }), editor('Vim', { terminal: true })],
};
// Open with on a remote folder: each editor as its app's picture or letter; one that cannot open a remote folder only says so.
export const sampleApps = [{ label: 'Cursor', letter: 'C', tone: 'blue' }, { label: 'Zed', letter: 'Z', tone: 'teal' }, { label: 'Xcode', letter: 'X', tone: 'violet', disabled: true, hint: 'local only' }];
// A pull request's label picker, and Spend's project chooser: a second line and a fact each.
export const sampleLabels = [{ label: 'bug', dot: 'blocked', second: 'Something is not working', checked: true }, { label: 'checkout', dot: 'done', second: 'The payments flow', checked: true }, { label: 'enhancement', dot: 'blue', second: 'A new feature or request' }, { label: 'docs', dot: 'violet', second: 'Words, not code' }, { label: 'later', dot: 'dim', second: 'Not this release' }];
export const sampleChoices = [{ label: 'acme-shop', second: '3 models', hint: '$4.12', checked: true }, { label: 'docs-site', second: '1 model', hint: '$0.80' }, { label: 'reports', second: '2 models', hint: '$1.94' }];
// Every project, more than a menu shows at once.
export const sampleProjectRun = ['acme-shop', 'docs-site', 'reports', 'kansō', 'site', 'dojo', 'api', 'mobile'];
export const sampleTargetsOpened = { file: 'src/session.ts', folder: '~/acme', picture: 'screenshot.png', remote: 'devbox: ~/acme/src/session.ts' };
export const sampleInstalled = [{ program: 'p-claude', name: 'Claude Code', last: true }, { program: 'p-codex', name: 'Codex' }];
// A project's worktrees as its menu lists them, and its tabs asleep.
export const sampleWorktrees = [{ branch: 'checkout-v2', place: 'kansō' }, { branch: 'cart-retry', place: '~/acme-shop-cart' }];
export const sampleAsleep = ['checkout', 'docs', 'billing'];
