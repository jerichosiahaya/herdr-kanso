// Each page's one status: approved pages are Ready, every other page is In review.
export const STATUSES = ["Ready", "In review", "Proposal", "Old look"];
export const STATUS_PROMPT = {
  Ready: "Follow the approved reference drawings and guidelines below. Additional states are Proposed.",
  "In review": "This design is In review and needs approval.",
  Proposal: "This design is a Proposal and needs approval.",
  "Old look": "This page shows the app's current look; it is not redesigned yet.",
};

const READY = ["Start/Philosophy", "Start/About", "Start/One fact, one home", "Start/How to read this Storybook", "Start/How to use the prompt for agents", "Tokens/Colour", "Tokens/Contrast, light and dark", "Tokens/Type", "Tokens/Spacing", "Tokens/Radius", "Tokens/Motion", "Tokens/Icons", "Primitives/Dialog", "Compositions/Arrangements dialog", "Compositions/New project dialog", "Compositions/New worktree dialog", "Compositions/Prompt dialog", "Compositions/Send dialog", "Compositions/Sleep dialog", "Compositions/Sidebar/Computer row", "Compositions/Sidebar/Section", "Compositions/Sidebar/Project row", "Compositions/Sidebar/Tile", "Compositions/Status bar", "Compositions/Activity", "Compositions/Keyboard", "Compositions/Keyboard/Key", "Compositions/Keyboard/Picked key", "Compositions/Keyboard/Shortcut row", "Compositions/Notifications", "Compositions/Panel", "Primitives/Menu", "Primitives/Avatar", "Primitives/Mark", "Primitives/Chip", "Primitives/Key hint", "Compositions/Sidebar", "Compositions/Sidebar/Footer", "Compositions/Sidebar/Session row", "Compositions/Sidebar/View switch", "Compositions/Toolbar", "Compositions/Status bar/Item", "Compositions/State patterns", "Compositions/Header", "Compositions/Agent menu", "Compositions/Computer menu", "Compositions/Project menu", "Compositions/Settings menu", "Compositions/New conversation menu", "Compositions/Open with menu", "Compositions/Pane menu", "Compositions/Add computer dialog", "Panels/Settings", "Panels/Find", "Panels/Files", "Panels/Ports", "Panels/Markdown", "Panels/Containers", "Layouts/Window", "Layouts/Pane"];

export const statusOf = (page) => READY.includes(page) ? "Ready" : "In review";
export const statusTags = (page) => READY.includes(page) ? [] : [statusOf(page)];
