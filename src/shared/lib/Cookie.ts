interface ICookieOptions {
 domain?: string;
 expires?: Date | number; // Date или количество дней
 maxAge?: number; // секунды (альтернатива expires)
 path?: string;

 sameSite?: "Lax" | "None" | "Strict";
 secure?: boolean;
}

const HOUR_PER_DAY = 24;
const MIN_PER_HOUR = 60;
const SEC_PER_MIN = 60;
const MS_PER_SEC = 1000;
const MS_PER_DAY = HOUR_PER_DAY * MIN_PER_HOUR * SEC_PER_MIN * MS_PER_SEC;

export class Cookie {
 private static readonly DEFAULT_PATH = "/";

 static get(key: string): null | string {
  const cookies = document.cookie.split(";");
  const prefix = `${key}=`;

  for (const cookie of cookies) {
   if (cookie.trimStart().startsWith(prefix)) {
    return decodeURIComponent(cookie.trimStart().substring(prefix.length));
   }
  }

  return null;
 }

 static getAll(): Record<string, string> {
  const result: Record<string, string> = {};
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
   const eqIndex = cookie.trimStart().indexOf("=");
   if (eqIndex > 0) {
    const key = cookie.trimStart().slice(0, eqIndex);
    const value = decodeURIComponent(cookie.trimStart().slice(eqIndex + 1));
    result[key] = value;
   }
  }

  return result;
 }

 static has(key: string): boolean {
  return this.get(key) !== null;
 }

 static remove(key: string, options: Omit<ICookieOptions, "expires" | "maxAge"> = {}): void {
  if (!this.get(key)) return;

  const deleteOptions: ICookieOptions = {
   ...options,
   expires: new Date(0), // 1970 год
   path: options.path ?? Cookie.DEFAULT_PATH,
  };

  this.set(key, "", deleteOptions);
 }

 static set(key: string, value: string, options: ICookieOptions | number = {}): void {
  const opts: ICookieOptions =
   typeof options === "number"
    ? { expires: options } // если передали число — это дни
    : options;

  const parts: Array<string> = [
   `${key}=${encodeURIComponent(value)}`,
   `path=${opts.path ?? Cookie.DEFAULT_PATH}`,
  ];

  if (opts.expires !== undefined) {
   let expires: Date;
   if (typeof opts.expires === "number") {
    // количество дней
    expires = new Date();
    expires.setTime(expires.getTime() + opts.expires * MS_PER_DAY);
   } else {
    expires = opts.expires;
   }
   parts.push(`expires=${expires.toUTCString()}`);
  }

  if (opts.maxAge !== undefined) {
   parts.push(`max-age=${opts.maxAge}`);
  }

  if (opts.domain) {
   parts.push(`domain=${opts.domain}`);
  }

  if (opts.secure) {
   parts.push("secure");
  }

  if (opts.sameSite) {
   parts.push(`samesite=${opts.sameSite}`);
  }

  document.cookie = parts.join("; ");
 }
}
