// The hypothesis behind each decision that removes, hides or moves a piece, and the signal that would prove it wrong.
export const hypotheses = {
  'Compositions/Edges': [
    {
      change: 'No minimap.',
      believe: 'someone running several agents reaches the pane they want as fast as with the minimap, with one thing less at rest: the edges put each pane out of view at its own side, with its program, one click away. The wheel over an edge slides the view; a pinned pane keeps its pin in its header.',
      wrong: 'with more than four columns, someone needs to know which column they are on and cannot tell from the edges; reaches for the wheel and finds nowhere to turn it; needs more clicks or ⌘J to reach a far pane than today; or a user asks for the minimap back.',
    },
  ],
  'Compositions/Keyboard': [
    {
      change: 'No row of modifier chips: the modifier keys on the map pick the layer.',
      believe: 'the modifier is where the eye already is when reading the map; four chips above it are a second copy of four keys, and holding the real modifier still works.',
      wrong: 'someone cannot find how to see another layer, or clicks a modifier key and does not expect it to stay held.',
    },
    {
      change: 'Lists and the layer count move from the chip row to the picked key.',
      believe: 'the count belongs to the layer being read, and the list keys are learned once, so their door is needed only beside the key in hand.',
      wrong: 'someone never reaches the list layer, or misses how many keys a layer has.',
    },
  ],
  'Compositions/Status bar': [
    {
      change: 'Panes per view shows its number at rest, − and + on hover.',
      believe: 'the number is the fact worth seeing; the buttons are needed only while changing it, and the wheel, the click to even out and the keys in the tooltip cover the rest.',
      wrong: 'someone cannot find how to change panes per view, or changes it often enough that the hover becomes a cost.',
    },
    {
      change: 'The palette is an icon Button with its key in the tooltip.',
      believe: 'a key is not a fact: the door to the palette is what would be missed, and the key is learned from its tooltip like every other key.',
      wrong: 'someone who used the key text to learn ⌘K stops opening the palette.',
    },
    {
      change: 'No working count.',
      believe: 'the rows and tiles already say who is working; a count on the bar is a second copy that nobody acts on.',
      wrong: 'with the sidebar folded, someone cannot tell whether any agent is still working.',
    },
  ],
  'Compositions/Tab bar': [
    {
      change: 'A mark only for Needs you.',
      believe: 'only a waiting session asks for an act; working and finished are said by the rows and the pane headers, so a tab mark for them is noise.',
      wrong: 'someone misses that the agents of a tab out of view have finished.',
    },
  ],
};
