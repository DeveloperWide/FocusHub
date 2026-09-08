import type { ApiDataResponse, Task } from "@focushub/contracts";

/** Compile-time proof that the web app can resolve shared client contracts. */
export type WebTaskListResponse = ApiDataResponse<Task[]>;
