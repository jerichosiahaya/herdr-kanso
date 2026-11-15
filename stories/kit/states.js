// The pages drawn from named states: each state is a preset of its page's playground, and the catalog draws its record from that preset.
import { computerItem, edge, keyboardSystems, layoutPaused, paletteDoor, panelShell, pickedKey, shortcutRow, stepperMenu, tabBar } from './compositions.js';
import { button, keycap, needsItem, stack, statusItem, stepper } from './pieces.js';
import { atWidth, inBar } from './frames.js';
import { keyLayer, keyLayerMods, statusMenus, statusPanels } from './samples.js';

export const layerDefaults = Object.fromEntries(keyboardSystems.map((os) => [`${os}Layer`, keyLayerMods[os][0]]));
const settingsSlice = (markup) => `<div class="kanso-story__slice kanso-story__settings">${markup}</div>`;

const question = 'Run pnpm add react-countdown@2.3?';
export const needsShown = { none: null, question: needsItem({ name: 'cart-ui', question, more: 1 }), folded: needsItem({ name: 'cart-ui', more: 1 }) };
export const memoryShown = { none: null, word: statusItem({ text: 'Memory 8% free', tone: 'blocked' }), folded: statusItem({ text: '8% free', tone: 'blocked' }) };
export const stepperShown = ['rest', 'hover', 'menu'];

const statusBar = ({ width, computer, paused, stepper: middle, needs, memory, panels, open }) => {
  const menuOpen = !paused && middle === 'menu';
  const popup = menuOpen ? stepperMenu() : panels && open !== 'none' ? statusMenus[open]() : '';
  const bar = inBar(width, {
    left: computer === 'none' ? [] : [computerItem({ name: 'devbox', state: computer })],
    middle: paused ? layoutPaused() : stepper({ hover: middle === 'hover', open: menuOpen }),
    right: [needsShown[needs], memoryShown[memory], ...(panels ? statusPanels({ open }) : []), paletteDoor()].filter(Boolean),
    popup,
  });
  return popup ? `<div class="kanso-story__popup-room">${bar}</div>` : bar;
};

const tabItems = (value) => [{ key: 'checkout', label: 'checkout' }, { key: 'cart-ui', label: 'cart-ui', mark: value === 'cart-ui' ? '' : 'blocked' }, { key: 'tests', label: 'tests' }];
export const tabActs = {
  'at rest': (items) => items,
  'close armed': ([first, ...rest]) => [{ ...first, armed: true, tip: 'Press again to close checkout' }, ...rest],
  renaming: ([first, ...rest]) => [{ ...first, editing: true }, ...rest],
  'renamed, waiting': ([first, ...rest]) => [{ ...first, label: 'api-limits', pending: true }, ...rest],
  dragging: ([first, second, third]) => [first, { ...second, drop: true }, { ...third, held: true }],
  'long name': ([first, second, third]) => [first, second, { ...third, label: 'retry-after-header-for-cart-and-checkout' }],
};
const foldedTabs = ['perf', 'web', 'e2e', 'storybook', 'seed-data'];

const edgeColumns = (panes, stacked) => stacked && panes.length > 1 ? [panes.slice(0, 2), ...panes.slice(2).map((pane) => [pane])] : panes.map((pane) => [pane]);
export const edgeSides = ['left', 'right', 'both'];

export const panelRowLooks = { rest: {}, hover: { hover: true }, selected: { current: true }, armed: { current: true, action: { label: 'Remove', kind: 'quiet', armed: true } } };
const worktreeRows = [
  { name: 'acme-shop-cart', meta: '310 MB', second: 'In a tab: cart-ui · today', mark: 'working' },
  { name: 'rate-limit-v1', meta: '412 MB', second: 'Merged · 3 d', mark: 'done' },
  { name: 'promo-banner', meta: '380 MB', second: '2 uncommitted changes · 6 d', mark: 'blocked' },
];
const panelRows = ({ marks, lines, look }) => worktreeRows.map((item, index) => ({ ...item, mark: marks ? item.mark : 'none', second: lines ? item.second : null, ...(index === worktreeRows.length - 1 ? panelRowLooks[look] : {}) }));

