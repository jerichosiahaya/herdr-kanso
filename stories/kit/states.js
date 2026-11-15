// The pages drawn from named states: each state is a preset of its page's playground, and the catalog draws its record from that preset.
import { addComputer, agentMenu, asleepMenu, paneMenu, computerMenu, projectMenu, settingsMenu, newInMenu, openWithMenu, copyMenu, moveMenu, snoozeMenu, arrangements, saveArrangement, newProject, newWorktree, promptDialog, sendDialog, sleepDialog, computerItem, computerRow, edge, header, asleep, section, pieceMenu, sidebarFooter, tabMenu, toolbar, keyboardSystems, layoutPaused, paletteDoor, panel, panelBack, panelHeader, panelRefresh, paneHeader, pickedKey, shortcutRow, statusBar, stepperMenu, tabBar, views } from './compositions.js';
import { avatar, button, card, chip, code, dawn, delta, dialog, dragHandle, markdown, keyHint, mark, emptyState, escape, glyph, menu, phrase, failureBlock, input, keycap, list, metric, needsItem, row, skeletonOf, stack, toggle, statusItem, stepper, tabs, terminal, thumbnail, toast, tooltip, windowControls, picture, pin, note, device, deviceScreen, bars, meter, heatmap, excerpt, band, sentence, well, shareCard, dojoGrid, dojoText, dojoProgress, dojoLevel } from './pieces.js';
import { atWidth, captioned, inBar, inPane, inRail, inSettings, inSidebar, inSlice } from './frames.js';
import { panelPages } from './panel-states.js';
import { sampleDojo, sampleFind, sampleShare, sampleShipped } from './panel-samples.js';
import { keyLayer, keyLayerMods, sampleShot, sampleScreens, samplePanel, samplePanelHeader, sampleAddMenu, sampleAgent, sampleApps, sampleChoices, sampleLabels, sampleProjectRun, sampleArrangements, sampleAsleep, sampleAsleepRow, footerUpdates, sampleRefusedUpdate, sampleCapture, sampleWorktrees, sampleCopy, sampleEditors, sampleInstalled, sampleMove, sampleSnooze, sampleTargetsOpened, sampleHosts, sampleMessage, sampleSortMenus, sampleSidebar, sampleTargets, sampleWindow, statusMenus, statusPanels } from './samples.js';

export const layerDefaults = Object.fromEntries(keyboardSystems.map((os) => [`${os}Layer`, keyLayerMods[os][0]]));

const question = 'Run pnpm add react-countdown@2.3?';
export const needsShown = { none: null, question: needsItem({ name: 'cart-ui', question, more: 1 }), folded: needsItem({ name: 'cart-ui', more: 1 }) };
const memoryItem = ({ folded = false, open = false }) => statusItem({ text: folded ? '8% free' : 'Memory 8% free', tone: 'blocked', open });
export const memoryShown = { none: null, word: memoryItem({}), folded: memoryItem({ folded: true }) };
export const stepperShown = ['rest', 'hover', 'menu'];
// Each item the bar can show, in its own half and at its fold.
export const statusItems = {
  Computer: ({ state, folded, open }) => ({ left: [computerItem({ name: 'devbox', state, folded, open })] }),
  'Needs you': ({ folded, more, open }) => ({ right: [needsItem({ name: 'cart-ui', question: folded ? '' : question, more, open })] }),
  Memory: (args) => ({ right: [memoryItem(args)] }),
  'Servers, containers, reviews': () => ({ right: statusPanels() }),
  'Working count': ({ open }) => ({ right: [statusItem({ mark: 'working', text: 3, open })] }),
  'Command palette': ({ open }) => ({ right: [paletteDoor({ open })] }),
};
// Each item's right-click Menu, as board B10 draws it.
const statusItemMenus = {
  Computer: () => pieceMenu({ title: 'devbox', items: [{ icon: 'lu-refresh-cw', label: 'Refresh' }] }),
  'Needs you': () => pieceMenu({ title: 'Needs you', items: [{ label: 'Go to cart-ui', hint: '⌘J', mark: 'blocked' }] }),
  Memory: () => pieceMenu({ title: 'Memory low', items: [{ icon: 'lu-memory-stick', label: 'Open Memory' }], needed: false }),
  'Working count': () => pieceMenu({ title: 'Agents at work', items: [{ label: 'Show them', hint: '⌃⌥S', mark: 'working' }] }),
  'Command palette': () => pieceMenu({ title: 'Command palette key', needed: false }),
};

// The status bar's halves for its controls; the page frames them at a width, the window places them as they are.
const statusParts = ({ computer, paused, stepper: middle, needs, memory, panels, open }) => {
  const menuOpen = !paused && middle === 'menu';
  return {
    left: computer === 'none' ? [] : [computerItem({ name: 'devbox', state: computer })],
    middle: paused ? layoutPaused() : stepper({ hover: middle === 'hover', open: menuOpen }),
    right: [needsShown[needs], memoryShown[memory], ...(panels ? statusPanels({ open }) : []), paletteDoor()].filter(Boolean),
    popup: menuOpen ? stepperMenu() : panels && open !== 'none' ? statusMenus[open]() : '',
  };
};
const withPopup = (width, parts) => parts.popup ? `<div class="kanso-story__popup-room">${inBar(width, parts)}</div>` : inBar(width, parts);
const statusStory = ({ width, ...args }) => withPopup(width, statusParts(args));
const statusArgs = { width: 1040, computer: 'none', paused: false, stepper: 'rest', needs: 'question', memory: 'none', panels: false, open: 'none' };

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
// The sidebar's views with one changed tab; a tab bar's tabs after an act, each closable.
const viewTabs = (change) => views.map((item, index) => index === 1 ? { ...item, ...change } : item);
const barTabs = (act) => tabActs[act](tabItems('checkout')).map((item) => ({ closable: true, ...item }));
export const tabMenus = { none: null, open: (name) => tabMenu({ name, agents: 2 }), 'close armed': (name) => tabMenu({ name, agents: 2, armed: true }) };

const edgeColumns = (panes, stacked) => stacked && panes.length > 1 ? [panes.slice(0, 2), ...panes.slice(2).map((pane) => [pane])] : panes.map((pane) => [pane]);
export const edgeSides = ['left', 'right', 'both'];

// Panel: the sample panel's content in each read; the last row takes the look picked for it.
export const panelRowLooks = { rest: {}, hover: { hover: true }, selected: { current: true }, armed: { current: true, action: { label: 'Remove', kind: 'quiet', armed: true } } };
const panelRows = ({ lines, last }) => samplePanel.rows.map((item, index, rows) => row({ ...item, second: lines ? item.second : null, ...(index === rows.length - 1 ? panelRowLooks[last] : {}) }));
const panelSection = (rows) => [row({ ...samplePanel.section, heading: true }), panelRows(rows)];
const periods = () => tabs({ items: samplePanel.periods.map((label) => ({ key: label, label })), value: 'Month', size: 'sm', track: true, label: true });
export const panelContents = {
  rows: (last) => panelSection({ lines: true, last }),
  'one-line rows': (last) => panelSection({ lines: false, last }),
  'period and the number': (last) => [periods(), metric(samplePanel.number), panelSection({ lines: true, last })],
};
// Each read puts its state pattern where the list would start; stale keeps the last body under the time it was read.
export const panelReads = {
  ready: { body: (content) => content },
  loading: { reading: true, body: () => skeletonOf({ shape: 'list row', count: 3 }) },
  empty: { body: () => emptyState(samplePanel.empty) },
  failed: { body: () => failureBlock(samplePanel.failure) },
  stale: { stale: true, scope: samplePanel.read, body: (content) => content },
};

// Dialog: what its body holds and the notes under it, each a sample of what a use puts there.
export const dialogBodies = {
  'a field': ({ loading }) => input({ text: 'checkout', label: 'Name', focus: !loading, selected: !loading, loading }),
  'a list': ({ loading }) => (loading ? skeletonOf({ shape: 'row', count: sampleTargets.length }) : list(sampleTargets.map(({ name, project }) => row({ icon: 'p-claude', name, detail: project })))),
  nothing: () => '',
};
export const dialogNotes = {
  none: [], 'a fact': [{ text: 'npm run dev stops now' }], 'nothing to do': [{ text: 'Nothing here keeps a conversation to wake on', tone: 'muted' }],
  'a refusal': [{ text: 'A name needs a letter', tone: 'error' }],
};

