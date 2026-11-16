import { elements, frame } from './storybook-markup.mjs';
import { THEMES, colour, contrast } from './tokens.mjs';
import { computerRow, projectRow, sessionRow, tile, viewSwitch } from '../stories/kit/compositions.js';
import { statedPages } from '../stories/kit/states.js';
import { iconSet, tokenExample, tokenTable } from '../stories/kit/pieces.js';
import { iconMeanings } from '../stories/kit/icons.js';
import { inRail, inSidebar } from '../stories/kit/frames.js';
export { elements } from './storybook-markup.mjs';

// Each named state of a stated page, drawn from its preset; `id` keeps a state's earlier name.
export const statedRecords = () => Object.entries(statedPages).flatMap(([page, { args, markup, states }]) => states.map(({ label, args: preset, caption, id }) => (
  { id: id ?? `kit/${page.replace('Compositions/', '')}/${label}`, source: 'kit', page, label, html: frame(markup({ ...args, ...preset })), caption })));

export function kitRecords(records) {
  const originals = records.filter((record) => record.html !== undefined && !['kit', 'tokens'].includes(record.source));
  const results = [];
  const byId = (id) => originals.find((record) => record.id === id)?.html ?? '';
  for (const [page, label, html, caption, id] of [
    ['Session row', 'Working', inSidebar(sessionRow({ name: 'Atlas', activity: 'Reviewing step 01', time: '3m' })), 'What it is on and for how long.'],
    ['Session row', 'Needs you', inSidebar(sessionRow({ program: 'lu-terminal', name: 'Nova', activity: 'Run npm publish?', time: '2m', status: 'blocked' })), 'The question, in foreground.'],
    ['Session row', 'Finished', inSidebar(sessionRow({ program: 'p-codex', name: 'Iris', status: 'done', current: true })), 'One line, the mark.'],
    ['Session row', 'Sub-session', inSidebar(sessionRow({ program: 'p-codex', name: 'Juno', status: 'idle', depth: 2 })), 'Under its parent.'],
    ['Project row', 'At rest', inSidebar(projectRow({ name: 'kansō', folder: 'herdr-kanso', branch: 'main', sync: '↓12' })), 'Name, folder, branch and sync.'],
    ['Project row', 'Folded', inSidebar(projectRow({ name: 'kansō', folder: 'herdr-kanso', branch: 'main', count: 3 })), 'The most urgent mark and how many.'],
    ['Computer row', 'This computer', inSidebar(computerRow({ name: 'light', remote: false })), 'This computer first.'],
    ['Computer row', 'Off', inSidebar(computerRow({ name: 'dark', state: 'off' })), 'A choice, not a failure.'],
    ['Computer row', 'Unreachable', inSidebar(computerRow({ name: 'devbox', state: 'unreachable' })), 'Refresh as its button.'],
    ['View switch', 'Row', inSidebar(viewSwitch()), 'Sidebar open: the three views by name.'],
    ['View switch', 'Column', inRail(viewSwitch({ column: true })), 'Sidebar collapsed: the three views as icons.'],
    ['Tile', 'Project', inRail(tile({ initial: 'A', status: 'blocked', count: 4, open: true })), 'A project in the rail.'],
    ['Tile', 'Status', inRail(tile({ status: 'working', count: 3 })), 'A state in the rail.'],
  ]) results.push({ id: id ?? `kit/${page}/${label}`, source: 'kit', page: page === 'Sidebar' ? 'Compositions/Sidebar' : `Compositions/Sidebar/${page}`, label, html: frame(html), caption });
  results.push(...statedRecords());
  const choices = elements(byId('proto/components-choosing-the-channel/ChoosingTheChannel/Default'), 'kanso-update');
  const sky = elements(byId('proto/tokens-dawn/TheBand/Default'), 'kanso-dawn--preview')[0];
  const mark = elements(byId('proto/approved-dawn/Reference/12'), 'kanso-settings__piece-choice')[0];
  for (const [label, html, caption, id] of [
    ['Sunrise', sky && `${sky}<button class="kanso-dawn__replay" type="button">Play the sunrise</button>`, 'Once on open and on switch, 2.6 s. Reduced motion shows the last frame.'],
    ['Channel mark', mark && `<div class="kanso-update">${mark}</div>`, 'Artwork, Pill or Hidden.'],
    ['Switch row · Stable Mode', choices[0], 'One press switches.'],
    ['Switch row · Dawn Mode', choices[1], 'One press switches.'],
    ['Switch row · Dawn Mode beta', choices[2], 'One press switches.'],
  ]) if (html) results.push({ id: id ?? `kit/Dawn Mode/${label}`, source: 'kit', page: 'Compositions/Dawn Mode', label, html: frame(html), caption });
  return results;
}

