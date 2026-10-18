// True when a keypress targets something that handles Enter/arrows itself,
// so global shortcuts shouldn't hijack it.
export function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("a, button, input, textarea, select, [contenteditable]") !== null
  );
}
