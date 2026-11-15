// The panels' named states: each one a preset of its panel's props, the catalog draws its record from it.
import { containers, conversationFind, files, markdownWindow, ports, settings } from './panels.js';
import { phrase } from './kit.js';
import { keyLayer } from './samples.js';
import { sampleContainers, sampleDisk, sampleAreas, sampleFiles, sampleFilesFailures, sampleFind, samplePlainTree, samplePortHistory, samplePorts, sampleTree, sampleCustomPanel, sampleFound, sampleHerdrKeys, sampleHidden, sampleKeyGroups, sampleMaintainers, sampleMarkdown, samplePlaces, sampleReleases, sampleTaken } from './panel-samples.js';

// Settings: each page with its samples, then each state as what changes on it.
const shows = (extra) => ({ page: 'pieces', hidden: sampleHidden, areas: sampleAreas, ...extra });
const picked = (area, extra = {}) => shows({ view: 'area', area, ...extra });
const withPanel = { ...sampleAreas, Panels: { ...sampleAreas.Panels, pieces: [...sampleAreas.Panels.pieces, sampleCustomPanel] } };
const keys = (extra) => ({ page: 'keys', os: 'mac', layer: keyLayer('mac', 'alt cmd'), picked: 'h', groups: sampleKeyGroups, herdr: sampleHerdrKeys, practice: 'Vim keys', ...extra });
// An open group: its rows at rest, the first one in the given state.
const opened = (group, first = {}) => keys({ open: group, groups: { ...sampleKeyGroups, [group]: sampleKeyGroups[group].map((item, index) => (index ? item : { ...item, ...first })) } });
const news = (extra) => ({ page: 'news', newer: sampleReleases.newer, installed: sampleReleases.installed, older: sampleReleases.older, ...extra });
const credits = (extra) => ({ page: 'credits', places: samplePlaces, maintainers: sampleMaintainers, ...extra });

export const settingsViews = {
  'What you hid': [shows({}), 'Opens on what you hid, one press each to show again.'],
  'A hidden row under the pointer': [shows({ hover: 'Minimap' }), 'Where it lives, and Show.'],
  'Nothing hidden': [shows({ hidden: [] }), 'Nothing is hidden.'],
  ...Object.fromEntries(Object.keys(sampleAreas).map((area) => [`${area} picked`, [picked(area), `Browse the window: the ${area.toLowerCase()} area’s pieces, each with its switch.`]])),
  'From a piece’s right-click': [picked('Status bar', { selected: 'Memory low' }), 'Settings for this… lands on its area with its row washed.'],
  'Just switched': [picked('Status bar', { pending: 'Reviews waiting' }), 'On at once, with the breathing dot until it is written.'],
  Changed: [picked('Pane header', { changed: 'reset' }), 'A choice differs from its default: Reset all.'],
  'After Reset all': [picked('Pane header', { changed: 'undo' }), 'Reset all can be taken back until the page changes.'],
  'Panels in order': [picked('Panels', { areas: withPanel }), 'A panel another mod adds sits with the others; each moves up or down.'],
  'Find, matches': [shows({ view: 'find', query: sampleFound.query, found: sampleFound }), 'Matches across areas, each with where it lives.'],
  'Find, nothing': [shows({ view: 'find', query: 'zzz' }), 'Find matches no piece.'],
  Keys: [keys({}), 'The keyboard of one layer with the picked key, then kansō’s groups and Herdr’s.'],
  ...Object.fromEntries(Object.keys(sampleKeyGroups).map((group) => [group, [opened(group), `The ${group.toLowerCase()} group’s keys.`]])),
  'Key, capture': [opened('Vim keys', { state: 'capture' }), 'A click on a row waits for the new key.'],
  'Key, changed': [opened('Vim keys', { state: 'changed' }), 'A key differs from the one kansō ships: Reset.'],
  'Key, unbound': [opened('Vim keys', { state: 'unbound' }), 'A key was removed.'],
  'Key, taken': [opened('Vim keys', { state: 'taken', taken: sampleTaken }), 'The key already does something: a second press takes it.'],
  'Key, not saved': [opened('Vim keys', { state: 'failed', source: 'keys.json: EACCES: permission denied' }), 'keys.json refused the write.'],
  'Numbered keys, capture': [opened('Moving along the strip', { state: 'capture', chords: ['⌘N'] }), 'A numbered family waits for a key with a digit; N takes its place.'],
  'Numbered keys, no digit': [opened('Moving along the strip', { state: 'no digit', chords: ['⌘N'] }), 'The key had no digit; N takes the digit’s place.'],
  'A newer release': [news({}), 'Stable Mode, a newer release out: its node carries the one action.'],
  'Older releases open': [news({ unfolded: [sampleReleases.installed] }), 'Older opens in place.'],
  'Dawn Mode': [news({ channel: 'dawn', newer: sampleReleases.dawn }), 'Dawn Mode, on a newer build.'],
  'Back on Stable Mode': [news({ newer: null, stay: 'Your Dawn Mode build stays until Stable Mode passes it.' }), 'Back on Stable Mode from a beta.'],
  'Up to date': [news({ newer: null }), 'The installed release is the newest.'],
  Checking: [news({ newer: null, checking: true }), 'A check is running.'],
  'Checks off': [news({ auto: false }), 'Automatic checks are off.'],
  Updating: [news({ installing: true }), 'The update is installing.'],
  'First read': [news({ reading: true }), 'The changelog is being read.'],
  'GitHub not answering': [news({ read: '14:02' }), 'The last copy, with when it was read.'],
  'Nothing kept': [news({ failure: { text: 'Can’t read what’s new', source: 'GitHub not answering, and no copy was kept', fix: 'Refresh' } }), 'Nothing to show.'],
  Credits: [credits({}), 'Where kansō comes from, and who maintains it.'],
  'A place under the pointer': [credits({ hover: 'Herdr' }), 'What it is, and the open mark.'],
};

