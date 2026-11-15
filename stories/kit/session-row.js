// The session row: one agent's session in the sidebar, the row in its own configuration.
import { row } from './kit.js';

export const sessionRow = ({ program = 'p-claude', name, activity = null, time = null, place = null, status = 'working', depth = 1, current = false, pinned = false, commands = 0, hover = false, focus = false, dimmed = false }) => row({
  icon: program, name, second: activity, detail: place, meta: time, mark: status, depth, current, dimmed, hover, focus,
  glint: status === 'working', flag: pinned ? 'lu-pin' : null, chip: commands, actions: [{ icon: 'lu-pin', label: 'Pin to the top' }, { icon: 'lu-ellipsis', label: 'More' }],
});
