// Compose retained panel features from the shared kit.
import { frame as free } from './storybook-markup.mjs';
import { panel, panelBack, panelClose, panelHeader, panelRefresh } from '../stories/kit/compositions.js';

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const icon = (name) => `<svg class="kanso-icon" aria-hidden="true"><use href="#lu-${name}"/></svg>`;
const button = (text, kind = 'quiet', disabled = false) => `<button type="button" class="kanso-button kanso-button--${kind}"${disabled ? ' disabled' : ''}>${text}</button>`;
const primary = (text) => `<button type="button" class="kanso-button kanso-button--solid">${text}</button>`;
const tool = (name, title) => `<button type="button" class="kanso-button kanso-button--icon" aria-label="${title}" title="${title}">${icon(name)}</button>`;
const actions = (...items) => `<div class="kanso-actions">${items.join('')}</div>`;
const note = (text) => `<div class="kanso-panel__note">${text}</div>`;
const refused = (text) => `<div class="kanso-panel__note kanso-text--blocked">${text}</div>`;
const section = (text) => `<div class="kanso-section">${text}</div>`;
const row = (name, value, focused = false) => `<div class="kanso-row${focused ? ' kanso-row--selected kanso-control--focus' : ''}" tabindex="0"><span class="kanso-row__name kanso-story__ellipsis" title="${esc(name)}">${name}</span><span class="kanso-row__value kanso-story__ellipsis" title="${esc(value)}">${value}</span></div>`;
const pending = (text) => `<span class="kanso-state-line kanso-state-line--pending"><span class="kanso-state-line__pending-dot"></span>${text}</span>`;
const empty = (name, text) => `<div class="kanso-state-empty">${icon(name)}<div class="kanso-content__text">${text}</div></div>`;
const bones = (count = 4) => `<div class="kanso-skeleton__list kanso-skeleton--breathing" aria-label="Loading">${Array.from({ length: count }, () => '<div class="kanso-row"><span class="kanso-skeleton kanso-layout__grow"></span></div>').join('')}</div>`;
const failure = (what, why, fix = 'Refresh') => `<div class="kanso-state-block"><svg class="kanso-mark kanso-mark--blocked" aria-hidden="true"><use href="#e-blk"/></svg><div class="kanso-state-block__what">${what}</div><div class="kanso-state-block__why" title="${esc(why)}">${why}</div><div class="kanso-state-block__actions">${button(fix, 'tonal')}<button type="button" class="kanso-button kanso-button--tonal kanso-explain">${icon('bot')}Explain to checkout</button></div></div>`;
const blocked = (what, why = '', ...fixes) => `<div class="kanso-state-block"><svg class="kanso-mark kanso-mark--blocked" aria-hidden="true"><use href="#e-blk"/></svg><div class="kanso-state-block__what">${what}</div>${why ? `<div class="kanso-state-block__why" title="${esc(why)}">${why}</div>` : ''}${fixes.length ? `<div class="kanso-state-block__actions">${fixes.join('')}</div>` : ''}</div>`;
const swap = (html, from, to) => {
  if (!html.includes(from)) throw new Error(`Drawing changed, cannot find: ${from.slice(0, 80)}`);
  return html.replace(from, () => to);
};
const frame = (title, scope, body, tools = '', window = false) => `<div class="kanso-story"><div class="kanso-story__theme kanso-story__frame ${window ? 'kanso-story--free' : 'kanso-panel kanso-panel--fit'}">${panel({ look: window ? 'window' : 'panel', header: panelHeader({ title, form: window ? 'bar' : 'page', start: window && title !== 'Markdown' ? [panelBack()] : [], second: scope, tools: [tools, panelRefresh(), panelClose()] }) }, body)}</div></div>`;