// Each worktree refusal in git's words, with the fix that ends it.
export const worktreeRefusals = {
  none: null,
  'already checked out': { text: 'app-audit is already checked out', source: "fatal: 'app-audit' is already checked out at '~/Apps/herdr/herdr-kanso-cart'", fix: 'Open it' },
  'not a branch name': { text: 'Not a valid branch name', source: "fatal: 'cart retry' is not a valid branch name", fix: 'Create' },
};
export const projectRefusals = {
  none: null,
  'already a project': { text: 'kansō is already a project', fix: 'Go to it' },
  'write refused': { text: "Couldn't create kansō", source: 'database is locked', fix: 'Create' },
};
// Who Send can reach: the sample agents, more than fit (Find shows), or none.
export const sendReach = {
  'a few agents': { agents: sampleTargets },
  'more than six': { agents: sampleTargets, find: '' },
  'no match': { find: 'missing', empty: 'No agent or project by that name' },
  'all wait for you': { empty: 'No agent can take a message' },
  'no other agent': { empty: 'No other agent is running' },
};
// What Sleep is asked to put away, and how far it got.
export const sleepCases = {
  'a project': { title: 'Sleep acme-shop', facts: ['vite on web starts fresh on Wake'], action: 'Sleep 3 tabs' },
  'a tab': { title: 'Sleep this tab', facts: ['npm run dev stops now'] },
  'one agent': { title: 'Sleep checkout' },
  reading: { title: 'Sleep acme-shop', reading: true, action: 'Sleep 3 tabs' },
  'going to sleep': { title: 'Sleep acme-shop', step: 'working', action: 'Going to sleep' },
  waking: { title: 'Wake checkout', step: 'working', action: 'Waking…' },
  'did not exit': { title: 'Sleep acme-shop', failure: { text: 'checkout did not exit', fix: 'Undo' } },
  'needs you first': { title: 'Sleep acme-shop', rows: [{ icon: 'p-claude', name: 'checkout', detail: 'needs you first', mark: 'blocked' }], action: null },
  'conversation not found': { title: 'Sleep acme-shop', failure: { text: "Can't sleep checkout", source: "checkout's conversation was not found", fix: 'Sleep' } },
  'cannot resume': { title: 'Sleep this agent', facts: ['Only a resumable agent can sleep on its own'], action: null },
  'nothing to resume': { title: 'Sleep acme-shop', facts: ['Nothing here keeps a conversation to wake on'], action: null },
  'already awake': { title: 'Wake', facts: ['That is no longer asleep'], action: null },
};
const sleepCaptions = {
  'a project': 'Only what will not come back the same is said.', 'a tab': 'One tab and what stops with it.', 'one agent': 'One agent.',
  reading: 'Its conversations are being checked.', 'going to sleep': 'The processes are exiting.', waking: 'A sleeping row comes back.',
  'did not exit': 'A step failed; Undo puts back what slept.', 'needs you first': 'An agent waits on a question.',
  'conversation not found': 'Its conversation is gone.', 'cannot resume': 'The program cannot resume.', 'nothing to resume': 'Nothing here keeps a conversation.',
  'already awake': 'The row is no longer asleep.',
};
// What the Arrangements list shows: the saved ones with the first chosen, or the one state that replaces them.
const chooseFirst = (look = {}) => sampleArrangements.map((item, index) => (index ? item : { ...item, chosen: true, ...look }));
export const arrangementViews = {
  'saved': { saved: chooseFirst() },
  'delete armed': { saved: chooseFirst({ armed: true }) },
  'delete refused': { saved: chooseFirst(), failure: { text: 'Not removed', source: 'SQLITE_READONLY: database is read only', fix: 'Delete' } },
  opening: { saved: chooseFirst({ opening: true }) },
  keyboard: { saved: sampleArrangements.map((item, index) => (index === 1 ? { ...item, focus: true } : item)) },
  reading: { reading: true },
  'none yet': { empty: 'No arrangement yet' },
  'read refused': { failure: { text: "Can't read arrangements", source: 'SQLITE_BUSY: database is locked', fix: 'Refresh' } },
  'no sqlite3': { empty: 'No arrangement yet', note: 'Install sqlite3 to keep arrangements.' },
  'save this tab': { save: {} },
  overwrite: { save: { title: 'Overwrite web and api', scope: 'With this tab as it is now', name: 'web and api', armed: true } },
  'capture reading': { save: { reading: true } },
  'save refused': { save: { failure: { text: 'Not saved', source: 'SQLITE_FULL: database or disk is full', fix: 'Save' } } },
};
const arrangementCaptions = {
  'saved': 'The chosen one shows Overwrite and Delete; another project’s shows that project.', 'delete armed': 'Delete asks twice within 4 s.',
  'delete refused': 'The store refused: its words, Delete again.', opening: 'The chosen one opens in this project.', keyboard: 'The list has the keyboard.',
  reading: 'Before the store answers.', 'none yet': 'Nothing saved anywhere.', 'read refused': 'The store did not answer.', 'no sqlite3': 'Nothing can be kept without sqlite3.',
  'save this tab': 'The name, then each pane as it will come back.', overwrite: 'Overwrite on a row: the save names it and asks twice.',
  'capture reading': 'The panes and their commands are being read.', 'save refused': 'The store refused the write; the tab stays as it was.',
};
// Menu: the items of a worktree's file row, and each look an item can take.
export const menuItems = [
  { label: 'Open the diff', icon: 'lu-git-pull-request' }, { label: 'Open', icon: 'lu-file', hint: '↵' }, { separator: true },
  { label: 'Hide this section', icon: 'lu-eye-off' }, { label: 'Delete worktree', icon: 'lu-x', verb: 'delete' },
];
// Each look a Menu control turns on, on the item it belongs to.
const itemLooks = { keys: [1, { selected: true }], armed: [4, { armed: true }], badge: [0, { badge: '2' }], mark: [0, { mark: 'blocked' }] };
const lookedItems = (on) => menuItems.map((item, at) => Object.entries(itemLooks).reduce((shown, [name, [index, look]]) => (on[name] && index === at ? { ...shown, ...look } : shown), item));
const grouped = (items) => [{ heading: 'This worktree' }, ...items.slice(0, 2), { separator: true }, { heading: 'Show' }, ...items.slice(3)];
const menuRefusal = { text: "Can't read this worktree", source: 'fatal: not a git repository', fix: 'Refresh', agent: sampleAgent };
const runOf = (items) => [...items.slice(0, 2), { separator: true }, { heading: 'Move to project' }, { scroll: sampleProjectRun.map((label) => ({ label, icon: 'lu-folder' })), rows: 4 }];
const pickerOf = () => [{ field: 'Find a label' }, { scroll: sampleLabels, rows: 4 }];
const menuOf = ({ title, values, apps, picker, choices, headings, run, reading, refused, titleMark, ...on }) => {
  const actions = lookedItems(on);
  const listed = values ? sampleSnooze.map(([label, hint]) => ({ label, hint })) : apps ? sampleApps : picker ? pickerOf() : choices ? sampleChoices : headings ? grouped(actions) : actions;
  const items = run ? runOf(listed) : listed;
  const read = reading ? [{ loading: true }, { loading: true }, ...items.slice(2)] : items;
  const body = refused ? [{ failure: menuRefusal }, ...read.slice(2)] : read;
  // A marked title is the first heading, carrying its Mark.
  return titleMark === 'none' ? menu({ title, items: body }) : menu({ items: [{ heading: title, mark: titleMark }, ...body] });
};
// Open with: what is opened, and what the editor search answered.
export const openWithCases = {
  'a file': { target: 'file' }, 'a folder': { target: 'folder' }, 'a picture': { target: 'picture' }, 'on devbox': { target: 'remote' },
  keyboard: { target: 'file', keys: true },
  reading: { reading: true },
  'no editor': { none: 'No code editor found' },
  'did not open': { target: 'file', failed: 'Cursor' },
  'search refused': { failure: { text: "Couldn't look for editors", source: 'Process could not be started', fix: 'Refresh' } },
};
const openWithEditors = ({ target, keys, failed }) => (target ? sampleEditors[target].map((item, index) => ({ ...item, key: keys && index < 3 ? String(index + 1) : null, chosen: keys && !index, failed: item.name === failed })) : []);
export const newInCases = {
  installed: { agents: sampleInstalled }, 'checking again': { place: 'devbox · api', agents: sampleInstalled.slice(0, 1), checking: true },
  'first read': { place: 'devbox · api', reading: true },
  'did not answer': { place: 'devbox · api', failure: { text: "Can't list agents on devbox", source: 'agent list: timed out after 10 s', fix: 'Refresh' } },
  'none installed, not a repository': { place: 'notes', repository: false },
};
const openWithCaptions = {
  'a file': 'The editors that open it; terminal editors after the rule.', 'a folder': 'Folders open in code editors and terminals.', 'a picture': 'Pictures open in Images first.',
  'on devbox': 'On another computer, only what runs there.', keyboard: 'The first three have a number key.', reading: 'The editors are being looked for.',
  'no editor': 'Nothing here opens it.', 'did not open': 'The chosen editor refused: its mark stays on it.', 'search refused': "The search failed: the tool's words, Refresh, Explain.",
};
const newInCaptions = {
  installed: 'Terminal first, then each program installed there with its number; the last used is where the keys start.',
  'checking again': 'The last list stays while the computer is asked again.', 'first read': 'Nothing read yet: two items breathe in place.',
  'did not answer': "The computer did not answer: the failure block in the programs' place.", 'none installed, not a repository': 'Terminal, New project and Arrange only.',
  'pick a project': '+ on Status and Threads, with several projects: pick where first.',
};
// What a computer's switch or sync refusal says.
const computerRefusals = {
  nothing: null,
  power: { text: 'devbox was not changed', fix: 'Turn on' },
  sync: { text: 'Sync devbox was not changed', fix: 'Sync' },
};
const capitalized = (text) => text[0].toUpperCase() + text.slice(1);
const worktreePlace = { here: '~/.kanso/worktrees/kansō-app-audit', devbox: 'devbox · ~/.kanso/worktrees/kansō-app-audit' };

const panelArgs = { title: samplePanel.title, scope: samplePanel.scope, header: 'page', state: 'ready', look: 'panel', content: 'rows', last: 'rest' };
const panelStory = ({ title, scope, header, state, look, content, last }) => {
  const { reading = false, stale = false, scope: read = scope, body } = panelReads[state];
  const start = look === 'window' ? [panelBack()] : [];
  return panel({ look, stale, header: panelHeader({ title, form: header, start, second: read, tools: [samplePanel.tool(), panelRefresh({ reading })] }) }, body(panelContents[content](last)));
};

// The window: each region is its composition at rest; a panel opens beside the panes and lights its door.
// A pane in each moment of its life: focused at rest; dragged, its place standing in with the ruler lit where it lands; its process gone, the output kept.
const paneBody = (...children) => stack({ variant: 'pane body' }, ...children);
export const paneMoments = {
  'at rest': ({ name, lines }) => stack({ variant: 'pane' }, paneHeader({ name, state: 'idle', focused: true }), paneBody(terminal({ lines }))),
  dragged: ({ name }) => stack({ variant: 'pane', 'drop-preview': true }, paneHeader({ name, held: true }),
    paneBody(stack({ variant: 'pane placeholder' }, glyph('p-claude'), escape(name))), stack({ variant: 'pane drop ruler', on: true })),
  'process gone': ({ name, lines }) => stack({ variant: 'pane', gone: true }, paneHeader({ name }), paneBody(terminal({ lines }))),
};
const windowLayout = ({ collapsed, menu, panel: open }) => stack({ variant: 'window', rest: true },
  sampleSidebar({ collapsed, rowMenu: menu && !collapsed ? agentMenu({ name: sampleWindow.menuOn }) : null }),
  stack({ variant: 'window workspace' },
    tabBar({ items: sampleWindow.tabs, value: sampleWindow.pane.name, panel: open ? sampleWindow.door : null }),
    stack({ variant: 'window panes' }, paneMoments['at rest'](sampleWindow.pane), open ? panelStory(panelArgs) : null),
    statusBar(statusParts({ ...statusArgs, needs: 'none' }))));

// Each state pattern on the pieces that carry it, one surface after another.
const unreachable = { name: 'dark', state: 'unreachable' };
const refused = { text: "Can't reach dark", source: 'ssh: connect to host dark port 22: Operation timed out', fix: 'Refresh' };
const statePlaces = {
  failure: ({ open }) => [
    captioned('Status bar', inBar(760, { left: [computerItem(unreachable)] })),
    captioned('Sidebar', inSlice(computerRow(unreachable), open ? computerMenu({ ...unreachable, failure: refused, agent: sampleAgent }) : null)),
    captioned('Panel', panel({}, failureBlock({ text: "Can't list worktrees on dark", source: 'git worktree list: timed out after 30 s', fix: 'Refresh', agent: sampleAgent }))),
    captioned('Toast', toast({ level: 'error', title: "Couldn't pull checkout", action: 'Retry' })),
  ],
  empty: () => [captioned('Panel', panel({}, emptyState({ icon: 'lu-git-pull-request', text: 'No pull requests on this branch', action: 'Create' })))],
  pending: () => [
    captioned('Status bar', inBar(760, { left: [computerItem({ name: 'devbox', state: 'pending' })] })),
    captioned('Sidebar', inSlice(row({ name: 'acme-shop', heading: true, detail: [{ icon: 'lu-git-branch', text: 'main' }, '↓0'], pending: true }))),
    captioned('Panel', panel({}, row({ name: 'Approved, with 2 line comments', meta: 'now', pending: true }))),
  ],
  loading: () => [captioned('Sidebar', inSlice(skeletonOf({ shape: 'row', count: 3 }))), captioned('Panel', panel({}, skeletonOf({ shape: 'list row', count: 3 })))],
};

// What an avatar is given to show: nothing but its initial, a picture, or a picture that cannot load.
export const avatarPictures = { none: '', 'a picture': 'https://images.placeholders.dev/96x96', 'one that cannot load': 'https://invalid.example/avatar.png' };

// The pane header's sample: the pull request's verdict, whether GitHub answers, and the folder when it differs from the tab's.
export const paneVerdicts = ['none', 'ready', 'checks running', 'test / unit failed', 'changes requested', 'conflicts with main', 'behind main'];
const verdictTones = { ready: 'done', 'checks running': 'working', 'behind main': 'working' };
const paneDigestOf = ({ files, commits, pr, github }) => ({ files, add: files * 14, del: files * 2, commits,
  pr: pr === 'none' ? null : { number: '#142', verdict: pr, tone: verdictTones[pr] ?? 'blocked' }, failure: github ? null : 'gh: HTTP 502: Bad Gateway (https://api.github.com/graphql)' });
const panePlace = ({ elsewhere, reach }) => elsewhere ? { folder: reach === 'here' ? 'checkout-v2' : '~/checkout-v2', branch: 'limits-table' } : null;

