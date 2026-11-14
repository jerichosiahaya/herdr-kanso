// Pages whose story is built from Storybook controls instead of drawn states.
import sprite from '../proto-sprite.svg?raw';

const icons = ['none', ...[...sprite.matchAll(/id="(lu-[^"]+)"/g)].map(([, id]) => id).sort()];
const escape = (text) => String(text).replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);
const frame = (markup) => `<div class="kanso-story"><div class="kanso-story__theme kanso-story__frame kanso-story--free">${markup}</div></div>`;
const kinds = { solid: 'kanso-button--solid', tonal: 'kanso-button--tonal', quiet: 'kanso-button--quiet kanso-text--fg', icon: 'kanso-button--icon' };
const button = ({ label, kind = 'solid', size = 'md', icon = 'none', disabled = false, verb = '', armed = false, active = false, spin = false }) => {
  const classes = ['kanso-button', kinds[kind], size === 'md' ? '' : `kanso-button--${size}`, disabled ? 'kanso-control--off' : '', armed ? 'kanso-action kanso-action--armed' : '', active ? 'kanso-button--active' : '', spin ? 'kanso-button--spinning' : ''].filter(Boolean).join(' ');
  const glyph = icon === 'none' ? (spin ? '<svg class="kanso-mark kanso-mark--working kanso-icon--inline"><use href="#e-work"/></svg>' : '') : `<svg class="kanso-icon"><use href="#${icon}"/></svg>`;
  const text = kind === 'icon' ? '' : escape(label);
  const inner = armed ? `<span>${text}</span><span>Press again to ${escape(verb || label.toLowerCase())}</span>` : `${glyph}${text}`;
  return `<span class="${classes}" tabindex="0" title="${escape(label)}"${disabled ? ' aria-disabled="true"' : ''}${spin ? ' aria-busy="true"' : ''}>${inner}</span>`;
};

const avatarSizes = { sm: ' kanso-avatar--sm', md: '', lg: ' kanso-avatar--lg' };
const avatar = ({ initial, image, size }) => {
  const picture = image ? `<img src="${escape(image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : '';
  return `<span class="kanso-avatar kanso-avatar--round${avatarSizes[size]}">${picture}${escape(initial.slice(0, 1))}</span>`;
};

const card = ({ author, image, age, body, loading }) => `<div class="kanso-panel"><div class="kanso-card${loading ? ' kanso-skeleton--shape' : ''}"><div class="kanso-card__header">${avatar({ initial: author, image, size: 'md' })}<b>${escape(author)}</b><span class="kanso-layout__grow"></span><span class="kanso-text--dim">${escape(age)}</span></div><div class="kanso-prose">${escape(body)}</div></div></div>`;

const syntax = /("[^"\n]*"|'[^'\n]*'|`[^`]*`)|\b(\d+)\b|\b(import|from|export|default|function|const|let|var|return|if|else|for|while|async|await|new|class)\b/g;
const highlight = (line) => {
  let html = '', at = 0;
  for (const match of line.matchAll(syntax)) {
    const tone = match[1] ? 'string' : match[2] ? 'number' : 'keyword';
    html += `${escape(line.slice(at, match.index))}<span class="kanso-code__token--${tone}">${escape(match[0])}</span>`;
    at = match.index + match[0].length;
  }
  return html + escape(line.slice(at));
};
const signs = { '+': 'added', '-': 'deleted', '@': 'hunk' };
const failure = /\b(fail(ed|ure)?|error|exception)\b|^\s*>/i;
const code = ({ text, kind, first, line }) => {
  const rows = text.split('\n').map((source, index) => {
    const sign = kind === 'diff' ? signs[source[0]] : undefined;
    const classes = ['kanso-code__line', sign ? `kanso-code__line--${sign}` : '', first + index === line ? 'kanso-control--on' : ''].filter(Boolean).join(' ');
    if (sign === 'hunk') return `<div class="${classes}">${escape(source)}</div>`;
    if (kind === 'log') return `<div class="${classes}"><span class="kanso-code__number"></span><span class="kanso-code__sign"> </span>${failure.test(source) ? `<span class="kanso-text--blocked">${escape(source)}</span>` : escape(source)}</div>`;
    const body = sign || (kind === 'diff' && source[0] === ' ') ? source.slice(1) : source;
    return `<div class="${classes}"><span class="kanso-code__number">${first + index}</span><span class="kanso-code__sign">${sign === 'added' ? '+' : sign === 'deleted' ? '-' : ' '}</span>${kind === 'source' ? highlight(body) : escape(body)}</div>`;
  }).join('');
  return `<div class="kanso-panel"><div class="kanso-code">${rows}</div></div>`;
};

const shape = (markup) => markup.replace(' kanso-text--fg', '').replace(/class="([^"]*)"/, 'class="$1 kanso-skeleton--shape"');
const words = (text, skeleton) => skeleton ? `<span class="kanso-skeleton--shape kanso-skeleton--text">${escape(text)}</span>` : escape(text);
const dialog = ({ title, scope, value, placeholder, loading, note, tone, primary, state, secondary }) => {
  const action = (label, kind, look) => (loading ? shape : String)(button({ label, kind, ...(loading ? {} : { disabled: look === 'disabled', spin: look === 'loading', armed: look === 'armed' }) }));
  const field = value ? `${escape(value)}<span class="kanso-caret"></span>` : `<span class="kanso-caret"></span><span class="kanso-dialog__placeholder">${escape(placeholder)}</span>`;
  return `<div class="kanso-dialog kanso-popover"><div class="kanso-dialog__header"><span class="kanso-dialog__title">${words(title, loading)}</span></div>`
    + (scope ? `<div class="kanso-dialog__scope">${words(scope, loading)}</div>` : '')
    + `<div class="kanso-field${loading ? ' kanso-skeleton--shape' : ' kanso-control--focus'} kanso-dialog__section" tabindex="0">${field}</div>`
    + (note ? `<div class="kanso-dialog__note${tone === 'dim' ? '' : ` kanso-dialog__note--${tone}`}">${words(note, loading)}</div>` : '')
    + `<div class="kanso-dialog__footer">${secondary ? action(secondary, 'quiet', 'default') : ''}${action(primary, 'solid', state)}</div></div>`;
};

