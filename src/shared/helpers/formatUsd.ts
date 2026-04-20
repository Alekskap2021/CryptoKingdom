export function formatUsd(value: string | undefined): string {
 if (!value) return "-";
 const num = Number(value);
 if (Number.isNaN(num)) return value;
 return `$${num.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;
}
