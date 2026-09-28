export const PRELOADER_SEEN_KEY = 'preloader-seen';

// The intro plays on every full page load (first visit, reload, hard
// refresh). It never replays inside the app, since route changes don't
// reload the page, and it is skipped when the browser's back/forward button
// returns to the site in a tab that has already seen it.
export function shouldShowPreloader() {
  try {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation?.type === 'back_forward' && sessionStorage.getItem(PRELOADER_SEEN_KEY)) return false;
  } catch {
    // Storage can be blocked; showing the intro is the safe default.
  }
  return true;
}