const input = ({ text: value, label: placeholder, icon, error, disabled, multiline, loading, limit }) => {
  const editable = !disabled && !loading;
  const enter = multiline ? '' : ` onkeydown="if (event.key === 'Enter') event.preventDefault()"`;
  const cap = ` onbeforeinput="if (event.inputType.startsWith('insert') && this.innerText.length >= ${limit}) event.preventDefault()"`;
  const text = `<div class="kanso-field__editor" role="textbox" aria-label="${escape(placeholder)}" aria-multiline="${multiline}" contenteditable="${editable}"${editable ? ' tabindex="0"' : ''}${enter}${cap}>${escape(value.slice(0, limit))}</div>`;
  const action = icon === 'none' ? '' : `<span class="kanso-button kanso-button--icon" tabindex="0"><svg class="kanso-icon kanso-icon--row"><use href="#${icon}"/></svg></span>`;
  const classes = `kanso-field${multiline ? ' kanso-field--multiline' : ''}${loading ? ' kanso-skeleton--shape' : `${error ? ' kanso-field--invalid' : ''}${disabled ? ' kanso-control--off' : ''}`}`;
  return `<div class="${classes}"${disabled ? ' aria-disabled="true"' : ''}>${text}${action}</div>`;
};

const inline = (text) => escape(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
const cells = (row, tag) => `<tr>${row.split('|').slice(1, -1).map((cell) => `<${tag}>${inline(cell.trim())}</${tag}>`).join('')}</tr>`;
const blocksOf = (source) => source.trim().split(/\n\s*\n/).map((block) => {
  const lines = block.split('\n');
  if (block.startsWith('## ')) return `<div class="kanso-markdown__subheading">${inline(block.slice(3))}</div>`;
  if (block.startsWith('# ')) return `<div class="kanso-markdown__heading">${inline(block.slice(2))}</div>`;
  if (lines.every((line) => line.trim().startsWith('|'))) return `<table class="kanso-markdown__table">${lines.filter((line) => !/^\s*\|[\s:|-]+\|\s*$/.test(line)).map((line, index) => cells(line.trim(), index ? 'td' : 'th')).join('')}</table>`;
  if (lines.every((line) => line.startsWith('- '))) return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  return `<p>${lines.map(inline).join(' ')}</p>`;
});
const markdown = ({ source, block, state }) => `<div class="kanso-panel"><div class="kanso-markdown">${blocksOf(source).map((html, index) => {
  const on = index + 1 === block ? { hover: ' kanso-row--hover', editing: ' kanso-editor--editing kanso-control--focus' }[state] ?? '' : '';
  return `<div class="kanso-markdown__block${on}"${on.includes('editing') ? ' contenteditable="true"' : ''}>${html}</div>`;
}).join('')}</div></div>`;

const menu = ({ title, items }) => {
  const rows = (Array.isArray(items) ? items : []).map((item) => {
    if (item.separator) return '<div class="kanso-menu__separator"></div>';
    const glyph = item.icon ? `<svg class="kanso-icon kanso-icon--row"><use href="#${escape(item.icon)}"/></svg>` : '<span class="kanso-menu__spacer"></span>';
    const classes = `kanso-menu__item${item.armed ? ' kanso-action--armed' : item.selected ? ' kanso-control--selected' : ''}`;
    const label = item.armed ? `Press again to ${escape(item.verb || String(item.label ?? '').toLowerCase())}` : escape(item.label ?? '');
    return `<div class="${classes}" role="menuitem" tabindex="0">${glyph}<span class="kanso-layout__grow">${label}</span>`
      + (item.badge ? `<span class="kanso-menu__badge">${escape(item.badge)}</span>` : '')
      + (item.hint ? `<span class="kanso-menu__hint">${escape(item.hint)}</span>` : '') + '</div>';
  }).join('');
  return `<div class="kanso-menu kanso-popover" role="menu">${title ? `<div class="kanso-menu__heading">${escape(title)}</div>` : ''}${rows}</div>`;
};

const metric = ({ value, unit, facts, loading }) => {
  const piece = (text, element) => `<span class="${element}${loading ? ' kanso-skeleton--shape kanso-skeleton--text' : ''}">${escape(text)}</span>`;
  const list = facts.split('|').map((fact) => fact.trim()).filter(Boolean);
  return `<div class="kanso-panel"><div class="kanso-metric">${piece(value, 'kanso-metric__value')}${unit ? piece(unit, 'kanso-metric__unit') : ''}</div>`
    + (list.length ? `<div class="kanso-panel__facts">${list.map((fact) => loading ? `<span class="kanso-skeleton--shape kanso-skeleton--text">${escape(fact)}</span>` : `<span>${escape(fact)}</span>`).join('')}</div>` : '')
    + '</div>';
};

const glyph = (icon) => `<svg class="${icon.startsWith('p-') ? 'kanso-icon--program' : 'kanso-icon kanso-icon--row'}"><use href="#${escape(icon)}"/></svg>`;
const flip = "if (this.getAttribute('aria-disabled')) return; this.setAttribute('aria-checked', this.classList.toggle('kanso-control--on'))";
const toggle = ({ checked, label, disabled }) => `<span class="kanso-switch${checked ? ' kanso-control--on' : ''}${disabled ? ' kanso-control--off' : ''}" role="switch" aria-checked="${checked}" aria-label="${escape(label)}" tabindex="0"${disabled ? ' aria-disabled="true"' : ''} onclick="${flip}" onkeydown="if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); this.click(); }"><i></i></span>`;
const marks = { working: 'e-work', blocked: 'e-blk', done: 'e-done', idle: 'e-idle', asleep: 'lu-moon' };
const markSizes = { sm: ' kanso-icon--inline', md: '', lg: ' kanso-icon--control' };
const mark = ({ status, size = 'md' }) => `<svg class="kanso-mark kanso-mark--${status}${markSizes[size]}"><use href="#${marks[status]}"/></svg>`;

const row = ({ icon, name, detail, meta, mark: status, second, selected, dimmed, pending }) => {
  const lead = icon === 'none' ? '' : glyph(icon);
  const tail = `${detail ? `<span class="kanso-text--dim kanso-text--truncate">${escape(detail)}</span>` : ''}<span class="kanso-layout__grow"></span>`
    + `${meta ? `<span class="kanso-row__meta">${escape(meta)}</span>` : ''}${pending ? '<span class="kanso-state-line__pending-dot"></span>' : ''}${status === 'none' ? '' : mark({ status })}`;
  const states = `${selected ? ' kanso-control--selected' : ''}${dimmed ? ' kanso-control--dim' : ''}${pending ? ' kanso-state-line--pending' : ''}`;
  const body = second
    ? `<div class="kanso-row kanso-row--two-lines${states}" tabindex="0"><div class="kanso-content__primary">${lead}<span>${escape(name)}</span>${tail}</div><div class="kanso-content__secondary">${escape(second)}</div></div>`
    : `<div class="kanso-row${states}" tabindex="0">${lead}<span>${escape(name)}</span>${tail}</div>`;
  return `<div class="kanso-panel">${body}</div>`;
};

const bar = (shape) => `<span class="kanso-skeleton kanso-skeleton--${shape}"></span>`;
const skeletonShapes = {
  row: () => `<div class="kanso-row">${bar('icon')}${bar('line')}<span class="kanso-layout__grow"></span></div>`,
  'list row': () => `<div class="kanso-row">${bar('line')}<span class="kanso-layout__grow"></span>${bar('meta')}</div>`,
  header: () => `<div class="kanso-panel__header">${bar('title')}<span class="kanso-layout__grow"></span>${bar('control')}</div>`,
  line: () => `<div class="kanso-row">${bar('line')}</div>`,
};
const skeletonOf = ({ shape, count }) => `<div class="kanso-panel"><div class="kanso-skeleton__list kanso-skeleton--breathing" role="status" aria-label="Loading">${Array.from({ length: shape === 'header' ? 1 : count }, (_, i) => skeletonShapes[shape](i)).join('')}</div></div>`;

const choose = "if (this.closest('.kanso-control--off')) return; for (const tab of this.parentNode.children) { tab.classList.toggle('kanso-tabs__tab--on', tab === this); tab.classList.toggle('kanso-control--selected', tab === this); tab.setAttribute('aria-selected', tab === this); }";
const tabs = ({ items, value, size, track, disabled, icon, label: named }) => `<div class="kanso-tabs kanso-tabs--${size}${track ? ' kanso-tabs--track' : ''}${disabled ? ' kanso-control--off' : ''}" role="tablist"${disabled ? ' aria-disabled="true"' : ''}>${(Array.isArray(items) ? items : []).map((item) => {
  const on = item.key === value;
  const label = escape(item.label ?? '');
  const square = icon && !named;
  return `<span class="kanso-tabs__tab${on ? ' kanso-tabs__tab--on kanso-control--selected' : ''}${square ? ' kanso-tabs__tab--icon' : ''}${item.armed ? ' kanso-action--armed' : ''}" role="tab" aria-selected="${on}" aria-label="${label}" tabindex="0" title="${square ? label : escape(item.tip ?? '')}" onclick="${choose}">`
    + `${icon && item.icon ? glyph(item.icon) : ''}${named || !item.icon ? label : ''}${item.mark && !square ? mark({ status: item.mark, size: 13 }) : ''}`
    + `${(item.dot || (square && item.mark === 'blocked')) && !on ? '<i class="kanso-tabs__dot"></i>' : ''}${on && item.closable && !square ? '<svg class="kanso-icon kanso-tabs__close"><use href="#lu-x"/></svg>' : ''}</span>`;
}).join('')}</div>`;

const thumbnail = ({ image, label, selected, loading }) => `<span class="kanso-thumbnail${selected ? ' kanso-control--selected' : ''}${loading ? ' kanso-skeleton--shape' : ''}" role="button" aria-pressed="${selected}" aria-label="${escape(label)}" title="${escape(label)}" tabindex="0">${image && !loading ? `<img src="${escape(image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</span>`;

const levels = { error: 'blocked', warning: 'working', success: 'done', info: 'accent' };
const lead = (level) => level === 'error' ? '<svg class="kanso-mark kanso-mark--blocked" aria-hidden="true"><use href="#e-blk"/></svg>'
  : level === 'success' ? '<svg class="kanso-icon kanso-icon--row kanso-text--done" aria-hidden="true"><use href="#lu-check"/></svg>'
  : `<i class="kanso-toast__dot kanso-fill--${levels[level]}"></i>`;
const toast = ({ level, icon, title, body, action, explain }) => {
  const fix = action ? button({ label: action, kind: 'tonal', size: 'sm' }) : '';
  const ask = explain ? `<span class="kanso-button kanso-button--tonal kanso-button--sm" tabindex="0"><svg class="kanso-icon kanso-icon--row" aria-hidden="true"><use href="#lu-bot"/></svg>Explain to ${escape(explain)}</span>` : '';
  const text = body ? `<span class="kanso-toast__text"><span>${escape(title)}</span><span class="kanso-toast__body">${escape(body)}</span></span>` : `<span class="kanso-content__text">${escape(title)}</span>`;
  return `<div class="kanso-toast kanso-popover${body ? ' kanso-toast--two-lines' : ''}" role="status">${icon === 'none' ? lead(level) : glyph(icon).replace('class="', `class="kanso-text--${levels[level]} `)}${text}${fix}${ask}</div>`;
};

const sides = ['auto', 'top', 'bottom', 'left', 'right'];
// Auto takes the side with the most room around the control, measured when it opens.
const place = "const tip = this.nextElementSibling, box = this.getBoundingClientRect(), room = { top: box.top, bottom: innerHeight - box.bottom, left: box.left, right: innerWidth - box.right }; const side = Object.keys(room).reduce((a, b) => room[b] > room[a] ? b : a); tip.className = tip.className.replace(/kanso-tooltip--(top|bottom|left|right)/, 'kanso-tooltip--' + side)";
const tooltip = ({ text, detail, key, icon, open, side }) => `<span class="kanso-tooltip__trigger"><span class="kanso-button kanso-button--icon" tabindex="0" aria-label="${escape(text)}"${side === 'auto' ? ` onmouseenter="${place}" onfocus="${place}"` : ''}><svg class="kanso-icon"><use href="#${icon}"/></svg></span>`
  + `<span class="kanso-tooltip kanso-popover kanso-tooltip--${side === 'auto' ? 'bottom' : side}${open ? ' kanso-tooltip--open' : ''}" role="tooltip">${escape(text)}${key ? ` <span>${escape(key)}</span>` : ''}${detail ? ` <span>· ${escape(detail)}</span>` : ''}</span></span>`;

const select = (name, options) => ({ name, control: { type: 'select' }, options });

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
    args: { initial: 'S', image: '', size: 'md' },
    argTypes: {
      initial: { name: 'Initial', control: { type: 'text' } },
      image: { name: 'Image URL', control: { type: 'text' } },
      size: select('Size', Object.keys(avatarSizes)),
    },
    markup: avatar,
  },
  'Primitives/Chip': {
    args: { label: '3 files' },
    argTypes: { label: { name: 'Label', control: { type: 'text' } } },
    markup: ({ label }) => `<span class="kanso-badge">${escape(label)}</span>`,
  },
  'Primitives/Code': {
    args: { text: 'export function bucket(customer) {\n  const plan = planOf(customer);\n  return { plan, tokens: LIMIT[plan] };\n}', kind: 'source', first: 11, line: 12 },
    argTypes: {
      text: { name: 'Code', control: { type: 'text' } },
      kind: select('Kind', ['source', 'diff', 'snippet', 'log']),
      first: { name: 'First line', control: { type: 'number', min: 1 } },
      line: { name: 'Highlighted line', control: { type: 'number', min: 0 } },
    },
    markup: code,
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
    markup: ({ state }) => `<svg class="kanso-icon kanso-icon--row kanso-header__grip${state === 'default' ? '' : ' kanso-text--fg'}"><title>Hold and drag onto another pane to move this one there</title><use href="#lu-grip-vertical"/></svg>`,
  },
  'Primitives/Field': {
    args: { text: '', label: 'Comment', icon: 'lu-send', error: false, disabled: false, multiline: false, loading: false, limit: 80 },
    argTypes: {
      text: { name: 'text', control: { type: 'text' } },
      label: { name: 'label', control: { type: 'text' } },
      icon: select('icon', icons),
      error: { name: 'error', control: { type: 'boolean' } },
      disabled: { name: 'disabled', control: { type: 'boolean' } },
      multiline: { name: 'multiline', control: { type: 'boolean' } },
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
    markup: ({ text, faint, recording }) => `<span class="kanso-key${faint ? ' kanso-text--dim' : ''}${recording ? ' kanso-key--recording kanso-ring--accent kanso-text--accent' : ''}">${escape(text.slice(0, 6))}</span>`,
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
    markup: markdown,
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
    args: { icon: 'lu-file', name: 'checkout.ts', detail: 'src/api', meta: '+14 −3', mark: 'none', second: '', selected: false, dimmed: false, pending: false },
    argTypes: {
      icon: select('icon', icons.concat(['p-claude', 'p-codex'])),
      name: { name: 'name', control: { type: 'text' } },
      detail: { name: 'detail', control: { type: 'text' } },
      meta: { name: 'meta', control: { type: 'text' } },
      mark: select('mark', ['none', ...Object.keys(marks)]),
      second: { name: 'second', control: { type: 'text' } },
      selected: { name: 'selected', control: { type: 'boolean' } },
      dimmed: { name: 'dimmed', control: { type: 'boolean' } },
      pending: { name: 'pending', control: { type: 'boolean' } },
    },
    markup: row,
  },
  'Primitives/Skeleton': {
    args: { shape: 'row', count: 3 },
    argTypes: {
      shape: select('shape', Object.keys(skeletonShapes)),
      count: { name: 'count', control: { type: 'range', min: 1, max: 6 }, if: { arg: 'shape', neq: 'header' } },
    },
    markup: skeletonOf,
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
    markup: card,
  },
};

export const playgroundStory = ({ args, argTypes, markup }) => ({
  name: 'Variants',
  args,
  argTypes,
  render: (values) => frame(markup(values)),
  parameters: { docs: { source: { type: 'dynamic', transform: (_code, context) => markup(context.args) } } },
});