export const statedPages = {
  'Compositions/Panel shell': {
    args: { title: 'Worktrees', scope: 'This computer', state: 'ready', marks: true, lines: true, period: false, number: false, narrow: false, look: 'rest' },
    markup: ({ marks, lines, look, period, number, ...args }) => panelShell({
      ...args, tools: [button({ label: 'New worktree', kind: 'icon', icon: 'lu-plus' })], read: 'Read 14:02 · devbox unreachable · next try 14:07',
      period: period ? 'Month' : null, number: number ? { value: '2.4 GB', unit: 'in 9 worktrees' } : null,
      sections: [{ title: 'acme-shop', meta: '1.6 GB', rows: panelRows({ marks, lines, look }) }],
      empty: { icon: 'lu-git-fork', text: 'No worktrees' },
      failure: { text: "Can't list worktrees on devbox", source: 'git worktree list: timed out after 30 s', agent: 'migrate' },
    }),
    states: [
      { label: 'Header and scope', args: {}, caption: 'Header 40 with the title 20 and icon buttons; scope line meta, dim.' },
      { label: 'Header, scope, period, the number', args: { period: true, number: true }, caption: 'Header, scope, period, the number.' },
      { label: 'Section and rows', args: { look: 'selected' }, caption: 'Section 15 strong with its fact dim. Row 32 body, the value at the right. Two-line row for a name and a fact.' },
      { label: 'Sections and the one row: rest, hover, selected, armed', args: { look: 'armed' }, caption: 'Sections and the one row: rest, hover, selected, armed.' },
      { label: 'With a mark, and the one-line form', args: { lines: false }, caption: 'With a mark, and the one-line form.' },
      { label: 'Narrow, 300: title 15, meta truncates', args: { narrow: true }, caption: 'Narrow, 300: title 15, meta truncates.' },
      { label: 'First read', args: { state: 'loading' }, caption: 'First read.' },
      { label: 'Empty', args: { state: 'empty' }, caption: 'Empty.' },
      { label: 'A read failed: where the list would start', args: { state: 'failed' }, caption: 'A read failed: where the list would start.' },
      { label: 'Stale: another computer stopped answering', args: { state: 'stale' }, caption: 'Stale: another computer stopped answering.' },
    ],
  },
  'Compositions/Status bar/Item': {
    args: { icon: 'lu-container', mark: 'none', text: '1', tone: 'blocked', pending: false },
    markup: ({ icon, mark: status, ...args }) => inBar(520, { right: [statusItem({ ...args, icon: icon === 'none' ? '' : icon, mark: status === 'none' ? '' : status })] }),
    states: [
      { label: 'Memory', args: { icon: 'none', text: 'Memory 8% free' }, caption: 'This computer is low on memory.' },
      { label: 'Memory folded', args: { icon: 'none', text: '8% free' }, caption: 'Memory loses its word last.' },
    ],
  },
  'Compositions/Status bar/Computer item': {
    args: { name: 'devbox', remote: true, state: 'on', folded: false },
    markup: (args) => inBar(520, { left: [computerItem(args)] }),
    states: [
      { label: 'Out of sight', args: {}, caption: 'Only while its sidebar row is out of sight.' },
      { label: 'Folded', args: { folded: true }, caption: 'The computer becomes its icon.' },
      { label: 'Unreachable', args: { state: 'unreachable' }, caption: 'While its row is out of sight; Refresh reconnects.' },
      { label: 'Reconnecting', args: { state: 'pending' }, caption: 'At 80% with a breathing dot.' },
    ],
  },
  'Compositions/Status bar/Needs you item': {
    args: { name: 'cart-ui', question, more: 1 },
    markup: (args) => inBar(760, { right: [needsItem(args)] }),
    states: [
      { label: 'One', args: { more: 0 }, caption: 'Mark, name and question, as the row says them. Click: ⌘J.' },
      { label: 'Several', args: {}, caption: 'How many more wait out of view.' },
      { label: 'Folded', args: { question: '' }, caption: 'The question goes; the name and +1 never fold.' },
    ],
  },
  'Compositions/Status bar': {
    args: { width: 1040, computer: 'none', paused: false, stepper: 'rest', needs: 'question', memory: 'none', panels: false, open: 'none' },
    markup: statusBar,
    states: [
      { label: 'At rest', args: { needs: 'none' }, caption: 'Nothing to say; panes per view keeps its slot.' },
      { label: 'Panes per view menu', args: { needs: 'none', stepper: 'menu' }, caption: 'Right-click: Even out, then the piece lines.' },
      { label: 'Layout paused', args: { needs: 'none', paused: true }, caption: 'The strip stopped after a failure; it resumes alone after 10 s.' },
      { label: 'Sidebar folded', args: { computer: 'on' }, caption: 'The focused project is on devbox.' },
      { label: 'Unreachable', args: { computer: 'unreachable', needs: 'none' }, caption: "devbox can't be reached and its row is out of sight." },
      { label: 'Needs you', args: {}, caption: 'While the waiting row is out of view.' },
      { label: 'Servers, containers and reviews', args: { width: 520, needs: 'none', panels: true }, caption: 'Each its icon and how many need a look; gone while its panel is open.' },
      { label: 'Servers open', args: { width: 520, needs: 'none', panels: true, open: 'servers' }, caption: 'The server with no pane: open, copy, stop.' },
      { label: 'Containers open', args: { width: 520, needs: 'none', panels: true, open: 'containers' }, caption: 'The stopped container: start, logs, remove.' },
      { label: 'Reviews open', args: { width: 520, needs: 'none', panels: true, open: 'reviews' }, caption: 'Each pull request waiting for you; a click opens it in PR.' },
      { label: 'Everything, 1200', args: { width: 1200, memory: 'word', panels: true }, caption: 'Every item at once.' },
      { label: 'Everything, 1040', args: { memory: 'folded', panels: true }, caption: 'The question shrinks; Memory loses its word.' },
      { label: 'Everything, 760', args: { width: 760, memory: 'folded' }, caption: 'Servers, containers and reviews give way.' },
      { label: 'Everything, 520', args: { width: 520, needs: 'folded', memory: 'folded' }, caption: 'The question is gone.' },
    ],
  },
  'Compositions/Tab bar': {
    args: { width: 1040, value: 'checkout', tab: 'at rest', panel: 'none', state: 'connected', folded: 0, overflow: false, windows: false },
    markup: ({ width, value, tab, folded, overflow, ...args }) => {
      const bar = atWidth(width, tabBar({ ...args, value, overflow, items: tabActs[tab](tabItems(value)), folded: foldedTabs.slice(0, folded).map((label) => ({ label })) }));
      return overflow && folded ? `<div class="kanso-story__menu-room">${bar}</div>` : bar;
    },
    states: [
      { label: 'At rest', args: {}, caption: 'Only a tab out of view whose session waits carries a mark; none for working or finished. Closed doors paint nothing.' },
      { label: 'Panel open', args: { panel: 'pr' }, caption: 'The open door on the quiet fill.' },
      { label: 'Close armed', args: { tab: 'close armed' }, caption: 'A tab holding a session: the first press arms for 4 s.' },
      { label: 'Renaming', args: { tab: 'renaming' }, caption: 'Double-click renames in place, the name selected.' },
      { label: 'Renamed on devbox, waiting', args: { tab: 'renamed, waiting' }, caption: 'At 80% with a breathing dot until confirmed.' },
      { label: 'Dragging', args: { tab: 'dragging' }, caption: 'The held tab on the pressed wash; the accent bar where it lands.' },
      { label: 'Long name', args: { tab: 'long name' }, caption: 'A name stops at 170 and truncates.' },
      { label: 'Folded, 760', args: { width: 760, folded: 5, overflow: true }, caption: 'What does not fit goes behind +5, a Menu with the marks.' },
      { label: 'Connecting', args: { width: 520, state: 'connecting' }, caption: 'A project on devbox: one breathing skeleton per known tab.' },
      { label: 'Unreachable', args: { width: 520, state: 'unreachable' }, caption: 'The tabs step down; no + and no doors.' },
      { label: 'Windows and Linux', args: { windows: true }, caption: 'The window buttons after the doors, in the same button.' },
    ],
  },
  'Compositions/Edges': {
    args: { side: 'right', panes: 3, stacked: false, drop: false, waiting: 'none', overflow: false },
    markup: ({ side, panes, stacked, drop, waiting, overflow }) => {
      const lit = { none: -1, nearest: 0, farthest: panes - 1 }[waiting];
      const list = Array.from({ length: panes }, (_, index) => ({ name: `pane ${index + 1}`, program: ['p-claude', 'p-codex', 'lu-terminal'][index % 3], lit: index === lit }));
      const [first, ...rest] = list;
      const edges = side === 'both'
        ? edge({ side: 'left', columns: [[first]], drop }) + edge({ columns: edgeColumns(rest, stacked), drop, overflow })
        : edge({ side, columns: edgeColumns(list, stacked), drop, overflow });
      return `<div class="kanso-story__strip${side === 'right' ? ' kanso-story__strip--end' : ''}">${edges}</div>`;
    },
    states: [
      { label: 'One left, three right', args: { side: 'both', panes: 4 }, caption: 'A tile per pane past each side; a click goes there, the name is its tooltip. No state dots.' },
      { label: 'A stacked column', args: { stacked: true }, caption: 'The panes of one column stay together.' },
      { label: 'Dragging past the edge', args: { panes: 1, drop: true }, caption: 'A pane dragged over an edge washes it in accent.' },
      { label: 'Ten beyond', args: { panes: 10 }, caption: 'Every pane keeps its tile.' },
    ],
  },
  'Compositions/Keyboard/Key': {
    args: { label: 'H', units: 1, state: 'kanso', hover: false },
    markup: (args) => stack({ variant: 'keyboard' }, stack({ variant: 'keyboard row' }, keycap(args))),
    states: [{ label: 'kansō key', args: {}, caption: 'A key that does a kansō action.' }],
  },
  'Compositions/Keyboard/Picked key': {
    args: { os: 'mac', ...layerDefaults, key: 'h' },
    markup: ({ os, key, ...args }) => settingsSlice(pickedKey({ os, layer: keyLayer(os, args[`${os}Layer`]), picked: key })),
    states: [{ label: 'Default', args: {}, caption: 'What the picked key does here, and its act.' }],
  },
  'Compositions/Keyboard/Shortcut row': {
    args: { name: 'Pin the pane', chords: '⌥⌘P', state: 'rest', hover: false },
    markup: ({ chords, ...args }) => settingsSlice(shortcutRow({ ...args, chords: chords.split(',').map((chord) => chord.trim()).filter(Boolean),
      taken: { chord: '⌥⌘J', name: 'Pane below' }, source: 'keys.json: EACCES: permission denied', agent: 'checkout' })),
    states: [{ label: 'Rest', args: {}, caption: 'One action and its keys.' }],
  },
};
