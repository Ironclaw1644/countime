import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Disable auto-injection of CSS — we import it explicitly above so it's
// available during SSR (avoids the "huge icons on first paint" flash).
config.autoAddCss = false;
