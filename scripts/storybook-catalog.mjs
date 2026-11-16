import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { normalizeComponent } from './storybook-components.mjs';
import { normalizeCss } from './storybook-css.mjs';
import { kitRecords, statedRecords, tokenRecords } from './storybook-kit.mjs';
import { gapDocument, mergeCoverage } from './storybook-coverage.mjs';
import { referenceText, sampleText } from './storybook-markup.mjs';
import { panelStateRecords } from './storybook-panel-states.mjs';
import { generateReferences } from "./storybook-references.mjs";
import { statusTags } from "../stories/kit/status.js";

export const SECTIONS = ['Start', 'Tokens', 'Primitives', 'Compositions', 'Features', 'Panels', 'Layouts'];
export const slug = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const cleanText = (s = '') => sampleText(referenceText(s)).replace(/; [^;.]+ keeps this component and its states in the shared kit\./g, '.').replace(/\b(?:prototype|board)(?:s|'s)?\b/gi, 'example').replace(/\bdesigners?\b/gi, 'reader').replace(/\bagents?\b/gi, (s) => s[0] === 'A' ? 'Session' : 'session').replace(/\ban? session\b/gi, 'a session').replace(/\bsubtracted\b/gi, 'simplified').replace(/\bremoved facts?\b/gi, 'simplified information').replace(/\bremoved\b/gi, 'cleared').replace(/\(S06 says why\)/g, '(its computer row says why)');
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));

export function pack(records) {
  const parts = [], keys = new Map();
  const intern = (value) => {
    const key = JSON.stringify(value);
    if (!keys.has(key)) { keys.set(key, parts.length); parts.push(value); }
    return keys.get(key);
  };
  const markup = (html) => {
    const stack = [{ tag: '', children: [] }];
    for (const token of html.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>|[^<]+|</g) ?? []) {
      const tag = /^<([a-z][\w:-]*)\b/i.exec(token)?.[1].toLowerCase();
      const close = /^<\/([a-z][\w:-]*)/i.exec(token)?.[1].toLowerCase();
      if (close && stack.length > 1 && stack.at(-1).tag === close) {
        const node = stack.pop();
        node.children.push(intern(token));
        stack.at(-1).children.push(intern(node.children));
      } else if (tag && !/\/\s*>$/.test(token) && !/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag)) {
        stack.push({ tag, children: [intern(token)] });
      } else stack.at(-1).children.push(intern(token));
    }
    while (stack.length > 1) stack.at(-2).children.push(intern(stack.pop().children));
    return intern(stack[0].children);
  };
  const prose = (text) => intern(cleanText(text).split(/(\n+)/).map(intern));
  const encoded = records.map(({ html, caption, context, spec, notes, ...record }) => ({
    ...record, label: cleanText(record.label), ...(html !== undefined ? { markup: markup(html) } : {}), caption: prose(caption),
    ...(context ? { context: prose(context) } : {}),
    ...(spec ? { spec: spec.map(([label, value]) => [intern(label), prose(value)]) } : {}),
    ...(notes?.length ? { notes: notes.map(prose) } : {}),
  }));
  return { format: 1, parts, records: encoded };
}

export function expand(catalog) {
  const cache = new Map();
  const value = (id) => {
    if (!cache.has(id)) cache.set(id, typeof catalog.parts[id] === 'string' ? catalog.parts[id] : catalog.parts[id].map(value).join(''));
    return cache.get(id);
  };
  return catalog.records.map(({ markup, caption, context, spec, notes, ...record }) => ({ ...record, ...(markup !== undefined ? { html: value(markup) } : {}), caption: value(caption),
    ...(context !== undefined ? { context: value(context) } : {}),
    ...(spec ? { spec: spec.map((row) => row.map(value)) } : {}), ...(notes ? { notes: notes.map(value) } : {}),
  }));
}

const serialize = (catalog) => `{\n "format": ${catalog.format},\n "parts": [\n${catalog.parts.map((part) => '  ' + JSON.stringify(part)).join(',\n')}\n ],\n "records": [\n${catalog.records.map((record) => '  ' + JSON.stringify(record)).join(',\n')}\n ]\n}\n`;

