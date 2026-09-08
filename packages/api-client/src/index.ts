import type {
  ApiDataResponse,
  ApiErrorResponse,
  ApiSuccessResponse,
  AuthenticatedUserResponse,
  ContactMessagePayload,
  ContactMessageResponse,
  CreateFocusTimerPayload,
  CreateTaskPayload,
  CurrentUserResponse,
  FocusByGoalStatistics,
  FocusTimer,
  FocusTimerFilters,
  Goal,
  GoalPayload,
  Last7DaysFocusStatistics,
  LoginPayload,
  MessageResponse,
  ProfileUpdateResponse,
  SetTaskCompletionPayload,
  SignupPayload,
  SubscriptionCheckoutPayload,
  SubscriptionCheckoutResponse,
  Task,
  TaskListResponse,
  UpdateFocusTimerPayload,
  UpdateGoalResponse,
  UpdateTaskPayload,
  UsernameAvailabilityResponse,
  UsernameSuggestionsResponse,
  BillingPlansResponse,
  BillingCheckoutPayload,
  BillingCheckoutResponse,
  BillingVerifyPayload,
  SubscriptionVerifyPayload,
  SubscriptionVerifyResponse,
} from "@focushub/contracts";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = object;
export type RequestBody = FormData | object;

export interface ApiClientOptions {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
  timezoneOffset?: number | (() => number);
  fetch?: typeof globalThis.fetch;
}

export interface RequestOptions {
  method?: HttpMethod;
  query?: QueryParams;
  body?: RequestBody;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly response: Response;

  constructor(status: number, message: string, body: unknown, response: Response) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.body = body;
    this.response = response;
  }
}