const tokenRecord = (name, page, caption, table) => ({ id: `tokens/${name}`, source: 'tokens', page, label: 'Reference', caption, html: frame(tokenTable(table)) });
const contrastRecord = (tokens) => {
  const surfaces = ['canvas', 'chrome', 'bg', 'raised', 'popover', 'hover', 'selected'];
  const pairs = [...['fg', 'muted', 'dim'].flatMap((text) => surfaces.map((surface) => [text, surface, 4.5])), ...['input', 'focus', 'working', 'blocked', 'done', 'idle'].map((edge) => [edge, 'bg', 3])];
  const ratio = (fore, surface) => Object.fromEntries(THEMES.map((theme) => [theme, `${contrast(colour(tokens, theme, fore), colour(tokens, theme, surface)).toFixed(1)}:1`]));
  return tokenRecord('Contrast', 'Tokens/Contrast, light and dark', 'Ratios from kanso/tokens.json.', { head: ['Colour', 'On', 'Ratio', 'Minimum'],
    rows: pairs.map(([fore, surface, min]) => ({ example: tokenExample({ group: 'contrast', fore, surface, text: min === 4.5 }), names: [`--${fore}`, `--${surface}`, ratio(fore, surface)], use: `${min}:1` })) });
};
const colourRows = (tokens) => {
  const names = [...new Set(Object.values(tokens.colour).flatMap((values) => values.map((row) => row.name)))];
  const value = (theme, n) => tokens.colour[theme].find((row) => row.name === n);
  return names.map((n) => ({ example: tokenExample({ group: 'colour', step: n }), names: [`--${n}`, Object.fromEntries(Object.keys(tokens.colour).map((theme) => [theme, value(theme, n)?.value ?? '']))], use: (value('dark', n) ?? value('light', n)).role }));
};
const role = (text) => text.replace(/:? ?ui\.js [\w.]+/g, '').replace(/ ?\(\d+ merged here\)/g, '').replace(/^4-based$/, 'base step').trim();
const groupRows = (tokens, keys) => keys.flatMap((group) => tokens[group].map(({ name: n, value, role: use }) => {
  const [, kind, step] = /^k-(\w+)-(.+)$/.exec(n);
  return { example: tokenExample({ group, kind, step }), names: [`--${n}`, String(value)], use: role(use) };
}));

export function tokenRecords(tokens) {
  const groups = { Colour: ['colour'], Type: ['type'], Spacing: ['space', 'height', 'switch'], Radius: ['radius'], Motion: ['motion'], Icons: ['icon'] };
  return Object.entries(groups).map(([name, keys]) => tokenRecord(name, `Tokens/${name}`, 'Values and roles from kanso/tokens.json.',
    { head: ['Token', 'Value', 'Use'], rows: keys[0] === 'colour' ? colourRows(tokens) : groupRows(tokens, keys) }))
    .concat(contrastRecord(tokens), { id: 'tokens/Icons/The whole set', source: 'tokens', page: 'Tokens/Icons', label: 'The whole set', caption: 'Every icon in use, its Lucide name and what it means. Nothing outside this list.', html: frame(iconSet({ icons: iconMeanings })) });
}
