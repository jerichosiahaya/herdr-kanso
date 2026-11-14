import { elements, escapeMarkup as escape, frame } from './storybook-markup.mjs';
import { THEMES, colour, contrast } from './tokens.mjs';
export { elements } from './storybook-markup.mjs';

export function kitRecords(records) {
  const originals = records.filter((record) => record.html !== undefined && !['kit', 'tokens'].includes(record.source));
  const results = [];
  const add = (name, label, html, caption) => results.push({ id: `kit/${name}/${label}`, source: 'kit', page: `Primitives/${name === 'Segmented' ? 'Tab' : name}`, label, html: frame(html), caption });
  const first = (className, prefer = 'compositions-controls/') => [...originals.filter((record) => record.id.includes(prefer)), ...originals].flatMap((record) => elements(record.html, className))[0];
  const definitions = [
    ['Button', 'kanso-button', ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Dimmed']],
    ['Field', 'kanso-field', ['Default', 'Hover', 'Focus', 'Disabled', 'Failure']],
    ['Segmented', 'kanso-segmented', ['Default', 'Hover', 'Focus', 'Disabled']],
    ['Switch', 'kanso-switch', ['Default', 'On', 'Hover', 'Focus', 'Active', 'Disabled']],
    ['Mark', 'kanso-mark', ['Default']], ['Chip', 'kanso-badge', ['Default']], ['Avatar', 'kanso-avatar--round', ['Default']],
    ['Row', 'kanso-row', ['Default', 'Hover', 'Focus', 'Active', 'Dimmed'], 'compositions-panel-pieces/SectionAndRows/'],
    ['Tab', 'kanso-tab', ['Default', 'Hover', 'Focus', 'Active', 'Disabled']],
    ['Menu', 'kanso-menu', ['Default']], ['Dialog', 'kanso-dialog', ['Default']],
    ['Skeleton', 'kanso-skeleton__list', ['Loading'], 'panels/files/FilesFirstRead/'], ['Drag handle', 'kanso-header__grip', ['Default']], ['Key hint', 'kanso-key', ['Default']],
  ];
  const modifiers = { Hover: 'kanso-control--hover', Focus: 'kanso-control--focus', Active: 'kanso-control--active', Disabled: 'kanso-control--off', Dimmed: 'kanso-control--dim', Failure: 'kanso-field--invalid', On: 'kanso-control--on' };
  for (const [name, className, states, prefer] of definitions) {
    const source = first(className, prefer);
    if (!source) continue;
    for (const label of states) {
      const modifier = modifiers[label];
      const html = modifier ? source.replace(/class="([^"]*)"/, (_, classes) => `class="${classes} ${modifier}"${label === 'Disabled' ? ' aria-disabled="true"' : ''}`) : source;
      add(name, label, html, `${label} appearance of the shared ${name.toLowerCase()}.`);
    }
  }
  const photo = 'https://images.placeholders.dev/96x96';
  const avatar = (size, inner) => `<span class="kanso-avatar kanso-avatar--round${size ? ` kanso-avatar--${size}` : ''}">${inner}</span>`;
  const img = `<img src="${photo}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
  add('Avatar', 'Image', avatar('', img), 'A picture from a URL, local or external, cropped to the circle.');
  add('Avatar', 'Small', `<span class="kanso-actions">${avatar('sm', 'S')}${avatar('sm', img)}</span>`, 'Inside a line of text.');
  add('Avatar', 'Large', `<span class="kanso-actions">${avatar('lg', 'S')}${avatar('lg', img)}</span>`, 'A card or a header.');
  add('Avatar', 'Image failed', avatar('', `<img src="https://invalid.example/avatar.png" alt="" onerror="this.remove()">S`), 'When the picture cannot load, the initial stays.');
  for (const state of ['working', 'blocked', 'done', 'idle']) {
    const html = first(`kanso-mark--${state}`);
    if (html) add('Mark', state[0].toUpperCase() + state.slice(1), html, `The owning item is ${state}.`);
  }
  const armed = first('kanso-action--armed');
  if (armed) add('Button', 'Armed', armed, 'A second press within four seconds confirms an irreversible action.');
  const button = first('kanso-button'), working = first('kanso-mark--working');
  if (button && working) add('Button', 'Loading', button.replace(/>[\s\S]*<\/([a-z]+)>$/, ` aria-busy="true">${working}Working…</$1>`), 'The action is waiting for its result.');
  const asleep = first('kanso-project', 'compositions-sidebar-rows/Asleep/');
  const machines = '<div class="kanso-sidebar__row-group"><div class="kanso-sidebar__row kanso-row--machine"';
  const open = first('kanso-sidebar'), at = open?.lastIndexOf(machines) ?? -1;
  const sidebar = asleep && at > 0 ? `${open.slice(0, at)}<div class="kanso-sidebar__row-group">${asleep}</div>${open.slice(at)}` : open;
  const rail = first('kanso-rail');
  const headerRecord = originals.find((record) => record.id.includes('layouts-sidebar-header-three-ways/'));
  const headers = headerRecord ? elements(headerRecord.html, 'kanso-sidebar--header-preview') : [];
  const dawn = headers.find((html) => html.includes('kanso-dawn'));
  const band = dawn && elements(dawn, 'kanso-dawn')[0];
  const pillHeader = headers.find((html) => html.includes('kanso-badge--count'));
  const pill = pillHeader && elements(pillHeader, 'kanso-badge--count')[0];
  for (const [name, variants] of [
    ['Header', { Open: headers.find((html) => !html.includes('kanso-dawn')) ?? first('kanso-header'), Collapsed: first('kanso-rail__brand') }],
    ['Sidebar', { Open: sidebar, Collapsed: rail, Dawn: sidebar && band ? sidebar.replace(/(<div[^>]*>)/, `$1${band}`) : undefined, 'Dawn Mode pill': sidebar && pill ? sidebar.replace(/(<span class="kanso-window__controls">[^]*?<\/span>)/, `$1${pill}`) : undefined }],
    ['Rail', { Open: sidebar, Collapsed: rail, Dawn: rail && band ? rail.replace(/(<div class="kanso-rail__brand"[^>]*>)/, `$1${band}`) : undefined }],
  ]) for (const [label, html] of Object.entries(variants)) if (html) results.push({ id: `kit/${name}/${label}`, source: 'kit', page: `Compositions/${name}`, label: name === 'Sidebar' && label === 'Dawn' ? 'Dawn Mode artwork' : label, html: frame(html), caption: `${label} navigation arrangement, composed from the shared kit.` });
  const byId = (id) => originals.find((record) => record.id === id)?.html ?? '';
  const choices = elements(byId('proto/components-choosing-the-channel/ChoosingTheChannel/Default'), 'kanso-update');
  const sky = elements(byId('proto/tokens-dawn/TheBand/Default'), 'kanso-dawn--preview')[0];
  const mark = elements(byId('proto/approved-dawn/Reference/12'), 'kanso-settings__piece-choice')[0];
  for (const [label, html, caption, id] of [
    ['Artwork', dawn, 'Default in Dawn Mode.', 'kit/Header/Dawn'],
    ['Pill', pillHeader, 'Dawn Mode, right of the lights.'],
    ['Hidden / Stable Mode', headers.at(-1), 'No mark. Stable Mode always shows this.'],
    ['Sunrise', sky && `${sky}<button class="kanso-dawn__replay" type="button">Play the sunrise</button>`, 'Once on open and on switch, 2.6 s. Reduced motion shows the last frame.'],
    ['Channel mark', mark && `<div class="kanso-update">${mark}</div>`, 'Artwork, Pill or Hidden.'],
    ['Switch row · Stable Mode', choices[0], 'One press switches.'],
    ['Switch row · Dawn Mode', choices[1], 'One press switches.'],
    ['Switch row · Dawn Mode beta', choices[2], 'One press switches.'],
  ]) if (html) results.push({ id: id ?? `kit/Dawn Mode/${label}`, source: 'kit', page: 'Compositions/Dawn Mode', label, html: frame(html), caption });
  const spend = originals.find((record) => record.id === 'panels/spend/SpendWellUsedTheMonthPerPlanThenToday/Default');
  if (spend) for (const [label, total, unit, factor] of [
    ['Today', '$41.20', 'today', 1], ['Month', '$824.00', 'this month', 20], ['30 days', '$1,236.00', 'over 30 days', 30],
    ['Year', '$9,888.00', 'this year', 240], ['All time', '$14,832.00', 'all time', 360],
  ]) {
    const html = spend.html.replace(/<span class="kanso-segmented">[^]*?<\/span><span class="kanso-layout__grow">/, `<span class="kanso-segmented">${['Today', 'Month', '30 days', 'Year', 'All time'].map((period) => `<span${period === label ? ' class="kanso-control--on"' : ''}>${period}</span>`).join('')}</span><span class="kanso-layout__grow">`)
      .replace('$41.20', total).replace('API value today', `API value ${unit}`)
      .replace(/(<span class="kanso-panel__row-value">)\$([\d.]+)/g, (_, tag, value) => `${tag}$${(Number(value) * factor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    results.push({ id: `kit/Spend/${label}`, source: 'kit', page: 'Panels/Spend', label, html, caption: `Sample API value ${unit}. Choose a period to update the total and breakdown.` });
  }
  return results;
}

const contrastRecord = (tokens) => {
  const surfaces = ['canvas', 'chrome', 'bg', 'raised', 'popover', 'hover', 'selected'];
  const pairs = [...['fg', 'muted', 'dim'].flatMap((text) => surfaces.map((surface) => [text, surface, 4.5])), ...['input', 'focus', 'working', 'blocked', 'done', 'idle'].map((edge) => [edge, 'bg', 3])];
  const sample = ([fore, surface, min]) => min === 4.5 ? `<span class="kanso-tokens__contrast kanso-text--${fore} kanso-fill--${surface}">Aa</span>` : `<span class="kanso-tokens__contrast kanso-ring--${fore} kanso-fill--${surface}"></span>`;
  const ratio = ([fore, surface]) => THEMES.map((theme) => `<span class="kanso-tokens__value kanso-tokens__value--${theme}">${contrast(colour(tokens, theme, fore), colour(tokens, theme, surface)).toFixed(1)}:1</span>`).join('');
  const html = `<table class="kanso-tokens"><thead><tr><th></th><th>Colour</th><th>On</th><th>Ratio</th><th>Minimum</th></tr></thead><tbody>${pairs.map((pair) => `<tr><td class="kanso-tokens__example">${sample(pair)}</td><td class="kanso-tokens__name">--${pair[0]}</td><td class="kanso-tokens__name">--${pair[1]}</td><td class="kanso-tokens__name">${ratio(pair)}</td><td>${pair[2]}:1</td></tr>`).join('')}</tbody></table>`;
  return { id: 'tokens/Contrast', source: 'tokens', page: 'Tokens/Contrast, light and dark', label: 'Reference', caption: 'Ratios from kanso/tokens.json.', html: frame(html) };
};

export function tokenRecords(tokens) {
  const groups = { Colour: ['colour'], Type: ['type'], Spacing: ['space', 'height', 'switch'], Radius: ['radius'], Motion: ['motion'], Icons: ['icon'] };
  return Object.entries(groups).map(([name, keys]) => {
    if (keys[0] === 'colour') {
      const names = [...new Set(Object.values(tokens.colour).flatMap((values) => values.map((row) => row.name)))];
      const value = (theme, n) => tokens.colour[theme].find((row) => row.name === n);
      const html = `<table class="kanso-tokens"><thead><tr><th></th><th>Token</th><th>Value</th><th>Use</th></tr></thead><tbody>${names.map((n) => `<tr><td><span class="kanso-tokens__swatch ${n === 'shadow' ? 'kanso-shadow' : `kanso-fill--${escape(n)}`}"></span></td><td class="kanso-tokens__name">--${escape(n)}</td><td class="kanso-tokens__name">${Object.keys(tokens.colour).map((theme) => `<span class="kanso-tokens__value kanso-tokens__value--${theme}">${escape(value(theme, n)?.value ?? '')}</span>`).join('')}</td><td>${escape((value('dark', n) ?? value('light', n)).role)}</td></tr>`).join('')}</tbody></table>`;
      return { id: `tokens/${name}`, source: 'tokens', page: `Tokens/${name}`, label: 'Reference', caption: 'Values and roles from kanso/tokens.json.', html: frame(html) };
    }
    const rows = keys.flatMap((key) => tokens[key].map((row) => ({ ...row, group: key })));
    const sample = ({ group, name: n }) => {
      const [, kind, step] = /^k-(\w+)-(.+)$/.exec(n);
      if (group === 'type') return kind === 'lh' ? `<span class="kanso-tokens__lines kanso-leading--${step}">Two lines<br>of text</span>` : `<span class="kanso-${kind === 'fw' ? 'weight' : 'type'}--${step}">Aa Quiet sessions</span>`;
      if (group === 'space') return `<span class="kanso-tokens__space kanso-gap--${step}"><i></i><i></i></span>`;
      if (group === 'radius') return `<span class="kanso-tokens__radius kanso-radius--${step}"></span>`;
      if (group === 'height') return `<span class="kanso-tokens__height kanso-height--${step}"></span>`;
      if (group === 'switch') return '<span class="kanso-switch kanso-control--on"><i></i></span>';
      if (group === 'icon') return `<svg class="kanso-icon kanso-icon--${step}" aria-hidden="true"><use href="#lu-bot"/></svg>`;
      if (group === 'motion') return /^k-(hover|ease)-/.test(n) ? '<span class="kanso-tokens__wash"></span>' : n === 'k-arm-ms' ? '<span class="kanso-tokens__arm"></span>' : n === 'k-skel-ms' ? '<span class="kanso-skeleton kanso-skeleton--breathing kanso-tokens__skeleton"></span>' : n === 'k-spin-ms' ? '<svg class="kanso-mark kanso-mark--working"><use href="#e-work"/></svg>' : '<span class="kanso-text--glint">checkout</span>';
      return '';
    };
    const role = (text) => text.replace(/:? ?ui\.js [\w.]+/g, '').replace(/ ?\(\d+ merged here\)/g, '').replace(/^4-based$/, 'base step').trim();
    const html = `<table class="kanso-tokens"><thead><tr><th></th><th>Token</th><th>Value</th><th>Use</th></tr></thead><tbody>${rows.map((row) => `<tr><td class="kanso-tokens__example">${sample(row)}</td><td class="kanso-tokens__name">--${escape(row.name)}</td><td class="kanso-tokens__name">${escape(row.value)}</td><td>${escape(role(row.role))}</td></tr>`).join('')}</tbody></table>`;
    return { id: `tokens/${name}`, source: 'tokens', page: `Tokens/${name}`, label: 'Reference', caption: 'Values and roles from kanso/tokens.json.', html: frame(html) };
  }).concat(contrastRecord(tokens));
}
