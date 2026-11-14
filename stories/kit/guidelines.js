// Design guidelines per page: principle, rule, detail; extra sections: title, text; and Start page prompts.
import { ledgerPrompt } from "./ledger.js";

export const guidelines = {
  "Tokens/Colour": [
    ["Seijaku", "Use a token, never a value.", "Every colour in a board or a mod is one of the tokens in the table. A new colour is added to the table, with its use and its rule, before anything uses it."],
    ["Fukinsei", "Three text levels:", "fg, muted and dim, told apart by size and place first and tone second."],
    ["Kokō", "One colour, one meaning.", "A state colour appears only on the thing in that state. Colour on anything that asks nothing is a defect."],
    ["Shizen", "Washes come from the foreground:", "track 4%, hover 7%, selected 12%, active project 14%. Light uses the same steps; it never reaches pure white or black."],
  ],
  "Tokens/Contrast, light and dark": [
    ["Shizen", "Text passes 4.5:1", "on every surface it can sit on, including hover and selected. Marks, focus rings and control edges pass 3:1. Never lower contrast with opacity on text."],
    ["Seijaku", "Light and dark are one design.", "They share the same geometry and the same token names; only the values differ."],
    ["Seijaku", "Checking a change.", "Any change to a token is measured against every surface in the table, hover and selected included, before it is published."],
  ],
  "Tokens/Type": [
    ["Fukinsei", "Hierarchy.", "Six roles, each with one size, weight and tone. Display 48 regular, the one number. Title 20 strong. Section 15 strong. Group 13.5 strong. Name 13.5 medium. Body 12.5 regular, with controls at 12.5 medium. Meta 11.5 regular in muted or dim. Size and weight tell the level; colour comes last."],
  ],
  "Tokens/Spacing": [
    ["Seijaku", "Space.", "Use the 4-based scale only: 2, 4, 8, 12, 16, 24, 32. The same relation always gets the same gap. Icon to label is 8. Control to control is 8. Rows touch. Groups and fields are 12 apart. Panel padding is 16. Nothing is glued and nothing floats."],
  ],
  "Tokens/Radius": [
    ["Seijaku", "Radius.", "Use the scale only: 4, 6, 8, 12 and full. Key hints and skeletons 4. Buttons, rows and fields 6. Cards, menus, panels and dialogs 8. Windows and frames 12. Pills and switches full. The same piece always gets the same radius."],
    ["Shizen", "Content keeps its own corner.", "A device's frame follows the device, so its radius is not from the scale."],
  ],
  "Tokens/Motion": [
    ["Shizen", "Motion.", "Only three things move. The ensō spins at 900 ms. A working name shimmers with three glints over 2200 ms, with no dots. A blocked pane's bar breathes. Nothing changes size or place. Reduced motion holds everything still."],
    ["Shizen", "Live states.", "Hover moves only tone, entering in 120 ms and leaving in 80 ms. Hover never reaches a disabled control and never replaces a state."],
    ["Kansō", "Armed.", "Only an action that cannot be undone asks twice. It fills with accent and reads \"Press again to <verb>\" for 4 s. Both labels share one cell, so nothing moves."],
  ],
  "Tokens/Icons": [
    ["Kokō", "Icons.", "Use exact Lucide icons, one name per meaning, at 12, 14, 15 or 17. Show an icon only where it tells something apart. The ensō marks and program marks are marks, not icons."],
    ["Seijaku", "Lucide, unchanged.", "Every icon is Lucide 1.72.0, the icon's own markup: 24 grid, stroke 2, round caps and joins. Ids are lu- and the Lucide name."],
    ["Seijaku", "One name per meaning", "across every board: one close (lu-x), one more (lu-ellipsis), one pin, one sync, one share, one layers, one terminal. A plain shell is lu-terminal."],
    ["Kokō", "Marks are not icons:", "the ensō marks and spinner, the blocked mark, the Claude Code and Codex marks, Hachi's pixel art, the Dawn artwork, the kansō wordmark, the macOS window lights."],
    ["Kokō", "No icon, a word.", "Android has no Lucide icon, so its button says \"Android\". iOS uses lu-apple, as the app does."],
  ],
};
const build = "Then run `npm run build:site-tokens`, `npm run build:ui-tokens` and `npm run build:stories`, and `npm run check:tokens` must pass.";
const adding = (what, rule) => [`Adding ${what}`, `The table is the only set. ${rule} Add it to \`kanso/tokens.json\` with its name, value and use before anything uses it. ${build}`];

export const sections = {
  "Tokens/Colour": [adding("a colour", "A new colour gets a value in both dark and light, passes 4.5:1 for text or 3:1 for edges and marks on every surface, and carries one meaning.")],
  "Tokens/Type": [adding("a type size", "A new size or weight takes one of the six roles; size and weight tell the level.")],
  "Tokens/Spacing": [adding("a space", "A new space or height stays on the 4-based scale, and the same relation always gets the same gap.")],
  "Tokens/Radius": [adding("a radius", "A new radius belongs to one kind of piece, and the same piece always gets the same radius.")],
  "Tokens/Motion": [adding("a motion", "Only three things move; a new motion replaces one of them or is not added. It changes tone, never size or place, and holds still with reduced motion.")],
  "Tokens/Icons": [
    ["Adding an icon", "This list is the only set. If you need another icon, take it from Lucide ([lucide.dev/icons](https://lucide.dev/icons), version 1.72.0, ISC license). Copy its markup unchanged, add it here with an **lu-** id and the meaning it carries, and only then use it. One name per meaning, never a custom icon."],
  ],
};
export const prompts = { "Start/One fact, one home": ledgerPrompt };
