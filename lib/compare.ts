export type CompareProduct = {
  productId: string;
  slug: string;
  name: string;
};

const STORAGE_KEY = 'compare-products';

/** So sánh quá 3 cột thì bảng không đọc được trên màn hình hẹp. */
export const MAX_COMPARE_ITEMS = 3;

const EMPTY: CompareProduct[] = [];

let cachedRaw: string | null = null;
let cachedValue: CompareProduct[] = EMPTY;

const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeCompare(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getCompareSnapshot(): CompareProduct[] {
  const raw = readRaw();

  if (raw === cachedRaw) {
    return cachedValue;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedValue = EMPTY;
    return cachedValue;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    cachedValue = Array.isArray(parsed) ? (parsed as CompareProduct[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }

  return cachedValue;
}

export function getCompareServerSnapshot(): CompareProduct[] {
  return EMPTY;
}

function write(items: CompareProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    return;
  }

  notify();
}

/** Trả false khi danh sách đã đầy — nơi gọi tự báo cho người dùng. */
export function toggleCompare(product: CompareProduct): boolean {
  const current = getCompareSnapshot();
  const existed = current.some((item) => item.productId === product.productId);

  if (existed) {
    write(current.filter((item) => item.productId !== product.productId));
    return true;
  }

  if (current.length >= MAX_COMPARE_ITEMS) {
    return false;
  }

  write([...current, product]);

  return true;
}

export function clearCompare(): void {
  write([]);
}