// A comment's three lines of code, with the one it talks about lit; a found turn from the conversation.
const sampleSnippet = { text: 'export function bucket(customer) {\n  const plan = planOf(customer);\n  return { plan, tokens: LIMIT[plan] };', kind: 'source', first: 11, line: 12, comment: 0 };
const [, foundHit] = sampleFind.days[0][1];
// The dōjō's two boards and where a level sits on its path.
const dojoBoards = { grid: dojoGrid, text: (spot) => dojoText({ ...spot, lines: sampleDojo.code }) };
const levelState = (n, current) => n < current ? 'done' : n === current ? 'current' : 'next';
// The three charts one page draws: bars over a run, a meter's share, days in weeks.
const charts = { bars, meter, heatmap };
const { rhythm: shipRhythm } = sampleShipped;
export const statedPages = {
  'Primitives/Avatar': {
    args: { initial: 'S', picture: 'none', size: 'md', tone: '', round: true },
    markup: ({ picture, ...args }) => avatar({ ...args, image: avatarPictures[picture] }),
    states: [
      { label: 'Initial', args: {}, caption: 'The initial is the avatar.' },
      { label: 'Picture', args: { picture: 'a picture' }, caption: 'A picture from a URL, local or external, cropped to the circle.' },
      { label: 'Picture failed', args: { picture: 'one that cannot load' }, caption: 'When the picture cannot load, the initial stays.' },
      { label: 'Small', args: { size: 'sm' }, caption: 'Inside a line of text.' },
      { label: 'Large', args: { size: 'lg' }, caption: 'On a card or a header.' },
      { label: 'A computer', args: { initial: 'D', tone: 'teal' }, caption: 'A computer’s initial in its own colour, in the rail.' },
      { label: 'Tile', args: { initial: 'Z', round: false, size: 'sm' }, caption: 'An app’s picture or letter, square, in a menu.' },
    ],
  },
  'Primitives/Chip': {
    args: { label: '3 files', quiet: false, pill: false, tone: '' },
    markup: chip,
    states: [
      { label: 'A fact', args: {}, caption: 'A count or a short fact the row does not already say.' },
      { label: 'Quiet', args: { label: '4', quiet: true }, caption: 'A count with no ground, on a rail tile.' },
      { label: 'Quiet, needs you', args: { label: '4', quiet: true, tone: 'blocked' }, caption: 'A tile’s count when one of its items waits for someone.' },
      { label: 'Pill', args: { label: 'Dawn Mode', pill: true }, caption: 'The channel’s name beside the window lights.' },
    ],
  },
  'Primitives/Key hint': {
    args: { text: '⌘↵', faint: false, recording: false },
    markup: ({ text, ...args }) => keyHint({ ...args, text: text.slice(0, 6) }),
    states: [
      { label: 'A chord', args: {}, caption: 'Symbols beside the action they run.' },
      { label: 'Three keys', args: { text: '⌃⇧,' }, caption: 'Modifiers first, as the computer writes them.' },
      { label: 'A word', args: { text: 'Esc' }, caption: 'Esc stays a word.' },
      { label: 'Faint', args: { faint: true }, caption: 'The key says nothing now.' },
      { label: 'Recording', args: { recording: true }, caption: 'A new shortcut is being pressed.' },
    ],
  },
  'Primitives/Button': {
    args: { label: 'Create', kind: 'solid', size: 'md', icon: 'none', disabled: false, armed: false, verb: '', active: false, spin: false, hover: false, focus: false, pressed: false },
    markup: button,
    states: [
      { label: 'Solid', args: {}, caption: 'The one main action.' },
      { label: 'Tonal', args: { kind: 'tonal', label: 'Explain' }, caption: 'A supporting action beside the solid one.' },
      { label: 'Quiet', args: { kind: 'quiet', label: 'Cancel' }, caption: 'Cancel in a dialog, a word on a row.' },
      { label: 'Icon', args: { kind: 'icon', icon: 'lu-refresh-cw', label: 'Refresh' }, caption: 'A tool named by its tooltip.' },
      { label: 'Small', args: { size: 'sm', label: 'Open' }, caption: 'On a row, a toast or a header.' },
      { label: 'Small icon', args: { kind: 'icon', size: 'sm', icon: 'lu-x', label: 'Close' }, caption: 'A row tool.' },
      { label: 'Large icon', args: { kind: 'icon', size: 'lg', icon: 'lu-plus', label: 'New' }, caption: 'A sidebar tool.' },
      { label: 'With a mark', args: { kind: 'tonal', size: 'sm', icon: 'p-claude', label: 'Claude' }, caption: 'A program button carries its mark.' },
      { label: 'Selected', args: { kind: 'icon', icon: 'lu-sliders-vertical', label: 'Filter', active: true }, caption: 'A tool that is on.' },
      { label: 'Hover', args: { hover: true }, caption: 'The pointer is over it.' },
      { label: 'Pressed', args: { pressed: true }, caption: 'Held down.' },
      { label: 'Focus', args: { focus: true }, caption: 'One ring for every control.' },
      { label: 'Disabled', args: { disabled: true }, caption: 'Nothing to do yet.' },
      { label: 'Armed', args: { label: 'Remove', verb: 'remove checkout', armed: true }, caption: 'An irreversible action asks twice, for four seconds.' },
      { label: 'Armed icon', args: { kind: 'icon', icon: 'lu-x', label: 'Close', verb: 'close checkout', armed: true }, caption: 'The question moves to its tooltip.' },
      { label: 'Working', args: { label: 'Working…', spin: true }, caption: 'The action waits for its result.' },
    ],
  },
  'Primitives/Card': {
    args: { author: 'sam', picture: 'none', age: '1h', body: 'Batches of 50, flushed every 2 s.', loading: false, heading: '', lines: [] },
    markup: ({ picture, heading, lines, ...args }) => stack({ variant: 'panel' }, lines.length
      ? well({ heading }, lines.map(([name, detail]) => row({ name, detail }))) : card({ ...args, image: avatarPictures[picture] })),
    states: [
      { label: 'A comment', args: {}, caption: 'Who, when, then what they said.' },
      { label: 'With a picture', args: { picture: 'a picture' }, caption: 'The author’s picture in place of the initial.' },
      { label: 'A long comment', args: { body: 'Should the bucket key include the plan? A customer who upgrades mid-window keeps the old limit until the window rolls over, and support hears about it first.' }, caption: 'The body wraps; the header stays one line.' },
      { label: 'Loading', args: { loading: true }, caption: 'One skeleton in the card’s place and size.' },
      { label: 'A well', args: { heading: 'Conflicts', lines: [['src/api/limits.ts', 'both modified'], ['src/api/checkout.ts', 'deleted by them']] }, caption: 'The same inset surface holding what a verdict rests on, its heading in ink first.' },
    ],
  },
  'Primitives/Code': {
    args: sampleSnippet,
    markup: (args) => stack({ variant: 'panel' }, code(args)),
    states: [
      { label: 'Snippet', args: {}, caption: 'A comment quotes three lines; the one it talks about is lit.' },
      { label: 'Source', args: { text: 'import { planOf } from \"./plans\";\n\nconst LIMIT = { free: 40, pro: 400 };\nconst REFILL_MS = 2000;\n\nexport function bucket(customer) {\n  const plan = planOf(customer);\n  return { plan, tokens: LIMIT[plan] };\n}', first: 1, line: 7 }, caption: 'A file: dim numbers, keywords, strings and numbers in their colours, the caret line lit.' },
      { label: 'Diff', args: { text: '@@ -14,3 +14,7 @@ app.post(\"/checkout\", (req, res) => {\n   const customer = req.user.id;\n-  const b = buckets.get(customer);\n+  const b = bucket(customer);\n+  if (b.tokens < 1) {\n+    res.set(\"Retry-After\", retryAfter(b));\n+    return res.status(429).end();\n+  }', kind: 'diff', first: 14, line: 0 }, caption: 'Numbered as git counts: a hunk restarts at its start, a deleted line has no number.' },
      { label: 'Diff, commenting', args: { text: '@@ -14,3 +14,7 @@ app.post(\"/checkout\", (req, res) => {\n   const customer = req.user.id;\n-  const b = buckets.get(customer);\n+  const b = bucket(customer);\n+  if (b.tokens < 1) {\n+    res.set(\"Retry-After\", retryAfter(b));\n+    return res.status(429).end();\n+  }', kind: 'diff', first: 14, line: 16, comment: 16 }, caption: 'The + in a line’s gutter comments on it.' },
      { label: 'Log', args: { text: ' FAIL  src/api/limits.test.ts > refills after 2 s\nAssertionError: expected 39 to be 40\n ❯ src/api/limits.test.ts:42:18\n    41|   const b = bucket(\"c1\")\n  > 42|   expect(b.tokens).toBe(40)\n      Tests  1 failed | 47 passed (48)', kind: 'log', first: 1, line: 0 }, caption: 'The tool’s words in order; only failure lines turn blocked.' },
    ],
  },
  'Primitives/Dawn': {
    args: {},
    markup: () => dawn(),
    states: [{ label: 'Sunrise', args: {}, caption: 'The sky of Dawn Mode; the sun rises once on load.' }],
  },
  'Primitives/Drag handle': {
    args: { state: 'rest' },
    markup: dragHandle,
    states: [
      { label: 'At rest', args: {}, caption: 'Dim beside the pane’s name.' },
      { label: 'Hover', args: { state: 'hover' }, caption: 'The pointer is on it: ink and an accent underline.' },
      { label: 'Dragging', args: { state: 'dragging' }, caption: 'Held while the pane moves.' },
    ],
  },
  'Primitives/Field': {
    args: { text: '', label: 'Comment', icon: 'lu-send', lead: 'none', action: '', choose: false, focus: false, hover: false, error: false, disabled: false, multiline: false, inline: false, selected: false, loading: false, limit: 80 },
    markup: input,
    states: [
      { label: 'Empty', args: {}, caption: 'The placeholder names what goes in; the icon sends it.' },
      { label: 'Typed', args: { text: 'Batch the writes' }, caption: 'What was typed, in ink.' },
      { label: 'Word action', args: { text: 'jj@studio.local', label: 'user@host', icon: 'none', action: 'Add' }, caption: 'The action is a word; it shows once something is typed.' },
      { label: 'Chosen', args: { text: '~/Apps/checkout', label: 'Folder', icon: 'none', action: 'Choose', choose: true }, caption: 'Filled by a chooser, not typed: its word always shows.' },
      { label: 'Search', args: { label: 'Find', icon: 'none', lead: 'lu-search', text: 'bucket' }, caption: 'A search leads with its glass.' },
      { label: 'Hover', args: { hover: true }, caption: 'The edge steps up under the pointer.' },
      { label: 'Focus', args: { focus: true }, caption: 'The one ring.' },
      { label: 'Failure', args: { text: 'checkout/', label: 'Name', icon: 'none', error: true }, caption: 'The edge turns blocked; the reason sits under the field.' },
      { label: 'Disabled', args: { disabled: true }, caption: 'Nothing can be typed yet.' },
      { label: 'Multiline', args: { text: 'Review the limits page.\nKeep the plan in the bucket key.', label: 'Prompt', multiline: true }, caption: 'A prompt grows with its lines; Enter adds one.' },
      { label: 'Rename', args: { text: 'checkout', label: 'Name', icon: 'none', inline: true, selected: true, focus: true }, caption: 'In place, its old name selected.' },
      { label: 'Loading', args: { loading: true }, caption: 'One skeleton in the field’s place.' },
    ],
  },
  'Primitives/Markdown': {
    args: { source: '# Rate limits\n\nEach customer gets a bucket of requests. A request takes one token; the bucket refills one token every 2 s.\n\n| Plan | Per minute | Burst |\n| --- | --- | --- |\n| Free | 40 | 10 |\n| Pro | 400 | 60 |\n\n## Retry-After\n\nAn empty bucket answers `429` with `Retry-After` in seconds.\n\n```js\nres.set(\"Retry-After\", retryAfter(b));\n```\n\n![checkout-429.png](shots/checkout-429.png)', view: 'document', block: 0, state: 'rest', picture: 'shown' },
    markup: ({ picture: state, ...args }) => stack({ variant: 'panel' }, markdown({ ...args, shot: { state, size: '4.2 MB', image: sampleShot } })),
    states: [
      { label: 'At rest', args: {}, caption: 'Headings, paragraphs, a table, code in text, a fence and a picture, as the note reads.' },
      { label: 'Hover', args: { block: 2, state: 'hover' }, caption: 'The block under the pointer is washed; a click edits it.' },
      { label: 'Editing', args: { block: 2, state: 'editing' }, caption: 'The block is edited in place.' },
      { label: 'Editing a table', args: { block: 3, state: 'editing' }, caption: 'A table edits its cells; a row or a column goes with its ×, then Add row, Add column, Done.' },
      { label: 'Source', args: { view: 'source' }, caption: 'The raw text, as it is on disk.' },
      { label: 'Picture loading', args: { picture: 'loading' }, caption: 'The picture’s shape breathes until it comes.' },
      { label: 'Picture held', args: { picture: 'held' }, caption: 'On another computer past 2 MB: its name, size and Load.' },
      { label: 'Picture failed', args: { picture: 'failed' }, caption: 'One quiet line.' },
    ],
  },
  'Primitives/Metric': {
    args: { value: '31%', unit: 'free of 16 GB · 2.4 GB swap', small: '', second: '', facts: '14 tasks | $2.94 a task | 9.1M tokens', loading: false, size: 'md', tone: '', delta: '', up: true },
    markup: ({ delta: text, up, ...args }) => stack({ variant: 'panel' }, metric(args), text ? delta({ text, up }) : ''),
    states: [
      { label: 'A panel’s figure', args: {}, caption: 'The one number of a panel, its unit beside it, its facts under it.' },
      { label: 'Toned', args: { value: '8%', tone: 'blocked', facts: '' }, caption: 'The figure takes the tone of what it says.' },
      { label: 'Second line', args: { value: '25×', unit: 'Claude Max 20x', second: '$5,012 of work for $200', tone: 'working', facts: '' }, caption: 'A unit in ink over a dim second line, both beside the value.' },
      { label: 'Small figure', args: { value: '+12,480', small: '−3,210', unit: 'lines', facts: '' }, caption: 'A second figure, muted, between the value and its unit.' },
      { label: 'Delta', args: { value: '+12,480', small: '−3,210', unit: 'lines', facts: '', delta: '18% on last week' }, caption: 'The change against the last period, under the figure.' },
      { label: 'Small', args: { value: '$41.20', unit: 'today', size: 'sm', facts: '' }, caption: 'A figure at title size inside a line, on one line.' },
      { label: 'Loading', args: { loading: true }, caption: 'Each part keeps its shape while it reads.' },
    ],
  },
  'Primitives/Row': {
    args: { icon: 'lu-file', letter: '', number: '', name: 'checkout.ts', detail: 'src/api', detailTone: 'none', meta: '+14 −3', mark: 'none', second: '', reason: null, path: '', verbs: [], level: undefined, open: false, heading: false, title: false, hero: false, depth: 0, tools: false, current: false, selected: false, hover: false, focus: false, dimmed: false, pending: false, strong: false, late: false },
    markup: ({ tools, detail, detailTone, ...args }) => stack({ variant: 'panel' }, row({ ...args, detail: detailTone === 'none' ? detail : { text: detail, tone: detailTone }, actions: tools ? [{ icon: 'lu-pin', label: 'Pin' }, { icon: 'lu-ellipsis', label: 'More' }] : [] })),
    states: [
      { label: 'A file', args: {}, caption: 'Icon, name, a dim fact, the meta at the right.' },
      { label: 'Hover', args: { hover: true }, caption: 'Washed under the pointer.' },
      { label: 'Tools on hover', args: { hover: true, tools: true }, caption: 'Its tools take the meta’s place.' },
      { label: 'Focus', args: { focus: true }, caption: 'The one ring.' },
      { label: 'Selected', args: { selected: true }, caption: 'Picked, on w12.' },
      { label: 'Current', args: { current: true }, caption: 'The one open now.' },
      { label: 'Dimmed', args: { dimmed: true }, caption: 'Closed or out of reach: muted.' },
      { label: 'Pending', args: { pending: true }, caption: 'Waiting on its write, with the dot.' },
      { label: 'Changed file', args: { icon: 'none', letter: 'U', detail: 'src/api' }, caption: 'The git letter leads: A and D dim, U blocked; a modified file keeps the slot empty.' },
      { label: 'Tree', args: { icon: 'lu-folder', name: 'api', detail: '', meta: '', level: 1, open: true }, caption: 'A folder at its level, its chevron open.' },
      { label: 'A program', args: { icon: 'p-claude', name: 'checkout', detail: 'acme-shop', meta: '', mark: 'working' }, caption: 'An agent with its mark at the right.' },
      { label: 'Toned fact', id: 'kit/Row/Toned fact', args: { icon: 'lu-container', name: 'postgres', detail: 'unhealthy', detailTone: 'blocked', meta: '412 MB' }, caption: 'A fact that is a verdict leads with its dot and takes its tone: a container’s health, a worktree’s verdict, a PR’s state, a port’s owner.' },
      { label: 'Strong', args: { icon: 'p-claude', name: 'tests', detail: 'acme-shop', meta: '2m', strong: true }, caption: 'Unread or new: the name in ink.' },
      { label: 'Late', args: { icon: 'p-claude', name: 'tests', detail: 'acme-shop', meta: '18m', late: true }, caption: 'A step past its time: the meta in blocked ink.' },
      { label: 'Numbered', args: { icon: 'none', number: '#142', name: 'Rate limit checkout per customer', detail: '', meta: { text: 'failing', tone: 'blocked' } }, caption: 'A dim lead number; the state as toned meta.' },
      { label: 'Second line', args: { icon: 'lu-git-branch', name: 'checkout', detail: '', meta: '1.2 GB', second: [{ text: '3 uncommitted', tone: 'working' }, 'behind 2'] }, caption: 'Facts on a second line, a dot between them.' },
      { label: 'Picked', args: { icon: 'lu-git-branch', name: 'checkout', detail: '', meta: '1.2 GB', second: [{ text: '3 uncommitted', tone: 'working' }, 'behind 2'], reason: { text: 'Three files changed since the last commit; removing it loses them.', tone: 'dim' }, path: '~/Apps/acme-shop-checkout', verbs: [{ label: 'Open' }, { label: 'Remove', verb: 'remove checkout', armed: true }, { agent: 'checkout' }] }, caption: 'Opened: why, its path, then its verbs; the armed one asks again.' },
      { label: 'Heading', args: { icon: 'none', name: 'Today', detail: '', meta: '', heading: true }, caption: 'Names a group of rows.' },
      { label: 'Title', args: { icon: 'none', name: 'Files', detail: '', meta: '', title: true, second: 'acme-shop · main' }, caption: 'A panel’s heading: the name at title size, its scope under it.' },
      { label: 'Hero', args: { icon: 'none', name: 'Rate limit checkout per customer and per plan', detail: '', meta: '', hero: true, second: { text: 'test / unit failed', tone: 'blocked' } }, caption: 'A page’s subject, wrapping at section size, its verdict under it.' },
      { label: 'Indented', args: { depth: 1 }, caption: 'One step in, under its parent.' },
    ],
  },
  'Primitives/Switch': {
    args: { checked: false, label: 'Toggle', disabled: false, hover: false, focus: false, pressed: false },
    markup: toggle,
    states: [
      { label: 'Off', args: {}, caption: 'Raised with the input edge.' },
      { label: 'On', args: { checked: true }, caption: 'Solid; the knob is the only part that moves.' },
      { label: 'Hover', args: { hover: true }, caption: 'Under the pointer.' },
      { label: 'Focus', args: { focus: true }, caption: 'The one ring.' },
      { label: 'Pressed', args: { pressed: true }, caption: 'Held down.' },
      { label: 'Disabled', args: { disabled: true }, caption: 'Nothing to switch yet.' },
    ],
  },
  'Primitives/Tab': {
    args: { items: views, value: 'spaces', size: 'md', track: false, disabled: false, icon: true, label: true },
    markup: tabs,
    states: [
      { label: 'At rest', args: {}, caption: 'Icon and name; the open one on the quiet fill.' },
      { label: 'Hover', args: { items: viewTabs({ hover: true }) }, caption: 'Under the pointer.' },
      { label: 'Focus', args: { items: viewTabs({ focus: true }) }, caption: 'The one ring.' },
      { label: 'Disabled', args: { disabled: true }, caption: 'Out of reach: the names step down.' },
      { label: 'Track', args: { track: true, size: 'sm' }, caption: 'One of a few on a track, the chosen one raised.' },
      { label: 'Icons only', args: { label: false }, caption: 'Square; the name is its tooltip.' },
      { label: 'Small', args: { size: 'sm' }, caption: 'Inside a row or a card.' },
      { label: 'Large', args: { size: 'lg' }, caption: 'In a panel or a dialog.' },
      { label: 'Something waits', args: { items: viewTabs({ dot: true }) }, caption: 'A dot on a closed tab whose session waits.' },
      { label: 'Open tabs', args: { items: barTabs('at rest'), value: 'checkout' }, caption: 'The open tab closes with ×; one out of view that waits carries its mark.' },
      { label: 'Close armed', args: { items: barTabs('close armed'), value: 'checkout' }, caption: 'The first press arms for 4 s.' },
      { label: 'Renaming', args: { items: barTabs('renaming'), value: 'checkout' }, caption: 'The name in place, selected.' },
      { label: 'Renamed, waiting', args: { items: barTabs('renamed, waiting'), value: 'checkout' }, caption: 'At 80% with a breathing dot until confirmed.' },
      { label: 'Dragging', args: { items: barTabs('dragging'), value: 'checkout' }, caption: 'The held tab on the pressed wash; the accent bar where it lands.' },
    ],
  },
  'Primitives/Thumbnail': {
    args: { image: sampleShot, label: 'cart-countdown.png', selected: false, loading: false, focus: false },
    markup: thumbnail,
    states: [
      { label: 'At rest', args: {}, caption: 'The picture cropped to fill the square.' },
      { label: 'Selected', args: { selected: true }, caption: 'The shared accent ring outside; nothing moves.' },
      { label: 'Focus', args: { focus: true }, caption: 'The one ring.' },
      { label: 'Loading', args: { loading: true }, caption: 'The square breathes until the picture comes.' },
      { label: 'No picture', args: { image: '' }, caption: 'A picture that cannot load leaves the raised square; the name is its tooltip.' },
    ],
  },
  'Primitives/Toast': {
    args: { level: 'error', icon: 'none', title: "Can't reach devbox", body: '', action: 'Refresh', explain: '', mark: '', tone: '', detail: '' },
    markup: toast,
    states: [
      { label: 'Failure', args: {}, caption: 'The blocked mark and the one fix.' },
      { label: 'Warning', args: { level: 'warning', title: 'Sync devbox was not changed', action: '' }, caption: 'A working dot.' },
      { label: 'Success', args: { level: 'success', title: 'Merged #142', action: '' }, caption: 'The check.' },
      { label: 'Information', args: { level: 'info', title: 'feat/checkout already had a worktree', action: '' }, caption: 'An accent dot.' },
      { label: 'Two lines', args: { title: "Couldn't pull checkout", body: 'fatal: Not possible to fast-forward, aborting.', action: 'Retry' }, caption: 'The source’s words on a second line, muted.' },
      { label: 'Explain', args: { title: "Couldn't pull checkout", body: 'fatal: Not possible to fast-forward, aborting.', action: '', explain: 'Atlas' }, caption: 'An error sends the source’s words to a session.' },
      { label: 'A home’s icon', args: { level: 'success', icon: 'lu-git-pull-request', title: 'Merged #142', action: '' }, caption: 'The icon of where it happened, in the level’s colour.' },
      { label: 'A session’s mark', args: { level: 'success', mark: 'done', title: 'Atlas finished', action: '' }, caption: 'A session has no icon, so its mark.' },
    ],
  },
  'Primitives/Tooltip': {
    args: { text: 'New tab', detail: '', key: '⌘T', icon: 'lu-plus', side: 'bottom', open: true },
    markup: tooltip,
    states: [
      { label: 'Below', args: {}, caption: 'The name of an unnamed control and its key, in dim.' },
      { label: 'Above', args: { side: 'top' }, caption: 'The caret points at the control.' },
      { label: 'Right', args: { side: 'right' }, caption: 'Beside it when there is more room there.' },
      { label: 'Left', args: { side: 'left' }, caption: 'The side the composition sets.' },
      { label: 'A detail', args: { text: 'Adding up', detail: '14 repositories to go', key: '', icon: 'lu-refresh-cw' }, caption: 'A detail follows the name, in dim.' },
      { label: 'Closed', args: { open: false }, caption: 'Shown on hover and keyboard focus only.' },
    ],
  },
  'Primitives/Window controls': {
    args: {},
    markup: windowControls,
    states: [
      { label: 'At rest', args: {}, caption: 'The three lights, where the system draws them.' },
    ],
  },
  'Primitives/Picture': {
    args: { image: sampleShot, state: 'shown', action: 'Load 4.2 MB', pins: [] },
    markup: (args) => stack({ variant: 'panel' }, picture(args)),
    states: [
      { label: 'Shown', args: {}, caption: 'Sized to its panel, nothing around it.' },
      { label: 'Pinned', args: { pins: [pin({ n: 1, at: [24, 30] }), pin({ n: 2, region: [52, 48, 30, 22] })] }, caption: 'Its pins over it, at a point or around a region.' },
      { label: 'Loading', args: { state: 'loading' }, caption: 'Its breathing shape until it comes.' },
      { label: 'Held', args: { state: 'held' }, caption: 'Too large to bring on its own: the slot and the one action that brings it.' },
    ],
  },
  'Primitives/Annotation': {
    args: { n: 1, at: [24, 30], region: null, pending: false, writing: null, text: '', typing: false },
    markup: ({ n, at, region, pending, writing, text, typing }) => {
      const mark = pin({ n, at, region, pending });
      return at || region ? stack({ variant: 'panel' }, picture({ image: sampleShot, pins: [mark, writing ? note({ text, at: writing, typing }) : null] })) : mark;
    },
    states: [
      { label: 'Placed', args: {}, caption: 'A numbered pin on the point it names.' },
      { label: 'No note yet', args: { pending: true }, caption: 'Stepped down until it has its words.' },
      { label: 'A region', args: { at: null, region: [36, 42, 30, 22] }, caption: 'The pin rings what it names.' },
      { label: 'Writing a note', args: { pending: true, writing: [28, 34], text: 'Count from the server', typing: true }, caption: 'The note opens beside the pin, the caret after the words.' },
      { label: 'Empty note', args: { pending: true, writing: [28, 34], typing: true }, caption: 'Its placeholder until the first word.' },
      { label: 'Inline', args: { at: null }, caption: 'The pin alone, leading its row in a list of notes.' },
    ],
  },
  'Primitives/Device': {
    args: { screen: 'ios', state: 'on', frozen: false, focus: false, touch: null, rotated: false, narrow: false, pins: [] },
    markup: ({ screen, ...look }) => device(look, deviceScreen(sampleScreens[screen])),
    states: [
      { label: 'On', args: {}, caption: 'The app on its screen, in the device’s frame.' },
      { label: 'Another system', args: { screen: 'android' }, caption: 'The same frame for every system.' },
      { label: 'Focus', args: { focus: true }, caption: 'Touches and keys go to it.' },
      { label: 'A touch', args: { focus: true, touch: [50, 82] }, caption: 'The point being pressed.' },
      { label: 'Frozen', args: { frozen: true, pins: [pin({ n: 1, at: [70, 62] })] }, caption: 'Held still to pin; the pins sit over the screen.' },
      { label: 'Off', args: { state: 'off' }, caption: 'The empty frame and Boot.' },
      { label: 'Booting', args: { state: 'booting' }, caption: 'Its breathing blank.' },
      { label: 'Stalled', args: { state: 'stalled' }, caption: 'The last picture, stepped down.' },
      { label: 'Rotated', args: { rotated: true }, caption: 'On its side.' },
      { label: 'Narrow', args: { narrow: true }, caption: 'In a narrow panel.' },
    ],
  },
  'Primitives/Chart': {
    args: { kind: 'bars', bars: shipRhythm.hours, peak: null, low: [], part: [], labels: [], ticks: shipRhythm.ticks, filled: false, share: 0.62, days: sampleShipped.week.days },
    markup: ({ kind, ...args }) => stack({ variant: 'panel' }, charts[kind](args)),
    states: [
      { label: 'Bars', args: {}, caption: 'One hairline per period, its height the share of the highest; ticks under the run.' },
      { label: 'Peak and low', args: { peak: shipRhythm.peak, low: [11] }, caption: 'The peak in the accent, a low in the blocked tone.' },
      { label: 'Empty periods', args: { bars: shipRhythm.hours.map((value, index) => index % 5 ? value : 0) }, caption: 'A period with nothing keeps its place, in the border colour.' },
      { label: 'A part', args: { part: shipRhythm.hours.map(() => 0.4) }, caption: 'A share stacked inside each bar, in the working tone.' },
      { label: 'Filled', args: { filled: true, peak: shipRhythm.peak }, caption: 'Few bars share the width; the peak in ink.' },
      { label: 'Values', args: { filled: true, bars: [0.4, 0.7, 1, 0.55], labels: ['$12', '$21', '$30', '$16'], ticks: ['Mon', 'Tue', 'Wed', 'Thu'], peak: 2 }, caption: 'Each value over its bar.' },
      { label: 'Meter', args: { kind: 'meter' }, caption: 'A thin track and its filled share.' },
      { label: 'Days', args: { kind: 'heatmap' }, caption: 'Days in week columns, five levels from none to most.' },
    ],
  },
  'Primitives/Excerpt': {
    args: { ...foundHit, where: '', query: sampleFind.query, lead: '', snippet: '', current: false, pending: false, depth: 0 },
    markup: (args) => stack({ variant: 'panel' }, excerpt(args)),
    states: [
      { label: 'Found', args: {}, caption: 'Who and when small on top, the words at body size with the query marked.' },
      { label: 'Current', args: { current: true }, caption: 'The one shown in the conversation, washed.' },
      { label: 'A comment', args: { query: '', where: 'src/api/limits.ts:12' }, caption: 'Its path after who, mono.' },
      { label: 'With its code', args: { query: '', where: 'src/api/limits.ts:12', snippet: code(sampleSnippet) }, caption: 'The lines it talks about between who and the words.' },
      { label: 'Pending', args: { query: '', pending: true }, caption: 'Sent, until GitHub has it.' },
      { label: 'A reply', args: { query: '', depth: 1 }, caption: 'One step in, under what it answers.' },
      { label: 'Opened', args: { query: sampleFind.query, text: sampleFind.turn, lead: button({ label: 'Back', kind: 'icon', icon: 'lu-chevron-left' }) }, caption: 'The whole turn, Back before who.' },
    ],
  },
  'Primitives/Band': {
    args: { text: 'Changed on disk at 14:06', actions: [{ label: 'Overwrite' }, { label: 'Reload', kind: 'quiet' }] },
    markup: (args) => stack({ variant: 'panel' }, band(args)),
    states: [
      { label: 'Changed', args: {}, caption: 'What changed and when, over the document, and the two ways out.' },
      { label: 'Undo', args: { text: 'Overwrote the file at 14:07', actions: [{ label: 'Undo', kind: 'quiet' }] }, caption: 'After the choice, one way back.' },
    ],
  },
  'Primitives/Sentence': {
    args: { text: 'rate-limit-v1, relay-hotfix and one more. Merged branches go too.', tone: 'dim' },
    markup: (args) => stack({ variant: 'panel' }, sentence(args)),
    states: [
      { label: 'Dim', args: {}, caption: 'Words that wrap under what they explain.' },
      { label: 'Muted', args: { tone: 'muted', text: 'Nothing is lost. Merged branches go too.' }, caption: 'A step closer to the ink.' },
      { label: 'Toned', args: { tone: 'blocked', text: 'Loses 2 uncommitted changes in promo-banner. Merged branches go too.' }, caption: 'What an armed act would lose, in the blocked tone.' },
    ],
  },
  'Primitives/Share card': {
    args: { card: 'Ports' },
    markup: ({ card }) => shareCard(sampleShare.cards[card]),
    states: [
      { label: 'A figure and its run', args: {}, caption: 'The heading and its period, the figure and what it means, four counts, a note, then one chart.' },
      { label: 'Six counts', args: { card: 'Memory' }, caption: 'Up to six counts on one line.' },
      { label: 'A change', args: { card: 'Spend' }, caption: 'The change on last period under the figure.' },
      { label: 'A subtitle', args: { card: 'Dōjō' }, caption: 'What it is, under the heading; a streak and a list.' },
      { label: 'Every block', args: { card: 'Shipped' }, caption: 'A smaller figure beside the big one; the streak, the records and the hours.' },
    ],
  },
  'Primitives/Dojo board': {
    args: { board: 'grid', at: [11, 3], target: [14, 6], best: [], key: '', progress: { score: 45, time: '38s', streak: 2, moves: 2, best: 5, done: 4 }, current: 3, focus: false },
    markup: ({ board, progress, current, focus, ...spot }) => board === 'path' ? stack({ variant: 'panel' }, stack({ variant: 'dojo path' }, sampleDojo.levels.map(({ n, name, best }) => dojoLevel({ n, name, best: n < current ? best : '', state: levelState(n, current), focus: focus && n === current }))))
      : stack({ variant: 'dojo board' }, dojoProgress(progress), dojoBoards[board](spot)),
    states: [
      { label: 'A round', args: {}, caption: 'The count over the board: score, time, streak, moves against the best, one segment per target; the cursor in ink, the target ringed.' },
      { label: 'A miss', args: { at: [11, 4], best: [[12, 4], [13, 4], [14, 4], [14, 5]], key: 'l', progress: { score: 45, time: '51s', streak: 0, moves: 8, best: 5, missed: true, done: 4 } }, caption: 'The moves in working ink; the best way there drawn, its first cell showing the key that starts it.' },
      { label: 'A text', args: { board: 'text', at: [2, 2], target: [17, 2], progress: { score: 30, time: '22s', streak: 1, moves: 1, best: 2, done: 2 } }, caption: 'Code one character to a cell, for the levels that move by words and letters.' },
      { label: 'Before a move', args: { progress: { done: 0 } }, caption: 'No moves yet; the first segment lit.' },
      { label: 'The path', args: { board: 'path' }, caption: 'Each level with its keys, the done ones with their best, the current one ringed.' },
      { label: 'Moving along the path', args: { board: 'path', focus: true }, caption: '[ and ] move the ring.' },
    ],
  },
  'Primitives/Skeleton': {
    args: { shape: 'row', count: 3 },
    markup: (args) => stack({ variant: 'panel' }, skeletonOf(args)),
    states: [
      { label: 'Rows', args: {}, caption: 'Bars in the shape of the rows to come, one soft light.' },
      { label: 'Two-line rows', args: { shape: 'two lines' }, caption: 'Rows with a second line.' },
      { label: 'List rows', args: { shape: 'list row' }, caption: 'A name and its meta.' },
      { label: 'Lines', args: { shape: 'line', count: 4 }, caption: 'Text to come.' },
      { label: 'Header', args: { shape: 'header' }, caption: 'A panel’s heading and its tool.' },
    ],
  },
  'Primitives/Mark': {
    args: { status: 'working', size: 'md' },
    markup: mark,
    states: [
      { label: 'Working', args: {}, caption: 'The ensō spins while the item works.' },
      { label: 'Blocked', args: { status: 'blocked' }, caption: 'The item waits for someone.' },
      { label: 'Done', args: { status: 'done' }, caption: 'The item finished.' },
      { label: 'Idle', args: { status: 'idle' }, caption: 'The item is open and quiet.' },
      { label: 'Asleep', args: { status: 'asleep' }, caption: 'The moon, in muted ink.' },
      { label: 'Small', args: { size: 'sm' }, caption: 'Inside a line or a count.' },
      { label: 'Large', args: { size: 'lg' }, caption: 'In an activity line.' },
    ],
  },
  'Primitives/Dialog': {
    args: { title: 'Rename checkout', scope: '', body: 'a field', notes: 'none', secondary: '', primary: 'Rename', state: 'default', loading: false },
    markup: ({ body, notes, scope, secondary, primary, ...args }) => dialog({ ...args, scope: scope || null, body: dialogBodies[body](args), notes: dialogNotes[notes], secondary: secondary || null, primary: primary || null }),
    states: [
      { label: 'At rest', args: {}, caption: 'A title, what it asks, one primary.' },
      { label: 'With a scope', args: { title: 'Rename project', scope: '~/acme' }, caption: 'A fact under the title says where.' },
      { label: 'Cancel and the primary', args: { title: 'New project', secondary: 'Cancel', primary: 'Create' }, caption: 'Cancel before the primary, only where leaving drops what was typed.' },
      { label: 'Nothing to do yet', args: { state: 'disabled' }, caption: 'The primary is off until the dialog has what it needs.' },
      { label: 'Working', args: { state: 'loading' }, caption: 'After the press, the primary carries the request.' },
      { label: 'Armed', args: { title: 'Overwrite web and api', primary: 'Overwrite', state: 'armed' }, caption: 'An irreversible primary asks for a second press within 4 s.' },
      { label: 'A list', args: { title: 'Send to an agent', body: 'a list', primary: 'Send to tests' }, caption: 'The body holds Rows.' },
      { label: 'A note', args: { title: 'Sleep this tab', body: 'nothing', notes: 'a fact', primary: 'Sleep' }, caption: 'A fact under the body, dim.' },
      { label: 'A refusal', args: { notes: 'a refusal' }, caption: 'The reason in blocked under the body.' },
      { label: 'No footer', args: { title: 'Sleep acme-shop', body: 'nothing', notes: 'nothing to do', primary: '' }, caption: 'Nothing to press: Esc or a click outside closes it.' },
      { label: 'Loading', args: { loading: true }, caption: 'Each piece as its own skeleton until the content arrives.' },
    ],
  },
  'Primitives/Menu': {
    args: { title: 'src/api/checkout.ts', values: false, apps: false, picker: false, choices: false, headings: false, run: false, keys: false, armed: false, badge: false, mark: false, titleMark: 'none', reading: false, refused: false },
    markup: menuOf,
    states: [
      { label: 'At rest', args: {}, caption: 'A title, items with their icons, a rule between groups.' },
      { label: 'Keyboard', args: { keys: true }, caption: 'The item the keys are on, its key at the right.' },
      { label: 'Armed', args: { armed: true }, caption: 'What cannot be undone asks twice within 4 s.' },
      { label: 'Values', args: { title: 'Snooze checkout', values: true }, caption: 'Each item with the value it gives.' },
      { label: 'Headings', args: { headings: true }, caption: 'A dim heading names a group.' },
      { label: 'A run that scrolls', args: { run: true }, caption: 'A long run shows four, the rest scroll inside the menu.' },
      { label: 'A picker', args: { title: 'Labels', picker: true }, caption: 'A field finds in the list; each item toggles with a check, its colour and its second line.' },
      { label: 'Two lines', args: { title: 'Project', choices: true }, caption: 'Each choice with its second line and its fact; the chosen one checked.' },
      { label: 'Pictures', args: { title: 'Open with · devbox: ~/acme', apps: true }, caption: 'Each app as its own picture or letter; one that cannot do it here is dim and says why.' },
      { label: 'A badge', args: { badge: true }, caption: 'How many, on the item they belong to.' },
      { label: 'A mark', args: { mark: true }, caption: 'The state of the thing the item opens.' },
      { label: 'A mark on the title', args: { title: 'devbox', titleMark: 'working' }, caption: 'The state of what the menu is about, at its title’s right.' },
      { label: 'Reading', args: { reading: true }, caption: 'Items still being read breathe in their place.' },
      { label: 'A refusal', args: { refused: true, titleMark: 'blocked' }, caption: 'What the menu could not read: the failure pattern in its place, the rest still there.' },
    ],
  },
  'Compositions/Open with menu': {
    args: { situation: 'a file' },
    markup: ({ situation }) => {
      const { target, keys, failed, ...rest } = openWithCases[situation];
      return openWithMenu({ ...rest, target: target ? sampleTargetsOpened[target] : null, editors: openWithEditors({ target, keys, failed }), agent: sampleAgent });
    },
    states: Object.keys(openWithCases).map((situation) => ({ label: capitalized(situation), args: { situation }, caption: openWithCaptions[situation] })),
  },
  'Compositions/New conversation menu': {
    args: { situation: 'installed' },
    markup: ({ situation }) => (situation === 'pick a project' ? sampleAddMenu() : newInMenu({ place: 'acme-shop', agent: sampleAgent, ...newInCases[situation] })),
    states: [...Object.keys(newInCases), 'pick a project'].map((situation) => ({ label: capitalized(situation), args: { situation }, caption: newInCaptions[situation] })),
  },
  'Compositions/Computer menu': {
    args: { state: 'on', sync: 'off', refused: 'nothing' },
    markup: ({ state, sync, refused }) => computerMenu({ name: 'devbox', state, sync, failure: computerRefusals[refused], agent: sampleAgent }),
    states: [
      { label: 'Connected', args: {}, caption: 'Right-click or ⋯ on a computer.' },
      { label: 'Sync on', args: { sync: 'on' }, caption: 'Sync says it is on.' },
      { label: 'Saving sync', args: { sync: 'saving' }, caption: 'Sync breathes in its place until it is written.' },
      { label: 'Off', args: { state: 'off' }, caption: 'Turn on leads.' },
      { label: 'Unreachable', args: { state: 'unreachable' }, caption: 'Refresh and Sign in lead.' },
      { label: 'Sign in', args: { state: 'sign in' }, caption: 'ssh asks for a sign-in: here, or the command to copy.' },
      { label: 'Power refused', args: { state: 'off', refused: 'power' }, caption: 'Turning it on was refused: the failure block leads, Turn on is its fix.' },
      { label: 'Sync refused', args: { refused: 'sync' }, caption: 'Sync was refused and stays as it was: the failure block leads, Sync is its fix.' },
    ],
  },
  'Compositions/State patterns': {
    args: { state: 'failure', menu: false },
    markup: ({ state, menu: open }) => list(statePlaces[state]({ open })),
    states: [
      { label: 'Failure', args: {}, caption: 'A read or an act was refused: each surface says what in our words, then the fix.' },
      { label: 'Failure, right-click', args: { menu: true }, caption: "On a sidebar row, the source's words, the other fixes and Explain wait in its right-click Menu." },
      { label: 'Empty', args: { state: 'empty' }, caption: 'Nothing to show: one sentence and at most one action.' },
      { label: 'Pending', args: { state: 'pending' }, caption: 'An act was sent: the new state is drawn at once and breathes until it is confirmed.' },
      { label: 'Loading', args: { state: 'loading' }, caption: 'The first read: the shape of the rows that will come.' },
    ],
  },
  'Compositions/Project menu': {
    args: { tabs: 3, worktrees: true, asleep: false, kept: true, missing: false, gone: false, armed: false },
    markup: ({ worktrees, asleep, ...rest }) => projectMenu({ name: 'acme-shop', worktrees: worktrees ? sampleWorktrees : [], asleep: asleep ? sampleAsleep : [], ...rest }),
    states: [
      { label: 'Open', args: {}, caption: 'Right-click or ⋯ on a project with open tabs.' },
      { label: 'Remove armed', args: { armed: true }, caption: 'Remove asks twice within 4 s and says how many tabs close.' },
      { label: 'Asleep', args: { tabs: 0, asleep: true }, caption: 'Its sleeping tabs wake first.' },
      { label: 'Not kept', args: { tabs: 1, worktrees: false, kept: false }, caption: 'An open folder that is not a project yet.' },
      { label: 'Folder missing', args: { tabs: 0, missing: true }, caption: 'Its folder is gone: find it, or remove the project.' },
      { label: 'Gone', args: { gone: true }, caption: 'The project left while the menu was open.' },
    ],
  },
  'Compositions/Header': {
    args: { collapsed: false, dawn: false, art: true },
    markup: header,
    states: [
      { label: 'Expanded', args: {}, id: 'kit/Header/Open', caption: 'The lights; + on the left; sort, search and hide on the right.' },
      { label: 'Collapsed', args: { collapsed: true }, id: 'kit/Header/Collapsed', caption: 'The lights; + and show stacked in the rail, Sort and Search under a caret.' },
      { label: 'Expanded, Dawn Mode', args: { dawn: true }, id: 'kit/Header/Dawn', caption: 'The dawn behind the lights, the Dawn Mode pill right of them.' },
      { label: 'Collapsed, Dawn Mode', args: { collapsed: true, dawn: true }, id: 'kit/Header/Dawn collapsed', caption: 'The dawn behind the lights, centred on the rail; no room for the pill.' },
      { label: 'Dawn Mode, sky off', args: { dawn: true, art: false }, caption: 'The pill stays; it cannot be hidden.' },
    ],
  },
  'Compositions/Sidebar/Section': {
    args: { title: 'Needs you', status: 'blocked', count: 0, moon: false, open: false },
    markup: ({ moon, open, ...args }) => inSidebar(moon ? asleep({ names: sampleAsleep, open }) : section(args)),
    states: [
      { label: 'With its mark', args: {}, id: 'kit/Section/Default', caption: 'A heading in Status and Threads.' },
      { label: 'Folded', args: { title: 'Idle', status: 'none', count: 2 }, caption: 'How many, only while folded.' },
      { label: 'Asleep, folded', args: { moon: true }, id: 'kit/Asleep/Folded', caption: 'The moon and how many sleep.' },
      { label: 'Asleep, open', args: { moon: true, open: true }, id: 'kit/Asleep/Open', caption: 'Each one dimmed, one level in, Wake at the right.' },
    ],
  },
  'Compositions/Sidebar/Footer': {
    args: { update: 'none', moment: 'offered', collapsed: false, open: false },
    markup: ({ update, moment = 'offered', collapsed, open }) => {
      const footer = sidebarFooter({ update: footerUpdates[update], updating: moment === 'updating', refused: moment === 'refused' ? sampleRefusedUpdate : null, collapsed });
      return list(open ? settingsMenu() : null, collapsed ? inRail(footer) : inSidebar(footer));
    },
    states: [
      { label: 'At rest', args: {}, id: 'kit/Footer/Default', caption: 'Settings alone, the same in Stable Mode and Dawn Mode.' },
      { label: 'A kansō update', args: { update: 'kansō' }, id: 'kit/Footer/Update', caption: 'One row above Settings, in foreground.' },
      { label: 'A Dawn Mode build', args: { update: 'Dawn Mode build' }, caption: 'The row names the build.' },
      { label: 'Updating', args: { update: 'kansō', moment: 'updating' }, caption: 'Marked at once, quiet until it lands.' },
      { label: 'Update refused', args: { update: 'kansō', moment: 'refused' }, caption: "The row unchanged, the tool's words under it." },
      { label: 'Settings open', args: { open: true }, caption: 'One menu: kansō settings and Herdr settings.' },
      { label: 'In the rail', args: { collapsed: true }, caption: 'Squares; the gear opens the same menu.' },
    ],
  },
  'Compositions/Settings menu': {
    args: { update: false, armed: false },
    markup: ({ update, armed }) => settingsMenu({ update: update ? 'Update Herdr to 0.1.16' : null, armed }),
    states: [
      { label: 'At rest', args: {}, caption: 'Settings in the footer, or the gear in the rail.' },
      { label: 'Herdr update', args: { update: true }, caption: 'Herdr has an update waiting: a third item, here only.' },
      { label: 'Restart armed', args: { update: true, armed: true }, caption: 'The update restarts Herdr, so it asks twice within 4 s.' },
    ],
  },
  'Compositions/Pane header': {
    args: { program: 'p-claude', name: 'checkout', state: 'working', focused: true, keyboard: false, hover: false, menu: false, rightClick: 'none', pinned: false, zoomed: false, reach: 'here', held: false, armed: false, renaming: false,
      elsewhere: false, files: 3, commits: 2, pr: 'test / unit failed', github: true, fold: 0 },
    markup: ({ files, commits, pr, github, elsewhere, ...args }) => inPane(paneHeader({ ...args, digest: paneDigestOf({ files, commits, pr, github }), place: panePlace({ elsewhere, reach: args.reach }) })),
    states: [
      { label: 'Focused, working', args: {}, caption: 'The selected ground; the working mark; the files, commits and pull request after the name.' },
      { label: 'Not focused', args: { focused: false }, caption: 'The same facts on the plain ground.' },
      { label: 'Waiting for you', args: { state: 'blocked' }, caption: 'The blocked wash and the blocked mark.' },
      { label: 'Finished', args: { state: 'done', pr: 'ready' }, caption: 'The done mark; Sleep and Send stay out while it is focused.' },
      { label: 'Pointer on it', args: { hover: true }, caption: 'Split right, wider or narrower, close and ⋯.' },
      { label: 'Focus from the keyboard', args: { keyboard: true }, caption: 'The accent ring around the header.' },
      { label: 'Close armed', args: { hover: true, armed: true }, caption: 'A pane with a session asks twice within 4 s.' },
      { label: 'Pinned', args: { pinned: true }, caption: 'A pin after the name.' },
      { label: 'A terminal', args: { program: 'lu-terminal', name: 'npm run dev', state: 'none', files: 0, commits: 0, pr: 'none' }, caption: 'The terminal icon and its command, no digest; Terminal when it has no project.' },
      { label: 'Folder differs from the tab', args: { elsewhere: true }, caption: 'The folder and branch after the name, only when they differ from the project.' },
      { label: 'GitHub does not answer', args: { github: false }, caption: 'The failure line with Refresh in place of the pull request.' },
      { label: 'Out of reach', args: { reach: 'unreachable' }, caption: 'A computer out of reach: the header at 55%, no mark.' },
      { label: 'Renaming', args: { renaming: true }, caption: 'Double-click renames in place, the name selected.' },
      { label: 'Held to move', args: { held: true }, caption: 'The header is the handle.' },
      { label: 'Narrow', args: { elsewhere: true, fold: 5 }, caption: 'Folder, branch, the tools, commits and files fold first; the pull request’s tooltip keeps them.' },
      { label: '⋯ open', args: { menu: true }, caption: 'The pane menu under ⋯, leaving out what the header shows.' },
      { label: 'Right-click folder or branch', args: { elsewhere: true, rightClick: 'folder or branch' }, caption: 'Copy path, Copy branch name, Open with…, then Hide this and Settings.' },
      { label: 'Right-click files or commits', args: { rightClick: 'files or commits' }, caption: 'Open the diff, Push the commits…, then the piece lines.' },
    ],
  },
  'Compositions/Pane menu': {
    args: { name: 'checkout', state: 'working', pinned: false, zoomed: false, parent: false, program: false, armed: false, keyboard: false },
    markup: ({ parent, ...args }) => paneMenu({ ...args, parent: parent ? 'checkout' : null }),
    states: [
      { label: 'At rest', args: {}, caption: 'Right-click a pane, or ⋯ on its header.' },
      { label: 'Keyboard', args: { keyboard: true }, caption: 'The list keys move through the items; each act has its own key at the right.' },
      { label: 'Pinned', args: { pinned: true }, caption: 'Pin becomes Unpin.' },
      { label: 'A terminal from a conversation', args: { name: 'tests', state: 'none', parent: true }, caption: 'A terminal opened from checkout can go back to it.' },
      { label: 'Without a program, on devbox', args: { name: 'web · devbox', state: 'none', pinned: true }, caption: 'Only what a plain terminal can do.' },
      { label: 'Right-clicks to the program', args: { program: true }, caption: 'Ticked: right-clicks go to the program; ⋯ still opens this menu.' },
      { label: 'Close armed', args: { armed: true }, caption: 'Close asks twice within 4 s, naming the pane.' },
    ],
  },
  'Compositions/Agent menu': {
    args: { on: 'an agent', pinned: false, away: 'no', armed: false, opened: 'none' },
    markup: ({ on, pinned, away, armed, opened = 'none' }) => ({
      none: () => on === 'an asleep row' ? asleepMenu(sampleAsleepRow) : agentMenu({ name: 'checkout', thread: on === 'a thread' ? 'Rate limit' : null, pinned, away: away === 'no' ? null : away, armed }),
      Snooze: () => snoozeMenu({ name: 'checkout', times: sampleSnooze }),
      'Move to project': () => moveMenu({ name: 'checkout', ...sampleMove }),
      Copy: () => copyMenu(sampleCopy),
    })[opened](),
    states: [
      { label: 'Agent', args: {}, caption: 'Right-click or ⋯ on an agent.' },
      { label: 'Close armed', args: { armed: true }, caption: 'Close asks twice within 4 s.' },
      { label: 'Pinned', args: { pinned: true }, caption: 'Pin to the top becomes Unpin.' },
      { label: 'Thread', args: { on: 'a thread' }, caption: 'On Threads: the thread’s title, and Settle.' },
      { label: 'Snoozed', args: { on: 'a thread', away: 'snoozed' }, caption: 'Only its way back: Wake.' },
      { label: 'Settled', args: { on: 'a thread', away: 'settled' }, caption: 'Only its way back: Bring back.' },
      { label: 'Asleep row', args: { on: 'an asleep row' }, caption: 'Its way back first; Everything asleep… opens Sleep.' },
      { label: 'Snooze', args: { opened: 'Snooze' }, caption: 'Each time with when it ends.' },
      { label: 'Move to project', args: { opened: 'Move to project' }, caption: 'The other projects, then back home.' },
      { label: 'Copy', args: { opened: 'Copy' }, caption: 'Each fact with its value.' },
    ],
  },
  'Compositions/Arrangements dialog': {
    args: { view: 'saved' },
    markup: ({ view }) => {
      const { save, ...list } = arrangementViews[view];
      return save ? saveArrangement({ title: 'Save this tab', scope: 'An arrangement for acme-shop', name: 'checkout and docs', panes: sampleCapture, agent: sampleAgent, ...save })
        : arrangements({ project: 'acme-shop', agent: sampleAgent, ...list });
    },
    states: Object.keys(arrangementViews).map((view) => ({ label: capitalized(view), args: { view }, caption: arrangementCaptions[view] })),
  },
  'Compositions/Prompt dialog': {
    args: { title: 'Rename checkout', scope: '', text: 'checkout', fallback: 'claude', action: 'Rename' },
    markup: ({ scope, ...args }) => promptDialog({ ...args, scope: scope || null }),
    states: [
      { label: 'Rename', args: {}, caption: 'Opened with the name selected.' },
      { label: 'With a scope', args: { title: 'Rename project', scope: '~/acme', text: 'acme' }, caption: 'A command gives where it acts.' },
      { label: 'Emptied', args: { text: '' }, caption: 'An emptied name shows what it falls back to.' },
      { label: 'Its own word', args: { title: 'Pin 1', text: 'Move this below the title', fallback: 'Note', action: 'Add' }, caption: 'The asking command names the primary.' },
    ],
  },
  'Compositions/New project dialog': {
    args: { folder: '', name: '', refusal: 'none', created: false },
    markup: ({ refusal, created, ...args }) => created
      ? stack({ variant: 'sidebar frame' }, row({ name: args.name, heading: true, pending: true }))
      : newProject({ ...args, failure: projectRefusals[refusal], agent: sampleAgent }),
    states: [
      { label: 'No folder yet', args: {}, caption: 'Create waits for a folder.' },
      { label: 'Folder chosen', args: { folder: '~/Apps/herdr/herdr-kanso', name: 'kansō' }, caption: 'The name follows the folder.' },
      { label: 'Already a project', args: { folder: '~/Apps/herdr/herdr-kanso', name: 'kansō', refusal: 'already a project' }, caption: 'The folder is one of your projects.' },
      { label: 'Write refused', args: { folder: '~/Apps/herdr/herdr-kanso', name: 'kansō', refusal: 'write refused' }, caption: 'The store refused it: its words and Create again.' },
      { label: 'Created', args: { name: 'kansō', created: true }, caption: 'The dialog closes; the row is there at once, quiet until written.' },
    ],
  },
  'Compositions/New worktree dialog': {
    args: { project: 'kansō', branch: 'app-audit', computer: 'here', exists: false, making: false, refusal: 'none' },
    markup: ({ computer, exists, refusal, ...args }) => newWorktree({ ...args, place: exists ? phrase('Uses the existing branch', args.branch) : worktreePlace[computer], failure: worktreeRefusals[refusal], agent: sampleAgent }),
    states: [
      { label: 'New branch', args: {}, caption: 'Where it will live, as a fact.' },
      { label: 'Existing branch', args: { exists: true }, caption: 'The branch exists: the worktree checks it out.' },
      { label: 'On devbox', args: { computer: 'devbox' }, caption: 'The project is on another computer.' },
      { label: 'Making', args: { making: true }, caption: 'git is making it.' },
      { label: 'Already checked out', args: { refusal: 'already checked out' }, caption: 'The branch has a worktree: Open it.' },
      { label: 'git refused', args: { branch: 'cart retry', refusal: 'not a branch name' }, caption: "git's words and Create again." },
    ],
  },
  'Compositions/Send dialog': {
    args: { reach: 'a few agents', chosen: 'tests', message: sampleMessage, unreachable: false, sending: false, refused: false },
    markup: ({ reach, chosen, unreachable, refused, ...args }) => {
      const { agents = [], ...rest } = sendReach[reach];
      const marked = agents.map((item, index) => ({ ...item, chosen: chosen === item.name || chosen === item.project, unreachable: unreachable && index === agents.length - 1 }));
      const count = marked.filter((item) => item.chosen).length;
      return sendDialog({ ...args, ...rest, agents: marked, to: count > 1 ? phrase('Send to', count, 'in', chosen) : count ? phrase('Send to', chosen) : null,
        failure: refused ? { text: 'Not sent', source: 'terminal no longer exists', fix: 'Send' } : null, agent: sampleAgent });
    },
    states: [
      { label: 'Ready', args: {}, caption: 'An agent chosen and a message.' },
      { label: 'A project chosen', args: { chosen: 'acme-shop' }, caption: 'The project word chooses every agent in it.' },
      { label: 'Find', args: { reach: 'more than six' }, caption: 'More than six agents: Find goes first.' },
      { label: 'No match', args: { reach: 'no match' }, caption: 'Nothing by that name.' },
      { label: 'No message', args: { message: '' }, caption: 'Send waits for words.' },
      { label: 'Sending', args: { sending: true }, caption: 'Delivery is under way.' },
      { label: 'Refused', args: { refused: true }, caption: 'Not delivered; the message stays.' },
      { label: 'A computer unreachable', args: { unreachable: true }, caption: 'Its agents step down.' },
      { label: 'All wait for you', args: { reach: 'all wait for you' }, caption: 'Every other agent waits on a question.' },
      { label: 'No other agent', args: { reach: 'no other agent' }, caption: 'Nobody else is running.' },
    ],
  },
  'Compositions/Sleep dialog': {
    args: { situation: 'a project' },
    markup: ({ situation }) => sleepDialog({ agent: sampleAgent, ...sleepCases[situation] }),
    states: Object.keys(sleepCases).map((situation) => ({ label: capitalized(situation), args: { situation }, caption: sleepCaptions[situation] })),
  },
  'Compositions/Add computer dialog': {
    args: { config: true, added: false, typed: '' },
    markup: ({ config, added, typed }) => addComputer({
      hosts: config ? sampleHosts.map((host) => (added ? host : { ...host, state: 'ready' })) : [], typed, agent: sampleAgent }),
    states: [
      { label: 'At rest', args: {}, caption: 'Opened from + → Add computer….' },
      { label: 'After Add', args: { added: true }, caption: 'Each host as ssh answered.' },
      { label: 'Typed', args: { typed: 'jj@studio.local' }, caption: 'A host the config does not list.' },
      { label: 'No hosts', args: { config: false }, caption: 'The config lists none.' },
    ],
  },
  'Compositions/Toolbar': {
    args: { view: 'spaces', column: false, open: false, sorted: false, menu: false, add: false },
    markup: ({ menu: shown, add, ...args }) => {
      const bar = toolbar({ ...args, sortMenu: shown ? sampleSortMenus[args.view]() : null, addMenu: add ? sampleAddMenu() : null });
      return shown || add ? `<div class="kanso-story__tools-room">${bar}</div>` : bar;
    },
    states: [
      { label: 'Projects', args: {}, caption: 'Sidebar open on Projects: + adds a project.' },
      { label: 'Status and Threads', args: { view: 'agents' }, caption: '+ starts a conversation in a project you pick.' },
      { label: '+ menu', args: { view: 'agents', add: true }, caption: 'After a click on +, on Status and Threads: Add computer… ends it.' },
      { label: 'Sorted', args: { sorted: true }, caption: 'The order is not the default one.' },
      { label: 'Sort menu, Projects', args: { menu: true }, caption: 'After a click on Sort, on Projects.' },
      { label: 'Sort menu, Status', args: { view: 'agents', menu: true }, caption: 'After a click on Sort, on Status.' },
      { label: 'Sort menu, Threads', args: { view: 'threads', menu: true }, caption: 'After a click on Sort, on Threads.' },
      { label: 'Collapsed', args: { column: true }, caption: 'Sidebar collapsed.' },
      { label: 'Collapsed, tools open', args: { column: true, open: true }, caption: 'After a click on the caret.' },
    ],
  },
  'Compositions/Panel': {
    args: panelArgs,
    markup: panelStory,
    states: [
      { label: 'At rest', args: {}, caption: 'The read is fresh.' },
      { label: 'Period and the number', args: { content: 'period and the number' }, caption: 'The panel counts over a period.' },
      { label: 'One-line rows', args: { content: 'one-line rows' }, caption: 'The rows have no second fact.' },
      { label: 'Selected, removal armed', args: { last: 'armed' }, caption: 'After the first press on Remove.' },
      { label: 'Narrow', args: { look: 'narrow' }, caption: 'The panel is under 340 wide.' },
      { label: 'Window', args: { look: 'window', header: 'bar' }, caption: 'A file opened from a panel.' },
      { label: 'Loading', args: { state: 'loading' }, caption: 'Before the first read answers.' },
      { label: 'Empty', args: { state: 'empty' }, caption: 'The read answered with nothing.' },
      { label: 'Failed', args: { state: 'failed' }, caption: 'The read did not answer.' },
      { label: 'Stale', args: { state: 'stale' }, caption: 'Another computer stopped answering.' },
    ],
  },
  'Compositions/Panel/Header': {
    args: { title: 'Ports', form: 'page', start: 'none', second: '', tools: 'share and refresh' },
    markup: ({ title, form, start, second, tools }) => panel({ header: panelHeader({ title, form, start: samplePanelHeader.starts[start](), second: second || null, tools: samplePanelHeader.tools[tools]() }) }),
    states: [
      { label: 'Page', args: {}, caption: 'A dashboard: its title, then its tools.' },
      { label: 'Page, reading', args: { title: 'Containers', tools: 'reading' }, caption: 'Refresh turns while the panel reads.' },
      { label: 'Page inside a panel', args: { title: 'checkout', start: 'back', second: 'Task', tools: 'refresh' }, caption: 'A page opened from a row of the panel.' },
      { label: 'Bar', args: { title: 'limits.md', form: 'bar', start: 'back', second: '~/acme-shop/docs', tools: 'document' }, caption: 'A file opened from a panel.' },
      { label: 'Bar with a mark', args: { title: 'cart-ui', form: 'bar', start: 'mark', second: '~/acme-shop', tools: 'pin and refresh' }, caption: 'Images of the agent in focus.' },
      { label: 'Bar, title only', args: { title: 'Files', form: 'bar', tools: 'none' }, caption: 'A list with nothing to refresh.' },
    ],
  },
  'Compositions/Status bar/Item': {
    args: { item: 'Computer', state: 'on', folded: false, more: 1, menu: false },
    markup: ({ item, menu: open, ...args }) => withPopup(760, { ...statusItems[item]({ ...args, open }), popup: open ? statusItemMenus[item]?.() : null }),
    states: [
      { label: 'Computer', args: {}, caption: 'Only while its sidebar row is out of sight.' },
      { label: 'Computer folded', args: { folded: true }, caption: 'The computer becomes its icon.' },
      { label: 'Unreachable', args: { state: 'unreachable' }, caption: 'While its row is out of sight; Refresh reconnects.' },
      { label: 'Reconnecting', args: { state: 'pending' }, caption: 'At 80% with a breathing dot.' },
      { label: 'Needs you', args: { item: 'Needs you', more: 0 }, caption: 'Mark, name and question, as the row says them. Click: ⌘J.' },
      { label: 'Needs you, several', args: { item: 'Needs you' }, caption: 'How many more wait out of view.' },
      { label: 'Needs you folded', args: { item: 'Needs you', folded: true }, caption: 'The question goes; the name and +1 never fold.' },
      { label: 'Memory', args: { item: 'Memory' }, caption: 'This computer is low on memory.' },
      { label: 'Memory folded', args: { item: 'Memory', folded: true }, caption: 'Memory loses its word last.' },
      { label: 'Servers, containers and reviews', args: { item: 'Servers, containers, reviews' }, caption: 'Each its icon and how many need a look.' },
      { label: 'Working count', args: { item: 'Working count' }, caption: 'The working mark and how many; a click opens Status.' },
      { label: 'Command palette', args: { item: 'Command palette' }, caption: 'The key to the palette, last on the right.' },
      { label: 'Computer, right-click', args: { menu: true }, caption: 'Refresh, then the piece lines.' },
      { label: 'Needs you, right-click', args: { item: 'Needs you', menu: true }, caption: 'Go to the pane, then the piece lines.' },
      { label: 'Memory, right-click', args: { item: 'Memory', menu: true }, caption: 'Open Memory, Hide this and Settings: it shows only when low.' },
      { label: 'Working count, right-click', args: { item: 'Working count', menu: true }, caption: 'Show them, then the piece lines.' },
      { label: 'Command palette, right-click', args: { item: 'Command palette', menu: true }, caption: 'Hide this and Settings only.' },
    ],
  },
  'Compositions/Status bar': {
    args: statusArgs,
    markup: statusStory,
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
    args: { width: 1040, value: 'checkout', tab: 'at rest', panel: 'none', state: 'connected', folded: 0, overflow: false, windows: false, menu: 'none' },
    markup: ({ width, value, tab, folded, overflow, menu: right, ...args }) => {
      const menu = tabMenus[right]?.(tabItems(value)[0].label) ?? null;
      const bar = atWidth(width, tabBar({ ...args, value, overflow, menu, items: tabActs[tab](tabItems(value)), folded: foldedTabs.slice(0, folded).map((label) => ({ label })) }));
      return (overflow && folded) || menu ? `<div class="kanso-story__menu-room">${bar}</div>` : bar;
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
      { label: 'Right-click a tab', args: { menu: 'open' }, caption: 'Rename, New tab, Sleep, Close tab, then Hide this and Settings.' },
      { label: 'Right-click, Close pressed once', args: { menu: 'close armed' }, caption: 'Close arms in place for 4 s and says what it ends; the menu stays open.' },
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
    markup: ({ os, key, ...args }) => inSettings(pickedKey({ os, layer: keyLayer(os, args[`${os}Layer`]), picked: key })),
    states: [{ label: 'Default', args: {}, caption: 'What the picked key does here, and its act.' }],
  },
  'Compositions/Keyboard/Shortcut row': {
    args: { name: 'Pin the pane', chords: '⌥⌘P', state: 'rest', hover: false },
    markup: ({ chords, ...args }) => inSettings(shortcutRow({ ...args, chords: chords.split(',').map((chord) => chord.trim()).filter(Boolean),
      taken: { chord: '⌥⌘J', name: 'Pane below' }, source: 'keys.json: EACCES: permission denied', agent: 'checkout' })),
    states: [{ label: 'Rest', args: {}, caption: 'One action and its keys.' }],
  },
  ...panelPages,
  'Compositions/Sidebar': {
    args: { collapsed: false, dawn: false, art: true, view: 'spaces', switcher: true, menu: false, moment: '' },
    markup: sampleSidebar,
    states: [
      { label: 'Open', args: {}, caption: 'Header, views, rows and footer.' },
      { label: 'Collapsed', args: { collapsed: true }, caption: 'The rail.' },
      { label: 'Dawn', args: { dawn: true }, caption: 'Open, in Dawn Mode.' },
      { label: 'Dawn collapsed', id: 'kit/Rail/Dawn', args: { collapsed: true, dawn: true }, caption: 'The rail, in Dawn Mode.' },
      { label: 'Views menu', args: { collapsed: true, menu: true }, caption: 'The rail: its one view button opens Projects, Status and Threads.' },
      { label: 'Keyboard', args: { moment: 'keyboard' }, caption: 'The sidebar has the keys: the ring is on one row; j and k move it, Enter opens.' },
      { label: 'Loading', args: { moment: 'loading' }, caption: 'Before the first read answers, on any view: the rows as their skeleton.' },
      { label: 'Pinned', args: { moment: 'pinned' }, caption: 'A pinned agent goes above the others of its project and keeps the pin before its mark.' },
      { label: 'Running command', args: { moment: 'running command' }, caption: 'An agent that left a command running, a server say, counts it before its mark.' },
      { label: 'Incoming message', args: { moment: 'incoming message' }, caption: 'A message from another agent not seen yet is its second line until it is opened.' },
      { label: 'Unread', args: { moment: 'unread' }, caption: 'Output not seen yet: the name in ink until it is opened.' },
      { label: 'Stuck step', args: { moment: 'stuck step' }, caption: 'A step past 15 minutes: its time in blocked ink.' },
      { label: 'Closed project', args: { moment: 'closed' }, caption: 'A kept project with nothing open steps down under the open ones.' },
      { label: 'Missing folder', args: { moment: 'missing' }, caption: 'Its folder is gone: Not found, and its menu locates the folder or removes the project.' },
      { label: 'No projects', args: { moment: 'no projects' }, caption: 'A computer with no project yet offers New project.' },
      { label: 'Nothing running', args: { moment: 'nothing running' }, caption: 'A project with nothing running is its heading alone; its + starts an agent.' },
      { label: 'Ahead', args: { moment: 'ahead' }, caption: 'Commits not on GitHub: ↑ and how many; a click opens the PR panel.' },
      { label: 'Pulling', args: { moment: 'pulling' }, caption: 'A click on ↓ pulls fast-forward only; while it runs, the pending dot. A refusal arrives as a notice.' },
      { label: 'Asleep, a row selected', args: { moment: 'wake selected' }, caption: 'Asleep open, the ring on one: Enter wakes it.' },
      { label: 'Rail, a group open', args: { collapsed: true, moment: 'rail popup' }, caption: 'A click on a tile lists its rows; a click goes to one, a sleeping one opens its wake menu.' },
      { label: 'Status', id: 'kit/Rail/Open', args: { view: 'agents' }, caption: 'Open on Status: a section per state, Needs you first.' },
      { label: 'Status collapsed', id: 'kit/Rail/Collapsed', args: { collapsed: true, view: 'agents' }, caption: 'The rail on Status: a tile per state.' },
      { label: 'Status, nothing running', args: { view: 'agents', moment: 'status empty' }, caption: 'No agent is running anywhere.' },
      { label: 'Threads', args: { view: 'threads' }, caption: 'Open on Threads: pinned first, then each project’s conversations; Snoozed and Settled fold at the end.' },
      { label: 'Threads, none yet', args: { view: 'threads', moment: 'threads empty' }, caption: 'No conversation yet.' },
      { label: 'Threads, asleep', args: { view: 'threads', moment: 'threads asleep' }, caption: 'A sleeping conversation stays in its project, under Asleep.' },
      { label: 'Threads, settled', args: { view: 'threads', moment: 'settled' }, caption: 'Settled, open: the conversations put away; each menu brings one back.' },
      { label: 'Threads, snoozed', args: { view: 'threads', moment: 'snoozed' }, caption: 'Snoozed, open: each says until when; its menu wakes it.' },
      { label: 'Needs you', args: { moment: 'needs you' }, caption: 'Over the list, how many wait; a click opens the queue in the list’s place, the longest waiting first.' },
      { label: 'Needs you, reading', args: { moment: 'needs you reading' }, caption: 'A computer has not answered yet: its place as a skeleton.' },
      { label: 'Needs you, unavailable', args: { moment: 'needs you unavailable' }, caption: 'A computer’s queue cannot be read: one quiet line.' },
      { label: 'Nobody waiting', args: { moment: 'nobody waiting' }, caption: 'The next-waiting key found nobody: the control says so.' },
    ],
  },
  'Layouts/Window': {
    args: { collapsed: false, menu: false, panel: false },
    markup: windowLayout,
    states: [
      { label: 'At rest', args: {}, caption: 'The sidebar, the tab bar, the panes and the status bar, each at rest; selection is one wash on the project, the tab and the focused pane.' },
      { label: 'A menu on a row', args: { menu: true }, caption: 'Right-click or ⋯ on a row opens its menu under it, over the rows below; nothing else moves.' },
      { label: 'A panel open', args: { panel: true }, caption: 'The panel opens beside the panes and lights its door; the panes give it room.' },
      { label: 'Sidebar collapsed', args: { collapsed: true }, caption: 'The sidebar folds to its rail; the work keeps the width.' },
    ],
  },
  'Layouts/Pane': {
    args: { moment: 'at rest' },
    markup: ({ moment }) => atWidth(760, stack({ variant: 'window panes' }, paneMoments[moment](sampleWindow.pane))),
    states: [
      { label: 'At rest', args: {}, caption: 'Its header over its terminal; focused, the header takes the selection wash.' },
      { label: 'Dragged', args: { moment: 'dragged' }, caption: 'While a pane is dragged its place shows the mark and the name, and the ruler marks the drop.' },
      { label: 'Process gone', args: { moment: 'process gone' }, caption: 'A pane whose process is gone keeps its last output in readable muted ink.' },
    ],
  },
};
