// Kanso's panel kit: Herdr's mark, the host's own tile and ram at a badge's size, in its own colours. Apache-2.0.
// Kept byte for byte by `npm run sync:share`: edit kanso-panel/ui-herdr-mark.js.
import { image } from "gpui-kit";
import { H, R } from "./ui.js";

const HERDR_MARK = "frame/welcome/herdr.png";

/** A mark, not an icon: Herdr draws it from its own picture. */
export const herdrMark = () => image(HERDR_MARK).size(H.badge).rounded(R.sm).flex_none();
