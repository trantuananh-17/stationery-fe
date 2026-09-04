export type RecentlyViewedProduct = {
  productId: string;
  name: string;
  slug: string;
  thumbnail: string;
  price: number;
};

const STORAGE_KEY = 'recently-viewed';
const MAX_ITEMS = 8;

const EMPTY: RecentlyViewedProduct[] = [];

// useSyncExternalStore đòi snapshot ổn định về tham chiếu, nên cache theo
// đúng chuỗi JSON đang nằm trong localStorage.
let cachedRaw: string | null = null;
let cachedValue: RecentlyViewedProduct[] = EMPTY;

const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Chế độ riêng tư hoặc trình duyệt chặn site data sẽ ném ngay khi đọc.
    return null;
  }
}

export function subscribeRecentlyViewed(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getRecentlyViewedSnapshot(): RecentlyViewedProduct[] {
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

    cachedValue = Array.isArray(parsed) ? (parsed as RecentlyViewedProduct[]) : EMPTY;
  } catch {
    cachedValue = EMPTY;
  }

  return cachedValue;
}

/** Phía server không có localStorage — luôn trả danh sách rỗng để khớp lần render đầu. */
export function getRecentlyViewedServerSnapshot(): RecentlyViewedProduct[] {
  return EMPTY;
}

export function addRecentlyViewed(product: RecentlyViewedProduct): void {
  try {
    const current = getRecentlyViewedSnapshot().filter((item) => item.productId !== product.productId);

    const next = [product, ...current].slice(0, MAX_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Không lưu được thì bỏ qua — đây chỉ là tiện ích hiển thị.
    return;
  }

  listeners.forEach((listener) => listener());
}
