export function formatCurrency(value: number, currency = "IDR"): string {
  if (currency === "IDR") {
    if (value >= 1_000_000_000_000) {
      return `Rp ${(value / 1_000_000_000_000).toFixed(1)} T`;
    }
    if (value >= 1_000_000_000) {
      return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    }
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  }
  if (currency === "USD") {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return `$${value.toLocaleString("en-US")}`;
  }
  return value.toLocaleString();
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatCapacity(value: string): string {
  return value;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
