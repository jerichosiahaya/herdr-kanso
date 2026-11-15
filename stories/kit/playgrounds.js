// Pages whose story is built from Storybook controls instead of drawn states.
import sprite from '../proto-sprite.svg?raw';
import { activity, activityMenu, computerMenuStates, asleep, paneFolds, paneHeader, panelHeaderForms, panelLooks, paneReaches, paneStates, noticeHomes, noticePlaces, noticeStates, systemMessage, toastStack, heldChord, keyboard, keyboardExplorer, keyboards, keyboardSystems, keyNames, shortcutRowStates, channelSettings, channels, computerItemStates, computerRow, computerStates, header, panelDoors, projectRow, section, sessionRow, sidebarFooter, tabBarStates, tile, toolbar, views, viewSwitch } from './compositions.js';
import { avatar, avatarSizes, button, card, chip, code, dawn, dialog, escape, input, keycapStates, keyHint, kinds, levels, mark, markdown, marks, markSizes, menu, metric, row, rowDepths, sides, skeletonOf, skeletonShapes, stack, statePatterns, tabs, thumbnail, toast, toggle, tooltip, windowControls } from './pieces.js';
import { barWidths, captioned, inSettings, inSlice } from './frames.js';
import { panelPlaygrounds } from './panel-states.js';
import { arrangementViews, dialogBodies, newInCases, openWithCases, dialogNotes, edgeSides, layerDefaults, memoryShown, needsShown, panelContents, panelReads, panelRowLooks, paneMoments, projectRefusals, sendReach, sleepCases, statedPages, stepperShown, tabActs, worktreeRefusals } from './states.js';
import { appNotices, keyLayer, keyLayerMods, sampleNotices, samplePanelHeader, sampleSidebar, statusMenus } from './samples.js';