// Find in the conversation: the query typed, then what the read gives back.
const finding = (extra) => ({ agent: sampleFind.agent, query: sampleFind.query, count: '', ...extra });
const second = sampleFind.days[0][1][1];
export const findViews = {
  Empty: [finding({ query: null }), 'Opens on an empty field; the arrows wait for a match.'],
  'Reading the conversation': [finding({ reading: true }), 'The first read, and a read again after the file was cleared; the query stays.'],
  Matches: [finding({ count: '2 of 3', days: sampleFind.days, at: second }), 'Each day a heading, each hit who and when, then its line with the match marked; the current one washed.'],
  'One turn open': [finding({ count: '2 of 3', days: sampleFind.days, at: second, open: true, turn: sampleFind.turn }), 'A hit opens its whole turn in place; back returns to the hits.'],
  'No matches': [finding({ query: 'countdown hook' }), 'Nothing found: the empty state, the count left empty.'],
  'The conversation file is gone': [finding({ missing: sampleFind.missing }), 'The file cannot be read: its path, Refresh, and Explain to the agent.'],
};
// Files: Changed with what the agent named, All files as the tree, then each read that is not the list.
const { named, unchanged, also, shell, remote, computer } = sampleFiles;
const changes = (extra) => ({ view: 'changed', files: { named, unchanged, also }, ...extra });
const tree = (extra) => ({ view: 'all', tree: sampleTree, ...extra });
export const filesViews = {
  'Changed, opened from the digest': [changes({}), 'What the agent named first, newest first; the named files that did not change on one dim line; then the rest.'],
  'All files, with marks': [tree({ picked: 'limits.ts' }), 'The tree: git’s letter in the icon’s place, a folder’s count of changed files; a folder at its limit says how many more.'],
  'Right-click a row': [changes({ files: { named, unchanged: ['plans.ts'] }, picked: 'checkout.ts', menu: sampleFiles.menu.path }), 'Open the diff, Open, Open with…, Copy path, and the piece’s own lines.'],
  'A shell pane: nothing named': [changes({ files: { also: shell } }), 'No conversation names files: the changed ones alone.'],
  'Nothing changed': [changes({ empty: { icon: 'lu-file', text: 'No uncommitted changes' } }), 'Changed with nothing to show.'],
  'Not a repository: the tree only': [{ repository: false, tree: samplePlainTree }, 'Outside git there is only the tree; a folder it cannot list says so in its place.'],
  'An empty folder': [tree({ tree: [], empty: { icon: 'lu-folder', text: 'No files' } }), 'The folder holds nothing.'],
  'First read': [{ reading: true, repository: false }, 'The skeleton, once; later reads keep the rows and spin Refresh.'],
  'The folder can’t be read': [changes({ failure: sampleFilesFailures.folder }), 'The folder’s own words, Refresh, and Explain to the agent.'],
  'No folder for this pane': [{ repository: false, empty: { icon: 'lu-folder', text: 'This pane has no folder' } }, 'The pane in front has no folder.'],
  'On another computer': [changes({ files: remote, scope: computer }), 'The computer’s name is the only scope line.'],
  'Stale: devbox stopped answering': [changes({ files: remote, scope: 'Read 14:02 · devbox unreachable · next try 14:03', stale: true }), 'The last read stays, stepped down, with when it was read and the next try.'],
  'Unreachable before the first read': [{ repository: false, scope: computer, failure: sampleFilesFailures.unreachable }, 'Nothing read yet: the computer’s words and Refresh.'],
  'Narrow, 300': [changes({ look: 'narrow', files: { named, unchanged: ['rate-limit-buckets.ts'], also } }), 'The title steps down; the folder truncates before the name.'],
};
// Ports: the four servers at rest, History folded; each state is what the pointer, a stop or a read changes.
const { noPane, inPanes } = samplePorts;
const served = (extra) => ({ servers: { noPane, inPanes }, history: { open: false }, ...extra });
const pastOpen = (extra = {}) => ({ open: true, ...samplePortHistory, ...extra });
export const portsViews = {
  'At rest: two with no pane, two in panes': [served({}), 'One line each: port, what runs it, size. No pane first; the rows after it name their pane.'],
  'Pointer on :6006': [served({ picked: ':6006' }), 'Command, folder and age, then Stop as the one primary and Open in the browser.'],
  'A pane’s server picked': [served({ picked: ':4000' }), 'Go to its pane first, then Open in the browser and Stop, all quiet.'],
  'Stop armed': [served({ picked: ':6006', armed: true }), 'Stop asks again for 4 s.'],
  Stopping: [served({ picked: ':6006', stopping: true }), 'The signal is sent; the row waits for the port to close.'],
  'A stop refused, on its row': [served({ picked: ':6006', refused: samplePorts.refused }), 'The kill’s own words, Force stop, and Explain to the agent.'],
  'Stop every one with no pane': [served({ heading: { hover: true } }), 'On the No pane heading, Stop 2; the ones in a pane stay.'],
  'Stop every one, armed': [served({ heading: { hover: true, armed: true } }), 'It asks again before it stops them.'],
  'History open': [served({ history: pastOpen() }), 'Its range, servers at once with the share with no pane, what stopped, then what opened and ended.'],
  'Share from the header': [served({ history: pastOpen(), share: true }), 'Counts and sizes only leave.'],
  'History off': [served({ history: pastOpen({ guard: samplePortHistory.said.off, bars: null }) }), 'Nothing collects history: the guard turns it on; the list stays.'],
  'History unreadable': [served({ history: pastOpen({ guard: samplePortHistory.said.bad, bars: null }) }), 'The history file is not readable; nothing is drawn from it.'],
  'History stopped': [served({ history: pastOpen({ guard: samplePortHistory.said.stale }) }), 'The collector stopped: the last chart stays, with when.'],
  'Some servers cannot be attributed': [served({ unattributed: samplePorts.unattributed }), 'Their folders cannot be read; they are listed and can be stopped.'],
  'On another computer': [served({ servers: samplePorts.remote, scope: samplePorts.computer, picked: ':8000' }), 'The focused project’s computer is read; its name is the scope.'],
  'Another computer, unreachable': [served({ servers: samplePorts.remote, scope: 'Read 14:02 · devbox unreachable · next try 14:07', stale: true, picked: ':8000' }), 'The last read stays, stepped down; Stop waits for the computer.'],
  'First read': [served({ reading: true, history: null }), 'The skeleton, once.'],
  Empty: [served({ servers: {} }), 'Nothing listens; History stays.'],
  'A read failed': [served({ failure: samplePorts.failure }), 'lsof’s own words, Refresh, and Explain to the agent.'],
  'Narrow, 300': [served({ look: 'narrow', picked: ':6006' }), 'The command folds away; Open in the browser becomes Open.'],
};
// Markdown: plan.md as cart-ui wrote it; each state is what the pointer, an edit, a review or a read changes.
const openFile = ({ file, folder, source }, { doc = {}, ...extra } = {}) => ({ file, folder, ...extra, doc: { source, ...doc } });
const plan = (extra) => openFile(sampleMarkdown.plan, extra);
const waits = phrase(sampleMarkdown.agent, 'waits for your review');
const listing = (extra) => ({ folder: '~/acme-shop', ...extra });
const [waiting, , folder] = sampleMarkdown.groups;
export const markdownViews = {
  'A document': [plan({}), 'The file formatted, its folder under the name; at rest only Close.'],
  'Pointer over the header and a block': [plan({ tools: ['source', 'refresh'], doc: { block: 3, state: 'hover' } }), 'Source and Refresh come with the pointer; the block under it is washed.'],
  Source: [plan({ tools: ['source', 'refresh'], doc: { view: 'source' } }), 'The whole file as text, edited and saved the same way; Formatted goes back.'],
  'Editing a block': [plan({ said: ['Saving…'], doc: { block: 2, state: 'editing' } }), 'A double-click edits that block alone; what you type saves as you go.'],
  'Editing a table': [openFile(sampleMarkdown.limits, { said: ['Edited'], doc: { block: 2, state: 'editing', cell: [1, 2] } }), 'A table opens as its cells, with Add row, Add column and Done under it.'],
  'Changed on disk while edited': [plan({ said: ['Edited'], band: { text: 'Changed on disk at 14:06', actions: [{ label: 'Overwrite' }, { label: 'Reload', kind: 'quiet' }] } }), 'Nothing is written until you choose: yours over it, or the file’s.'],
  'After Overwrite': [plan({ band: { text: 'Saved over the 14:06 text', actions: [{ label: 'Undo', kind: 'quiet' }] } }), 'Undo, on that line, until the next change.'],
  "Couldn’t save": [plan({ said: [waits, 'Edited'], tools: ['done'], failure: sampleMarkdown.failures.save }), 'The write was refused: its words, Save again, and Explain to the agent.'],
  'Review: an agent waits': [plan({ said: [waits, 'Edited'], tools: ['done'] }), 'md-review waits on this file: Done is the one primary, and tells the agent.'],
  'Another review waits': [plan({ said: [waits], tools: ['done'], also: 'release.md also waits for your review' }), 'Done shows the next review waiting, or closes.'],
  'Done could not tell the agent': [plan({ said: [waits], failure: sampleMarkdown.failures.told }), 'Done stays; a second press tries again.'],
  'No file: the list': [listing({ groups: sampleMarkdown.groups }), 'Reviews waiting first, then what this terminal mentioned, then the folder’s own.'],
  'The folder only': [listing({ groups: [folder] }), 'Nothing waits and the terminal named nothing: the folder’s files, no headings.'],
  'Keyboard on a row': [listing({ groups: [waiting, folder], picked: 'CHANGELOG.md' }), 'j and k move, Enter opens.'],
  Looking: [listing({ reading: true }), 'The skeleton while it looks.'],
  Empty: [{ folder: '~/infra', empty: 'No Markdown in ~/infra' }, 'The folder holds no Markdown.'],
  'On another computer': [listing({ folder: 'devbox: ~/acme-shop', groups: [folder] }), 'The list and the file come from that computer, read again every 3 s.'],
  'Another computer, not answering': [openFile(sampleMarkdown.runbook, { said: ['Read 14:02', 'devbox not answering'], stale: true }), 'The last read stays, stepped down, with when it was read.'],
  'Too large to edit': [openFile(sampleMarkdown.events, { said: ['612 KB, read only'], tools: ['refresh'] }), 'Past 400,000 characters it reads only.'],
};
// Containers: Docker's cost, acme-shop and docs-site, buildkit in no project; each state is what the pointer, an armed press or a read changes.
const { cost, projects, loose, details: said } = sampleContainers;
const docked = (extra) => ({ cost, projects, loose, ...extra });
const diskOpen = (extra = {}) => docked({ disk: { ...sampleDisk, ...extra } });
const running = (extra) => docked({ picked: 'mailpit', said, ...extra });
const { remote: elsewhere } = sampleContainers;
export const containersViews = {
  'At rest: one exited, two running, one project not started': [docked({}), 'Docker’s cost on one line; each project with its count; a running row has no dot, a failed one says how it ended.'],
  'Pointer on acme-shop': [docked({ hover: 'acme-shop' }), 'compose.yaml takes the count’s place; Up again, Rebuild and Down come under the name, and Stop all when more than one runs.'],
  'Pointer on the cost': [docked({ cost: { ...cost, hover: true } }), 'Can grow to, and Quit Docker with what it stops.'],
  'A running container picked': [running({}), 'Image, port and age, then Open, Logs, Shell, Restart, Stop and Details.'],
  'Details open': [running({ details: true }), 'Details fold inside the row.'],
  'No details from Docker': [running({ details: true, said: [] }), 'Docker gave nothing to fold open.'],
  'An exited container picked': [docked({ picked: 'api-db' }), 'Logs first, then Start, Details and Remove.'],
  'Working on a container': [running({ pending: true }), 'The breathing dot until Docker answers; its words wait.'],
  'Down armed': [docked({ down: 'acme-shop' }), 'Down asks again before it takes the project down.'],
  'Quit armed': [docked({ cost: { ...cost, hover: true, armed: true } }), 'Quit asks again, and says how many it stops.'],
  'A removal refused, on its row': [docked({ picked: 'api-db', refused: sampleContainers.refused }), 'Docker’s own words, Remove again, and Explain to the agent.'],
  'Not in a project, Remove armed': [docked({ picked: 'buildkit', armed: true }), 'A container no compose file names sits under its own dim heading.'],
  'Empty, with a stack a project can bring up': [docked({ projects: projects.slice(1), loose: [] }), 'Nothing runs; a project’s compose file offers Up.'],
  'No containers': [docked({ projects: [], loose: [] }), 'Nothing runs and no compose file is found; Pull is in Disk.'],
  'Disk open': [diskOpen(), 'The pull field, then images, volumes and the build cache, each with what it gives back.'],
  'Run an image': [diskOpen({ picked: sampleDisk.run.image, run: sampleDisk.run }), 'Run… opens the name and the port under the image.'],
  'Run, a name refused': [diskOpen({ picked: sampleDisk.run.image, run: { ...sampleDisk.run, ...sampleDisk.invalid.name } }), 'The field is marked and the rule says why.'],
  'Run, a port refused': [diskOpen({ picked: sampleDisk.run.image, run: { ...sampleDisk.run, ...sampleDisk.invalid.port } }), 'The field is marked and the rule says why.'],
  'Remove an unused image, armed': [diskOpen({ picked: 'node:20-bookworm', armed: 'image' }), 'It asks again before it removes the image.'],
  'Remove unused volumes, armed': [diskOpen({ armed: 'volumes' }), 'It says their data goes for good, and asks again.'],
  'Docker not running': [{ docker: 'down' }, 'The empty state and Open Docker.'],
  'Docker could not be opened': [{ docker: 'down', unopened: sampleContainers.unopened }, 'Open Docker failed: its words, and Open Docker again.'],
  'Starting Docker': [{ docker: 'starting' }, 'Open Docker was pressed; the skeleton until it answers.'],
  'First read': [{ reading: true }, 'The skeleton, once; later reads keep the rows and spin Refresh.'],
  'A read failed': [{ failure: sampleContainers.failure }, 'Docker’s own words, Refresh, and Explain to the agent.'],
  'Docker on another machine (a context)': [{ loose: sampleContainers.context.loose, scope: sampleContainers.context.name, context: true, picked: 'pg-primary' }, 'The context’s name is the scope; its containers are not this computer’s, so there is no cost and no Open.'],
  'On another computer': [{ ...elsewhere, scope: elsewhere.computer }, 'The focused project’s computer reads its own docker; its name is the scope.'],
  'Another computer, unreachable': [{ ...elsewhere, scope: 'Read 14:02 · devbox unreachable · next try 14:07', stale: true }, 'The last read stays, stepped down, with when it was read and the next try.'],
  'Memory not attributed': [docked({ unattributed: sampleContainers.unattributed }), 'On Windows the VM’s memory cannot be read yet: it says so.'],
  'Narrow, 300': [running({ look: 'narrow' }), 'The image hides; the words wrap.'],
};
const stated = (views, draw) => ({
  args: { view: Object.keys(views)[0] },
  markup: ({ view }) => draw(views[view][0]),
  states: Object.entries(views).map(([label, [, caption]]) => ({ label, args: { view: label }, caption })),
});
const control = (views) => ({ view: { name: 'what it shows', control: { type: 'select' }, options: Object.keys(views) } });

const panels = { 'Panels/Settings': [settingsViews, settings], 'Panels/Find': [findViews, conversationFind], 'Panels/Files': [filesViews, files], 'Panels/Ports': [portsViews, ports], 'Panels/Markdown': [markdownViews, markdownWindow], 'Panels/Containers': [containersViews, containers] };
export const panelPages = Object.fromEntries(Object.entries(panels).map(([page, [views, draw]]) => [page, stated(views, draw)]));
export const panelPlaygrounds = Object.fromEntries(Object.entries(panels).map(([page, [views]]) => [page, { ...panelPages[page], argTypes: control(views) }]));
