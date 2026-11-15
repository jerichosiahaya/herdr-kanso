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
export const sampleRanges = [{ key: 'day', label: '24 h' }, { key: 'week', label: '7 days' }, { key: 'month', label: '30 days' }];
export const samplePortHistory = {
  ranges: sampleRanges,
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

// Containers: Docker's cost on this computer, acme-shop's compose project with one exited, a stack not started, one container in no project.
const container = (name, health, meta, image, ports, age, web = false) => ({ name, health, meta, image, ports, age, web });
export const sampleContainers = {
  cost: { held: '2.1 GB', limit: '7.8 GB', disk: '4.2 GB on disk', stops: 2 },
  projects: [
    { name: 'acme-shop', compose: 'compose.yaml', count: '2 of 3 up', containers: [
      container('api-db', 'failed', 'exited 1 · 3 min', 'postgres:16', ':5432', null),
      container('mailpit', 'running', '31 MB', 'axllent/mailpit', ':8025', 'up 2 h', true),
      container('redis', 'running', '9 MB', 'redis:7-alpine', ':6379', 'up 2 h')] },
    { name: 'docs-site', compose: 'compose.yaml', count: 'not started', containers: [] },
  ],
  loose: [container('buildkit', 'stopped', 'stopped · 2 d', 'moby/buildkit:v0.13', null, null)],
  details: [['Ports', '8025 → 8025/tcp, 1025 → 1025/tcp'], ['Mounts', 'mailpit-data → /data'], ['Networks', 'acme-shop_default'], ['Restarts', 'unless-stopped'], ['Compose', 'compose.yaml · mailpit'], ['Id', '3f9c1a7e20b4']],
  context: { name: 'prod-db', loose: [container('pg-primary', 'running', '1.9 GB', 'postgres:16', ':5432', 'up 9 d'), container('pgbouncer', 'running', '22 MB', 'edoburu/pgbouncer', ':6432', 'up 9 d')] },
  remote: { computer: 'devbox', cost: { held: '3.0 GB', limit: '8 GB', disk: '6.1 GB on disk', stops: 2 }, projects: [{ name: 'relay', compose: 'compose.yaml', count: '2 of 2 up', containers: [
    container('db', 'running', '212 MB', 'postgres:16', ':5432', 'up 1 d'), container('queue', 'running', '48 MB', 'redis:7-alpine', ':6379', 'up 1 d')] }] },
  refused: { text: 'Couldn’t remove api-db', source: 'Error response from daemon: cannot remove container "api-db": container is restarting, stop the container before removing', fix: 'Remove', agent: 'checkout' },
  failure: { text: 'Can’t reach Docker', source: 'docker ps: permission denied while trying to connect to /var/run/docker.sock', fix: 'Refresh', agent: 'checkout' },
  unopened: { text: 'Docker could not be opened from here', source: 'open -a Docker: Unable to find application named Docker', fix: 'Open Docker' },
  unattributed: { label: 'Docker’s memory cannot be attributed', note: 'Docker VM memory attribution requires a Herdr API on Windows.' },
};
// Containers · Disk: the images, the volumes and the build cache, each with what it would give back.
const image = (name, size, users, unused = false) => ({ name, size, users, unused });
export const sampleDisk = {
  summary: '9 images 4.2 GB · 1.6 GB unused',
  pull: 'postgres:17',
  spare: '1.6 GB',
  images: [image('postgres:16', '438 MB', 'acme-shop · api-db'), image('node:20-bookworm', '1.1 GB', 'unused · 3 weeks', true), image('axllent/mailpit', '31 MB', 'acme-shop · mailpit')],
  run: { image: 'node:20-bookworm', name: 'web', port: '8080:80' },
  invalid: {
    name: { field: 'name', name: '/web', source: 'Name: letters, digits, _ . or -, starting with a letter or digit.' },
    port: { field: 'port', port: 'http', source: 'Port: a number, or host:container like 8080:80.' },
  },
  volumes: [{ name: 'mailpit-data', users: 'acme-shop · mailpit' }, { name: 'pg-old', users: 'unused' }, { name: 'cache-old', users: 'unused' }],
  unusedVolumes: 2,
  cache: '860 MB',
};

// Memory: 31% free on a 16 GB Mac, the guard on, five sessions with docs past the guard's limit and cart-ui needing you.
const session = (name, size, state, said, extra = {}) => ({ name, size, state, said, ...extra });
export const sampleMemory = {
  free: { value: '31%', of: 'free of 16 GB', swap: '2.4 GB swap' },
  herdr: { size: '1.4 GB', window: '1.1 GB window', core: '210 MB core', limit: 'past its 1.2 GB' },
  helpers: { count: 2, size: '60 MB' },
  sessions: [
    session('checkout', '1.2 GB', 'working', ['Claude', 'working', 'up 3 d']),
    session('docs', '980 MB', 'idle', ['Codex', 'idle 3 h', 'up 2 d', 'past the guard’s 900 MB'], { over: true }),
    session('cart-ui', '760 MB', 'blocked', ['Claude', 'needs you', 'left as it is']),
    session('perf', '720 MB', 'idle', ['Claude', 'idle 2 d', 'up 6 d']),
    session('i18n', '640 MB', 'working', ['Codex', 'working', 'docs-site']),
  ],
  more: 3,
  spark: [0.2, 0.3, 0.35, 0.5, 0.45, 0.6, 0.7, 0.65, 0.8, 0.9, 1, 0.95],
  unrecyclable: 'No conversation to resume',
  bulk: { idle: '2 idle', back: 'about 1.7 GB back', heavy: 'Only the 1 over 500 MB', unused: 'Close the 1 not used for 2 days · 720 MB' },
  batch: { done: [['checkout', '1.6 GB → 210 MB'], ['perf', '720 MB → 180 MB']], current: 'docs', said: 'Recycled 2 of 2 · 1.9 GB back' },
  guard: [['Recycle idle agents past 900 MB', true], ['Restart the window past 1.2 GB', true], ['Notify under 20% free', true]],
  history: {
    ranges: sampleRanges,
    bars: [0.6, 0.55, 0.5, 0.52, 0.45, 0.4, 0.3, 0.2, 0.12, 0.08, 0.15, 0.3, 0.45, 0.5, 0.55, 0.5, 0.48, 0.52, 0.55, 0.58, 0.5, 0.45, 0.4, 0.31],
    low: [8, 9, 10],
    ticks: ['yesterday 15:00', 'now'],
    most: 'lowest 8% · 11:20',
    summary: ['6 recycles', '1 closed', '1 restart', '2.3 GB freed'],
    lists: [
      { key: 'events', label: 'Events', rows: [['docs recycled: 1.4 GB to 190 MB', '11:24'], ['Memory low: 8% free', '11:20'], ['cart-ui not recycled: it needs you', '09:02', true], ['Window restarted past 1.2 GB', '08:41']], more: 0 },
      { key: 'heaviest', label: 'Heaviest', rows: [['Docker VM', '2.1 GB'], ['Herdr window', '1.1 GB'], ['Safari', '940 MB']], more: 0 },
    ],
  },
  refused: { text: 'Couldn’t recycle docs', source: 'docs: its terminal did not take the restart', fix: 'Recycle', agent: 'docs' },
  reap: { text: 'Couldn’t end 2 hung helpers', source: 'kill: (4121) - Operation not permitted', fix: 'End', agent: 'checkout' },
  install: { text: 'Couldn’t turn on the memory guard', source: 'launchctl bootstrap: 5: Input/output error', fix: 'Turn on', agent: 'checkout' },
  unreadable: { text: 'Can’t read the memory guard', source: 'guard.json: Unexpected end of JSON input', fix: 'Turn on', agent: 'checkout' },
  stale: 'Stopped at 14:02',
  silent: 'The guard stopped answering',
  remote: { computer: 'devbox', free: { value: '54%', of: 'free of 32 GB', swap: '0 swap' }, herdr: { size: '320 MB' }, sessions: [session('relay', '1.1 GB', 'working', ['Claude', 'working', 'up 1 d'])] },
};
// The guard's notices in its own words; on screen they are toasts, away the computer's notifications.
const notice = (state, text, detail) => ({ state, home: 'memory', text, detail });
export const sampleMemoryNotices = {
  'Recycled': notice('done', 'docs restarted', 'It held 1400 MB; the same conversation goes on in a fresh process (190 MB).'),
  'Batch': notice('done', 'Agents recycled', '3 of 3, 2100 MB freed. Same conversations, fresh processes.'),
  'Did not resume': notice('failed', 'docs did not resume', 'Run in its terminal: codex resume 0199a4'),
  'Terminal busy': notice('waits', 'docs needs a manual restart', 'It exited, but its terminal is busy. Run: codex resume 0199a4'),
  'Restart needed': notice('waits', 'perf needs a manual restart', 'Run in its terminal: claude --resume 7f3e'),
  'Restart scheduled': notice('fact', 'Herdr will restart its window', 'Past its 1.2 GB. It restarts when you pause for a minute; terminals keep running.'),
  'Window restarted': notice('done', 'Herdr window restarted', 'Past its 1.2 GB. Your terminals and agents kept running.'),
  'Restart loop': notice('failed', 'Herdr keeps outgrowing its limit', 'Automatic restarts are paused for an hour. Open Memory in kansō to see what grows.'),
};