const icons = ['none', ...[...sprite.matchAll(/id="(lu-[^"]+)"/g)].map(([, id]) => id).sort()];
const frame = (markup) => `<div class="kanso-story"><div class="kanso-story__theme kanso-story__frame kanso-story--free">${markup}</div></div>`;

const inSidebar = (markup) => stack({ variant: 'sidebar frame' }, markup), inRail = (markup) => stack({ variant: 'rail frame' }, markup);
const select = (name, options) => ({ name, control: { type: 'select' }, options });
const text = (name) => ({ name, control: { type: 'text' } });
const flag = (name) => ({ name, control: { type: 'boolean' } });
// The Agent menu's controls an asleep row has none of.
const agentAwake = { arg: 'on', neq: 'an asleep row' };
// Controls several pages share, each named once.
const shared = {
  title: text('title'), scope: text('scope'), name: text('name'),
  program: { name: 'program', control: { type: 'select', labels: { 'p-claude': 'Claude Code', 'p-codex': 'Codex', 'lu-terminal': 'Terminal' } }, options: ['p-claude', 'p-codex', 'lu-terminal'] },
  view: { name: 'view', control: { type: 'inline-radio', labels: Object.fromEntries(views.map(({ key, label }) => [key, label])) }, options: views.map(({ key }) => key) },
  count: { name: 'folded count', control: { type: 'number', min: 0 } },
  status: { ...select('mark', ['blocked', 'working', 'done', 'idle']), if: { arg: 'count' } },
  hover: flag('hover'), focus: flag('focus'), dimmed: flag('dimmed'), remote: flag('remote'), selected: flag('selected'), loading: flag('loading'),
};
const pick = (...names) => Object.fromEntries(names.map((name) => [name, shared[name]]));

// One layer control per computer, each labelled the way that computer writes its modifiers.
const pickable = keyNames().filter((key) => !['ctrl', 'alt', 'shift', 'cmd'].includes(key));
const layerArgs = Object.fromEntries(keyboardSystems.map((os) => [`${os}Layer`, { name: 'layer', control: { type: 'select', labels: Object.fromEntries(keyLayerMods[os].map((mods) => [mods, mods === 'lists' ? 'Lists' : heldChord({ os, held: mods.split(' ') })])) }, options: keyLayerMods[os], if: { arg: 'os', eq: os } }]));
const osArg = { name: 'computer', control: { type: 'inline-radio' }, options: keyboardSystems };

export const playgrounds = {
  'Primitives/Button': {
    args: { label: 'Create', kind: 'solid', size: 'md', icon: 'none', disabled: false, armed: false, verb: '', active: false, spin: false },
    argTypes: {
      label: text('label'),
      kind: select('kind', Object.keys(kinds)),
      size: select('size', ['sm', 'md', 'lg']),
      icon: select('icon', icons),
      disabled: flag('disabled'),
      armed: flag('armed'),
      verb: { name: 'verb', control: { type: 'text' }, if: { arg: 'armed' } },
      active: flag('active'),
      spin: flag('spin'),
    },
    markup: button,
  },
  'Primitives/Avatar': {
    args: { initial: 'S', image: '', size: 'md', tone: '' },
    argTypes: {
      initial: text('Initial'),
      image: text('Image URL'),
      size: select('Size', Object.keys(avatarSizes)),
      tone: select('Tone', ['', 'teal', 'yellow', 'blue', 'violet', 'green', 'red']),
    },
    markup: avatar,
  },
  'Primitives/Chip': {
    args: { label: '3 files', quiet: false },
    argTypes: { label: text('Label'), quiet: flag('quiet') },
    markup: chip,
  },
  'Primitives/Code': {
    args: { text: 'export function bucket(customer) {\n  const plan = planOf(customer);\n  return { plan, tokens: LIMIT[plan] };\n}', kind: 'source', first: 11, line: 12 },
    argTypes: {
      text: text('Code'),
      kind: select('Kind', ['source', 'diff', 'snippet', 'log']),
      first: { name: 'First line', control: { type: 'number', min: 1 } },
      line: { name: 'Highlighted line', control: { type: 'number', min: 0 } },
    },
    markup: (args) => `<div class="kanso-panel">${code(args)}</div>`,
  },
  'Primitives/Dialog': {
    ...statedPages['Primitives/Dialog'],
    argTypes: {
      ...pick('title', 'scope'),
      body: { name: 'body', control: { type: 'inline-radio' }, options: Object.keys(dialogBodies) },
      notes: { name: 'under the body', control: { type: 'inline-radio' }, options: Object.keys(dialogNotes) },
      secondary: text('Cancel'),
      primary: text('primary'),
      state: { ...select('primary state', ['default', 'disabled', 'loading', 'armed']), if: { arg: 'loading', truthy: false } },
      loading: flag('content loading'),
    },
  },
  'Primitives/Drag handle': {
    args: { state: 'default' },
    argTypes: { state: select('State', ['default', 'hover']) },
    markup: ({ state }) => `<svg class="kanso-icon kanso-icon--row kanso-grip${state === 'default' ? '' : ' kanso-text--fg'}"><title>Hold and drag onto another pane to move this one there</title><use href="#lu-grip-vertical"/></svg>`,
  },
  'Primitives/Field': {
    args: { text: '', label: 'Comment', icon: 'lu-send', action: '', choose: false, focus: false, error: false, disabled: false, multiline: false, inline: false, selected: false, loading: false, limit: 80 },
    argTypes: {
      text: text('text'),
      label: text('label'),
      icon: select('icon', icons),
      action: { name: 'word action', control: { type: 'text' }, description: 'Replaces the icon; shown once something is typed' },
      choose: { name: 'filled by a chooser', control: { type: 'boolean' }, description: 'Not typed: its word always shows' },
      focus: flag('focus'),
      error: flag('error'),
      disabled: flag('disabled'),
      multiline: flag('multiline'),
      inline: flag('inline'),
      ...pick('selected', 'loading'),
      limit: { name: 'limit', control: { type: 'number', min: 1 } },
    },
    markup: input,
  },
  'Primitives/Key hint': {
    args: { text: '⌘↵', faint: false, recording: false },
    argTypes: {
      text: { name: 'text', control: { type: 'text', maxLength: 6 } },
      faint: flag('faint'),
      recording: flag('recording'),
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
      source: text('Markdown'),
      state: select('Block state', ['rest', 'hover', 'editing']),
      block: { name: 'Block', control: { type: 'number', min: 1 }, if: { arg: 'state', neq: 'rest' } },
    },
    markup: (args) => `<div class="kanso-panel">${markdown(args)}</div>`,
  },
  'Primitives/Menu': {
    ...statedPages['Primitives/Menu'],
    argTypes: {
      title: text('title'),
      values: flag('items with values'),
      apps: { ...flag('apps with their pictures'), if: { arg: 'values', truthy: false } },
      picker: { ...flag('a picker with a field'), if: { arg: 'values', truthy: false } },
      choices: { ...flag('choices on two lines'), if: { arg: 'values', truthy: false } },
      headings: { ...flag('groups with headings'), if: { arg: 'values', truthy: false } },
      run: flag('a run that scrolls'),
      keys: { ...flag('keyboard on an item'), if: { arg: 'values', truthy: false } },
      armed: { ...flag('Delete armed'), if: { arg: 'values', truthy: false } },
      badge: { ...flag('a count on an item'), if: { arg: 'values', truthy: false } },
      mark: { ...flag('a mark on an item'), if: { arg: 'values', truthy: false } },
      titleMark: select('a mark on the title', ['none', ...Object.keys(marks)]),
      reading: flag('items still reading'),
      refused: flag('the read refused'),
    },
  },
  'Primitives/Metric': {
    args: { value: '31%', unit: 'free of 16 GB · 2.4 GB swap', facts: '14 tasks | $2.94 a task | 9.1M tokens', loading: false },
    argTypes: {
      value: text('Value'),
      unit: text('Unit'),
      facts: text('Facts (separated by |)'),
      loading: flag('Loading'),
    },
    markup: (args) => `<div class="kanso-panel">${metric(args)}</div>`,
  },
  'Primitives/Window controls': { args: {}, argTypes: {}, markup: windowControls },
  'Primitives/Dawn': { args: {}, argTypes: {}, markup: () => dawn() },
  'Compositions/Add computer dialog': {
    ...statedPages['Compositions/Add computer dialog'],
    argTypes: {
      config: flag('hosts in the config'),
      added: { name: 'after Add', control: { type: 'boolean' }, if: { arg: 'config' } },
      typed: text('typed'),
    },
  },
  'Compositions/Open with menu': {
    ...statedPages['Compositions/Open with menu'],
    argTypes: { situation: { ...select('situation', Object.keys(openWithCases)) } },
  },
  'Compositions/New conversation menu': {
    ...statedPages['Compositions/New conversation menu'],
    argTypes: { situation: { ...select('situation', [...Object.keys(newInCases), 'pick a project']) } },
  },
  'Compositions/Computer menu': {
    ...statedPages['Compositions/Computer menu'],
    argTypes: {
      state: { name: 'computer', control: { type: 'inline-radio' }, options: computerMenuStates },
      sync: { name: 'sync', control: { type: 'inline-radio' }, options: ['off', 'on', 'saving'], if: { arg: 'state', eq: 'on' } },
      refused: { name: 'refused', control: { type: 'inline-radio' }, options: ['nothing', 'power', 'sync'] },
    },
  },
  'Compositions/Project menu': {
    ...statedPages['Compositions/Project menu'],
    argTypes: {
      tabs: { name: 'open tabs', control: { type: 'number', min: 0 } },
      worktrees: flag('worktrees'), asleep: flag('tabs asleep'), kept: flag('kept as a project'),
      missing: flag('folder missing'), gone: flag('gone'), armed: flag('remove armed'),
    },
  },
  'Compositions/Settings menu': {
    ...statedPages['Compositions/Settings menu'],
    argTypes: { update: flag('Herdr update waiting'), armed: { ...flag('restart armed'), if: { arg: 'update' } } },
  },
  'Compositions/Pane menu': {
    ...statedPages['Compositions/Pane menu'],
    argTypes: {
      name: text('title'), state: select('agent', paneStates), pinned: flag('pinned'), zoomed: flag('zoomed'), parent: flag('opened from a conversation'),
      program: flag('right-clicks to the program'), armed: flag('close armed'), keyboard: flag('keyboard'),
    },
  },
  'Compositions/Agent menu': {
    ...statedPages['Compositions/Agent menu'],
    argTypes: {
      on: { name: 'on', control: { type: 'inline-radio' }, options: ['an agent', 'a thread', 'an asleep row'] },
      pinned: { ...flag('pinned'), if: agentAwake },
      away: { name: 'put away', control: { type: 'inline-radio' }, options: ['no', 'snoozed', 'settled'], if: { arg: 'on', eq: 'a thread' } },
      armed: { ...flag('close armed'), if: agentAwake },
      opened: { name: 'opened', control: { type: 'inline-radio' }, options: ['none', 'Snooze', 'Move to project', 'Copy'], if: agentAwake },
    },
  },
  'Compositions/Arrangements dialog': {
    ...statedPages['Compositions/Arrangements dialog'],
    argTypes: { view: { name: 'what it shows', control: { type: 'select' }, options: Object.keys(arrangementViews) } },
  },
  'Compositions/Prompt dialog': {
    ...statedPages['Compositions/Prompt dialog'],
    argTypes: {
      title: text('title'),
      scope: text('where'),
      text: text('typed'),
      fallback: text('falls back to'),
      action: text('primary'),
    },
  },
  'Compositions/New project dialog': {
    ...statedPages['Compositions/New project dialog'],
    argTypes: {
      folder: text('folder'),
      name: text('name'),
      refusal: { name: 'refused', control: { type: 'inline-radio' }, options: Object.keys(projectRefusals) },
      created: flag('after Create'),
    },
  },
  'Compositions/New worktree dialog': {
    ...statedPages['Compositions/New worktree dialog'],
    argTypes: {
      branch: text('branch'),
      computer: { name: 'computer', control: { type: 'inline-radio' }, options: ['here', 'devbox'] },
      exists: flag('branch exists'),
      making: flag('making'),
      refusal: { name: 'git refused', control: { type: 'inline-radio' }, options: Object.keys(worktreeRefusals) },
    },
  },
  'Compositions/Send dialog': {
    ...statedPages['Compositions/Send dialog'],
    argTypes: {
      reach: { name: 'who it can reach', control: { type: 'inline-radio' }, options: Object.keys(sendReach) },
      chosen: { name: 'chosen', control: { type: 'inline-radio' }, options: ['tests', 'acme-shop'] },
      message: text('message'),
      unreachable: flag('a computer unreachable'),
      sending: flag('sending'),
      refused: flag('refused'),
    },
  },
  'Compositions/Sleep dialog': {
    ...statedPages['Compositions/Sleep dialog'],
    argTypes: { situation: { name: 'situation', control: { type: 'select' }, options: Object.keys(sleepCases) } },
  },
  'Compositions/Toolbar': {
    ...statedPages['Compositions/Toolbar'],
    argTypes: {
      ...pick('view'),
      column: flag('collapsed'),
      open: { name: 'tools open', control: { type: 'boolean' }, if: { arg: 'column' } },
      sorted: flag('sorted'),
      menu: flag('Sort menu'),
      add: flag('+ menu'),
    },
  },
  'Compositions/Header': {
    args: { collapsed: false, dawn: false, art: true },
    argTypes: { collapsed: flag('collapsed'), dawn: flag('Dawn Mode'),
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'dawn' } } },
    markup: header,
  },
  'Compositions/Dawn Mode': {
    args: { channel: 'dawn', art: true, collapsed: false },
    argTypes: {
      channel: { name: 'channel', control: { type: 'inline-radio' }, options: channels.map((item) => item.key) },
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'channel', eq: 'dawn' } },
      collapsed: flag('collapsed'),
    },
    markup: ({ channel, art, collapsed }) => captioned('Sidebar header', header({ collapsed, dawn: channel === 'dawn', art }))
      + captioned('Settings · Updates', inSettings(channelSettings({ channel, art }))),
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
      ...pick('program', 'name'),
      state: select('state', paneStates),
      focused: flag('focused'),
      keyboard: flag('focus from the keyboard'),
      hover: flag('pointer on it'),
      menu: flag('⋯ open'),
      pinned: flag('pinned'),
      zoomed: { name: 'zoomed', control: { type: 'boolean' }, if: { arg: 'menu' } },
      reach: { name: 'computer', control: { type: 'inline-radio' }, options: paneReaches },
      held: flag('held to move'),
      armed: { name: 'close armed', control: { type: 'boolean' }, if: { arg: 'hover' } },
      renaming: flag('renaming'),
      elsewhere: flag('folder differs from the tab'),
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
    ...statedPages['Compositions/Keyboard/Key'],
    argTypes: {
      label: { name: 'label', control: { type: 'text', maxLength: 3 } },
      units: { name: 'width in keys', control: { type: 'inline-radio' }, options: [...new Set(Object.values(keyboards).flatMap(({ rows }) => rows.flat().map(([, units = 1]) => units)))].sort((a, b) => a - b) },
      state: select('state', keycapStates),
      hover: flag('hover'),
    },
  },
  'Compositions/Keyboard/Picked key': {
    ...statedPages['Compositions/Keyboard/Picked key'],
    argTypes: { os: osArg, ...layerArgs, key: select('key', pickable) },
  },
  'Compositions/Keyboard/Shortcut row': {
    ...statedPages['Compositions/Keyboard/Shortcut row'],
    argTypes: {
      name: text('does'),
      chords: text('chords, comma between'),
      state: select('state', shortcutRowStates),
      hover: flag('hover'),
    },
  },
  'Compositions/Keyboard': {
    args: { os: 'mac', ...layerDefaults, key: 'h', hover: 'none' },
    argTypes: { os: osArg, ...layerArgs, key: select('picked', pickable), hover: select('hover', ['none', ...keyNames()]) },
    markup: ({ os, key, hover, ...args }) => keyboardExplorer({ os, layer: keyLayer(os, args[`${os}Layer`]), picked: key, hover }),
  },
  'Compositions/Sidebar/Session row': {
    args: { program: 'p-claude', name: 'Atlas', activity: 'Reviewing step 01', time: '3m', place: '', status: 'working', depth: 1, current: false, pinned: false, commands: 0, hover: false, focus: false, dimmed: false },
    argTypes: {
      ...pick('program', 'name'),
      activity: text('activity'),
      time: text('time'),
      place: text('project'),
      status: select('mark', ['none', 'working', 'blocked', 'done', 'idle']),
      depth: { name: 'depth', control: { type: 'inline-radio' }, options: [0, 1, 2] },
      current: flag('current'),
      pinned: flag('pinned'),
      commands: { name: 'commands', control: { type: 'number', min: 0 } },
      ...pick('hover', 'focus', 'dimmed'),
    },
    markup: (args) => inSidebar(sessionRow(args)),
  },
  'Compositions/Sidebar/Project row': {
    args: { name: 'kansō', folder: 'herdr-kanso', branch: 'main', sync: '↓12', open: false, status: 'blocked', count: 0, hover: false, focus: false },
    argTypes: {
      name: text('name'),
      folder: text('folder'),
      branch: text('branch'),
      sync: text('sync'),
      open: flag('open'),
      ...pick('count', 'status', 'hover', 'focus'),
    },
    markup: (args) => inSidebar(projectRow(args)),
  },
  'Compositions/Sidebar/Computer row': {
    args: { name: 'dark', remote: true, state: 'on', status: 'blocked', count: 0, hover: false, focus: false },
    argTypes: {
      ...pick('name', 'remote'),
      state: select('state', computerStates),
      ...pick('count', 'status', 'hover', 'focus'),
    },
    markup: (args) => inSidebar(computerRow(args)),
  },
  'Compositions/Sidebar/Asleep': {
    args: { names: ['site', 'dojo'], open: false },
    argTypes: { names: { name: 'names', control: { type: 'object' } }, open: flag('open') },
    markup: (args) => inSidebar(asleep(args)),
  },
  'Compositions/Sidebar/Section': {
    args: { title: 'Needs you', status: 'blocked', count: 0 },
    argTypes: { title: text('title'), status: select('mark', ['none', 'blocked']), count: { name: 'count', control: { type: 'number', min: 0 } } },
    markup: (args) => inSidebar(section(args)),
  },
  'Compositions/Sidebar/View switch': {
    args: { view: 'spaces', column: false },
    argTypes: { ...pick('view'), column: flag('column') },
    markup: (args) => (args.column ? inRail : inSidebar)(viewSwitch(args)),
  },
  'Compositions/Sidebar/Tile': {
    args: { initial: 'A', tone: 'teal', status: 'blocked', count: 4, open: false },
    argTypes: {
      initial: text('initial'),
      tone: select('tone', ['', 'teal', 'yellow', 'blue', 'violet', 'green', 'red']),
      status: select('mark', ['none', 'blocked', 'working', 'done', 'idle']),
      count: { name: 'count', control: { type: 'number', min: 0 } },
      open: flag('open'),
    },
    markup: (args) => inRail(tile(args)),
  },
  'Compositions/Sidebar/Footer': {
    args: { update: '' },
    argTypes: { update: text('update') },
    markup: (args) => inSidebar(sidebarFooter(args)),
  },
  'Compositions/Sidebar': {
    args: { collapsed: false, dawn: false, art: true, view: 'spaces', switcher: true, menu: false },
    argTypes: {
      collapsed: flag('collapsed'),
      dawn: flag('Dawn Mode'),
      art: { name: 'Dawn sky', control: { type: 'boolean' }, if: { arg: 'dawn' } },
      switcher: flag('view switch'),
      ...pick('view'),
      menu: { name: 'views menu', control: { type: 'boolean' }, if: { arg: 'collapsed' } },
    },
    markup: sampleSidebar,
  },
  'Compositions/Panel': {
    ...statedPages['Compositions/Panel'],
    argTypes: {
      ...pick('title', 'scope'),
      header: { name: 'header', control: { type: 'inline-radio' }, options: panelHeaderForms },
      state: { name: 'read', control: { type: 'inline-radio' }, options: Object.keys(panelReads) },
      look: { name: 'look', control: { type: 'inline-radio' }, options: panelLooks },
      content: select('body', Object.keys(panelContents)),
      last: { name: 'the last row', control: { type: 'inline-radio' }, options: Object.keys(panelRowLooks) },
    },
  },
  'Compositions/Panel/Header': {
    ...statedPages['Compositions/Panel/Header'],
    argTypes: {
      title: text('title'),
      form: { name: 'form', control: { type: 'inline-radio' }, options: panelHeaderForms },
      start: { name: 'before the title', control: { type: 'inline-radio' }, options: Object.keys(samplePanelHeader.starts) },
      second: text('second line'),
      tools: select('tools', Object.keys(samplePanelHeader.tools)),
    },
  },
  'Compositions/Status bar/Item': {
    ...statedPages['Compositions/Status bar/Item'],
    argTypes: {
      icon: select('icon', icons),
      mark: select('mark', ['none', 'working', 'blocked', 'done', 'idle']),
      text: text('text'),
      tone: select('tone', ['', 'working', 'blocked', 'done']),
      pending: flag('pending'),
    },
  },
  'Compositions/Status bar/Computer item': {
    ...statedPages['Compositions/Status bar/Computer item'],
    argTypes: {
      ...pick('name', 'remote'),
      state: select('state', computerItemStates),
      folded: flag('folded'),
    },
  },
  'Compositions/Status bar/Needs you item': {
    ...statedPages['Compositions/Status bar/Needs you item'],
    argTypes: {
      name: text('name'),
      question: text('question'),
      more: { name: 'more waiting', control: { type: 'number', min: 0 } },
    },
  },
  'Compositions/Status bar': {
    ...statedPages['Compositions/Status bar'],
    argTypes: {
      width: { name: 'width', control: { type: 'inline-radio' }, options: barWidths },
      computer: select('computer', ['none', ...computerItemStates]),
      paused: flag('layout paused'),
      stepper: { name: 'panes per view', control: { type: 'inline-radio' }, options: stepperShown, if: { arg: 'paused', truthy: false } },
      needs: { name: 'needs you', control: { type: 'inline-radio' }, options: Object.keys(needsShown) },
      memory: { name: 'memory low', control: { type: 'inline-radio' }, options: Object.keys(memoryShown) },
      panels: flag('servers, containers, reviews'),
      open: { ...select('open', ['none', ...Object.keys(statusMenus)]), if: { arg: 'panels' } },
    },
  },
  'Compositions/Activity': {
    args: { events: 3, row: 'none', menu: false, docked: false },
    argTypes: {
      events: { name: 'events', control: { type: 'number', min: 0, max: 6 } },
      row: { name: 'second row', control: { type: 'inline-radio' }, options: ['none', 'hover', 'focus'] },
      menu: flag('right-click menu'),
      docked: flag('in the sidebar'),
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
      return docked ? sampleSidebar({ away: card }) + menu : inSlice(card, menu);
    },
  },
  'Compositions/State patterns': {
    ...statedPages['Compositions/State patterns'],
    argTypes: {
      state: { name: 'state', control: { type: 'inline-radio' }, options: statePatterns },
      menu: { name: 'right-click menu', control: { type: 'boolean' }, if: { arg: 'state', eq: 'failure' } },
    },
  },
  'Compositions/Tab bar': {
    ...statedPages['Compositions/Tab bar'],
    argTypes: {
      width: { name: 'width', control: { type: 'inline-radio' }, options: barWidths.slice(1) },
      value: { name: 'chosen tab', control: { type: 'inline-radio' }, options: ['checkout', 'cart-ui', 'tests'] },
      tab: select('a tab', Object.keys(tabActs)),
      panel: select('open door', ['none', ...panelDoors.map((item) => item.key)]),
      state: { name: 'computer', control: { type: 'inline-radio' }, options: tabBarStates },
      folded: { name: 'folded tabs', control: { type: 'number', min: 0, max: 5 } },
      overflow: { name: 'folded menu open', control: { type: 'boolean' }, if: { arg: 'folded' } },
      windows: flag('Windows and Linux'),
    },
  },
  'Compositions/Edges': {
    ...statedPages['Compositions/Edges'],
    argTypes: {
      side: { name: 'side', control: { type: 'inline-radio' }, options: edgeSides },
      panes: { name: 'panes past the edge', control: { type: 'number', min: 1, max: 10 } },
      stacked: flag('first column stacked'),
      drop: flag('dragging over'),
      waiting: { name: 'Needs you hovered', control: { type: 'inline-radio' }, options: ['none', 'nearest', 'farthest'] },
      overflow: flag('folded menu open'),
    },
  },
  'Layouts/Window': {
    ...statedPages['Layouts/Window'],
    argTypes: { collapsed: flag('sidebar collapsed'), menu: { name: 'a menu on a row', control: { type: 'boolean' }, if: { arg: 'collapsed', truthy: false } }, panel: flag('a panel open') },
  },
  'Layouts/Pane': {
    ...statedPages['Layouts/Pane'],
    argTypes: { moment: { name: 'moment', control: { type: 'inline-radio' }, options: Object.keys(paneMoments) } },
  },
  'Primitives/Switch': {
    args: { checked: false, label: 'Toggle', disabled: false },
    argTypes: {
      checked: flag('checked'),
      label: text('label'),
      disabled: flag('disabled'),
    },
    markup: toggle,
  },
  'Primitives/Row': {
    args: { icon: 'lu-file', name: 'checkout.ts', detail: 'src/api', meta: '+14 −3', mark: 'none', second: '', heading: false, title: false, depth: 0, tools: false, current: false, selected: false, hover: false, focus: false, dimmed: false, pending: false },
    argTypes: {
      icon: select('icon', icons.concat(['p-claude', 'p-codex'])),
      name: text('name'),
      detail: text('detail'),
      meta: text('meta'),
      mark: select('mark', ['none', ...Object.keys(marks)]),
      second: text('second'),
      heading: flag('heading'),
      title: flag('title form'),
      depth: { name: 'depth', control: { type: 'inline-radio' }, options: rowDepths },
      tools: flag('tools on hover'),
      current: flag('current'),
      selected: flag('selected'),
      ...pick('hover', 'focus', 'dimmed'),
      pending: flag('pending'),
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
      value: text('value'),
      size: select('size', ['sm', 'md', 'lg']),
      track: flag('track'),
      disabled: flag('disabled'),
      icon: flag('icon'),
      label: flag('label'),
    },
    markup: tabs,
  },
  'Primitives/Thumbnail': {
    args: { image: 'https://images.placeholders.dev/120x80', label: 'cart-countdown.png', selected: false, loading: false },
    argTypes: {
      image: text('image'),
      label: text('label'),
      ...pick('selected', 'loading'),
    },
    markup: thumbnail,
  },
  'Primitives/Toast': {
    args: { level: 'error', icon: 'none', title: "Can't reach devbox", body: '', action: 'Refresh', explain: '' },
    argTypes: {
      level: select('level', Object.keys(levels)),
      icon: { ...select('icon', icons), description: "Any icon; it takes the level's colour" },
      title: text('title'),
      body: text('body'),
      action: text('action'),
      explain: { name: 'explain', control: { type: 'text' }, description: 'The session an error can be explained to' },
    },
    markup: toast,
  },
  'Primitives/Tooltip': {
    args: { text: 'Adding up', detail: '14 repositories to go', key: '', icon: 'lu-refresh-cw', side: 'auto', open: true },
    argTypes: {
      text: text('text'),
      detail: text('detail'),
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
      author: text('Author'),
      image: text('Image URL'),
      age: text('Age'),
      body: text('Body'),
      loading: flag('Loading'),
    },
    markup: (args) => `<div class="kanso-panel">${card(args)}</div>`,
  },
  ...panelPlaygrounds,
};

export const playgroundStory = ({ args, argTypes, markup }) => ({
  name: 'Variants',
  args,
  argTypes,
  render: (values) => frame(markup(values)),
  parameters: { docs: { source: { type: 'dynamic', transform: (_code, context) => markup(context.args) } } },
});
