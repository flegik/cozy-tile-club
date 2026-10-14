# GitHub Pages release

Publication of flegik/cozy-tile-club as public and of its game is explicitly authorized. WORDLE DE is not modified. A scan of the local complete history (6 commits, 105 distinct blobs before this release) found no credential patterns or private email addresses. No saved games, account tokens or hosted Site credentials are tracked. Local commit metadata uses a GitHub noreply author. Existing custom fan SVG illustrations remain; no official asset files were added.

Deployment uses `/cozy-tile-club/`, Actions artifact upload and deploy-pages. Tests and production build precede deployment; `npm run check:pages` verifies entry-point assets, manifest paths, standalone metadata, Apple icon dimensions and all cached files. Cache namespace includes app and scope pathname. The regression service-worker test verifies other apps' caches and requests remain untouched.

The public origin cannot read storage of the older private test Site. Use full save export/import when moving addresses, or if iOS Safari and the installed web app do not share progress. Updates on the same origin keep the save key and schema. Offline install is contingent on a complete online first load and retained browser storage.

Manual iPhone checks still needed: Safari installation, 180px icon, standalone launch and status bar; notch/home-indicator spacing in portrait/landscape; touch targets and compact layers; save/reload/background/resume; Normal/Cozy and quotas; shop/room; full save/download/import; flight-mode startup and offline hint/Cozy solver; next deployment cache update without progress loss. Automated DOM and service-worker simulations do not replace real iPhone tests.
