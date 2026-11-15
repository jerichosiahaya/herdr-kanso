// Story frames shared by the catalog script and the playgrounds: a bar or a strip at one of the kit's widths, each width a frame class on tokens.
import { statusBar } from './compositions.js';

export const barWidths = [1200, 1040, 760, 520];
const width = (value) => `kanso-story--w${barWidths.includes(value) ? value : 1040}`;
export const atWidth = (value, markup) => `<div class="kanso-story__bar ${width(value)}">${markup}</div>`;
export const inStrip = (value, markup) => `<div class="kanso-story__strip ${width(value)}">${markup}</div>`;
export const inBar = (value, parts) => atWidth(value, statusBar(parts));