const joinUrl = (baseUrl: string, path: string): string =>
  `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

const appendQuery = (url: URL, query?: QueryParams) => {
  if (!query) return;

  for (const [key, value] of Object.entries(query as Record<string, QueryValue | QueryValue[]>)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item !== undefined && item !== null) url.searchParams.append(key, String(item));
    }
  }
};

const parseResponseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text) return undefined;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getServerMessage = (body: unknown, fallback: string): string => {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

const isFormData = (body: RequestBody): body is FormData =>
  typeof FormData !== "undefined" && body instanceof FormData;

const toJsonBody = (body: RequestBody): BodyInit =>
  isFormData(body) ? body : JSON.stringify(body);

export interface ApiClient {
  request<T>(path: string, options?: RequestOptions): Promise<T>;
  auth: {
    checkUsername(username: string): Promise<UsernameAvailabilityResponse>;
    suggestUsername(username: string): Promise<UsernameSuggestionsResponse>;
    signup(payload: SignupPayload): Promise<AuthenticatedUserResponse>;
    login(payload: LoginPayload): Promise<AuthenticatedUserResponse>;
    me(): Promise<CurrentUserResponse>;
    logout(): Promise<MessageResponse>;
  };
  tasks: {
    list(query?: { dayKey?: string; tzOffset?: number }): Promise<TaskListResponse>;
    create(payload: CreateTaskPayload): Promise<ApiDataResponse<Task>>;
    update(id: string, payload: UpdateTaskPayload): Promise<ApiDataResponse<Task>>;
    setCompletion(id: string, payload?: SetTaskCompletionPayload): Promise<ApiDataResponse<Task>>;
    remove(id: string): Promise<ApiSuccessResponse>;
  };
  goals: {
    list(): Promise<ApiDataResponse<Goal[]>>;
    create(payload: GoalPayload): Promise<ApiDataResponse<Goal>>;
    update(id: string, payload: GoalPayload): Promise<UpdateGoalResponse>;
    remove(id: string): Promise<ApiSuccessResponse>;
  };
  focus: {
    list(filters?: FocusTimerFilters): Promise<ApiDataResponse<FocusTimer[]>>;
    listLegacy(filters?: FocusTimerFilters): Promise<ApiDataResponse<FocusTimer[]>>;
    create(payload: CreateFocusTimerPayload): Promise<ApiDataResponse<FocusTimer>>;
    createLegacy(payload: CreateFocusTimerPayload): Promise<ApiDataResponse<FocusTimer>>;
    update(id: string, payload: UpdateFocusTimerPayload): Promise<ApiDataResponse<FocusTimer>>;
    remove(id: string): Promise<ApiSuccessResponse>;
    last7Days(tzOffset?: number): Promise<ApiDataResponse<Last7DaysFocusStatistics>>;
    byGoal(tzOffset?: number): Promise<ApiDataResponse<FocusByGoalStatistics>>;
  };
  profile: {
    update(body: FormData): Promise<ProfileUpdateResponse>;
    remove(): Promise<ApiSuccessResponse>;
  };
  billing: {
    plans(): Promise<BillingPlansResponse>;
    checkout(payload: BillingCheckoutPayload): Promise<BillingCheckoutResponse>;
    verify(payload: BillingVerifyPayload): Promise<ApiDataResponse<{ subscription: unknown }>>;
  };
  subscriptions: {
    checkout(payload: SubscriptionCheckoutPayload): Promise<SubscriptionCheckoutResponse>;
    verify(payload: SubscriptionVerifyPayload): Promise<SubscriptionVerifyResponse>;
  };
  contact: {
    create(payload: ContactMessagePayload): Promise<ContactMessageResponse>;
  };
}

export const createApiClient = (options: ApiClientOptions): ApiClient => {
  const fetcher = options.fetch || globalThis.fetch;
  if (!fetcher) throw new Error("This environment does not provide fetch");

  const request = async <T>(path: string, requestOptions: RequestOptions = {}): Promise<T> => {
    const url = new URL(joinUrl(options.baseUrl, path));
    appendQuery(url, requestOptions.query);

    const headers = new Headers(options.headers);
    new Headers(requestOptions.headers).forEach((value, key) => headers.set(key, value));

    const token = options.getToken ? await options.getToken() : null;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    else headers.delete("Authorization");

    const timezoneOffset =
      typeof options.timezoneOffset === "function"
        ? options.timezoneOffset()
        : options.timezoneOffset ?? new Date().getTimezoneOffset();
    headers.set("x-tz-offset", String(timezoneOffset));

    if (requestOptions.body && !isFormData(requestOptions.body)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetcher(url, {
      method: requestOptions.method || "GET",
      headers,
      credentials: options.credentials || "include",
      body: requestOptions.body ? toJsonBody(requestOptions.body) : undefined,
      signal: requestOptions.signal,
    });
    const body = await parseResponseBody(response);

    if (!response.ok) {
      throw new ApiClientError(
        response.status,
        getServerMessage(body, response.statusText || "Request failed"),
        body,
        response,
      );
    }

    return body as T;
  };

  const json = <T>(path: string, method: HttpMethod, body?: RequestBody, query?: QueryParams) =>
    request<T>(path, { method, body, query });

  return {
    request,
    auth: {
      checkUsername: (username) => request(`/api/auth/u/check-username/${encodeURIComponent(username)}`),
      suggestUsername: (username) => request(`/api/auth/u/suggest/${encodeURIComponent(username)}`),
      signup: (payload) => json("/api/auth/signup", "POST", payload),
      login: (payload) => json("/api/auth/login", "POST", payload),
      me: () => request("/api/auth/me"),
      logout: () => json("/api/auth/logout", "POST"),
    },
    tasks: {
      list: (query) => request("/api/tasks", { query }),
      create: (payload) => json("/api/tasks", "POST", payload),
      update: (id, payload) => json(`/api/tasks/${encodeURIComponent(id)}`, "PUT", payload),
      setCompletion: (id, payload = {}) => json(`/api/tasks/${encodeURIComponent(id)}/complete`, "PATCH", payload),
      remove: (id) => request(`/api/tasks/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
    goals: {
      list: () => request("/api/goals"),
      create: (payload) => json("/api/goals", "POST", payload),
      update: (id, payload) => json(`/api/goals/${encodeURIComponent(id)}`, "PUT", payload),
      remove: (id) => request(`/api/goals/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
    focus: {
      list: (filters) => request("/api/focus/timers", { query: filters }),
      listLegacy: (filters) => request("/api/focus/focus-tasks", { query: filters }),
      create: (payload) => json("/api/focus/timers", "POST", payload),
      createLegacy: (payload) => json("/api/focus", "POST", payload),
      update: (id, payload) => json(`/api/focus/timers/${encodeURIComponent(id)}`, "PATCH", payload),
      remove: (id) => request(`/api/focus/timers/${encodeURIComponent(id)}`, { method: "DELETE" }),
      last7Days: (tzOffset) => request("/api/focus/stats/last-7-days", { query: { tzOffset } }),
      byGoal: (tzOffset) => request("/api/focus/stats/by-goal", { query: { tzOffset } }),
    },
    profile: {
      update: (body) => request("/api/profile/update", { method: "PUT", body }),
      remove: () => request("/api/profile/me", { method: "DELETE" }),
    },
    billing: {
      plans: () => request("/api/billing/plans"),
      checkout: (payload) => json("/api/billing/checkout", "POST", payload),
      verify: (payload) => json("/api/billing/verify", "POST", payload),
    },
    subscriptions: {
      checkout: (payload) => json("/api/subscriptions/checkout", "POST", payload),
      verify: (payload) => json("/api/subscriptions/verify", "POST", payload),
    },
    contact: {
      create: (payload) => json("/api/contact", "POST", payload),
    },
  };
};

export type { ApiErrorResponse };
