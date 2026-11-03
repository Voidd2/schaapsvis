// Coarse, user-agent supplied labels for account security, not a fingerprint.
// Versions, raw user agents and inferred hardware identifiers are not stored.
export function clientDeviceInfo(request) {
  const ua = String(request.headers.get("User-Agent") || "");
  const platform = String(request.headers.get("Sec-CH-UA-Platform") || "").replaceAll('"', '');
  const mobile = request.headers.get("Sec-CH-UA-Mobile") === "?1";
  const isTablet = /iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isPhone = mobile || /iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua);
  const operatingSystem = /iPhone|iPad|iPod/i.test(ua) || platform === "iOS" ? "iOS/iPadOS"
    : /Android/i.test(ua) || platform === "Android" ? "Android"
    : /CrOS/i.test(ua) || platform === "Chrome OS" ? "ChromeOS"
    : /Windows/i.test(ua) || platform === "Windows" ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) || platform === "macOS" ? "macOS"
    : /Linux/i.test(ua) || platform === "Linux" ? "Linux" : "Onbekend";
  // Chromium-derived browsers identify as Chrome too: check their specific tokens first.
  const browser = /Edg(?:e|A|iOS)?\//i.test(ua) ? "Edge"
    : /SamsungBrowser\//i.test(ua) ? "Samsung Internet"
    : /OPR\/|OPiOS\/|Opera\//i.test(ua) ? "Opera"
    : /CriOS\/|Chrome\/|Chromium\//i.test(ua) ? "Chrome"
    : /FxiOS\/|Firefox\//i.test(ua) ? "Firefox"
    : /Safari\//i.test(ua) ? "Safari" : "Onbekend";
  const modelHint = request.headers.get("Sec-CH-UA-Model");
  const model = modelHint?.replace(/^"|"$/g, "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 80);
  return {
    deviceType: isTablet ? "tablet" : isPhone ? "smartphone" : ua ? "desktop" : "unknown",
    operatingSystem, browser, deviceModel: model || null,
    accessContext: request.headers.get("X-SV-App-Context") === "standalone" ? "standalone" : "browser",
  };
}