export function replaceSource(source, records, root = '.') {
  pagesOf(records);
  if (new Set(records.map((record) => record.id)).size !== records.length) throw new Error('Duplicate state ids');
  const file = join(root, 'stories/catalog.json');
  const previous = existsSync(file) ? expand(read(file)).filter((record) => record.source !== source) : [];
  const catalog = pack([...previous, ...records.map((record) => ({ ...record, source }))].filter((record) => !['kit', 'tokens'].includes(record.source)).sort((a, b) => a.id.localeCompare(b.id)));
  mkdirSync(join(root, 'stories'), { recursive: true });
  writeFileSync(file, serialize(catalog));
  generate(root);
}

const primitive = {
  KeyHint: null, PillAndAvatar: null, Switch: null, Segmented: null, Field: null,
  ButtonsFourKinds: null, ButtonsOnALine: null, ActionRows: null, ButtonWithAMark: null, Armed: null,
  FocusRing: null, HoverSelectedPressed: null, Tooltip: null, ChromeAndBarButtons: null,
  FileRow: null, PortRow: null, RowActions: null, SettingRow: null, SettingRowWithAValue: null, FindRow: null,
  Card: null, Metric: null, ThumbnailStrip: null, SkeletonTwoLines: null, Loading: null,
  Toast: null, ToastWithItsSource: null, Snippet: null, Reply: null, Picture: null,
};
// The panel pieces drawn on their own panel's page.
const panelPiece = { HeroAndVerdict: 'Panels/PR', InATab: 'Panels/Worktrees', MemoryMetricAndChart: 'Panels/Memory', PlanAndSpend: 'Panels/Spend' };
const protoPage = {
  'components-annotated-picture': 'Panels/Pins', 'components-choosing-the-channel': null,
  'components-code': null, 'components-collapsed-rail': null,
  'components-dialog': null, 'components-edges-and-minimap': null,
  'components-find-in-the-conversation': 'Panels/Find', 'components-header-digest': null,
  'components-log': null, 'components-markdown-window': 'Panels/Markdown', 'components-markdown': null,
  'components-menu': null, 'components-new-project': null, 'components-new-worktree': null,
  'components-pane-header': null, 'components-pane-standing-in': null, 'components-panel-menu': null,
  'components-pick-list': null, 'components-rename': null, 'components-settings-tabs': 'Panels/Settings',
  'components-shipped': 'Panels/Shipped', 'components-simulator-screen': 'Panels/Simulator',
  'components-status-bar-working': null, 'components-status-bar': null,
  'components-system-notification': 'Compositions/Notifications', 'components-tab-bar': 'Compositions/Tab bar', 'components-tab-states': null,
  'components-title-and-tools': null, 'components-while-you-were-away': 'Compositions/Activity', 'components-worktree-row-open': null,
  'compositions-bars': null, 'compositions-controls': 'Primitives/Button', 'compositions-files-and-pr': 'Panels/PR',
  'compositions-menu-and-dialog': null, 'compositions-panel-pieces': 'Compositions/Panel',
  'compositions-sidebar-features': null, 'compositions-sidebar-rows': null, 'compositions-states': null,
  'layouts-sidebar-at-rest': null, 'layouts-sidebar-header-three-ways': null,
  'layouts-window-at-rest': null, 'layouts-right-click-any-piece': null, 'layouts-hjkl-dojo': null,
  'tokens-colour-and-wash': 'Tokens/Colour', 'tokens-dawn': null, 'tokens-icons': null, 'tokens-type': 'Tokens/Type',
};
// Of a source routed to null, the stories a page still draws from.
const protoKept = { 'compositions-sidebar-features': { AwayEvents: 'Compositions/Activity' } };
const coveragePage = {
  Arrangements: 'Compositions/Arrangements dialog', SaveArrangement: 'Compositions/Arrangements dialog', SettingsMenu: 'Compositions/Settings menu', UpdateNotice: 'Compositions/Notifications', RuntimeNotice: 'Compositions/Notifications',
  ContainerList: 'Panels/Containers', ContainerRow: 'Panels/Containers', ComposeProject: 'Panels/Containers', ContainerDisk: 'Panels/Containers',
  Practice: 'Panels/Dojo', PracticeFeedback: 'Panels/Dojo', PracticeResult: 'Panels/Dojo', PracticePet: 'Panels/Dojo',
  Memory: 'Panels/Memory', MemoryAgent: 'Panels/Memory', MemoryRecovery: 'Panels/Memory', MemoryHistory: 'Panels/Memory', MemoryChart: 'Primitives/Chart', SystemNotice: 'Compositions/Notifications',
  Help: 'Panels/Settings', Guide: 'Panels/Settings', KeyboardExplorer: 'Compositions/Keyboard', MarkdownFiles: 'Panels/Markdown', MarkdownReview: 'Panels/Markdown',
  PaneMenu: 'Compositions/Pane menu', OpenWith: 'Compositions/Open with menu', Files: 'Panels/Files', Preview: 'Panels/Preview', MarkdownEditing: 'Panels/Preview', ConversationFind: 'Panels/Find',
  Images: 'Panels/Images', Ports: 'Panels/Ports', PortHistory: 'Panels/Ports', PullRequest: 'Panels/PR', PullRequestContext: 'Panels/PR', PullRequestList: 'Panels/PR', PullRequestDetails: 'Panels/PR', PullRequestPicker: 'Panels/PR',
  WorktreeVerdict: 'Panels/Worktrees', Worktrees: 'Panels/Worktrees', WorktreeHistory: 'Panels/Worktrees', Shipped: 'Panels/Shipped', Share: 'Panels/Share', VerdictBody: 'Panels/PR', CodeLimits: 'Primitives/Code', HistoryChart: 'Primitives/Chart', ActionNotice: 'Primitives/Toast', ShareCard: 'Panels/Share',
  MultilinePrompt: 'Primitives/Field', Prompt: 'Compositions/Prompt dialog', SendDialog: 'Compositions/Send dialog', Pieces: 'Panels/Settings', Bindings: 'Panels/Settings', ReleaseControls: 'Panels/Settings', CreditsLoading: 'Panels/Settings',
  Devices: 'Panels/Simulator', DeviceControls: 'Panels/Simulator', PictureState: 'Panels/Simulator', SleepDialog: 'Compositions/Sleep dialog',
  Sidebar: 'Compositions/Sidebar', SidebarStatus: 'Compositions/Sidebar', SidebarThreads: 'Compositions/Sidebar', SidebarSort: 'Compositions/Toolbar', ProjectGit: 'Compositions/Sidebar',
  ProjectMenu: 'Compositions/Project menu', AgentMenu: 'Compositions/Agent menu', NewConversation: 'Compositions/New conversation menu', ProjectCreation: 'Compositions/New project dialog', ComputerMenu: 'Compositions/Computer menu', Asleep: 'Compositions/Sidebar', NeedsQueue: 'Compositions/Sidebar', AwayEvents: 'Compositions/Activity', CreateWorktree: 'Compositions/New worktree dialog',
  Spend: 'Panels/Spend', SpendBreakdown: 'Panels/Spend', SpendSettings: 'Panels/Spend', SpendChart: 'Primitives/Chart', StatusStandIn: 'Compositions/Status bar', PaneTools: 'Compositions/Pane header', StripNavigation: 'Compositions/Edges', Tabs: 'Primitives/Tab', PanelToolbar: 'Compositions/Tab bar', Notice: 'Primitives/Toast', NoticeStack: 'Primitives/Toast',
};

