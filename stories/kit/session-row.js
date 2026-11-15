// The session row: one agent's session in the sidebar, the row in its own configuration.
import { row } from './kit.js';

const ACTIVITY_TONE = { blocked: 'fg', working: 'muted' };

export const sessionRow = ({ program = 'p-claude', name, activity = null, step = null, time = null, place = null, placeTip = null, status = 'working', depth = 1, guides = [], current = false, pinned = false, pinnable = true, commands = 0, commandsTip = null, tools = [], refresh = false, drop = null, hover = false, focus = false, dimmed = false }) => row({
  icon: program, name, mark: status, depth, guides, current, dimmed, hover, focus, drop, glint: status === 'working',
  second: activity && [{ text: activity, tone: ACTIVITY_TONE[status] ?? 'dim' }, step && { text: step.time, tone: step.stuck ? 'blocked' : 'dim' }],
  detail: place && { text: place, tip: placeTip }, meta: time && { text: time, tone: status === 'blocked' ? 'blocked' : null },
  wash: status === 'blocked' && !current ? 'blocked' : null, flag: pinned ? 'lu-pin' : null, chip: commands && { label: commands, tip: commandsTip },
  action: refresh ? { kind: 'icon', icon: 'lu-refresh-cw', label: 'Refresh' } : null,
  actions: [...tools, pinnable && { icon: 'lu-pin', label: pinned ? 'Unpin' : 'Pin to the top' }, { icon: 'lu-ellipsis', label: 'More' }].filter(Boolean),
});
