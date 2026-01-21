/**
 * Re-export ApiContext from building_blocks
 * This allows pages to keep their existing imports while using the shared implementation.
 */
export { ApiProvider, useApi, useApiSafe, type ApiContextValue } from "@sudobility/building_blocks/firebase";