export function pageFor(source, file, key) {
  const base = file.replace(/\.(json|stories\.js)$/, '');
  if (source === 'panels') return ({ skeleton: 'Compositions/Panel', availability: 'Panels/No tool, no panel' })[base] ?? `Panels/${base === 'pr' ? 'PR' : base[0].toUpperCase() + base.slice(1)}`;
  if (source === 'coverage') {
    if (!coveragePage[key]) throw new Error(`Missing component route: ${file}:${key}`);
    return coveragePage[key];
  }
  if (source === 'proto') {
    if (key in primitive && /compositions-/.test(base)) return primitive[key] && `Primitives/${primitive[key]}`;
    if (base === 'compositions-panel-pieces' && panelPiece[key]) return panelPiece[key];
    if (protoKept[base]?.[key]) return protoKept[base][key];
    if (protoPage[base] === null) return null;
    if (!protoPage[base]) {
      if (base.startsWith('components-')) return `Primitives/${base.slice(11).replace(/-/g, ' ').replace(/^./, (s) => s.toUpperCase())}`;
      throw new Error(`Missing component route: ${file}:${key}`);
    }
    return protoPage[base];
  }
  throw new Error(`Unknown story source: ${source}`);
}

// A prototype source routed to null is a copy of a kit composition and is not imported.
export function recordsFrom(source, file, data, notes = []) {
  return Object.entries(data).filter(([key]) => pageFor(source, file, key) !== null).flatMap(([key, story]) => Object.entries(story.variants ?? { Default: story }).map(([state, variant]) => ({
    id: `${source}/${file.replace(/\.json$/, '')}/${key}/${state}`, source, page: pageFor(source, file, key),
    label: cleanText([story.name ?? story.title ?? key.replace(/([a-z])([A-Z])/g, '$1 $2'), ...(story.variants ? [state] : [])].join(' · ')),
    caption: variant.when ?? story.caption ?? '', ...(story.variants && story.caption ? { context: story.caption } : {}), html: variant.html, ...(variant.spec ? { spec: variant.spec } : {}),
    ...(variant.source ? { location: variant.source } : {}), ...(notes.length ? { notes } : {}),
  })));
}

