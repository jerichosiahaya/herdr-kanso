// Pages whose story is built from Storybook controls instead of drawn states.
import sprite from '../proto-sprite.svg?raw';
import { activity, activityMenu, asleep, paneFolds, paneHeader, paneReaches, paneStates, noticeHomes, noticePlaces, noticeStates, systemMessage, toastStack, heldChord, keyboard, keyboardExplorer, keyboards, keyboardSystems, keyNames, pickedKey, shortcutRow, shortcutRowStates, channelSettings, channels, computerItem, computerItemStates, computerRow, computerStates, edge, failureMenu, header, layoutPaused, paletteDoor, panelDoors, projectRow, section, sessionRow, sidebarFooter, tabBar, tabBarStates, tile, toolbar, views, viewSwitch } from './compositions.js';
import { avatar, avatarSizes, button, card, chip, code, dawn, dialog, emptyState, escape, failureBlock, input, keycap, keycapStates, keyHint, kinds, levels, mark, markdown, marks, markSizes, menu, metric, needsItem, row, rowDepths, sides, skeletonOf, skeletonShapes, stack, statePatterns, statusItem, stepper, tabs, thumbnail, toast, toggle, tooltip, windowControls } from './pieces.js';
import { atWidth, barWidths, inBar } from './frames.js';
import { appNotices, keyLayer, keyLayerMods, sampleNotices, sampleSidebar, statusMenus, statusPanels } from './samples.js';

