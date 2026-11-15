// Story frames shared by the catalog script and the playgrounds: a bar or a strip at one of the kit's widths, each width a frame class on tokens.
import { statusBar } from './compositions.js';
import { list, stack } from './pieces.js';

export const barWidths = [1200, 1040, 760, 520];
const width = (value) => {
  if (!barWidths.includes(value)) throw new Error(`frames: unknown width ${value}`);
  return `kanso-story--w${value}`;
};
export const atWidth = (value, markup) => `<div class="kanso-story__bar ${width(value)}">${markup}</div>`;
export const inStrip = (value, markup) => `<div class="kanso-story__strip ${width(value)}">${markup}</div>`;
export const inBar = (value, parts) => atWidth(value, statusBar(parts));
// A place's name over its drawing; a slice of the sidebar; a slice of Settings.
export const captioned = (place, markup) => `<p class="kanso-story__caption">${place}</p>${markup}`;
export const inSlice = (...parts) => `<div class="kanso-story__slice">${list(parts)}</div>`;
export const inSettings = (markup) => `<div class="kanso-story__slice kanso-story__settings">${markup}</div>`;
// A piece in the open sidebar's width, or in the rail's.
export const inSidebar = (markup) => stack({ variant: 'sidebar frame' }, markup);
export const inRail = (markup) => stack({ variant: 'rail frame' }, markup);
