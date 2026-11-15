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

// Find in the conversation: checkout's conversation searched for one header; each hit is who, when and its line.
const hit = (who, when, text) => ({ who, when, text });
export const sampleFind = {
  agent: 'checkout',
  query: 'Retry-After',
  days: [
    ['Today', [hit('You', '14:02', 'Rate limit POST /checkout per customer and send a Retry-After header'), hit('Claude', '14:09', 'The 429 now carries Retry-After, in seconds, from the bucket’s refill time')]],
    ['Yesterday', [hit('Claude', '17:40', 'cart-ui can read Retry-After to show the countdown')]],
  ],
  turn: 'The 429 now carries Retry-After, in seconds, from the bucket’s refill time. limits.ts exports refillIn(customer) and checkout.ts sets the header before it returns. Tests: 21 passed.',
  missing: '~/.claude/projects/acme-shop/4f2a.jsonl: no such file',
};

// Files: what checkout changed in acme-shop; `letter` is git's, modified has none; `stat` opens the diff.
const changed = (name, folder, stat, letter = 'M') => ({ name, folder, stat, letter });
export const sampleFiles = {
  named: [changed('limits.ts', 'src/api', '+22', 'A'), changed('checkout.ts', 'src/api', '+14 −3')],
  unchanged: ['plans.ts', 'Cart.tsx', 'limits.md'],
  also: [changed('limits.test.ts', 'src/api', '+6 −4')],
  shell: [changed('RetryIn.tsx', 'src/web', '+22', 'A')],
  remote: { named: [changed('limits.ts', 'src/api', '+22', 'A'), changed('checkout.ts', 'src/api', '+14 −3')], unchanged: [], also: [changed('limits.test.ts', 'src/api', '+6 −4')] },
  computer: 'devbox',
  menu: { path: 'src/api/checkout.ts' },
};
// The tree as All files draws it: each entry its level; a folder open or not, with its count of changed files.
const folder = (name, level, open, count = null) => ({ name, level, open, count });
const file = (name, level, letter = null) => ({ name, level, letter });
export const sampleTree = [folder('.github', 0, false), folder('docs', 0, false), folder('src', 0, true, '3'), folder('api', 1, true, '3'),
  file('checkout.ts', 2, 'M'), file('limits.test.ts', 2, 'M'), file('limits.ts', 2, 'A'), file('plans.ts', 2), folder('web', 1, false),
  folder('fixtures', 0, true), file('orders-0001.json', 1), { more: '1,214 more not listed', level: 1 }, file('package.json', 0)];
export const samplePlainTree = [folder('private', 0, true), { failure: { text: 'Can’t list this folder', source: 'EACCES: permission denied, scandir \'/Users/jj/notes/private\'', fix: 'Refresh' }, level: 1 },
  file('rate-limits.md', 0), file('standup.md', 0)];
export const sampleFilesFailures = {
  folder: { text: 'Can’t list ~/acme-shop', source: 'EACCES: permission denied, scandir \'/Users/jj/acme-shop\'', fix: 'Refresh', agent: 'checkout' },
  unreachable: { text: 'Can’t reach devbox', source: 'ssh: connect to host devbox port 22: Operation timed out', fix: 'Refresh' },
};