export function pagesOf(records) {
  const pages = new Map();
  // A Start page is written by hand; its drawing is read from the catalog by id.
  for (const record of records.filter(({ page }) => !page.startsWith(`${SECTIONS[0]}/`))) {
    if (!SECTIONS.slice(1).some((section) => record.page.startsWith(section + '/'))) throw new Error(`Invalid page: ${record.page}`);
    if (!pages.has(record.page)) pages.set(record.page, []);
    pages.get(record.page).push(record);
  }
  return [...pages].sort(([a], [b]) => SECTIONS.indexOf(a.split('/')[0]) - SECTIONS.indexOf(b.split('/')[0]) || a.localeCompare(b));
}

export function generate(root = '.') {
  const file = join(root, 'stories/catalog.json');
  const retained = expand(read(file)).filter((record) => !['kit', 'tokens'].includes(record.source));
  const drawings = panelStateRecords(retained), regenerated = new Set(drawings.map((record) => record.id));
  const originals = mergeCoverage([...retained.filter((record) => !regenerated.has(record.id)), ...drawings].map((record) => record.html === undefined ? record : normalizeComponent(record)), statedRecords());
  const tokenFile = join(root, 'kanso/tokens.json');
  const tokens = existsSync(tokenFile) ? read(tokenFile) : null;
  const catalog = pack([...originals, ...kitRecords().map(normalizeComponent), ...(tokens ? tokenRecords(tokens) : [])]);
  writeFileSync(file, serialize(catalog));
  writeFileSync(join(root, 'stories/GAPS.md'), gapDocument(expand(catalog)));
  const records = expand(catalog);
  const references = existsSync(join(root, 'stories/references.json')) ? read(join(root, 'stories/references.json')).pages : [];
  const pages = pagesOf(records).filter(([page]) => !references.some((reference) => reference.page === page && !reference.existing));
  const cssFile = join(root, 'stories/proto.css');
  if (existsSync(cssFile)) writeFileSync(cssFile, normalizeCss(readFileSync(cssFile, 'utf8'), { kit: true }));
  const out = join(root, 'stories/components');
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const [page] of pages) {
    const file = slug(page);
    writeFileSync(join(out, `${file}.stories.js`), `import { componentStory } from '../kit/story.js';\n\nexport default { title: ${JSON.stringify(page)}, tags: ${JSON.stringify(statusTags(page))} };\nexport const Variants = componentStory(${JSON.stringify(page)});\n`);
    writeFileSync(join(out, `${file}.mdx`), `import { Meta } from '@storybook/addon-docs/blocks';\nimport * as stories from './${file}.stories.js';\nimport { ComponentPage } from '../kit/ComponentPage.jsx';\n\n<Meta of={stories} name="Overview" />\n<ComponentPage of={stories} page=${JSON.stringify(page)} />\n`);
  }
  generateReferences(root, records);
  return { stories: pages.length, states: catalog.records.filter((record) => record.markup !== undefined).length, covered: catalog.records.filter((record) => record.design).length, gaps: catalog.records.filter((record) => record.gap).length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) console.log(JSON.stringify(generate()));
