// The panels' design guidelines and hypotheses, on the same templates as every page.

export const panelGuidelines = {
  'Panels/Settings': [
    ['Kokō', 'One window, four pages.', 'A Dialog at window size: the title and its pages as Tabs beside it. ⌃⇧, opens it on What shows, ⌘⇧/ on Keys, a piece’s Settings for this… on its area; Esc closes it. Herdr settings is a separate window, reached from the footer’s Settings menu.'],
    ['Kansō', 'It opens on what you hid.', 'What shows starts with Hidden by you, one press each to show again. Every other piece is one step away: Find, or Browse the window and pick an area on its map.'],
    ['Kokō', 'A switch, and its condition in words.', 'Each piece is a Row with its Switch. A piece that can show only when needed says when, such as only when one waits. Off is dimmed. Hiding a piece stops the work behind it; the area says which.'],
    ['Shizen', 'A switch acts at once.', 'The row turns on or off at the press, with the breathing dot until the choice is written. A refusal is the Failure block under the row.'],
    ['Kokō', 'Keys: the keyboard, then the groups.', 'The keyboard of the held layer and the picked key, then kansō’s groups folded to a line with their counts, and Herdr’s keys, which open Herdr settings. A group opens its Shortcut rows in place; Vim keys ends with the way to the hjkl dōjō.'],
    ['Kokō', 'What’s new is a timeline.', 'Updates first, Stable Mode or Dawn Mode. Then the releases from the newest: a newer one carries the one action, Update to it; the installed one says you are here; the older ones fold into one line.'],
    ['Seijaku', 'Room.', 'What shows never scrolls at 860 by 680; Keys and What’s new scroll as documents.'],
  ],
};

export const panelHypotheses = {
  'Panels/Settings': [
    {
      change: 'Pieces becomes What shows, and opens on what you hid.',
      today: 'Pieces lists every piece of every group, each with Show, When needed and Hide.',
      why: 'every choice in one list, to scan and change.',
      question: 'what does someone open this page for, other than to bring back something they hid?',
      believe: 'opening on Hidden by you answers the common visit in one press, and Find or the map reaches any other piece in one step.',
      jobs: [['bring a piece back', 'Hidden by you, Show'], ['change any piece', 'Find, or Browse the window and its area'], ['Reset all', 'the area’s heading']],
      wrong: 'people browse every area one by one, or search for a piece they could not find.',
      try: 'Dawn Mode first.',
      back: 'the page lists every group again, as today.',
    },
    {
      change: 'Show, When needed and Hide become a Switch and the condition in words.',
      today: 'three Tabs on each row.',
      why: 'three states are three choices.',
      question: 'how often is When needed chosen against its default?',
      believe: 'on or off is the choice people make; the words say when an on piece shows, and pressing them switches between always and only when needed.',
      jobs: [['show or hide', 'the Switch'], ['only when needed', 'the words beside it']],
      wrong: 'someone looks for When needed and does not find it.',
      try: 'Dawn Mode first.',
      back: 'the three Tabs come back on each row.',
    },
    {
      change: 'kansō help becomes the Keys page, and the header loses the version, Help and Esc.',
      today: 'a second window, kansō help, with Keyboard, hjkl dōjō and Guide; each window links to the other; the header shows the installed version and the word Esc.',
      why: 'help with keys in one place, settings in another, and a way between them.',
      question: 'what does help hold that Keys does not, once the keyboard is on Keys?',
      believe: 'one window answers which key does what and lets you change it; two windows linked to each other make you look in both.',
      jobs: [['which key does what', 'Keys, its keyboard and the picked key'], ['the hjkl dōjō', 'its own window, from Practice them in Vim keys'], ['the Guide', 'the site’s docs'], ['the installed version', 'What’s new, you are here'], ['how to close', 'Esc, as in every dialog'], ['⌘⇧/', 'opens Keys']],
      wrong: 'someone presses ⌘⇧/ and looks for help that Keys does not give, or cannot close the window.',
      try: 'Dawn Mode first.',
      back: 'kansō help returns as its own window, with the links between the two.',
    },
    {
      change: 'Keys loses its two explaining lines, and the tab bar tiles become the Panels group.',
      today: 'two lines say these are kansō’s own keys and that Herdr’s are in Herdr’s settings; Panels draws each panel as a tile with its key.',
      why: 'to say what the page holds, and to show each panel’s key.',
      question: 'what does the reader do with those lines that the keyboard and the groups do not show?',
      believe: 'the keyboard shows whose key is whose, Herdr’s keys is a row that opens Herdr’s settings, and one row says a panel opens with its number.',
      jobs: [['kansō’s or Herdr’s', 'the keyboard’s tones and the Herdr’s keys row'], ['each panel’s key', 'Open or close a panel, ⌥⌘1…9']],
      wrong: 'someone changes a Herdr key here, or cannot find a panel’s key.',
      try: 'Dawn Mode first.',
      back: 'the two lines and the tiles return.',
    },
    {
      change: 'Credits shows three places and one line of names.',
      today: 'a sentence, two headings, and each person on a row with a GitHub picture and their profile.',
      why: 'to credit the people and the places kansō comes from.',
      question: 'who opens a person’s profile from here?',
      believe: 'names in one line credit everyone; the kansō row opens the repository, which lists each of them.',
      jobs: [['where it comes from', 'Herdr, kansō and Lucide, each opening its page'], ['who made it', 'Maintained by'], ['a person’s profile', 'the kansō row, then the repository']],
      wrong: 'someone looks for a maintainer’s profile and cannot reach it.',
      try: 'Dawn Mode first.',
      back: 'each person gets their row and picture again.',
    },
  ],
};