// Ports: what listens, with no pane first; a pane's server is named by its pane.
const server = (port, what, size, command, folder, age, pane = null) => ({ port, what, size, command, folder, age, pane });
export const samplePorts = {
  noPane: [server(':6006', 'storybook', '388 MB', 'storybook dev -p 6006', '~/acme-shop-cart', '2 h'), server(':3001', 'next', '214 MB', 'next dev -p 3001', '~/acme-shop-docs', '5 h')],
  inPanes: [server(':4000', 'tsx', '146 MB', 'tsx watch src/server.ts', '~/acme-shop', '1 h', 'checkout'), server(':5173', 'vite', '182 MB', 'vite --port 5173', '~/acme-shop', '40 min', 'web')],
  remote: { noPane: [server(':8000', 'uvicorn', '96 MB', 'uvicorn app:api --port 8000', '~/billing', '3 h')], inPanes: [server(':5432', 'postgres', '64 MB', 'postgres -D data', '~/billing', '1 d', 'migrate')] },
  computer: 'devbox',
  refused: { text: 'Couldn’t stop :6006', source: 'kill 48213: still listening on :6006 after SIGTERM', fix: 'Force stop', agent: 'checkout' },
  failure: { text: 'Can’t read ports', source: 'lsof: unknown option -F', fix: 'Refresh', agent: 'checkout' },
  unattributed: { label: 'Some servers cannot be attributed', note: 'Working directories require a Herdr API on Windows.' },
};
// Ports · History: servers at once over the range, the part with no pane, then what opened and ended.
const opened = (name, ports, when, ran, peak, how = null) => ({ name, ports, when, ran, peak, how });
export const samplePortHistory = {
  ranges: [{ key: 'day', label: '24 h' }, { key: 'week', label: '7 days' }, { key: 'month', label: '30 days' }],
  bars: [0.3, 0.4, 0.25, 0.5, 0.45, 0.6, 0.35, 0.5, 0.7, 0.55, 0.4, 1, 0.6, 0.45, 0.5, 0.65, 0.4, 0.55, 0.3, 0.5, 0.45, 0.6, 0.4, 0.35],
  part: [0, 0, 0, 0.2, 0, 0, 0, 0.2, 0.3, 0, 0, 0.4, 0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0.2, 0, 0],
  peak: 11,
  ticks: ['Wed', 'now'],
  most: 'peak 6 at once',
  summary: ['4 stopped by you', '3 left with no pane'],
  lists: [
    { key: 'opened', label: 'Opened today', rows: [opened('storybook', ':6006', 'opened 09:12', 'ran 2 h', '388 MB', 'no pane'), opened('vite', ':5173', 'opened 13:20', 'ran 40 min', '182 MB')], more: 4 },
    { key: 'ended', label: 'Recently ended', rows: [opened('next', ':3002', 'ended 11:40', 'ran 3 h', '240 MB', 'stopped by you')], more: 0 },
  ],
  said: { off: 'No history', bad: 'History unreadable', stale: 'History stopped at 14:02' },
};

// Markdown: the plan an agent wrote in acme-shop, and the folder's Markdown around it.
export const sampleMarkdown = {
  plan: { file: 'plan.md', folder: '~/acme-shop/docs', source: `# Rate limit checkout per customer

Each customer gets a bucket of 40 requests that refills one token every 2 s. A request over the limit gets 429 and \`wait_s\`, the seconds until the next token.

- Keep the bucket in Redis, keyed by customer id
- Read the limit from \`plans.limits\`
- Log the first 429 per customer per hour

## Tests

\`\`\`
pnpm test src/api/limits.test.ts
\`\`\`` },
  limits: { file: 'limits.md', folder: '~/acme-shop-docs/docs', source: `## Limits by plan

| Plan | Requests | Refill |
|---|---|---|
| Free | 40 | 2 s |
| Team | 200 | 0.5 s |` },
  runbook: { file: 'runbook.md', folder: '~/billing', source: `# Webhook retries

Deliveries retry 5 times with backoff 1, 2, 4, 8, 16 s. A 410 stops them.` },
  events: { file: 'events.md', folder: '~/acme-shop/logs', source: `## Events, 2026-11-10

- 09:14 checkout · 429 for cus_8812
- 09:15 checkout · 429 for cus_8812` },
  agent: 'cart-ui',
  groups: [
    ['Waiting for your review', [['plan.md', 'cart-ui · docs']]],
    ['From this terminal', [['limits.md', '~/acme-shop-docs/docs'], ['notes.md', 'scratchpad']]],
    ['In this folder', [['README.md'], ['CHANGELOG.md'], ['plan.md', 'docs']]],
  ],
  failures: {
    told: { text: 'cart-ui was not told', source: 'md-review: data/markdown-review-done/48213: Permission denied', fix: 'Done', agent: 'cart-ui' },
    save: { text: 'Couldn’t save plan.md', source: 'EACCES: permission denied, write plan.md', fix: 'Save', agent: 'cart-ui' },
  },
};
