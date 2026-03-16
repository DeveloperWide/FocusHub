const QUEUE_KEY = "focusSaveQueue";

const safeParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const loadFocusSaveQueue = () => {
  const raw = localStorage.getItem(QUEUE_KEY);
  const parsed = safeParse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

export const saveFocusSaveQueue = (queue) => {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
};

export const generateClientId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const enqueueFocusSave = (payload) => {
  const queue = loadFocusSaveQueue();
  const clientId = generateClientId();

  queue.push({
    clientId,
    payload,
    queuedAt: Date.now(),
  });

  saveFocusSaveQueue(queue);
  return queue.length;
};

export const removeFocusSave = (clientId) => {
  const queue = loadFocusSaveQueue();
  const next = queue.filter((q) => q.clientId !== clientId);
  saveFocusSaveQueue(next);
  return next;
};

