/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Utilities for syncing the native system UI background color with the app theme.
 *
 * These helpers safely no-op if `expo-system-ui` is not installed.
 * They are designed to be called imperatively whenever the theme changes.
 */

/**
 * Minimal theme type used by this util. Your full theme can extend this shape.
 */
export type MinimalTheme = {
  colors: {
    background: string
  }
}

/**
 * Sets the system UI background color (status/navigation bars) if `expo-system-ui` is available.
 * Silently no-ops on platforms or environments where it's not present.
 *
 * @param color - The background color to apply (e.g. "#ffffff")
 */
export function setSystemUIBackgroundColor(color: string): void {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies, global-require
    const systemui = require('expo-system-ui');
    if (systemui?.setBackgroundColorAsync) {
      // Intentionally fire-and-forget; we don't want to make callers async
      // and we also don't want to fail if the promise rejects.
      void systemui.setBackgroundColorAsync(color).catch(() => {});
    }
  } catch {
    // `expo-system-ui` is not installed or not available in this environment.
    // Swallow the error to keep this a safe no-op.
  }
}

/**
 * Applies imperative theming effects based on the provided theme object.
 * Currently syncs the native system UI background to match the theme background.
 *
 * @param theme - The theme object containing at least a `colors.background` value.
 */
export function setImperativeTheming(theme: MinimalTheme): void {
  const bg = theme?.colors?.background;
  if (typeof bg === 'string' && bg.length > 0) {
    setSystemUIBackgroundColor(bg);
  }
}
