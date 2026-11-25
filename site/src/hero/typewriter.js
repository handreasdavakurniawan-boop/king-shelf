// How long the typewriter waits before striking the next character, in milliseconds.
// The poem in the hero is "typed" one character at a time; this decides its rhythm.
//
// char:    the character about to appear (a letter, space, comma, full stop…)
// returns: delay in ms before it appears
export function keystrokeDelay(char) {
  // TODO(human): give the typing a human rhythm (pauses after punctuation, a little jitter).
  return 45
}
