// `/console` is now a layout-only route. The default export re-exports
// the layout from `components/workspace/Layout.tsx` so that
// `/console`, `/console/threads`, `/console/prompts`, `/console/billing`
// all share the same sidebar + workspace chrome.
import ConsoleLayout, { loader } from "~/components/workspace/Layout";

export { loader };
export default ConsoleLayout;
