// Sample sidebar content for the stories: the rows and tiles of each view, drawn with the compositions.
import { asleep, computerRow, projectRow, section, sessionRow, sidebar, tile } from './compositions.js';
import { menu, stack, statusItem } from './pieces.js';

const group = (...rows) => stack({ variant: 'row group' }, ...rows);
export const sampleRows = {
  spaces: () => [
    group(computerRow({ name: 'light', remote: false })),
    group(projectRow({ name: 'prjct' }), sessionRow({ program: 'lu-terminal', name: 'Orion', status: 'idle' })),
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
export const sampleSidebar = ({ view = 'spaces', ...args } = {}) => sidebar({ ...args, view, rows: sampleRows[view](), tiles: sampleTiles[view]() });

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
