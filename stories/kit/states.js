// The pages drawn from named states: each state is a preset of its page's playground, and the catalog draws its record from that preset.
import { addComputer, agentMenu, computerMenu, projectMenu, settingsMenu, newInMenu, openWithMenu, copyMenu, moveMenu, snoozeMenu, arrangements, saveArrangement, newProject, newWorktree, promptDialog, sendDialog, sleepDialog, computerItem, edge, toolbar, keyboardSystems, layoutPaused, paletteDoor, panel, panelBack, panelHeader, panelRefresh, pickedKey, shortcutRow, stepperMenu, tabBar } from './compositions.js';
import { dialog, emptyState, menu, phrase, failureBlock, input, keycap, list, metric, needsItem, row, skeletonOf, stack, statusItem, stepper, tabs } from './pieces.js';
import { atWidth, inBar } from './frames.js';
import { keyLayer, keyLayerMods, samplePanel, samplePanelHeader, sampleAddMenu, sampleAgent, sampleArrangements, sampleAsleep, sampleCapture, sampleWorktrees, sampleCopy, sampleEditors, sampleInstalled, sampleMove, sampleSnooze, sampleTargetsOpened, sampleHosts, sampleMessage, sampleSortMenus, sampleTargets, statusMenus, statusPanels } from './samples.js';

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
const withItem = (index, look) => menuItems.map((item, at) => (at === index ? { ...item, ...look } : item));
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
  agents: { agents: sampleInstalled }, reading: { reading: true }, 'none installed': { none: 'No agents found on devbox' },
  'search refused': { failure: { text: "Can't list agents on devbox", source: 'ssh: connection timed out', fix: 'Refresh' } },
};
const openWithCaptions = {
  'a file': 'The editors that open it; terminal editors after the rule.', 'a folder': 'Folders open in code editors and terminals.', 'a picture': 'Pictures open in Images first.',
  'on devbox': 'On another computer, only what runs there.', keyboard: 'The first three have a number key.', reading: 'The editors are being looked for.',
  'no editor': 'Nothing here opens it.', 'did not open': 'The chosen editor refused: its mark stays on it.', 'search refused': "The search failed: the tool's words, Refresh, Explain.",
};
const newInCaptions = {
  agents: 'The agents installed there, the last one used marked.', reading: 'The agents are being read.', 'none installed': 'No agent there; Terminal still opens.',
  'search refused': "The computer did not answer: the tool's words, Refresh, Explain.", 'pick a project': '+ on Status and Threads, with several projects: pick where first.',
};
// What a computer's switch or sync refusal says.
const computerRefusals = {
  nothing: null,
  power: { text: 'devbox was not changed' },
  sync: { text: 'Sync devbox was not changed' },
};
const capitalized = (text) => text[0].toUpperCase() + text.slice(1);
const worktreePlace = { here: '~/.kanso/worktrees/kansō-app-audit', devbox: 'devbox · ~/.kanso/worktrees/kansō-app-audit' };

export const statedPages = {
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
    args: { title: 'src/api/checkout.ts', items: menuItems },
    markup: menu,
    states: [
      { label: 'At rest', args: {}, caption: 'A title, items with their icons, a rule between groups.' },
      { label: 'Keyboard', args: { items: withItem(1, { selected: true }) }, caption: 'The item the keys are on, its key at the right.' },
      { label: 'Armed', args: { items: withItem(4, { armed: true }) }, caption: 'What cannot be undone asks twice within 4 s.' },
      { label: 'Values', args: { title: 'Snooze checkout', items: sampleSnooze.map(([label, hint]) => ({ label, hint })) }, caption: 'Each item with the value it gives.' },
      { label: 'Headings', args: { items: [{ heading: 'This worktree' }, ...menuItems.slice(0, 2), { separator: true }, { heading: 'Show' }, menuItems[3]] }, caption: 'A dim heading names a group.' },
      { label: 'A badge', args: { items: withItem(0, { badge: '2' }) }, caption: 'How many, on the item they belong to.' },
      { label: 'A mark', args: { items: withItem(0, { mark: 'blocked' }) }, caption: 'The state of the thing the item opens.' },
      { label: 'Reading', args: { items: [{ loading: true }, { loading: true }, ...menuItems.slice(2)] }, caption: 'Items still being read breathe in their place.' },
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
    args: { situation: 'agents' },
    markup: ({ situation }) => (situation === 'pick a project' ? sampleAddMenu() : newInMenu({ project: 'acme-shop', agent: sampleAgent, ...newInCases[situation] })),
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
      { label: 'Power refused', args: { state: 'off', refused: 'power' }, caption: 'Turning it on was refused: our words lead, Turn on stays under them.' },
      { label: 'Sync refused', args: { refused: 'sync' }, caption: 'Sync was refused and stays as it was: our words lead, Sync stays under them.' },
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
  'Compositions/Settings menu': {
    args: { update: false, armed: false },
    markup: ({ update, armed }) => settingsMenu({ update: update ? 'Update Herdr to 0.1.16' : null, armed }),
    states: [
      { label: 'At rest', args: {}, caption: 'Settings in the footer, or the gear in the rail.' },
      { label: 'Herdr update', args: { update: true }, caption: 'Herdr has an update waiting: a third item, here only.' },
      { label: 'Restart armed', args: { update: true, armed: true }, caption: 'The update restarts Herdr, so it asks twice within 4 s.' },
    ],
  },
  'Compositions/Agent menu': {
    args: { on: 'an agent', pinned: false, away: 'no', armed: false, opened: 'none' },
    markup: ({ on, pinned, away, armed, opened }) => ({
      none: () => agentMenu({ name: 'checkout', thread: on === 'a thread' ? 'Rate limit' : null, pinned, away: away === 'no' ? null : away, armed }),
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
    args: { title: samplePanel.title, scope: samplePanel.scope, header: 'page', state: 'ready', look: 'panel', content: 'rows', last: 'rest' },
    markup: ({ title, scope, header, state, look, content, last }) => {
      const { reading = false, stale = false, scope: read = scope, body } = panelReads[state];
      const start = look === 'window' ? [panelBack()] : [];
      return panel({ look, stale, header: panelHeader({ title, form: header, start, second: read, tools: [samplePanel.tool(), panelRefresh({ reading })] }) }, body(panelContents[content](last)));
    },
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
