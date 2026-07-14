import {Temporal} from "temporal-polyfill";

// Provide the global `Temporal` on runtimes that don't ship it natively yet (e.g. Node < 24),
// so the Temporal schema specs run in CI instead of throwing. Native `Temporal` (Node >= 24/26)
// takes precedence and the polyfill is a no-op there.
(globalThis as {Temporal?: unknown}).Temporal ??= Temporal;