export function panelStateRecords(records) {
  const drawings = [], find = (part) => records.find((r) => r.id.includes(part) && r.html)?.html;
  const add = (page, component, state, html, behavior) => drawings.push({ id: `panels/${page.toLowerCase()}/Feature${component.replaceAll(' ', '')}/${state}`, source: 'panels', page: `Panels/${page}`, label: `${component} · ${state}`, caption: behavior, html, spec: [['Anatomy', `${component}: shared panel header, scope and kit state primitives.`], ['Values', 'Shared kit tokens, single-line rows with ellipsis, contextual controls.'], ['States', state], ['Behaviour', behavior], ['Principle', 'Kansō']] });
  const put = (page, component, state, html, behavior, anatomy) => drawings.push({ id: `panels/${page.split('/')[1].toLowerCase()}/Feature${component.replaceAll(' ', '')}/${state}`, source: 'panels', page, label: `${component} · ${state}`, caption: behavior, html, spec: [['Anatomy', anatomy], ['Values', 'Shared kit tokens, single-line rows with ellipsis, contextual controls.'], ['States', state], ['Behaviour', behavior], ['Principle', 'Kansō']] });
  const toast = (mark, text, fix = '') => free(`<div class="kanso-toast kanso-popover">${mark}<span class="kanso-content__text" title="${esc(text)}">${text}</span>${fix}</div>`);
  const done = '<svg class="kanso-icon kanso-icon--row" aria-hidden="true"><use href="#lu-check"/></svg>';
  const failed = '<svg class="kanso-mark kanso-mark--blocked" aria-hidden="true"><use href="#e-blk"/></svg>';
  const notice = 'The toast: mark, one line, at most one action.';
  for (const [state, notes, behavior] of [
    ['Installed, keys updated', "kansō's keys updated.", 'The release changed kansō’s keys; yours were merged with them.'],
    ['Installed, kept your keys', "kansō's keys updated. Kept your own cmd-d, cmd-shift-w.", 'Keys you changed yourself stay yours and are named.'],
    ['Installed, keys.json unreadable', "Your keys.json could not be read, so kansō's keys were left as they are.", 'An unreadable keys.json is left untouched.'],
    ['Installed, new layout', 'New layout; the one you had is in layouts/kanso.json.old-*.', 'A changed layout replaces yours, which is kept beside it.'],
  ]) put('Compositions/Notifications', 'Update Notice', state, toast(done, `kansō updated to 3.31.0: ${notes}`), behavior, notice);
  for (const [state, why, behavior] of [
    ['Install failed, Windows tool missing', 'curl.exe is not on PATH; nothing was downloaded another way', 'On Windows the update needs curl.exe and tar.exe; nothing else downloads it.'],
    ['Install failed, Windows folder not moved', 'could not put kanso-tabs in place: C:\\Users\\you\\AppData\\Roaming\\herdr-app\\mods\\kanso-tabs', 'On Windows a mod folder that cannot be moved stops the update; what you had stays in place.'],
  ]) put('Compositions/Notifications', 'Update Notice', state, toast(failed, `kansō was not updated: ${why}`, '<button type="button" class="kanso-button kanso-button--tonal">Update</button>'), behavior, notice);
  const ports = find('panels/ports/PortsAtRestNow/Default');
  if (ports) put('Panels/Ports', 'Ports', 'Not attributed', ports.replace(/(?:<\/div>){4}$/, (end) => blocked('Some servers cannot be attributed', 'Working directories require a Herdr API on Windows.') + end), 'Where working directories cannot be read, servers are still listed and can be stopped; the panel says why they have no project.', 'The panel: header, rows and the failure block.');
  const dojo = find('proto/layouts-hjkl-dojo/HjklDojo/Default');
  if (dojo) put('Panels/Dojo', 'Practice Feedback', 'sqlite3 missing', swap(dojo, 'Make a move to start: 10 targets, in as few moves as you can.', 'Install sqlite3 to keep your rounds.'), 'Without sqlite3 the dōjō plays, and the line under Hachi says rounds are not kept.', 'The dōjō: path, board, feedback line and keyboard.');
  const pr = find('panels/pr/PRDetailsDetailsOpen/Default');
  if (pr) {
    const file = (name, folder, stat, status = '') => `<div class="kanso-row">${status ? `<span class="kanso-file__status kanso-text--dim">${status}</span>` : '<span class="kanso-file__spacer"></span>'}<span class="kanso-row__filename">${name}</span><span class="kanso-row__directory-path">${folder}</span><span class="kanso-row__meta">${stat}</span></div>`;
    const files = [['checkout.ts', 'src/api', '+14 −3'], ['limits.ts', 'src/api', '+22', 'A'], ['limits.test.ts', 'src/api', '+6 −4'], ['bucket.ts', 'src/api', '+31', 'A'], ['cart.tsx', 'src/web', '+9 −2'], ['retry.ts', 'src/web', '+12'], ['en.json', 'locales', '+3'], ['de.json', 'locales', '+3']].map((f) => file(...f)).join('');
    put('Panels/PR', 'Pull Request Details', 'Files cut off', frame('#142', 'acme-shop · checkout-v2 → main', `<div class="kanso-section">Files<span class="kanso-row__detail">140 · +4,812 −1,206</span></div>${files}${actions(button('Show 92 more'))}${note('GitHub lists the first 100 of 140 files.')}`), 'Past 100 files GitHub lists only the first 100; the panel says how many there are.', 'The panel: header, scope, Files section, rows and one quiet line.');
  }
  if (!find('components-markdown-window/MarkdownWindow/') || !find('SimulatorAndroidTouchKeysTheDevicesButtons/')) return drawings;
  const document = find('components-markdown-window/MarkdownWindow/').match(/<div class="kanso-markdown__document">[\s\S]*(?=<\/div><\/div><\/div><\/div>$)/)[0];
  const code = '<div class="kanso-code kanso-code--source"><span class="kanso-row__name">1</span>const LIMIT = { free: 40, pro: 400 };\n<span class="kanso-row__name">2</span>const REFILL_MS = 1000;</div>';
  const md = (body, scope = '~/acme-shop/docs', tools = '') => frame('plan.md', scope, body, tool('code', 'Source') + tools, true);
  const preview = (body, scope = '~/acme-shop/docs', tools = '', title = 'limits.md') => frame(title, scope, body, tool('code', 'Source') + tool('external-link', 'Open with…') + tools);
  const sim = (body, scope = 'This computer') => frame('Simulator', scope, body, tool('smartphone', 'Devices'));

  add('Preview', 'Preview', 'Loading', preview(bones(), '~/acme-shop/src/api', '', 'limits.ts'), 'The file header stays while its text loads.');
  add('Preview', 'Preview', 'Read failed', preview(failure('Can’t read limits.ts', 'EACCES: permission denied, open limits.ts'), '~/acme-shop/src/api', '', 'limits.ts'), 'Read failure offers Refresh and the source error.');
  add('Preview', 'Preview', 'Picture failed', preview(failure('Can’t show checkout.png', 'Cannot show this picture'), '~/acme-shop/screens', '', 'checkout.png'), 'A failed picture keeps Open with and Refresh available.');
  add('Preview', 'Preview', 'Save failed', preview(failure('Couldn’t save limits.ts', 'EACCES: permission denied, write limits.ts', 'Save') + code + actions(button('Discard')), '~/acme-shop/src/api · Edited', '', 'limits.ts'), 'The draft stays after a refused save; Save retries and Discard remains available.');
  add('Preview', 'Markdown Editing', 'Append', preview(document + '<div class="kanso-markdown__editor kanso-control--focus" tabindex="0" role="textbox" aria-label="New Markdown block">## Rollout<span class="kanso-caret"></span></div>', '~/acme-shop/docs · Edited', button('Discard')), 'Double-clicking below the final block appends an editable block; Escape returns to reading.');
  add('Preview', 'Markdown Editing', 'Image failed', preview(document + failure('Can’t show diagram.png', 'Cannot show this picture')), 'A failed inline image leaves the surrounding Markdown readable.');
  add('Preview', 'Markdown Editing', 'Loading', preview(bones(6)), 'Markdown blocks load beneath the document controls.');
  add('Preview', 'Markdown Editing', 'Save failed', preview(failure('Couldn’t save limits.md', 'EACCES: permission denied, write limits.md', 'Save') + document, '~/acme-shop/docs · Edited', button('Discard')), 'The Markdown draft remains available after the write fails.');
  add('Preview', 'Markdown Editing', 'Saving', preview(document, '~/acme-shop/docs · Saving…', pending('Saving…')), 'The edited Markdown remains visible during the pending write.');
  add('Preview', 'Markdown Editing', 'Stale', preview(document + note('devbox did not answer. Changes save when it is back.'), 'devbox: ~/acme-shop/docs · as of 14:06', button('Discard')), 'The last document and local draft remain while the remote computer is unreachable.');
  add('Preview', 'Code Limits', 'Truncated code', preview(code + '<div class="kanso-code kanso-code--source">… (file truncated)</div>', '~/acme-shop/src/api · Read only', '', 'limits.ts'), 'Code beyond 400,000 characters is truncated and read only.');
  add('Preview', 'Code Limits', 'Truncated markdown', preview(document + '<div class="kanso-markdown__section">… (file truncated)</div>', '~/acme-shop/docs · Read only'), 'The Markdown renderer ends its retained content with the truncation marker.');

  const list = (body, scope = '~/acme-shop/docs') => frame('Markdown', scope, body, '', true);
  add('Markdown', 'Markdown Files', 'Empty', list(empty('file', 'No Markdown in ~/acme-shop/docs')), 'An empty folder keeps the window controls available.');
  add('Markdown', 'Markdown Files', 'Loading', list(bones()), 'The folder list is loading, with no false empty message.');
  add('Markdown', 'Markdown Files', 'Keyboard', list(section('In this folder') + row('plan.md', '', true) + row('limits.md', 'api')), 'The focused file row uses the kit focus ring.');
  add('Markdown', 'Markdown Files', 'Recent', list(section('From this terminal') + row('notes.md', '~/acme-shop') + section('In this folder') + row('plan.md', '') + row('limits.md', 'api')), 'Recent terminal documents appear before folder files and retain their folder context.');
  add('Markdown', 'Markdown Files', 'Remote', list(section('In this folder') + row('plan.md', '') + row('limits.md', 'api'), 'devbox: /srv/acme-shop/docs'), 'Remote files keep their computer and folder visible.');
  add('Markdown', 'Markdown Files', 'Review waiting', list(section('Waiting for your review') + row('plan.md', '~/acme-shop/docs') + row('release.md', '~/infra') + section('From this terminal') + row('notes.md', '~/acme-shop') + section('In this folder') + row('limits.md', 'api')), 'Pending reviews stay first and can be reopened after closing a document.');
  add('Markdown', 'Markdown Review', 'Review', md(document, '~/acme-shop/docs · checkout waits for your review', button('Done', 'tonal')), 'Done saves the document, answers every waiting review for this file and closes when no review remains.');
  add('Markdown', 'Markdown Review', 'Another review', md(document + note('release.md also waits for your review'), '~/acme-shop/docs · checkout waits for your review', button('Done', 'tonal')), 'Done on this document opens the next waiting review instead of closing the window.');
  add('Markdown', 'Markdown Review', 'Saving', md(document, '~/acme-shop/docs · checkout waits for your review', pending('Saving…') + button('Done', 'tonal', true)), 'The document stays while Done flushes its pending write.');
  add('Markdown', 'Markdown Review', 'Save failed', md(failure('Couldn’t save plan.md', 'EACCES: permission denied, write plan.md', 'Save') + document, '~/acme-shop/docs · checkout waits for your review · Edited', button('Done', 'tonal')), 'The draft and review stay available after a failed document write.');
  add('Markdown', 'Markdown Review', 'Marker failed', md(failure('Review not delivered', 'md-review was not told: EACCES: permission denied', 'Done') + document, '~/acme-shop/docs · checkout waits for your review'), 'Done retries telling the waiting session; the header does not repeat the failed action.');

  const iosControls = (acting = false, url = 'acme-shop://checkout') => actions(button('Open in Simulator', 'quiet', acting), button('Appearance light', 'quiet', acting), button('Appearance dark', 'quiet', acting), button('Shut down', 'quiet', acting)) + `<div class="kanso-actions"><input class="kanso-field kanso-layout__grow" aria-label="Device URL" value="${url}"${url === 'checkout' ? ' aria-invalid="true"' : ''}>${button('Open a URL', 'quiet', acting || url === 'checkout')}</div>`;
  const android = find('SimulatorAndroidTouchKeysTheDevicesButtons/').replace('width:200px;height:420px', 'width:calc(var(--k-sp-4) * 12.5);height:calc(var(--k-sp-4) * 26.25)');
  const screen = android.match(/<div class="kanso-simulator kanso-panel--focus">[\s\S]*?(?=<div class="kanso-panel__tools">)/)[0].trim();
  add('Simulator', 'Device Controls', 'Acting', sim(row('iPhone 16 Pro', 'iOS 18 · Booted') + note(pending('Appearance dark…')) + iosControls(true)), 'All device commands wait while one command runs.');
  add('Simulator', 'Device Controls', 'URL invalid', sim(row('iPhone 16 Pro', 'iOS 18 · Booted') + iosControls(false, 'checkout') + note('Enter a URL with a scheme, such as acme-shop://checkout.')), 'An invalid URL cannot be opened; other device controls stay available.');
  add('Simulator', 'Devices', 'Empty', sim(empty('smartphone', 'No devices')), 'Installed tools returned no devices; Refresh reads them again.');
  add('Simulator', 'Devices', 'Emulator binary missing', sim(row('Pixel 8', 'Android · Off') + note('Android SDK emulator binary is missing.') + empty('smartphone', 'Off')), 'adb is installed but an emulator cannot be started without its binary.');
  add('Simulator', 'Devices', 'Offline', sim(row('Pixel 8', 'Android · Off', true) + note('offline') + empty('smartphone', 'Off')), 'An offline Android device keeps its row but has no active screen controls.');
  add('Simulator', 'Devices', 'Unauthorized', sim(row('R58M123', 'Android · Off', true) + note('unauthorized') + empty('smartphone', 'Off')), 'An Android device awaiting trust remains listed with the source status.');
  add('Simulator', 'Devices', 'Remote project', sim(row('Pixel 8', 'Android · Booted', true) + note('Devices are on this computer.') + screen + android.slice(android.indexOf('<div class="kanso-panel__tools">'), android.lastIndexOf('</div></div></div>')) + actions(button('Rotate'), button('Shut down')), 'devbox: ~/acme-shop · Devices on this computer'), 'A remote project still uses the devices attached to this computer.');
  add('Simulator', 'Devices', 'Start timed out', sim(row('Pixel 8', 'Android · Off', true) + failure('Couldn’t start Pixel 8', 'Start timed out.', 'Start')), 'A start timeout returns the device to Off and offers Start again.');
  add('Simulator', 'Picture State', 'Key focus', android.replace('kanso-simulator kanso-panel--focus', 'kanso-simulator kanso-panel--focus kanso-control--focus').replace('<div class="kanso-panel__tools">', '<div class="kanso-panel__scope">Keyboard · type, paste, Enter, Backspace and arrow keys go to Pixel 8</div><div class="kanso-panel__tools">'), 'A focused Android picture receives keyboard input, paste and touch gestures.');
  add('Simulator', 'Picture State', 'No picture', sim(row('iPhone 16 Pro', 'iOS 18 · Booted') + empty('smartphone', 'No picture from the device') + iosControls()), 'A booted device with no frame still offers its commands and Refresh.');
  const port = (number, command, ...labels) => `<div class="kanso-row--two-lines"><div class="kanso-content__primary kanso-panel__compact-row"><span class="kanso-row__port">${number}</span><span class="kanso-text--muted kanso-text--truncate">${command}</span></div><div class="kanso-content__actions kanso-panel__actions">${labels.map((label) => button(label)).join('')}</div></div>`;
  const computer = (name, count) => `<div class="kanso-section">${name}<span class="kanso-row__meta">${count}</span></div>`;
  const computers = (body) => frame('Ports', 'All computers', body, tool('share', 'Share'));
  const here = section('dark') + port(':3000', 'next dev', 'Open in the browser', 'Go to its pane', 'Stop') + port(':6006', 'storybook', 'Open in the browser', 'Stop');
  add('Ports', 'Computers', 'Another computer', computers(here + computer('light', 1) + port(':5173', 'vite', 'Open in the browser', 'Go to its pane', 'Stop')), 'Each connected computer’s servers sit under its name, this computer first; Open, Go to its pane and Stop act on the computer the server runs on.');
  add('Ports', 'Computers', 'Unreachable', computers(here + note('<span class="kanso-text--blocked">light · unreachable</span>')), 'A computer out of reach is one line, “light · unreachable”, or what it lacks, such as “lsof is not installed”; this computer’s list never waits for it.');
  return drawings;
}
