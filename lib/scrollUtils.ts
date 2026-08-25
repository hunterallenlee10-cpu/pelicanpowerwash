/**
 * Smooth scroll to an element and optionally focus on it
 */
export function smoothScrollToElement(
  elementId: string,
  options?: { focus?: boolean; offset?: number }
): void {
  if (typeof window === "undefined") return;

  const element = document.getElementById(elementId);
  if (!element) return;

  const offset = options?.offset || 80; // Account for sticky header height
  const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: elementPosition,
    behavior: "smooth",
  });

  // Focus on element for accessibility
  if (options?.focus) {
    setTimeout(() => {
      element.focus({ preventScroll: true });
    }, 100);
  }
}

/**
 * Update URL hash without full page load
 */
export function updateUrlHash(hash: string): void {
  if (typeof window === "undefined") return;

  // No feature check: `replaceState` predates every browser this site targets,
  // and testing a function that is always defined is a type error.
  window.history.replaceState(null, "", `#${hash}`);
}

/**
 * Get current scroll position
 */
export function getScrollPosition(): number {
  if (typeof window === "undefined") return 0;
  return window.scrollY || window.pageYOffset || 0;
}

/**
 * Check if an element is in viewport
 */
export function isElementInViewport(element: HTMLElement): boolean {
  if (typeof window === "undefined") return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/**
 * Debounce function for scroll events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Animate value counter
 */
export function animateCounter(
  start: number,
  end: number,
  duration: number = 1000,
  onUpdate?: (value: number) => void
): void {
  const startTime = Date.now();
  const range = end - start;

  function updateCounter() {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + range * progress);

    if (onUpdate) {
      onUpdate(current);
    }

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}
