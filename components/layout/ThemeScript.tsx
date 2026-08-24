/**
 * Applies the saved theme before first paint.
 *
 * Without this the page renders in the system theme and then snaps to the
 * stored choice — a white flash for anyone reading at night, which is exactly
 * the audience the dark theme exists for.
 */
const SCRIPT = `(function(){try{var t=localStorage.getItem('countime-theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