const icons = ['none', ...[...sprite.matchAll(/id="(lu-[^"]+)"/g)].map(([, id]) => id).sort()];
const frame = (markup) => `<div class="kanso-story"><div class="kanso-story__theme kanso-story__frame kanso-story--free">${markup}</div></div>`;

const inSidebar = (markup) => stack({ variant: 'sidebar frame' }, markup), inRail = (markup) => stack({ variant: 'rail frame' }, markup);
const select = (name, options) => ({ name, control: { type: 'select' }, options });

// One layer control per computer, each labelled the way that computer writes its modifiers.
const pickable = keyNames().filter((key) => !['ctrl', 'alt', 'shift', 'cmd'].includes(key));
const layerArgs = Object.fromEntries(keyboardSystems.map((os) => [`${os}Layer`, { name: 'layer', control: { type: 'select', labels: Object.fromEntries(keyLayerMods[os].map((mods) => [mods, mods === 'lists' ? 'Lists' : heldChord({ os, held: mods.split(' ') })])) }, options: keyLayerMods[os], if: { arg: 'os', eq: os } }]));
const layerDefaults = Object.fromEntries(keyboardSystems.map((os) => [`${os}Layer`, keyLayerMods[os][0]]));
const osArg = { name: 'computer', control: { type: 'inline-radio' }, options: keyboardSystems };

export const playgrounds = {
  'Primitives/Button': {
    args: { label: 'Create', kind: 'solid', size: 'md', icon: 'none', disabled: false, armed: false, verb: '', active: false, spin: false },
    argTypes: {
      label: { name: 'label', control: { type: 'text' } },
      kind: select('kind', Object.keys(kinds)),
      size: select('size', ['sm', 'md', 'lg']),
      icon: select('icon', icons),
      disabled: { name: 'disabled', control: { type: 'boolean' } },
      armed: { name: 'armed', control: { type: 'boolean' } },
      verb: { name: 'verb', control: { type: 'text' }, if: { arg: 'armed' } },
      active: { name: 'active', control: { type: 'boolean' } },
      spin: { name: 'spin', control: { type: 'boolean' } },
    },
    markup: button,
  },
  'Primitives/Avatar': {
    args: { initial: 'S', image: '', size: 'md', tone: '' },
    argTypes: {
      initial: { name: 'Initial', control: { type: 'text' } },
      image: { name: 'Image URL', control: { type: 'text' } },
      size: select('Size', Object.keys(avatarSizes)),
      tone: select('Tone', ['', 'teal', 'yellow', 'blue', 'violet', 'green', 'red']),
    },
    markup: avatar,
  },
  'Primitives/Chip': {
    args: { label: '3 files', quiet: false },
    argTypes: { label: { name: 'Label', control: { type: 'text' } }, quiet: { name: 'quiet', control: { type: 'boolean' } } },
    markup: chip,
  },
  'Primitives/Code': {
    args: { text: 'export function bucket(customer) {\n  const plan = planOf(customer);\n  return { plan, tokens: LIMIT[plan] };\n}', kind: 'source', first: 11, line: 12 },
    argTypes: {
      text: { name: 'Code', control: { type: 'text' } },
      kind: select('Kind', ['source', 'diff', 'snippet', 'log']),
      first: { name: 'First line', control: { type: 'number', min: 1 } },
      line: { name: 'Highlighted line', control: { type: 'number', min: 0 } },
    },
    markup: (args) => `<div class="kanso-panel">${code(args)}</div>`,
  },
  'Primitives/Dialog': {
    args: { title: 'Rename checkout', scope: '', value: 'checkout', placeholder: 'Name', loading: false, note: '', tone: 'dim', primary: 'Rename', state: 'default', secondary: 'Cancel' },
    argTypes: {
      title: { name: 'Title', control: { type: 'text' } },
      scope: { name: 'Scope', control: { type: 'text' } },
      value: { name: 'Value', control: { type: 'text' } },
      placeholder: { name: 'Placeholder', control: { type: 'text' } },
      loading: { name: 'Content loading', control: { type: 'boolean' } },
      note: { name: 'Note', control: { type: 'text' } },
      tone: select('Note tone', ['dim', 'muted', 'error']),
      primary: { name: 'Primary', control: { type: 'text' } },
      state: { ...select('Primary state', ['default', 'disabled', 'loading', 'armed']), if: { arg: 'loading', truthy: false } },
      secondary: { name: 'Secondary', control: { type: 'text' } },
    },
    markup: dialog,
  },
  'Primitives/Drag handle': {
    args: { state: 'default' },
    argTypes: { state: select('State', ['default', 'hover']) },
    markup: ({ state }) => `<svg class="kanso-icon kanso-icon--row kanso-grip${state === 'default' ? '' : ' kanso-text--fg'}"><title>Hold and drag onto another pane to move this one there</title><use href="#lu-grip-vertical"/></svg>`,
  },
  'Primitives/Field': {
    args: { text: '', label: 'Comment', icon: 'lu-send', error: false, disabled: false, multiline: false, inline: false, selected: false, loading: false, limit: 80 },
    argTypes: {
      text: { name: 'text', control: { type: 'text' } },
      label: { name: 'label', control: { type: 'text' } },
      icon: select('icon', icons),
      error: { name: 'error', control: { type: 'boolean' } },
      disabled: { name: 'disabled', control: { type: 'boolean' } },
      multiline: { name: 'multiline', control: { type: 'boolean' } },
      inline: { name: 'inline', control: { type: 'boolean' } },
      selected: { name: 'selected', control: { type: 'boolean' } },
      loading: { name: 'loading', control: { type: 'boolean' } },
      limit: { name: 'limit', control: { type: 'number', min: 1 } },
    },
    markup: input,
  },
  'Primitives/Key hint': {
    args: { text: '⌘↵', faint: false, recording: false },
    argTypes: {
      text: { name: 'text', control: { type: 'text', maxLength: 6 } },
      faint: { name: 'faint', control: { type: 'boolean' } },
      recording: { name: 'recording', control: { type: 'boolean' } },
    },
    markup: ({ text, faint, recording }) => keyHint({ text: text.slice(0, 6), faint, recording }),
  },
  'Primitives/Mark': {
    args: { status: 'working', size: 'md' },
    argTypes: {
      status: select('status', Object.keys(marks)),
      size: select('size', Object.keys(markSizes)),
    },
    markup: mark,
  },
  'Primitives/Markdown': {
    args: { source: '# Rate limits\n\nEach customer gets a bucket of requests. A request takes one token; the bucket refills one token every 2 s.\n\n| Plan | Per minute | Burst |\n| --- | --- | --- |\n| Free | 40 | 10 |\n| Pro | 400 | 60 |\n\n## Retry-After\n\nAn empty bucket answers `429` with `Retry-After` in seconds.', block: 3, state: 'hover' },
    argTypes: {
      source: { name: 'Markdown', control: { type: 'text' } },
      state: select('Block state', ['rest', 'hover', 'editing']),
      block: { name: 'Block', control: { type: 'number', min: 1 }, if: { arg: 'state', neq: 'rest' } },
    },
    markup: (args) => `<div class="kanso-panel">${markdown(args)}</div>`,
  },
  'Primitives/Menu': {
    args: {
      title: 'src/api/checkout.ts',
      items: [
        { label: 'Open the diff', icon: 'lu-git-pull-request' },
        { label: 'Open', icon: 'lu-file', hint: '↵', selected: true },
        { separator: true },
        { label: 'Hide this section', icon: 'lu-eye-off' },
        { label: 'Delete worktree', icon: 'lu-x', verb: 'delete', armed: false },
      ],
    },
    argTypes: {
      title: { name: 'title', control: { type: 'text' } },
      items: { name: 'items', control: { type: 'object' }, description: '{ label, icon, hint, badge, verb, armed, selected } or { separator: true }' },
    },
    markup: menu,
  },
  'Primitives/Metric': {
    args: { value: '31%', unit: 'free of 16 GB · 2.4 GB swap', facts: '14 tasks | $2.94 a task | 9.1M tokens', loading: false },
    argTypes: {
      value: { name: 'Value', control: { type: 'text' } },
      unit: { name: 'Unit', control: { type: 'text' } },
      facts: { name: 'Facts (separated by |)', control: { type: 'text' } },
      loading: { name: 'Loading', control: { type: 'boolean' } },
    },
    markup: metric,
  },
  'Primitives/Window controls': { args: {}, argTypes: {}, markup: windowControls },
  'Primitives/Dawn': { args: {}, argTypes: {}, markup: () => dawn() },
  'Compositions/Toolbar': {
    args: { column: false, open: false },
    argTypes: { column: { name: 'column', control: { type: 'boolean' } }, open: { name: 'open', control: { type: 'boolean' }, if: { arg: 'column' } } },
    markup: toolbar,
  },
  'Compositions/Header': {
    args: { collapsed: false, dawn: false, art: true },
    argTypes: { collapsed: { name: 'collapsed', control: { type: 'boolean' } }, dawn: { name: 'Dawn Mode', control: { type: 'boolean' } },
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'dawn' } } },
    markup: header,
  },
  'Compositions/Dawn Mode': {
    args: { channel: 'dawn', art: true, collapsed: false },
    argTypes: {
      channel: { name: 'channel', control: { type: 'inline-radio' }, options: channels.map((item) => item.key) },
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'channel', eq: 'dawn' } },
      collapsed: { name: 'collapsed', control: { type: 'boolean' } },
    },
    markup: ({ channel, art, collapsed }) => `<p class="kanso-story__caption">Sidebar header</p>${header({ collapsed, dawn: channel === 'dawn', art })}`
      + `<p class="kanso-story__caption">Settings · Updates</p><div class="kanso-story__slice kanso-story__settings">${channelSettings({ channel, art })}</div>`,
  },
  'Compositions/Notifications': {
    args: { example: 'your own', state: 'failed', home: 'agent', text: 'Can\'t reach devbox', act: 'Refresh', detail: 'ssh: connect to host devbox port 22: Connection refused', place: 'window on screen', stacked: 1 },
    argTypes: {
      example: select('a notice the app sends', ['your own', ...Object.keys(appNotices)]),
      state: { ...select('state', noticeStates), if: { arg: 'example', eq: 'your own' } },
      home: { ...select('home', noticeHomes), if: { arg: 'example', eq: 'your own' } },
      text: { name: 'sentence', control: { type: 'text' }, if: { arg: 'example', eq: 'your own' } },
      act: { name: 'word to act', control: { type: 'text' }, if: { arg: 'example', eq: 'your own' } },
      detail: { name: 'detail', control: { type: 'text' }, if: { arg: 'example', eq: 'your own' } },
      place: { name: 'where you are', control: { type: 'inline-radio' }, options: noticePlaces },
      stacked: { name: 'on screen', control: { type: 'inline-radio' }, options: [1, 2, 3], if: { arg: 'place', eq: 'window on screen' } },
    },
    markup: ({ example, stacked, place, act, detail, ...args }) => {
      const item = example === 'your own' ? { ...args, act: act || null, detail: detail || null, place } : { act: null, detail: null, ...appNotices[example], place };
      const sent = systemMessage(item);
      if (sent) return `<p class="kanso-story__caption">Sent to the computer's notifications</p><p class="kanso-story__caption">Title: ${escape(sent.title)}</p>${sent.body ? `<p class="kanso-story__caption">Text: ${escape(sent.body)}</p>` : ''}`;
      if (place !== 'window on screen') return '<p class="kanso-story__caption">Not sent: its home is on screen.</p>';
      return toastStack({ notices: [...sampleNotices, item].slice(-stacked) });
    },
  },
  'Compositions/Pane header': {
    args: { program: 'p-claude', name: 'checkout', state: 'working', focused: true, keyboard: false, hover: false, menu: false, pinned: false, zoomed: false, reach: 'here', held: false, armed: false, renaming: false,
      elsewhere: false, files: 3, commits: 2, pr: 'test / unit failed', github: true, fold: 0 },
    argTypes: {
      program: select('program', ['p-claude', 'p-codex', 'lu-terminal']),
      name: { name: 'name', control: { type: 'text' } },
      state: select('state', paneStates),
      focused: { name: 'focused', control: { type: 'boolean' } },
      keyboard: { name: 'focus from the keyboard', control: { type: 'boolean' } },
      hover: { name: 'pointer on it', control: { type: 'boolean' } },
      menu: { name: '⋯ open', control: { type: 'boolean' } },
      pinned: { name: 'pinned', control: { type: 'boolean' } },
      zoomed: { name: 'zoomed', control: { type: 'boolean' }, if: { arg: 'menu' } },
      reach: { name: 'computer', control: { type: 'inline-radio' }, options: paneReaches },
      held: { name: 'held to move', control: { type: 'boolean' } },
      armed: { name: 'close armed', control: { type: 'boolean' }, if: { arg: 'hover' } },
      renaming: { name: 'renaming', control: { type: 'boolean' } },
      elsewhere: { name: 'folder differs from the tab', control: { type: 'boolean' } },
      files: { name: 'files changed', control: { type: 'number', min: 0 } },
      commits: { name: 'commits not on GitHub', control: { type: 'number', min: 0 } },
      pr: { name: 'pull request', control: { type: 'select' }, options: ['none', 'ready', 'checks running', 'test / unit failed', 'changes requested', 'conflicts with main', 'behind main'] },
      github: { name: 'GitHub answers', control: { type: 'boolean' }, if: { arg: 'pr', neq: 'none' } },
      fold: { name: 'folded', control: { type: 'select', labels: Object.fromEntries(paneFolds.map((label, step) => [step, label])) }, options: paneFolds.map((_, step) => step) },
    },
    markup: ({ files, commits, pr, github, elsewhere, ...args }) => {
      const tone = { ready: 'done', 'checks running': 'working', 'behind main': 'working' }[pr] ?? 'blocked';
      const digest = { files, add: files * 14, del: files * 2, commits, pr: pr === 'none' ? null : { number: '#142', verdict: pr, tone }, failure: github ? null : 'gh: HTTP 502: Bad Gateway (https://api.github.com/graphql)' };
      const place = elsewhere ? { folder: args.reach === 'here' ? 'checkout-v2' : '~/checkout-v2', branch: 'limits-table' } : null;
      return `<div class="kanso-pane kanso-story__pane">${paneHeader({ ...args, digest, place })}</div>`;
    },
  },
  'Compositions/Keyboard/Key': {
    args: { label: 'H', units: 1, state: 'kanso', hover: false },
    argTypes: {
      label: { name: 'label', control: { type: 'text', maxLength: 3 } },
      units: { name: 'width in keys', control: { type: 'inline-radio' }, options: [...new Set(Object.values(keyboards).flatMap(({ rows }) => rows.flat().map(([, units = 1]) => units)))].sort((a, b) => a - b) },
      state: select('state', keycapStates),
      hover: { name: 'hover', control: { type: 'boolean' } },
    },
    markup: (args) => stack({ variant: 'keyboard' }, stack({ variant: 'keyboard row' }, keycap(args))),
  },
  'Compositions/Keyboard/Picked key': {
    args: { os: 'mac', ...layerDefaults, key: 'h' },
    argTypes: { os: osArg, ...layerArgs, key: select('key', pickable) },
    markup: ({ os, key, ...args }) => `<div class="kanso-story__slice kanso-story__settings">${pickedKey({ os, layer: keyLayer(os, args[`${os}Layer`]), picked: key })}</div>`,
  },
  'Compositions/Keyboard/Shortcut row': {
    args: { name: 'Pin the pane', chords: '⌥⌘P', state: 'rest', hover: false },
    argTypes: {
      name: { name: 'does', control: { type: 'text' } },
      chords: { name: 'chords, comma between', control: { type: 'text' } },
      state: select('state', shortcutRowStates),
      hover: { name: 'hover', control: { type: 'boolean' } },
    },
    markup: ({ chords, ...args }) => `<div class="kanso-story__slice kanso-story__settings">${shortcutRow({ ...args, chords: chords.split(',').map((chord) => chord.trim()).filter(Boolean),
      taken: { chord: '⌥⌘J', name: 'Pane below' }, source: 'keys.json: EACCES: permission denied', agent: 'checkout' })}</div>`,
  },
  'Compositions/Keyboard': {
    args: { os: 'mac', ...layerDefaults, key: 'h', hover: 'none' },
    argTypes: { os: osArg, ...layerArgs, key: select('picked', pickable), hover: select('hover', ['none', ...keyNames()]) },
    markup: ({ os, key, hover, ...args }) => keyboardExplorer({ os, layer: keyLayer(os, args[`${os}Layer`]), picked: key, hover }),
  },
  'Compositions/Sidebar/Session row': {
    args: { program: 'p-claude', name: 'Atlas', activity: 'Reviewing step 01', time: '3m', place: '', status: 'working', depth: 1, current: false, pinned: false, commands: 0, hover: false, focus: false, dimmed: false },
    argTypes: {
      program: select('program', ['p-claude', 'p-codex', 'lu-terminal']),
      name: { name: 'name', control: { type: 'text' } },
      activity: { name: 'activity', control: { type: 'text' } },
      time: { name: 'time', control: { type: 'text' } },
      place: { name: 'project', control: { type: 'text' } },
      status: select('mark', ['none', 'working', 'blocked', 'done', 'idle']),
      depth: { name: 'depth', control: { type: 'inline-radio' }, options: [0, 1, 2] },
      current: { name: 'current', control: { type: 'boolean' } },
      pinned: { name: 'pinned', control: { type: 'boolean' } },
      commands: { name: 'commands', control: { type: 'number', min: 0 } },
      hover: { name: 'hover', control: { type: 'boolean' } },
      focus: { name: 'focus', control: { type: 'boolean' } },
      dimmed: { name: 'dimmed', control: { type: 'boolean' } },
    },
    markup: (args) => inSidebar(sessionRow(args)),
  },
  'Compositions/Sidebar/Project row': {
    args: { name: 'kansō', folder: 'herdr-kanso', branch: 'main', sync: '↓12', open: false, status: 'blocked', count: 0, hover: false, focus: false },
    argTypes: {
      name: { name: 'name', control: { type: 'text' } },
      folder: { name: 'folder', control: { type: 'text' } },
      branch: { name: 'branch', control: { type: 'text' } },
      sync: { name: 'sync', control: { type: 'text' } },
      open: { name: 'open', control: { type: 'boolean' } },
      count: { name: 'folded count', control: { type: 'number', min: 0 } },
      status: { ...select('mark', ['blocked', 'working', 'done', 'idle']), if: { arg: 'count' } },
      hover: { name: 'hover', control: { type: 'boolean' } },
      focus: { name: 'focus', control: { type: 'boolean' } },
    },
    markup: (args) => inSidebar(projectRow(args)),
  },
  'Compositions/Sidebar/Computer row': {
    args: { name: 'dark', remote: true, state: 'on', status: 'blocked', count: 0, hover: false, focus: false },
    argTypes: {
      name: { name: 'name', control: { type: 'text' } },
      remote: { name: 'remote', control: { type: 'boolean' } },
      state: select('state', computerStates),
      count: { name: 'folded count', control: { type: 'number', min: 0 } },
      status: { ...select('mark', ['blocked', 'working', 'done', 'idle']), if: { arg: 'count' } },
      hover: { name: 'hover', control: { type: 'boolean' } },
      focus: { name: 'focus', control: { type: 'boolean' } },
    },
    markup: (args) => inSidebar(computerRow(args)),
  },
  'Compositions/Sidebar/Asleep': {
    args: { names: ['site', 'dojo'], open: false },
    argTypes: { names: { name: 'names', control: { type: 'object' } }, open: { name: 'open', control: { type: 'boolean' } } },
    markup: (args) => inSidebar(asleep(args)),
  },
  'Compositions/Sidebar/Section': {
    args: { title: 'Needs you', status: 'blocked', count: 0 },
    argTypes: { title: { name: 'title', control: { type: 'text' } }, status: select('mark', ['none', 'blocked']), count: { name: 'count', control: { type: 'number', min: 0 } } },
    markup: (args) => inSidebar(section(args)),
  },
  'Compositions/Sidebar/View switch': {
    args: { view: 'spaces', column: false },
    argTypes: { view: { name: 'view', control: { type: 'inline-radio' }, options: views.map((item) => item.key) }, column: { name: 'column', control: { type: 'boolean' } } },
    markup: (args) => (args.column ? inRail : inSidebar)(viewSwitch(args)),
  },
  'Compositions/Sidebar/Tile': {
    args: { initial: 'A', tone: 'teal', status: 'blocked', count: 4, open: false },
    argTypes: {
      initial: { name: 'initial', control: { type: 'text' } },
      tone: select('tone', ['', 'teal', 'yellow', 'blue', 'violet', 'green', 'red']),
      status: select('mark', ['none', 'blocked', 'working', 'done', 'idle']),
      count: { name: 'count', control: { type: 'number', min: 0 } },
      open: { name: 'open', control: { type: 'boolean' } },
    },
    markup: (args) => inRail(tile(args)),
  },
  'Compositions/Sidebar/Footer': {
    args: { update: '' },
    argTypes: { update: { name: 'update', control: { type: 'text' } } },
    markup: (args) => inSidebar(sidebarFooter(args)),
  },
  'Compositions/Sidebar': {
    args: { collapsed: false, dawn: false, art: true, view: 'spaces', switcher: true, menu: false },
    argTypes: {
      collapsed: { name: 'collapsed', control: { type: 'boolean' } },
      dawn: { name: 'Dawn Mode', control: { type: 'boolean' } },
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'dawn' } },
      switcher: { name: 'view switch', control: { type: 'boolean' } },
      view: { name: 'view', control: { type: 'inline-radio' }, options: views.map((item) => item.key) },
      menu: { name: 'views menu', control: { type: 'boolean' }, if: { arg: 'collapsed' } },
    },
    markup: sampleSidebar,
  },
  'Compositions/Status bar/Item': {
    args: { icon: 'lu-container', mark: 'none', text: '1', tone: 'blocked', pending: false },
    argTypes: {
      icon: select('icon', icons),
      mark: select('mark', ['none', 'working', 'blocked', 'done', 'idle']),
      text: { name: 'text', control: { type: 'text' } },
      tone: select('tone', ['', 'working', 'blocked', 'done']),
      pending: { name: 'pending', control: { type: 'boolean' } },
    },
    markup: ({ icon, mark: status, ...args }) => inBar(520, { right: [statusItem({ ...args, icon: icon === 'none' ? '' : icon, mark: status === 'none' ? '' : status })] }),
  },
  'Compositions/Status bar/Computer item': {
    args: { name: 'devbox', remote: true, state: 'on', folded: false },
    argTypes: {
      name: { name: 'name', control: { type: 'text' } },
      remote: { name: 'remote', control: { type: 'boolean' } },
      state: select('state', computerItemStates),
      folded: { name: 'folded', control: { type: 'boolean' } },
    },
    markup: (args) => inBar(520, { left: [computerItem(args)] }),
  },
  'Compositions/Status bar/Needs you item': {
    args: { name: 'cart-ui', question: 'Run pnpm add react-countdown@2.3?', more: 1 },
    argTypes: {
      name: { name: 'name', control: { type: 'text' } },
      question: { name: 'question', control: { type: 'text' } },
      more: { name: 'more waiting', control: { type: 'number', min: 0 } },
    },
    markup: (args) => inBar(760, { right: [needsItem(args)] }),
  },
  'Compositions/Status bar': {
    args: { width: 1040, computer: false, paused: false, stepper: false, needs: true, memory: false, panels: false, open: 'none' },
    argTypes: {
      width: { name: 'width', control: { type: 'inline-radio' }, options: barWidths },
      computer: { name: 'computer', control: { type: 'boolean' } },
      paused: { name: 'layout paused', control: { type: 'boolean' } },
      stepper: { name: 'stepper hovered', control: { type: 'boolean' }, if: { arg: 'paused', truthy: false } },
      needs: { name: 'needs you', control: { type: 'boolean' } },
      memory: { name: 'memory low', control: { type: 'boolean' } },
      panels: { name: 'servers, containers, reviews', control: { type: 'boolean' } },
      open: { ...select('open', ['none', ...Object.keys(statusMenus)]), if: { arg: 'panels' } },
    },
    markup: ({ width, computer, paused, stepper: hover, needs, memory, panels, open }) => (panels && open !== 'none' ? (html) => `<div class="kanso-story__popup-room">${html}</div>` : String)(inBar(width, {
      left: computer ? [computerItem({ name: 'devbox' })] : [],
      middle: paused ? layoutPaused() : stepper({ hover }),
      right: [needs && needsItem({ name: 'cart-ui', question: 'Run pnpm add react-countdown@2.3?', more: 1 }), memory && statusItem({ text: 'Memory 8% free', tone: 'blocked' }), ...(panels ? statusPanels({ open }) : []), paletteDoor()].filter(Boolean),
      popup: panels && open !== 'none' ? statusMenus[open]() : '',
    })),
  },
  'Compositions/Activity': {
    args: { events: 3, row: 'none', menu: false, docked: false },
    argTypes: {
      events: { name: 'events', control: { type: 'number', min: 0, max: 6 } },
      row: { name: 'second row', control: { type: 'inline-radio' }, options: ['none', 'hover', 'focus'] },
      menu: { name: 'right-click menu', control: { type: 'boolean' } },
      docked: { name: 'in the sidebar', control: { type: 'boolean' } },
    },
    markup: ({ events, row: state, menu: open, docked }) => {
      const all = [
        { icon: 'lu-git-pull-request', subject: 'PR #166', fact: 'merged', age: '32m' },
        { icon: 'lu-git-pull-request', tone: 'blocked', subject: 'PR #165', fact: 'checks failed', detail: 'test / unit · Run pnpm test', age: '9m' },
        { icon: 'lu-moon', subject: 'Orion', fact: 'went to sleep', age: '1h' },
        { icon: 'e-done', tone: 'done', subject: 'Iris', fact: 'finished', detail: 'Boards 01 to 04 done', age: '12m' },
        { icon: 'lu-check', tone: 'done', subject: 'PR #164', fact: 'approved', age: '41m' },
        { icon: 'lu-git-pull-request', subject: 'PR #163', fact: 'merged', age: '2h' },
      ];
      const card = activity({ events: all.slice(0, events), hover: state === 'hover' ? 1 : -1, focus: state === 'focus' ? 1 : -1 }) ?? '';
      const menu = open && events ? activityMenu() : '';
      return docked ? sampleSidebar({ away: card }) + menu : `<div class="kanso-story__slice">${card}${menu}</div>`;
    },
  },
  'Compositions/State patterns': {
    args: { state: 'failure', menu: false },
    argTypes: {
      state: { name: 'state', control: { type: 'inline-radio' }, options: statePatterns },
      menu: { name: 'right-click menu', control: { type: 'boolean' }, if: { arg: 'state', eq: 'failure' } },
    },
    markup: ({ state, menu: open }) => {
      const at = (place, markup) => `<p class="kanso-story__caption">${place}</p>${markup}`;
      const slice = (...parts) => `<div class="kanso-story__slice">${parts.join('')}</div>`;
      const panel = (markup) => `<div class="kanso-panel kanso-story__panel">${markup}</div>`;
      const source = 'ssh: connect to host dark port 22: Operation timed out';
      return {
        failure: () => at('Status bar', inBar(520, { left: [computerItem({ name: 'dark', state: 'unreachable' })] }))
          + at('Sidebar', slice(computerRow({ name: 'dark', state: 'unreachable' }), open ? failureMenu({ source, fixes: ['Refresh', 'Sign in…'], agent: 'Atlas' }) : ''))
          + at('Panel', panel(failureBlock({ text: "Can't list worktrees on dark", source: 'git worktree list: timed out after 30 s', fix: 'Refresh', agent: 'Atlas' })))
          + at('Toast', toast({ level: 'error', icon: 'none', title: "Couldn't pull checkout", action: 'Retry' })),
        empty: () => at('Panel', panel(emptyState({ icon: 'lu-git-pull-request', text: 'No pull requests on this branch', action: 'Create' }))),
        pending: () => at('Status bar', inBar(520, { left: [computerItem({ name: 'devbox', state: 'pending' })] }))
          + at('Sidebar', slice(row({ name: 'acme-shop', heading: true, detail: [{ icon: 'lu-git-branch', text: 'main' }, '↓0'], pending: true })))
          + at('Panel', panel(row({ name: 'Approved, with 2 line comments', meta: 'now', pending: true }))),
        loading: () => at('Sidebar', slice(skeletonOf({ shape: 'row', count: 3 }))) + at('Panel', panel(skeletonOf({ shape: 'list row', count: 3 }))),
      }[state]();
    },
  },
  'Compositions/Tab bar': {
    args: { width: 1040, value: 'checkout', panel: 'none', state: 'connected', folded: 0, overflow: false, windows: false },
    argTypes: {
      width: { name: 'width', control: { type: 'inline-radio' }, options: barWidths.slice(1) },
      value: { name: 'chosen tab', control: { type: 'inline-radio' }, options: ['checkout', 'cart-ui', 'tests'] },
      panel: select('open door', ['none', ...panelDoors.map((item) => item.key)]),
      state: { name: 'computer', control: { type: 'inline-radio' }, options: tabBarStates },
      folded: { name: 'folded tabs', control: { type: 'number', min: 0, max: 5 } },
      overflow: { name: 'folded menu open', control: { type: 'boolean' }, if: { arg: 'folded' } },
      windows: { name: 'Windows and Linux', control: { type: 'boolean' } },
    },
    markup: ({ width, value, panel, folded, ...args }) => atWidth(width, tabBar({
      ...args, value, panel, items: [{ key: 'checkout', label: 'checkout' }, { key: 'cart-ui', label: 'cart-ui', mark: value === 'cart-ui' ? '' : 'blocked' }, { key: 'tests', label: 'tests' }],
      folded: ['perf', 'web', 'e2e', 'storybook', 'seed-data'].slice(0, folded).map((label) => ({ label })),
    })),
  },
  'Compositions/Edges': {
    args: { side: 'right', panes: 3, stacked: false, drop: false, waiting: 'none', overflow: false },
    argTypes: {
      side: { name: 'side', control: { type: 'inline-radio' }, options: ['left', 'right'] },
      panes: { name: 'panes past the edge', control: { type: 'number', min: 1, max: 10 } },
      stacked: { name: 'first column stacked', control: { type: 'boolean' } },
      drop: { name: 'dragging over', control: { type: 'boolean' } },
      waiting: { name: 'Needs you hovered', control: { type: 'inline-radio' }, options: ['none', 'nearest', 'farthest'] },
      overflow: { name: 'folded menu open', control: { type: 'boolean' } },
    },
    markup: ({ side, panes, stacked, drop, waiting, overflow }) => {
      const lit = { none: -1, nearest: 0, farthest: panes - 1 }[waiting];
      const list = Array.from({ length: panes }, (_, index) => ({ name: `pane ${index + 1}`, program: ['p-claude', 'p-codex', 'lu-terminal'][index % 3], lit: index === lit }));
      const columns = stacked && list.length > 1 ? [list.slice(0, 2), ...list.slice(2).map((item) => [item])] : list.map((item) => [item]);
      return `<div class="kanso-story__strip${side === 'right' ? ' kanso-story__strip--end' : ''}">${edge({ side, columns, drop, overflow })}</div>`;
    },
  },
  'Primitives/Switch': {
    args: { checked: false, label: 'Toggle', disabled: false },
    argTypes: {
      checked: { name: 'checked', control: { type: 'boolean' } },
      label: { name: 'label', control: { type: 'text' } },
      disabled: { name: 'disabled', control: { type: 'boolean' } },
    },
    markup: toggle,
  },
  'Primitives/Row': {
    args: { icon: 'lu-file', name: 'checkout.ts', detail: 'src/api', meta: '+14 −3', mark: 'none', second: '', heading: false, depth: 0, tools: false, current: false, selected: false, hover: false, focus: false, dimmed: false, pending: false },
    argTypes: {
      icon: select('icon', icons.concat(['p-claude', 'p-codex'])),
      name: { name: 'name', control: { type: 'text' } },
      detail: { name: 'detail', control: { type: 'text' } },
      meta: { name: 'meta', control: { type: 'text' } },
      mark: select('mark', ['none', ...Object.keys(marks)]),
      second: { name: 'second', control: { type: 'text' } },
      heading: { name: 'heading', control: { type: 'boolean' } },
      depth: { name: 'depth', control: { type: 'inline-radio' }, options: rowDepths },
      tools: { name: 'tools on hover', control: { type: 'boolean' } },
      current: { name: 'current', control: { type: 'boolean' } },
      selected: { name: 'selected', control: { type: 'boolean' } },
      hover: { name: 'hover', control: { type: 'boolean' } },
      focus: { name: 'focus', control: { type: 'boolean' } },
      dimmed: { name: 'dimmed', control: { type: 'boolean' } },
      pending: { name: 'pending', control: { type: 'boolean' } },
    },
    markup: ({ tools, ...args }) => `<div class="kanso-panel">${row({ ...args, actions: tools ? [{ icon: 'lu-pin', label: 'Pin' }, { icon: 'lu-ellipsis', label: 'More' }] : [] })}</div>`,
  },
  'Primitives/Skeleton': {
    args: { shape: 'row', count: 3 },
    argTypes: {
      shape: select('shape', Object.keys(skeletonShapes)),
      count: { name: 'count', control: { type: 'range', min: 1, max: 6 }, if: { arg: 'shape', neq: 'header' } },
    },
    markup: (args) => `<div class="kanso-panel">${skeletonOf(args)}</div>`,
  },
  'Primitives/Tab': {
    args: {
      items: [
        { key: 'spaces', label: 'Projects', icon: 'lu-folder', tip: 'Projects ⌃1' },
        { key: 'agents', label: 'Status', icon: 'lu-activity', dot: true, tip: 'Status ⌃2' },
        { key: 'threads', label: 'Threads', icon: 'lu-message-square', tip: 'Threads ⌃3' },
      ],
      value: 'spaces',
      size: 'md',
      track: false,
      disabled: false,
      icon: true,
      label: true,
    },
    argTypes: {
      items: { name: 'items', control: { type: 'object' }, description: '{ key, label, icon, mark, dot, tip, closable, armed }' },
      value: { name: 'value', control: { type: 'text' } },
      size: select('size', ['sm', 'md', 'lg']),
      track: { name: 'track', control: { type: 'boolean' } },
      disabled: { name: 'disabled', control: { type: 'boolean' } },
      icon: { name: 'icon', control: { type: 'boolean' } },
      label: { name: 'label', control: { type: 'boolean' } },
    },
    markup: tabs,
  },
  'Primitives/Thumbnail': {
    args: { image: 'https://images.placeholders.dev/120x80', label: 'cart-countdown.png', selected: false, loading: false },
    argTypes: {
      image: { name: 'image', control: { type: 'text' } },
      label: { name: 'label', control: { type: 'text' } },
      selected: { name: 'selected', control: { type: 'boolean' } },
      loading: { name: 'loading', control: { type: 'boolean' } },
    },
    markup: thumbnail,
  },
  'Primitives/Toast': {
    args: { level: 'error', icon: 'none', title: "Can't reach devbox", body: '', action: 'Refresh', explain: '' },
    argTypes: {
      level: select('level', Object.keys(levels)),
      icon: { ...select('icon', icons), description: "Any icon; it takes the level's colour" },
      title: { name: 'title', control: { type: 'text' } },
      body: { name: 'body', control: { type: 'text' } },
      action: { name: 'action', control: { type: 'text' } },
      explain: { name: 'explain', control: { type: 'text' }, description: 'The session an error can be explained to' },
    },
    markup: toast,
  },
  'Primitives/Tooltip': {
    args: { text: 'Adding up', detail: '14 repositories to go', key: '', icon: 'lu-refresh-cw', side: 'auto', open: true },
    argTypes: {
      text: { name: 'text', control: { type: 'text' } },
      detail: { name: 'detail', control: { type: 'text' } },
      key: { name: 'key', control: { type: 'text', maxLength: 6 } },
      icon: { ...select('icon', icons.filter((id) => id !== 'none')), description: 'The unnamed control it names' },
      side: { ...select('side', sides), description: 'Auto: the side with the most room around the control' },
      open: { name: 'open', control: { type: 'boolean' }, description: 'Off: shown on hover and keyboard focus' },
    },
    markup: tooltip,
  },
  'Primitives/Card': {
    args: { author: 'sam', image: '', age: '1h', body: 'Batches of 50, flushed every 2 s.', loading: false },
    argTypes: {
      author: { name: 'Author', control: { type: 'text' } },
      image: { name: 'Image URL', control: { type: 'text' } },
      age: { name: 'Age', control: { type: 'text' } },
      body: { name: 'Body', control: { type: 'text' } },
      loading: { name: 'Loading', control: { type: 'boolean' } },
    },
    markup: (args) => `<div class="kanso-panel">${card(args)}</div>`,
  },
};

export const playgroundStory = ({ args, argTypes, markup }) => ({
  name: 'Variants',
  args,
  argTypes,
  render: (values) => frame(markup(values)),
  parameters: { docs: { source: { type: 'dynamic', transform: (_code, context) => markup(context.args) } } },
});
