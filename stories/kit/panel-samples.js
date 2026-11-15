// Sample data the panels show, in the app's words.

// Settings · What shows: each area of the window, what hiding one of its pieces stops, and its pieces.
// `when` is the shown-only-when-needed choice in words; a row without it is shown or hidden.
const piece = (name, extra = {}) => ({ name, on: true, ...extra });
export const sampleAreas = {
  Sidebar: {
    stops: 'Hiding one stops its read: agents ps, branches git.',
    pieces: [piece('Projects, Status, Threads'), piece('What each agent is on'), piece('Time in its state', { on: false }), piece('Commands still running'), piece('Branch, ahead, behind'),
      piece('While you were away', { when: 'only when something happened' }), piece('Needs you', { when: 'only when one waits' }), piece('Computers'), piece('Add a computer')],
  },
  'Pane header': {
    stops: 'Hiding one stops its read: changes git, pull requests gh.',
    pieces: [piece('Folder and branch'), piece('Files and commits', { when: 'only when changed' }), piece('PR', { when: 'only when one is open' })],
  },
  'Status bar': {
    stops: 'Hiding one stops its check: servers lsof every 60 s, containers docker every 60 s, reviews gh every 2 min.',
    pieces: [piece('Computer and branch'), piece('Needs you', { when: 'only when one waits' }), piece('Memory low', { when: 'only when low' }), piece('Servers with no pane', { when: 'only when one runs' }),
      piece('Failed containers', { when: 'only when one fails' }), piece('Reviews waiting', { when: 'only when asked' }), piece('Agents at work'), piece('Spend today', { on: false }), piece('Minimap', { on: false }), piece('Command palette key', { on: false })],
  },
  'Tab bar': { stops: null, pieces: [piece('Arrangements'), piece('New tab')] },
  Panels: {
    stops: 'Hiding one stops its read: files and worktrees git, pull requests gh, ports lsof, containers docker, memory ps.',
    order: true,
    pieces: [piece('Files'), piece('Spend'), piece('PR'), piece('Shipped'), piece('Worktrees'), piece('Ports'), piece('Containers'), piece('Memory'), piece('Images', { on: false }), piece('Simulator', { on: false })],
  },
  Notifications: { stops: null, pieces: [piece('kansō update', { on: false }), piece('Memory low')] },
  'Behind the scenes': { stops: 'Each one is work kansō does while you do not look.', pieces: [piece('Check for updates'), piece('Memory guard', { on: false })] },
};
export const sampleHidden = [['Time in its state', 'Sidebar'], ['Minimap', 'Status bar'], ['Command palette key', 'Status bar'], ['Images', 'Panels'], ['Simulator', 'Panels'], ['kansō update', 'Notifications']];
// A panel another mod registers sits with the built-in ones.
export const sampleCustomPanel = piece('Project notes');
export const sampleFound = { query: 'memory', rows: [['Memory low', 'Status bar'], ['Memory', 'Panels'], ['Memory low', 'Notifications'], ['Memory guard', 'Behind the scenes', false]] };

// Settings · Keys: each group of kansō's own keys, its actions and their chords; Herdr's keys are counted, not listed.
const action = (name, chords) => ({ name, chords });
export const sampleKeyGroups = {
  Panels: [action('Open or close a panel', ['⌥⌘1…9']), action('Simulator', ['⌥⌘0']), action('kansō settings', ['⌃⇧,'])],
  Sidebar: [action('Projects', ['⌥⌘1']), action('Status', ['⌥⌘2']), action('Threads', ['⌥⌘3'])],
  Panes: [action('New pane to the left', ['⌥⌘N']), action('Next agent that needs you', ['⌥⌘Y']), action('Agent above', ['⌥⌘↑']), action('Agent below', ['⌥⌘↓']), action('Pin the pane to its side', ['⌥⌘P'])],
  'Vim keys': [action('Pane to the left, or the sidebar’s list', ['⌥⌘H']), action('Pane below', ['⌥⌘J']), action('Pane above', ['⌥⌘K']), action('Pane to the right', ['⌥⌘L']),
    action('Move the pane left', ['⌥⇧⌘H']), action('Move the pane down', ['⌥⇧⌘J']), action('Move the pane up', ['⌥⇧⌘K']), action('Move the pane right', ['⌥⇧⌘L'])],
  'Moving along the strip': [action('Go to a column', ['⌘1…9']), action('First column', ['⌘⇧[']), action('Last column', ['⌘⇧]']), action('Bring the pane into view', ['⌥⌘C']),
    action('Slide left', ['⌥⌘,']), action('Slide right', ['⌥⌘.']), action('Fewer panes in view', ['⌥⌘-']), action('More panes in view', ['⌥⌘=']), action('Even the columns out', ['⌥⌘0'])],
  'Spend, Preview, Memory': [action('Spend: read again', ['⌘R']), action('Spend’s settings', ['⌘,']), action('Preview: save the file', ['⌘S']), action('Memory: check now', ['⌘R']), action('Memory: show fewer', ['Esc'])],
  'Every list and menu': [action('Down and up', ['j', 'k']), action('First and last', ['gg', 'G']), action('Open', ['Enter']), action('Find', ['/'])],
};
export const sampleHerdrKeys = 31;
export const sampleTaken = { chord: '⌘R', name: 'Check now' };

// Settings · What's new: the releases as the changelog says them; the installed one is where you are.
const release = (version, date, changes = []) => ({ version, date, changes });
export const sampleReleases = {
  newer: release('3.31.0', 'today · Nov 11', [
    { kind: 'Added', text: 'Every piece can be shown, shown only when it has something to say, or hidden. Hiding it stops the work behind it. Settings opens on that list.' },
    { kind: 'Added', text: 'Any file that is not a picture opens from Files into Preview. Any text file up to 1 MB can be edited, on this computer or another.' },
    { kind: 'Changed', text: 'The pull request panel opens on what stops it (the failing step and its last log lines, or the review comment), with one action.' },
  ]),
  dawn: release('3.32.0-beta.2', 'today · Nov 12', [{ kind: 'Changed', text: 'Settings and Memory use the shared kit.' }]),
  installed: release('3.30.0', 'Nov 4', [{ kind: 'Changed', text: 'The sidebar reads each computer once, whatever its rows ask.' }]),
  older: { from: '3.29.0', to: '3.27.0' },
};

// Settings · Credits: where kansō comes from, then who maintains it.
export const samplePlaces = [
  { name: 'Herdr', note: 'The app kansō runs in', url: 'herdr.dev' },
  { name: 'kansō', note: 'Source, releases and issues', url: 'github.com/jlopezlira/herdr-kanso' },
  { name: 'Lucide (ISC)', note: 'Toolbar icons', url: 'lucide.dev' },
];
export const sampleMaintainers = ['JJ', 'Iván Campaña', 'Leangseu Kim', 'Johannes Hund'];
