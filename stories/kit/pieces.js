// The kit's pieces: every function here returns markup; compositions.js only calls them.

export const escape = (text) => String(text).replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`);

// Children are pieces, arrays of pieces, or null/false for nothing.
export const list = (...children) => children.flat(Infinity).filter((child) => child !== null && child !== undefined && child !== false).join('');

// A label made of words and values, such as a name inside an action's title.
export const phrase = (...parts) => parts.join(' ');
// A chord: its keys' names joined as the computer writes them, ⌥⌘H or Alt+L.
export const chord = (join, ...parts) => parts.join(join ?? '');

export const grow = (inner = '') => `<span class="kanso-layout__grow">${inner}</span>`;
// A colour as a dot: a level, or a label's own colour.
export const dot = (tone) => `<i class="kanso-dot kanso-fill--${escape(tone)}"></i>`;

// Atoms

export const kinds = { solid: 'kanso-button--solid', tonal: 'kanso-button--tonal', quiet: 'kanso-button--quiet kanso-text--fg', icon: 'kanso-button--icon' };
export const button = ({ label, kind = 'solid', size = 'md', icon = 'none', disabled = false, verb = '', armed = false, active = false, spin = false }) => {
  const classes = ['kanso-button', kinds[kind], size === 'md' ? '' : `kanso-button--${size}`, disabled ? 'kanso-control--off' : '', armed ? 'kanso-action kanso-action--armed' : '', active ? 'kanso-button--active' : '', spin ? 'kanso-button--spinning' : ''].filter(Boolean).join(' ');
  const lead = icon === 'none' ? (spin ? mark({ status: 'working', size: 'sm' }) : '') : iconSvg(icon, 'control');
  const text = kind === 'icon' ? '' : escape(label);
  const again = `Press again to ${escape(verb || label.toLowerCase())}`;
  const inner = armed && kind !== 'icon' ? `<span>${text}</span><span>${again}</span>` : `${lead}${text}`;
  return `<span class="${classes}" tabindex="0" title="${armed && kind === 'icon' ? again : escape(label)}"${disabled ? ' aria-disabled="true"' : ''}${spin ? ' aria-busy="true"' : ''}>${inner}</span>`;
};

export const windowControls = () => '<span class="kanso-window-controls"><i></i><i></i><i></i></span>';

export const dawn = ({ id = 'dawn' } = {}) => `<svg class="kanso-dawn kanso-dawn--rising" viewBox="0 0 256 56" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--dawn-top)"/><stop offset=".45" style="stop-color:var(--dawn-mid)"/><stop offset=".8" style="stop-color:var(--dawn-low)"/><stop offset="1" style="stop-color:var(--dawn-edge)"/></linearGradient><radialGradient id="${id}-glow" cx="124" cy="44" r="78" gradientUnits="userSpaceOnUse" gradientTransform="translate(0 15.4) scale(1.65)"><stop offset="0" style="stop-color:var(--dawn-sun);stop-opacity:.85"/><stop offset=".35" style="stop-color:var(--dawn-edge);stop-opacity:.45"/><stop offset="1" style="stop-color:var(--dawn-edge);stop-opacity:0"/></radialGradient><linearGradient id="${id}-fade" x1="0" y1="44" x2="0" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0" style="stop-color:var(--dawn-edge);stop-opacity:.5"/><stop offset="1" style="stop-color:var(--chrome);stop-opacity:0"/></linearGradient><clipPath id="${id}-clip"><rect x="0" y="0" width="256" height="44"/></clipPath></defs><rect width="256" height="44" fill="url(#${id}-sky)"/><rect class="kanso-dawn__night" width="256" height="44" style="fill:var(--dawn-top)"/><g clip-path="url(#${id}-clip)"><rect class="kanso-dawn__glow" width="256" height="44" fill="url(#${id}-glow)"/><g class="kanso-dawn__stars" style="fill:var(--dawn-star)"><circle cx="14" cy="7" r=".7" opacity=".8"/><circle cx="44" cy="13" r=".5" opacity=".55"/><circle cx="212" cy="6" r=".6" opacity=".7"/><circle cx="240" cy="15" r=".5" opacity=".45"/><circle cx="84" cy="5" r=".45" opacity=".5"/></g><g class="kanso-dawn__clouds" style="stroke:var(--dawn-sun)" stroke-linecap="round" fill="none"><path d="M28 31h58" stroke-width="1.6" opacity=".55"/><path d="M52 36h30" stroke-width="1.2" opacity=".5"/><path d="M162 28h64" stroke-width="1.6" opacity=".5"/><path d="M176 34h30" stroke-width="1.2" opacity=".45"/><path d="M6 39h40" stroke-width="1" opacity=".4"/><path d="M214 40h36" stroke-width="1" opacity=".4"/></g><g class="kanso-dawn__sun"><circle cx="124" cy="44" r="10" style="fill:var(--dawn-sun)" opacity=".5"/><circle cx="124" cy="44" r="13" fill="none" style="stroke:var(--dawn-sun)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="70 12" transform="rotate(-150 124 44)" class="kanso-dawn__circle"/></g></g><rect y="44" width="256" height="12" fill="url(#${id}-fade)"/><path class="kanso-dawn__horizon" d="M0 44.5H256" style="stroke:var(--dawn-sun)" stroke-width="1" opacity=".55"/></svg>`;

export const avatarSizes = { sm: ' kanso-avatar--sm', md: '', lg: ' kanso-avatar--lg' };
// `round: false` is a tile, an app's picture or its letter.
export const avatar = ({ initial, image, size, tone, round = true }) => {
  const picture = image ? `<img src="${escape(image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : '';
  return `<span class="kanso-avatar${round ? ' kanso-avatar--round' : ''}${avatarSizes[size] ?? ""}${tone ? ` kanso-text--host-${escape(tone)}` : ""}">${picture}${escape(initial.slice(0, 1))}</span>`;
};

export const card = ({ author, image, age, body, loading }) => `<div class="kanso-card${loading ? ' kanso-skeleton--shape' : ''}"><div class="kanso-card__header">${avatar({ initial: author, image, size: 'md' })}<b>${escape(author)}</b>${grow()}<span class="kanso-text--dim">${escape(age)}</span></div><div class="kanso-prose">${escape(body)}</div></div>`;

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
export const code = ({ text, kind, first, line }) => {
  const rows = text.split('\n').map((source, index) => {
    const sign = kind === 'diff' ? signs[source[0]] : undefined;
    const classes = ['kanso-code__line', sign ? `kanso-code__line--${sign}` : '', first + index === line ? 'kanso-control--on' : ''].filter(Boolean).join(' ');
    if (sign === 'hunk') return `<div class="${classes}">${escape(source)}</div>`;
    if (kind === 'log') return `<div class="${classes}"><span class="kanso-code__number"></span><span class="kanso-code__sign"> </span>${failure.test(source) ? `<span class="kanso-text--blocked">${escape(source)}</span>` : escape(source)}</div>`;
    const body = sign || (kind === 'diff' && source[0] === ' ') ? source.slice(1) : source;
    return `<div class="${classes}"><span class="kanso-code__number">${first + index}</span><span class="kanso-code__sign">${sign === 'added' ? '+' : sign === 'deleted' ? '-' : ' '}</span><span class="kanso-code__text">${kind === 'source' ? highlight(body) : escape(body)}</span></div>`;
  }).join('');
  return `<div class="kanso-code">${rows}</div>`;
};

const shape = (markup) => markup.replace(' kanso-text--fg', '').replace(/class="([^"]*)"/, 'class="$1 kanso-skeleton--shape"');
const words = (text, skeleton) => skeleton ? `<span class="kanso-skeleton--shape kanso-skeleton--text">${escape(text)}</span>` : escape(text);
// A dialog: its title with its `tools` after it, an optional scope, the body its use composes, notes, then Cancel before the one primary.
// The window size is the Settings and Help window.
// The find size is a titleless popover: its field in the header's place, the results under a rule.
const dialogSizes = { md: '', window: ' kanso-dialog--window', find: ' kanso-dialog--find' };
export const dialog = ({ title, tools = '', size = 'md', scope, body = '', notes = [], primary, kind = 'solid', state = 'default', secondary, loading = false }) => {
  const action = (label, look, emphasis) => (loading ? shape : String)(button({ label, kind: emphasis, ...(loading ? {} : { disabled: look === 'disabled', spin: look === 'loading', armed: look === 'armed' }) }));
  const footer = primary || secondary ? `<div class="kanso-dialog__footer">${secondary ? action(secondary, 'default', 'quiet') : ''}${primary ? action(primary, state, kind) : ''}</div>` : '';
  const header = title || tools.length ? `<div class="kanso-dialog__header">${title ? `<span class="kanso-dialog__title">${words(title, loading)}</span>` : ''}${list(tools)}</div>` : '';
  return `<div class="kanso-dialog${dialogSizes[size]} kanso-popover" role="dialog">${header}`
    + (scope ? `<div class="kanso-dialog__scope">${words(scope, loading)}</div>` : '')
    + (body ? `<div class="kanso-dialog__body">${body}</div>` : '')
    + notes.map(({ text, tone: look = 'dim' }) => `<div class="kanso-dialog__note${look === 'dim' ? '' : ` kanso-dialog__note--${look}`}">${words(text, loading)}</div>`).join('')
    + footer + '</div>';
};

// A find field leads with its `lead` icon and keeps a `count` slot and its drawn `tools` after the text.
export const input = ({ text: value = '', label: placeholder, icon = 'none', lead = 'none', count = null, tools = [], action = '', choose = false, focus = false, error, disabled, multiline, inline: rename, selected, loading, limit = 80 }) => {
  const editable = !disabled && !loading && !choose;
  const enter = multiline ? '' : ` onkeydown="if (event.key === 'Enter') event.preventDefault()"`;
  const cap = ` onbeforeinput="if (event.inputType.startsWith('insert') && this.innerText.length >= ${limit}) event.preventDefault()"`;
  const text = `<div class="kanso-field__editor" role="textbox" aria-label="${escape(placeholder)}" aria-multiline="${multiline}" contenteditable="${editable}"${editable ? ' tabindex="0"' : ''}${enter}${cap}>${selected ? `<span class="kanso-field__selection">${escape(value.slice(0, limit))}</span>` : escape(value.slice(0, limit))}</div>`;
  const iconTool = icon === 'none' ? '' : button({ label: placeholder, kind: 'icon', icon });
  // A word action shows once something is typed, or always when a chooser fills the field.
  const wordTool = value || choose ? button({ label: action, kind: 'tonal', size: 'sm' }) : '';
  const tool = rename ? '' : action ? wordTool : iconTool;
  const classes = `kanso-field${multiline ? ' kanso-field--multiline' : ''}${rename ? ' kanso-field--inline' : ''}${loading ? ' kanso-skeleton--shape' : `${error ? ' kanso-field--invalid' : ''}${disabled ? ' kanso-control--off' : ''}${focus ? ' kanso-control--focus' : ''}`}`;
  const after = `${count === null ? '' : `<span class="kanso-field__count">${escape(count)}</span>`}${list(tools)}`;
  return `<div class="${classes}"${disabled ? ' aria-disabled="true"' : ''}>${lead === 'none' ? '' : glyph(lead)}${text}${tool}${after}</div>`;
};

// The query's words marked in a line of text, one match look kit-wide.
const literal = (word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matches = (query) => new RegExp(`(${query.trim().split(/\s+/).filter(Boolean).map(literal).join('|') || '(?!)'})`, 'gi');
export const found = ({ text, query = '' }) => String(text).split(matches(query)).map((part, index) => index % 2 ? `<mark class="kanso-match">${escape(part)}</mark>` : escape(part)).join('');
// A found line, the `current` one washed: who and when small on top, after any `lead` piece, the text at body size with the query marked.
export const excerpt = ({ who, when = '', text, query = '', lead = '', current = false }) => `<div class="kanso-excerpt${current ? ' kanso-excerpt--current' : ''}" tabindex="0">`
  + `<div class="kanso-excerpt__who">${list(lead)}<span>${escape(who)}</span><span class="kanso-text--dim">${escape(when)}</span></div><div class="kanso-excerpt__text">${found({ text, query })}</div></div>`;

const inline = (text) => escape(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
// An edited table puts its `cell` [row, column] in focus, a remover over each column and after each row, and its own actions under it.
const tableActions = () => `<div class="kanso-markdown__actions">${['Add row', 'Add column', 'Done'].map((label) => button({ label, kind: 'quiet', size: 'sm' })).join('')}</div>`;
const remover = (what, shown = true) => `<td class="kanso-markdown__remover kanso-markdown__remover--${what}">${shown ? button({ label: `Remove this ${what}`, kind: 'icon', size: 'sm', icon: 'lu-x' }) : ''}</td>`;
const cellOf = (text, tag, focus) => `<${tag}${focus ? ' class="kanso-control--focus" contenteditable="true"' : ''}>${inline(text.trim())}</${tag}>`;
const rowCells = (row) => row.trim().split('|').slice(1, -1);
const cells = (row, tag, at, cell) => `<tr>${rowCells(row).map((text, column) => cellOf(text, tag, cell?.[0] === at && cell?.[1] === column)).join('')}${cell ? remover('row', at > 0) : ''}</tr>`;
const columnRemovers = (head) => {
  const columns = rowCells(head);
  return `<tr>${columns.map(() => remover('column', columns.length > 1)).join('')}${remover('row', false)}</tr>`;
};
const isTable = (lines) => lines.every((line) => line.trim().startsWith('|'));
const isFence = (lines) => lines[0].startsWith('```');
const tableOf = (lines, cell) => {
  const rows = lines.filter((line) => !/^\s*\|[\s:|-]+\|\s*$/.test(line));
  return `<table class="kanso-markdown__table${cell ? ' kanso-editor--editing' : ''}">${cell ? columnRemovers(rows[0]) : ''}${rows.map((line, index) => cells(line, index ? 'td' : 'th', index, cell)).join('')}</table>${cell ? tableActions() : ''}`;
};
// A picture in a note: shown, loading, held on another computer as its name, size and Load, or failed in one quiet line.
const imageLine = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const pictureBlock = (path, { state = 'shown', size = '', image = '' }) => state === 'held' ? row({ icon: 'lu-file', name: path.split('/').at(-1), detail: size, action: { label: 'Load', kind: 'quiet' } })
  : state === 'failed' ? '<p class="kanso-text--dim">Cannot show this picture</p>'
  : picture({ image, state });
const blockOf = (block, cell, shot) => {
  const lines = block.split('\n');
  const image = block.trim().match(imageLine);
  if (image) return pictureBlock(image[2], shot);
  if (isFence(lines)) return `<pre class="kanso-markdown__code">${escape(lines.slice(1, lines.at(-1).startsWith('```') ? -1 : undefined).join('\n'))}</pre>`;
  if (block.startsWith('## ')) return `<div class="kanso-markdown__subheading">${inline(block.slice(3))}</div>`;
  if (block.startsWith('# ')) return `<div class="kanso-markdown__heading">${inline(block.slice(2))}</div>`;
  if (isTable(lines)) return tableOf(lines, cell);
  if (lines.every((line) => line.startsWith('- '))) return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  return `<p>${lines.map(inline).join(' ')}</p>`;
};
const blockStates = { hover: ' kanso-row--hover', editing: ' kanso-editor--editing kanso-control--focus' };
// A block in `state`: hovered, or edited in place; an edited table edits its cells instead. The source `view` shows the raw text.
const blockView = (text, on, state, cell, shot) => {
  const table = isTable(text.split('\n'));
  const look = on && !(table && state === 'editing') ? blockStates[state] ?? '' : '';
  return `<div class="kanso-markdown__block${look}"${look.includes('editing') ? ' contenteditable="true"' : ''}>${blockOf(text, on && table && state === 'editing' ? cell : null, shot)}</div>`;
};
// `shot` is how its pictures stand: { state, size, image }.
export const markdown = ({ source, block, state, cell = [1, 0], view = 'document', shot = {} }) => view === 'source'
  ? `<div class="kanso-markdown"><div class="kanso-markdown__source">${escape(source.trim())}</div></div>`
  : `<div class="kanso-markdown">${source.trim().split(/\n\s*\n/).map((text, index) => blockView(text, index + 1 === block, state, cell, shot)).join('')}</div>`;

// A washed band over a document: what changed and what to do about it.
export const band = ({ text, actions = [] }) => `<div class="kanso-band" role="status"><span class="kanso-band__text">${escape(text)}</span>${actions.map(button).join('')}</div>`;

// A heading's `mark` sits at its right, the state of what it names; a `failure` item is the failure pattern in the menu's place.
const menuHeading = (text, status) => `<div class="kanso-menu__heading">${status ? `${grow(escape(text))}${mark({ status, size: 'sm' })}` : escape(text)}</div>`;
// An item leads with its icon, a colour `dot`, or an app's picture or letter as a tile; a `disabled` item is dim and does nothing.
const menuLead = (item) => item.picture || item.letter ? avatar({ initial: item.letter ?? '', image: item.picture, size: 'sm', tone: item.tone, round: false })
  : item.dot ? `<span class="kanso-menu__spacer">${dot(item.dot)}</span>` : item.icon ? glyph(item.icon) : '<span class="kanso-menu__spacer"></span>';
// The label, with its `second` line under it; armed, the label takes the hint's room.
const menuLabel = (label, second) => grow(second ? `<span class="kanso-menu__label">${label}</span><span class="kanso-menu__second">${escape(second)}</span>` : label);
const menuItem = (item) => {
  const classes = `kanso-menu__item${item.second ? ' kanso-menu__item--two-lines' : ''}${item.armed ? ' kanso-action--armed' : item.selected ? ' kanso-control--selected' : ''}${item.disabled ? ' kanso-control--off' : ''}`;
  const label = item.armed ? `Press again to ${escape(item.verb || String(item.label ?? '').toLowerCase())}` : escape(item.label ?? '');
  return `<div class="${classes}" role="menuitem" tabindex="${item.disabled ? -1 : 0}"${item.disabled ? ' aria-disabled="true"' : ''}${item.checked === undefined ? '' : ` aria-checked="${item.checked}"`}>${menuLead(item)}${menuLabel(label, item.second)}`
    + (item.badge ? `<span class="kanso-menu__badge">${escape(item.badge)}</span>` : '')
    + (item.hint && !item.armed ? `<span class="kanso-menu__hint">${escape(item.hint)}</span>` : '') + (item.mark ? mark({ status: item.mark }) : '') + (item.checked ? glyph('lu-check') : '') + '</div>';
};
// A `scroll` run shows `rows` items, the rest scroll inside the menu; a `field` finds in it.
const menuEntry = (item) => item.separator ? '<div class="kanso-menu__separator"></div>'
  : item.field ? `<div class="kanso-menu__field">${input({ label: item.field, icon: 'lu-search' })}</div>`
  : item.failure ? failureBlock(item.failure)
  : item.heading ? menuHeading(item.heading, item.mark)
  : item.scroll ? `<div class="kanso-menu__scroll" style="--k-rows:${Number(item.rows ?? 4)}">${item.scroll.map(menuEntry).join('')}</div>`
  : item.loading ? `<div class="kanso-menu__item kanso-skeleton--breathing" aria-busy="true">${bar('icon')}${bar('line')}</div>`
  : menuItem(item);
export const menu = ({ title, items }) => `<div class="kanso-menu kanso-popover" role="menu">${title ? menuHeading(title) : ''}${(Array.isArray(items) ? items : []).map(menuEntry).join('')}</div>`;

// `size` sm is the value at title size, on one line at row width.
// `tone` puts the value in a state's ink (low free memory); a `second` line sits under the unit, both beside the value, and takes the tone too.
export const metric = ({ value, unit, second = '', facts = '', loading = false, size = 'md', tone = '' }) => {
  const piece = (text, element) => `<span class="${element}${loading ? ' kanso-skeleton--shape kanso-skeleton--text' : ''}">${escape(text)}</span>`;
  const list = facts.split('|').map((fact) => fact.trim()).filter(Boolean);
  const ink = tone ? ` kanso-text--${escape(tone)}` : '';
  const beside = second ? `<span class="kanso-metric__beside">${piece(unit, 'kanso-metric__unit')}${piece(second, `kanso-metric__second${ink}`)}</span>` : unit ? piece(unit, 'kanso-metric__unit') : '';
  return `<div class="kanso-metric${size === 'sm' ? ' kanso-metric--sm' : ''}${second ? ' kanso-metric--beside' : ''}">${piece(value, `kanso-metric__value${ink}`)}${beside}</div>`
    + (list.length ? `<div class="kanso-panel__facts">${list.map((fact) => loading ? `<span class="kanso-skeleton--shape kanso-skeleton--text">${escape(fact)}</span>` : `<span>${escape(fact)}</span>`).join('')}</div>` : '');
};

// An icon by name: a program's own art or a Lucide icon, at a control's or a row's size; a tone colours it.
const iconSvg = (icon, size, tone = '') => `<svg class="${tone ? `kanso-text--${escape(tone)} ` : ''}${icon.startsWith('p-') ? 'kanso-icon--program' : size === 'row' ? 'kanso-icon kanso-icon--row' : 'kanso-icon'}"><use href="#${escape(icon)}"/></svg>`;
export const glyph = (icon, tone = '') => iconSvg(icon, 'row', tone);
const flip = "if (this.getAttribute('aria-disabled')) return; this.setAttribute('aria-checked', this.classList.toggle('kanso-control--on'))";
export const toggle = ({ checked, label, disabled }) => `<span class="kanso-switch${checked ? ' kanso-control--on' : ''}${disabled ? ' kanso-control--off' : ''}" role="switch" aria-checked="${checked}" aria-label="${escape(label)}" tabindex="0"${disabled ? ' aria-disabled="true"' : ''} onclick="${flip}" onkeydown="if (event.key === ' ' || event.key === 'Enter') { event.preventDefault(); this.click(); }"><i></i></span>`;
// The lines that end every piece's right-click Menu.
export const pieceLines = [{ separator: true }, { icon: 'lu-check', label: 'Only when needed' }, { icon: 'lu-eye-off', label: 'Hide this' }, { icon: 'lu-sliders-vertical', label: 'Settings for this…' }];
export const marks = { working: 'e-work', blocked: 'e-blk', done: 'e-done', idle: 'e-idle', asleep: 'lu-moon' };
export const markSizes = { sm: ' kanso-icon--inline', md: '', lg: ' kanso-icon--control' };
export const mark = ({ status, size = 'md' }) => `<svg class="kanso-mark kanso-mark--${status}${markSizes[size]}"><use href="#${marks[status]}"/></svg>`;

export const chip = ({ label, quiet = false, pill = false, tone = '' }) => `<span class="kanso-badge${quiet ? ' kanso-badge--quiet' : ''}${pill ? ' kanso-badge--pill' : ''}${tone ? ` kanso-text--${escape(tone)}` : ''}">${escape(String(label))}</span>`;
// A fact is words or { icon, text, tone }; its words take the tone. In a row's detail a toned fact leads with its dot.
const fact = (part) => typeof part === 'string' ? `<span>${escape(part)}</span>` : `${part.icon ? `<svg class="kanso-icon kanso-icon--inline"><use href="#${escape(part.icon)}"/></svg>` : ''}<span${part.tone ? ` class="kanso-text--${escape(part.tone)}"` : ''}>${escape(part.text)}</span>`;
const detailFact = (part) => `${part.tone ? dot(part.tone) : ''}${fact(part)}`;
const factLine = (parts) => [].concat(parts).filter(Boolean).map(fact).join('<span>·</span>');
const rowTool = (action) => button({ kind: 'icon', size: 'sm', ...action });
export const rowDepths = [0, 1, 2];
// A file's git `letter` takes the icon's slot; modified keeps the slot empty so names align.
const letterTones = { A: 'dim', D: 'dim', U: 'blocked', M: '' };
const fileLetter = (letter) => `<span class="kanso-row__letter${letterTones[letter] ? ` kanso-text--${letterTones[letter]}` : ''}">${letter === 'M' ? '' : escape(letter)}</span>`;
// A tree row sits at its `level` and leads with its fold: a folder's chevron, `open` or not, or an empty slot for a file.
const fold = (open) => `<span class="kanso-row__fold">${open === undefined ? '' : inlineIcon(open ? 'lu-chevron-down' : 'lu-chevron-right')}</span>`;
// A verb { agent } is Explain to that agent.
const rowVerb = (verb) => verb.agent ? explainButton({ agent: verb.agent, size: 'sm' }) : button({ kind: 'quiet', size: 'sm', ...verb });
// `actions` show on hover or focus and take the meta's place; `action` and the drawn `tools` are always shown; `keys` are the row's key hints, last.
// The title form is a panel's heading: the name at title size, the second line its scope.
// `verbs` are a line of quiet word actions under it; `strong` puts the name in ink (unread, new); `meta` may be { text, tone }; `late` is its blocked tone.
// `second` is words or facts; a picked row may add a `reason` { text, tone } that wraps and a mono `path`; `number` leads dim (#44).
export const row = ({ icon = 'none', tone = '', letter, level, open, number, name, detail, meta, chip: count, flag, mark: status = 'none', second, reason, path, heading, title, depth = 0, glint, strong, late, selected, current, dimmed, pending, hover, focus, actions = [], action, verbs = [], start = [], tools = [], keys = [] }) => {
  const slot = letter ? fileLetter(letter) : icon === 'none' ? '' : glyph(icon, tone);
  const lead = `${list(start)}${level === undefined ? '' : fold(open)}${slot}${number ? `<span class="kanso-row__number">${escape(number)}</span>` : ''}`;
  const label = `<span class="kanso-row__name${glint ? ' kanso-text--glint' : ''}">${escape(name)}</span>`;
  const facts = [].concat(detail ?? []).filter(Boolean);
  const metaFact = meta && { ...(typeof meta === 'object' ? meta : { text: meta }), ...(late && { tone: 'blocked' }) };
  const tail = `${facts.length ? `<span class="kanso-row__detail">${facts.map(detailFact).join('')}</span>` : ''}${grow()}`
    + `${metaFact ? `<span class="kanso-row__meta${metaFact.tone ? ` kanso-text--${escape(metaFact.tone)}` : ''}">${escape(metaFact.text)}</span>` : ''}${flag ? `<span class="kanso-row__flag">${glyph(flag)}</span>` : ''}`
    + `${actions.length ? `<span class="kanso-row__actions">${actions.map(rowTool).join('')}</span>` : ''}${count ? chip({ label: count }) : ''}${action ? button({ size: 'sm', ...action }) : ''}${list(tools)}${keys.map(keyHint).join('')}`
    + `${pending ? '<span class="kanso-state-line__pending-dot"></span>' : ''}${!status || status === 'none' ? '' : mark({ status })}`;
  const twoLines = Boolean(second || reason || path) || verbs.length > 0;
  const states = [twoLines && 'kanso-row--two-lines', level !== undefined && 'kanso-row--tree', strong && 'kanso-row--strong', heading && 'kanso-row--heading', title && 'kanso-row--title', depth && `kanso-row--depth-${depth}`, selected && 'kanso-control--selected', current && 'kanso-row--selected',
    dimmed && 'kanso-control--dim', pending && 'kanso-state-line--pending', hover && 'kanso-control--hover', focus && 'kanso-control--focus'].filter(Boolean).map((name) => ` ${name}`).join('');
  const opening = `<div class="kanso-row${states}" tabindex="0"${level === undefined ? '' : ` style="--k-level:${Number(level)}"`}>`;
  const under = `${second ? `<div class="kanso-content__secondary">${factLine(second)}</div>` : ''}${reason ? `<div class="kanso-row__reason${reason.tone ? ` kanso-text--${escape(reason.tone)}` : ''}">${escape(reason.text)}</div>` : ''}`
    + `${path ? `<div class="kanso-row__path">${escape(path)}</div>` : ''}${verbs.length ? `<div class="kanso-content__actions">${verbs.map(rowVerb).join('')}</div>` : ''}`;
  return twoLines ? `${opening}<div class="kanso-content__primary">${lead}${label}${tail}</div>${under}</div>` : `${opening}${lead}${label}${tail}</div>`;
};

const bar = (shape) => `<span class="kanso-skeleton kanso-skeleton--${shape}"></span>`;
// A Row's silhouette, as the app's skeleton draws it: the bars in a row's box.
const shapeRow = (...bars) => `<div class="kanso-row">${list(bars)}</div>`;
export const skeletonShapes = {
  row: () => shapeRow(bar('icon'), bar('line'), grow()),
  'list row': () => shapeRow(bar('line'), grow(), bar('meta')),
  header: () => `<div class="kanso-panel__header">${bar('title')}${grow()}${bar('control')}</div>`,
  line: () => shapeRow(bar('line')),
};
export const skeletonOf = ({ shape, count }) => `<div class="kanso-skeleton__list kanso-skeleton--breathing" role="status" aria-label="Loading">${Array.from({ length: shape === 'header' ? 1 : count }, (_, i) => skeletonShapes[shape](i)).join('')}</div>`;

export const tabNameLimit = 64;
const choose = "if (this.closest('.kanso-control--off')) return; for (const tab of this.parentNode.children) { tab.classList.toggle('kanso-tabs__tab--on', tab === this); tab.setAttribute('aria-selected', tab === this); }";
export const tabs = ({ items, value, size, track, disabled, icon, label: named }) => `<div class="kanso-tabs kanso-tabs--${size}${track ? ' kanso-tabs--track' : ''}${disabled ? ' kanso-control--off' : ''}" role="tablist"${disabled ? ' aria-disabled="true"' : ''}>${(Array.isArray(items) ? items : []).map((item) => {
  const on = item.key === value;
  const label = escape(item.label ?? '');
  const square = icon && !named;
  const states = [on && 'kanso-tabs__tab--on', square && 'kanso-tabs__tab--icon', item.armed && 'kanso-action--armed', item.pending && 'kanso-state-line--pending', item.held && 'kanso-control--held'].filter(Boolean).map((name) => ` ${name}`).join('');
  const name = item.editing ? input({ text: item.label ?? '', label: item.label ?? '', icon: 'none', inline: true, selected: true, limit: tabNameLimit }) : `<span class="kanso-tabs__label">${label}</span>`;
  return `${item.drop ? '<i class="kanso-tabs__insertion"></i>' : ''}<span class="kanso-tabs__tab${states}" role="tab" aria-selected="${on}" aria-label="${label}" tabindex="0" title="${square ? label : escape(item.tip ?? '')}" onclick="${choose}">`
    + `${icon && item.icon ? glyph(item.icon) : ''}${named || !item.icon ? name : ''}${item.pending ? '<i class="kanso-state-line__pending-dot"></i>' : ''}${item.mark && !square ? mark({ status: item.mark }) : ''}`
    + `${(item.dot || (square && item.mark === 'blocked')) && !on ? '<i class="kanso-tabs__dot"></i>' : ''}${on && item.closable && !square && !item.editing ? '<svg class="kanso-icon kanso-tabs__close"><use href="#lu-x"/></svg>' : ''}</span>`;
}).join('')}</div>`;

// Where a pin, a note or a touch sits over a picture or a screen, in percent of it.
const spotAt = ([x, y], size = []) => ` style="--k-x:${Number(x)}%;--k-y:${Number(y)}%${size.length ? `;--k-w:${Number(size[0])}%;--k-h:${Number(size[1])}%` : ''}"`;
// A numbered pin: inline as a row's lead, placed `at` a point, or ringing a `region` [x, y, w, h]; `pending` has no note yet.
export const pin = ({ n = '', at, region, pending = false }) => {
  const spot = region ? [0, 0] : at;
  const badge = `<span class="kanso-annotation${pending ? ' kanso-annotation--inactive' : ''}${spot ? ' kanso-annotation--placed' : ''}"${spot ? spotAt(spot) : ''}>${escape(String(n))}</span>`;
  return region ? `<span class="kanso-annotation__region"${spotAt(region, region.slice(2))}>${badge}</span>` : badge;
};
// A pin's note beside it; `typing` shows the caret, an empty note its placeholder.
export const note = ({ text = '', at = [0, 0], typing = false }) => `<div class="kanso-annotation__note"${spotAt(at)}>${text ? escape(text) : '<span class="kanso-text--dim">Note</span>'}${typing ? '<span class="kanso-caret"></span>' : ''}</div>`;
const pinLayer = (pins, look = '') => pins.length ? `<div class="kanso-annotation__layer${look}">${list(pins)}</div>` : '';

// A sample app on a device's screen: its status line, title, lines (a `held` line washed, a `hint` value dim) and its primary action.
const screenLine = ({ label, value, held, hint }) => `<div class="kanso-simulator__line${held ? ' kanso-simulator__line--held' : ''}"><span>${escape(label)}</span><span${hint ? ' class="kanso-text--dim"' : ''}>${escape(value)}</span></div>`;
export const deviceScreen = ({ time, signal, title, lines = [], primary }) => `<div class="kanso-simulator__app"><div class="kanso-content__time"><span>${escape(time)}</span><span>${escape(signal)}</span></div>`
  + `<div class="kanso-content__text">${escape(title)}</div><div class="kanso-simulator__lines">${lines.map(screenLine).join('')}</div>${primary ? `<div class="kanso-simulator__payment">${escape(primary)}</div>` : ''}</div>`;
export const deviceStates = ['on', 'off', 'booting', 'stalled'];
// A device's frame around its `screen`: `off` the empty frame with Boot, `booting` its breathing blank, `stalled` the last picture stepped down.
// `frozen` rings it while pinning, `focus` while touches and keys go to it, `touch` [x, y] the point being pressed; `pins` sit over the screen.
export const device = ({ state = 'on', frozen, focus, touch, rotated, narrow, pins = [] }, screen = '') => {
  const shape = `${rotated ? ' kanso-simulator--rotated' : ''}${narrow ? ' kanso-simulator--narrow' : ''}`;
  if (state === 'off') return `<div class="kanso-simulator__frame${shape}">${button({ label: 'Boot' })}</div>`;
  if (state === 'booting') return `<div class="kanso-simulator__frame kanso-simulator__frame--booting kanso-skeleton--breathing${shape}" aria-busy="true"></div>`;
  const states = `${shape}${frozen ? ' kanso-simulator--frozen' : ''}${focus ? ' kanso-control--focus' : ''}${state === 'stalled' ? ' kanso-simulator--stalled' : ''}`;
  return `<div class="kanso-simulator${states}"><div class="kanso-simulator__screen">${screen}</div>${touch ? pinLayer([pin({ at: touch, pending: true })], ' kanso-annotation__layer--touch') : ''}${pinLayer(pins)}</div>`;
};
export const pictureStates = ['shown', 'loading', 'held'];
// A picture sized to its panel: `shown` with its `pins` over it, `loading` its breathing shape, `held` the slot with the one `action` that brings it.
export const picture = ({ image = '', state = 'shown', action = '', pins = [] }) => state === 'loading' ? '<div class="kanso-picture__loading kanso-skeleton kanso-skeleton--breathing" aria-busy="true"></div>'
  : state === 'held' ? `<div class="kanso-picture__loading">${button({ label: action })}</div>`
  : `<div class="kanso-picture">${image}${pinLayer(pins)}</div>`;

export const thumbnail = ({ image, label, selected, loading }) => `<span class="kanso-thumbnail${selected ? ' kanso-control--selected' : ''}${loading ? ' kanso-skeleton--shape' : ''}" role="button" aria-pressed="${selected}" aria-label="${escape(label)}" title="${escape(label)}" tabindex="0">${image && !loading ? `<img src="${escape(image)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</span>`;

export const levels = { error: 'blocked', warning: 'working', success: 'done', info: 'accent' };
const lead = (level) => level === 'error' ? mark({ status: 'blocked' })
  : level === 'success' ? glyph('lu-check', levels.success)
  : dot(levels[level]);
// `mark` stands in for the level's mark; `tone` colours an icon apart from the level; `detail` is the tool's words, in the tooltip.
export const toast = ({ level = 'info', icon = 'none', title, body, action, explain, mark: status, tone, detail }) => {
  const fix = action ? button({ label: action, kind: 'tonal', size: 'sm' }) : '';
  const ask = explain ? explainButton({ agent: explain, size: 'sm' }) : '';
  const text = body ? `<span class="kanso-toast__text"><span>${escape(title)}</span><span class="kanso-toast__body">${escape(body)}</span></span>` : `<span class="kanso-content__text">${escape(title)}</span>`;
  const head = status ? mark({ status }) : icon === 'none' ? lead(level) : glyph(icon, tone || levels[level]);
  return `<div class="kanso-toast kanso-popover${body ? ' kanso-toast--two-lines' : ''}" role="status"${detail ? ` title="${escape(detail)}"` : ''}>${head}${text}${fix}${ask}</div>`;
};

// Explain to <agent>: the bot icon and the agent named in words.
export const explainButton = ({ agent, size = 'md' }) => button({ label: `Explain to ${agent}`, kind: 'tonal', size, icon: 'lu-bot' });

export const sides = ['auto', 'top', 'bottom', 'left', 'right'];
// Auto takes the side with the most room around the control, measured when it opens.
const place = "const tip = this.lastElementChild, box = this.firstElementChild.getBoundingClientRect(), room = { top: box.top, bottom: innerHeight - box.bottom, left: box.left, right: innerWidth - box.right }; const side = Object.keys(room).reduce((a, b) => room[b] > room[a] ? b : a); tip.className = tip.className.replace(/kanso-tooltip--(top|bottom|left|right)/, 'kanso-tooltip--' + side)";
// The drawn tip takes the system title's place on its trigger.
export const tooltip = ({ text, detail, key, icon, open, side }) => `<span class="kanso-tooltip__trigger"${side === 'auto' ? ` onmouseenter="${place}" onfocusin="${place}"` : ''}>${button({ label: text, kind: 'icon', icon }).replace(' title=', ' aria-label=')}`
  + `<span class="kanso-tooltip kanso-popover kanso-tooltip--${side === 'auto' ? 'bottom' : side}${open ? ' kanso-tooltip--open' : ''}" role="tooltip">${escape(text)}${key ? ` <span>${escape(key)}</span>` : ''}${detail ? ` <span>· ${escape(detail)}</span>` : ''}</span></span>`;

// A setting: its label, its control at the right, and an optional note under both with one quiet link.
export const setting = ({ label, control, note, link }) => `<div class="kanso-setting"><span class="kanso-setting__label">${escape(label)}</span>${control ?? ''}`
  + `${note || link ? `<div class="kanso-setting__note">${note ? escape(note) : ''}${link ? ` ${link}` : ''}</div>` : ''}</div>`;

// A key hint: the chord beside the action it runs; faint when it says nothing now, recording while a key is captured.
export const keyHint = ({ text, faint = false, recording = false }) => `<span class="kanso-key${faint ? ' kanso-text--dim' : ''}${recording ? ' kanso-key--recording kanso-ring--accent kanso-text--accent' : ''}">${escape(text)}</span>`;

// One key of the keyboard map; `units` is its width in keys.
const keycapClass = { free: '', herdr: ' kanso-keyboard__key--available', kanso: ' kanso-keyboard__key--bound', held: ' kanso-control--held', picked: ' kanso-control--on' };
export const keycapStates = Object.keys(keycapClass);
export const keycap = ({ label, units = 1, state = 'free', hover = false }) => `<span class="kanso-keyboard__key${keycapClass[state]}${hover ? ' kanso-control--hover' : ''}" role="button" tabindex="0"${units === 1 ? '' : ` style="--k-units:${Number(units)}"`}>${escape(label ?? '')}</span>`;

// The picked key: its chord, what it does or Nothing, its layer, then the acts on it.
export const keyPicked = ({ chord, meaning = null, layer = null, actions = [] }) => `<div class="kanso-keyboard__selection"><span class="kanso-keyboard__chord">${escape(chord)}</span>`
  + `<span class="kanso-keyboard__meaning${meaning ? '' : ' kanso-text--muted'}">${escape(meaning ?? 'Nothing')}</span>${layer ? `<span class="kanso-keyboard__layer">${escape(layer)}</span>` : ''}`
  + `${list(actions) ? `<div class="kanso-actions">${list(actions)}</div>` : ''}</div>`;

// Pane header pieces: one fact per segment, its parts each in their own tone; `act` opens the fact's home.
// An `open` segment anchors the right-click Menu over it.
export const headerSegment = ({ parts = [], icon = null, tone = null, title = null, act = false, open = false }) => `<span class="kanso-pane-header__segment${act ? ' kanso-pane-header__segment--act' : ''}${open ? ' kanso-pane-header__segment--open' : ''}${tone ? ` kanso-text--${escape(tone)}` : ''}"`
  + `${act ? ' role="button" tabindex="0"' : ''}${title ? ` title="${escape(title)}"` : ''}>${icon ? `<svg class="kanso-icon kanso-icon--inline"><use href="#${escape(icon)}"/></svg>` : ''}`
  + `${parts.filter(Boolean).map(({ text, tone: ink }) => `<span${ink ? ` class="kanso-text--${escape(ink)}"` : ''}>${escape(text)}</span>`).join('')}</span>`;
export const paneName = ({ name }) => `<span class="kanso-pane-header__name">${escape(name)}</span>`;
// Lines added and removed, as git says them.
export const diffText = ({ add = 0, del = 0 }) => `+${Number(add)} −${Number(del)}`;
// Facts on one line, the way a tooltip lists what was folded away.
export const facts = (...parts) => parts.filter(Boolean).join(' · ');

// A count of what is folded away, such as +3.
export const plus = (count) => `+${count}`;

// Status bar pieces: each item is a Mark or an icon with its words, in the bar's meta size.
const inlineIcon = (name) => `<svg class="kanso-icon kanso-icon--inline"><use href="#${escape(name)}"/></svg>`;
// An `open` item anchors the Menu or popup over it.
const itemOpen = (open) => open ? ' kanso-status-bar__item--open' : '';
// A `tool` item is one small button, as the palette's door.
export const statusItem = ({ icon = '', mark: status = '', text = '', tone = '', pending = false, open = false, tool } = {}) => `<span class="kanso-status-bar__item${tone ? ` kanso-text--${escape(tone)}` : ''}${pending ? ' kanso-state-line--pending' : ''}${itemOpen(open)}">`
  + `${tool ? button({ kind: 'icon', size: 'sm', ...tool }) : ''}${status ? mark({ status, size: 'sm' }) : icon ? inlineIcon(icon) : ''}${text === '' || text === null ? '' : `<span>${escape(String(text))}</span>`}${pending ? '<i class="kanso-state-line__pending-dot"></i>' : ''}</span>`;

// The failure pattern on a bar: the blocked mark, our words that truncate first, one small tonal fix that stays.
export const failureLine = ({ text, fix, detail = '' }) => `<span class="kanso-state-line"${detail ? ` title="${escape(detail)}"` : ''}>${mark({ status: 'blocked' })}<span class="kanso-text--truncate">${escape(text)}</span>${button({ label: fix, kind: 'tonal', size: 'sm' })}</span>`;
// The failure pattern in a panel, where the list would start: our words, the source's words, the fix, then Explain.
export const failureBlock = ({ text, source = '', fix, agent = '' }) => `<div class="kanso-state-block" role="alert">${mark({ status: 'blocked' })}<div class="kanso-state-block__what">${escape(text)}</div>`
  + `${source ? `<div class="kanso-state-block__why" title="${escape(source)}">${escape(source)}</div>` : ''}<div class="kanso-state-block__actions">${button({ label: fix, kind: 'solid' })}${agent ? explainButton({ agent }) : ''}</div></div>`;
// The empty pattern: the view's icon, one sentence, at most one action.
export const emptyState = ({ icon = '', text, action = '' }) => `<div class="kanso-state-empty">${icon ? glyph(icon) : ''}<div class="kanso-content__text">${escape(text)}</div>${action ? button({ label: action, kind: 'tonal' }) : ''}</div>`;
export const statePatterns = ['failure', 'empty', 'pending', 'loading'];

export const needsItem = ({ name, question = '', more = 0, open = false }) => `<span class="kanso-status-bar__item kanso-status-bar__needs${itemOpen(open)}">${mark({ status: 'blocked', size: 'sm' })}<span class="kanso-status-bar__name">${escape(name)}</span>`
  + `${question ? `<span class="kanso-status-bar__question">${escape(question)}</span>` : ''}${more ? `<span class="kanso-status-bar__more">${plus(more)}</span>` : ''}</span>`;

// Panes per view: the number at rest, − and + on hover; its keys are in the tooltips.
export const stepper = ({ value = 2, open = false, hover = false } = {}) => `<span class="kanso-status-bar__item kanso-status-bar__stepper${itemOpen(open)}${hover ? ' kanso-control--hover' : ''}">${button({ label: 'Fewer panes per view ⌘⇧−', kind: 'icon', size: 'sm', icon: 'lu-minus' })}`
  + `<span class="kanso-status-bar__value" title="${Number(value)} per view · scroll to change, click to even out">${Number(value)}</span>${button({ label: 'More panes per view ⌘⇧=', kind: 'icon', size: 'sm', icon: 'lu-plus' })}</span>`;

// A terminal's output: each line a list of parts, a part plain words or { text, tone }.
const termPart = (part) => typeof part === 'string' ? escape(part) : `<span class="kanso-text--${escape(part.tone)}">${escape(part.text)}</span>`;
export const terminal = ({ lines = [] }) => `<div class="kanso-terminal">${lines.map((line) => [].concat(line).map(termPart).join('')).join('\n')}</div>`;

// The window's areas by name, each one pressable; the body is blank, the picked area on.
export const windowAreas = ['Sidebar', 'Tab bar', 'Pane header', 'Body', 'Panels', 'Notifications', 'Status bar'];
const areaClass = (name) => name.toLowerCase().replace(/ /g, '-');
export const windowMap = ({ picked = null, hover = null } = {}) => `<div class="kanso-settings__window-map">${windowAreas.map((name) => name === 'Body'
  ? `<span class="kanso-settings__area kanso-settings__area--body"></span>`
  : `<span class="kanso-settings__area kanso-settings__area--${areaClass(name)}${name === picked ? ' kanso-control--on' : ''}${name === hover ? ' kanso-control--hover' : ''}" role="button" tabindex="0" aria-pressed="${name === picked}">${escape(name)}</span>`).join('')}</div>`;

// One release on the timeline: a newer one with its date and action, the one you run marked, the older ones folded into one line.
const releaseDots = { newer: '', here: ' kanso-update__timeline-dot--current', older: ' kanso-update__timeline-dot--small' };
const changeLines = (changes) => changes.map(({ kind, text }, index) => `<div class="kanso-update__change"><span>${kind === changes[index - 1]?.kind ? '' : escape(kind)}</span><span>${escape(text)}</span></div>`).join('');
export const release = ({ version, date = null, node = 'newer', action = null, changes = [] }) => {
  const when = date ? `<span class="kanso-update__timeline-date">${escape(date)}</span>` : '';
  const heading = node === 'older'
    ? `<div class="kanso-update__fold">Older<span class="kanso-update__timeline-date">${escape(version)}</span>${inlineIcon('lu-chevron-right')}</div>`
    : `<div class="kanso-update__timeline-heading"><span class="kanso-update__version-name">${escape(version)}</span>${when}${node === 'here' ? chip({ label: 'you are here' }) : ''}${action ? button({ label: action }) : ''}</div>`;
  return `<div class="kanso-update__timeline-release kanso-update__timeline-release--${node}"><span class="kanso-update__timeline-dot${releaseDots[node]}"></span>${heading}${changeLines(changes)}</div>`;
};

// Bars over time, each a share of the tallest: the `peak` one marked, `low` ones in the blocked tone, a zero one empty,
// a `part` share stacked inside a bar, `values` over their bars and `ticks` under the run; `filled` bars share the width.
const share = (value) => `--k-share:${Math.max(0, Math.min(1, Number(value) || 0))}`;
const barState = (value, index, peak, low) => index === peak ? ' kanso-bars__bar--peak' : low.includes(index) ? ' kanso-bars__bar--low' : Number(value) ? '' : ' kanso-bars__bar--empty';
export const bars = ({ bars: values = [], peak = null, low = [], part = [], labels = [], ticks = [], filled = false }) => `<div class="kanso-bars${filled ? ' kanso-bars--filled' : ''}${labels.some(Boolean) ? ' kanso-bars--labelled' : ''}">`
  + `<div class="kanso-bars__plot">${values.map((value, index) => `<span class="kanso-bars__bar${barState(value, index, peak, low)}" style="${share(value)}">`
    + `${part[index] ? `<span class="kanso-bars__part" style="${share(part[index])}"></span>` : ''}${labels[index] ? `<span class="kanso-bars__label">${escape(labels[index])}</span>` : ''}</span>`).join('')}</div>`
  + `${ticks.length ? `<div class="kanso-bars__ticks">${ticks.map((tick) => `<span>${escape(tick)}</span>`).join('')}</div>` : ''}</div>`;
// A thin track with its filled `share`.
export const meter = ({ share: value = 0, label = '' }) => `<div class="kanso-meter" role="meter" aria-valuemin="0" aria-valuemax="1" aria-valuenow="${Number(value)}"${label ? ` aria-label="${escape(label)}"` : ''}><span class="kanso-meter__fill" style="${share(value)}"></span></div>`;
// Days in week columns, each a level from 0 (none) to 4, or null where there is no day.
export const heatmap = ({ days = [] }) => `<div class="kanso-days">${days.map((level) => `<span class="kanso-days__day${level === null ? ' kanso-days__day--none' : ` kanso-days__day--${Number(level)}`}"></span>`).join('')}</div>`;

export const tabSkeleton = () => '<span class="kanso-skeleton kanso-skeleton--breathing kanso-tab-bar__skeleton"></span>';

// One layout piece for the wrappers that only place other pieces; each variant keeps its own class and states.
export const stacks = {
  toolbar: { block: 'kanso-toolbar', states: ['column'] },
  'toolbar group': { block: 'kanso-toolbar__group', states: ['open'] },
  'toolbar sort': { block: 'kanso-toolbar__sort', tag: 'span', states: ['sorted'] },
  'toolbar add': { block: 'kanso-toolbar__add', tag: 'span' },
  'toolbar menu': { block: 'kanso-toolbar__menu', tag: 'span' },
  header: { block: 'kanso-header', states: ['collapsed'] },
  'header title': { block: 'kanso-header__title' },
  sidebar: { block: 'kanso-sidebar', tag: 'aside' },
  rows: { block: 'kanso-sidebar__rows' },
  'row group': { block: 'kanso-sidebar__row-group' },
  'view switch': { block: 'kanso-sidebar__view-switch' },
  'view menu': { block: 'kanso-sidebar__view-menu' },
  'row menu': { block: 'kanso-sidebar__row-menu' },
  footer: { block: 'kanso-sidebar__footer' },
  rail: { block: 'kanso-rail', tag: 'aside' },
  'rail list': { block: 'kanso-rail__list' },
  'rail tile': { block: 'kanso-rail__tile', focusable: true },
  'rail footer': { block: 'kanso-rail__footer' },
  'rail menu': { block: 'kanso-rail__menu' },
  'sidebar frame': { block: 'kanso-sidebar' },
  'rail frame': { block: 'kanso-rail' },
  'status bar': { block: 'kanso-status-bar', states: ['grid'] },
  'status bar left': { block: 'kanso-status-bar__left' },
  'status bar middle': { block: 'kanso-status-bar__middle' },
  'status bar right': { block: 'kanso-status-bar__right' },
  'status bar popup': { block: 'kanso-status-bar__popup' },
  edge: { block: 'kanso-edge', states: ['target'] },
  'edge column': { block: 'kanso-edge__column', tag: 'span' },
  'edge more': { block: 'kanso-edge__more', tag: 'span' },
  'edge menu': { block: 'kanso-edge__menu', tag: 'span', states: ['left', 'right'] },
  'tab bar': { block: 'kanso-tab-bar' },
  'tab bar more': { block: 'kanso-tab-bar__more', tag: 'span' },
  'tab bar menu': { block: 'kanso-tab-bar__menu', tag: 'span' },
  'tab bar doors': { block: 'kanso-tab-bar__doors', tag: 'span' },
  away: { block: 'kanso-away', tag: 'section' },
  keyboard: { block: 'kanso-keyboard' },
  'keyboard row': { block: 'kanso-keyboard__row' },
  'keyboard layout': { block: 'kanso-keyboard__layout' },
  toasts: { block: 'kanso-toasts' },
  'pane header': { block: 'kanso-pane-header', states: ['focus', 'keyboard', 'blocked', 'unreachable', 'held'] },
  'pane digest': { block: 'kanso-pane-header__digest', tag: 'span' },
  'pane tools': { block: 'kanso-pane-header__tools', tag: 'span' },
  'pane more': { block: 'kanso-pane-header__more', tag: 'span' },
  'pane menu': { block: 'kanso-pane-header__menu', tag: 'span' },
  window: { block: 'kanso-window', states: ['rest'] },
  'window workspace': { block: 'kanso-window__workspace' },
  'window panes': { block: 'kanso-window__panes' },
  pane: { block: 'kanso-pane', states: ['focus', 'drop-preview', 'gone'] },
  'pane body': { block: 'kanso-pane__body' },
  'pane placeholder': { block: 'kanso-pane__placeholder' },
  'pane drop ruler': { block: 'kanso-pane__drop-ruler' },
  'device tools': { block: 'kanso-panel__tools' },
  panel: { block: 'kanso-panel', states: ['narrow', 'window', 'stale'] },
  timeline: { block: 'kanso-update__timeline' },
  columns: { block: 'kanso-layout kanso-layout--columns' },
  column: { block: 'kanso-layout kanso-layout--column' },
  line: { block: 'kanso-layout kanso-layout--line' },
  'panel header': { block: 'kanso-panel-header', states: ['bar'] },
};
export const stack = ({ variant, on = false, ...flags }, ...children) => {
  if (!Object.hasOwn(stacks, variant)) throw new Error(`stack: unknown variant "${variant}"`);
  const { block, tag = 'div', states = [], focusable = false } = stacks[variant];
  const unknown = Object.keys(flags).find((flag) => !states.includes(flag));
  if (unknown) throw new Error(`stack: variant "${variant}" has no state "${unknown}"`);
  const classes = [block, ...states.filter((state) => flags[state]).map((state) => `${block}--${state}`), on ? 'kanso-control--on' : ''].filter(Boolean).join(' ');
  return `<${tag} class="${classes}"${focusable ? ' tabindex="0"' : ''}>${list(children)}</${tag}>`;
};
