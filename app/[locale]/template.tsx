import { ViewTransition } from 'react';

/**
 * template.tsx remounts on every navigation, which is what gives React a
 * distinct old/new pair to transition between.
 *
 * `default="none"` matters: without it every unrelated transition on the page
 * would also fire this animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="kadraj-in" exit="kadraj-out" default="none">
      {children}
    </ViewTransition>
  );
}
