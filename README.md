# CU AR Department Directory

A static school lab activity that uses MindAR image tracking to reveal eight tappable college logos when the official Capitol University logo is recognized. Each college opens an information overlay with its programs and a 3D mascot model.

## Included assets and college mapping

The uploaded target, logos, and GLB models are already connected to the app. The numbered files map to the colleges as follows:

| Asset number | College |
| --- | --- |
| `dept1` | College of Computer Studies |
| `dept2` | College of Maritime Education |
| `dept3` | College of Business Administration |
| `dept4` | College of Engineering |
| `dept5` | College of Health Sciences & Midwifery |
| `dept6` | College of Education |
| `dept7` | College of Arts and Sciences |
| `dept8` | College of Criminology |

The current data is stored in `departments.json`. Update only the mascot labels when the official mascot names are confirmed. Keep the existing `logo` and `model` paths unless you rename the assets.

## Compile `targets.mind`

1. Open the MindAR image targets compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile/
2. Upload a clear, high-contrast image of the official Capitol University logo.
3. Compile the image target and download the generated `targets.mind` file.
4. Put it at `./assets/targets/targets.mind`.
5. The official CU logo must be the first target in the compiled file because the app uses `targetIndex: 0`.

The target file and numbered logo/model assets are already wired into the app. The college names and program descriptions have been entered; confirm the official mascot names before publishing.

## Run locally

Camera access requires HTTPS (or localhost). Opening `index.html` directly from `file://` will not provide a reliable camera environment. Use a static HTTPS host such as GitHub Pages for the actual phone test.

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173` in a browser on the same device. Do not use `file://`.

## GitHub Pages

1. In the repository, open **Settings > Pages**.
2. Choose **Deploy from a branch**, select `main`, and choose `/ (root)`.
3. Open the generated HTTPS URL in Chrome on Android.
4. Grant camera permission when prompted.
5. If permission was previously blocked, open Chrome site settings, allow Camera, and tap **Try again** in the app.

The app uses relative asset paths and can be hosted from a project subpath. The final URL must remain HTTPS. If the GitHub Pages URL redirects to an `http://` custom domain, remove or correctly configure that custom domain before testing; Chrome blocks camera access on an insecure HTTP page.

## Mobile camera and layout behavior

The app now:

- Requests camera access explicitly before starting MindAR.
- Prefers the rear-facing camera on mobile devices.
- Shows a useful error when the page is HTTP, camera permission is blocked, or no camera is available.
- Uses mobile-safe dynamic viewport sizing and safe-area insets.
- Recalculates the MindAR camera viewport after startup, orientation changes, and mobile browser viewport changes.
- Keeps the AR canvas and camera video centered and full-screen in portrait and landscape layouts.
- Uses a scrollable department information overlay on small screens.

For the best phone test, use the latest Chrome or Safari, hold the phone in portrait mode, and reload after rotating the device.

## Test checklist

| Department | Logo shows | Tap works | Info correct | 3D loads | Back works |
| --- | --- | --- | --- | --- | --- |
| 1 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 2 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 3 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 4 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 5 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 6 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 7 | [ ] | [ ] | [ ] | [ ] | [ ] |
| 8 | [ ] | [ ] | [ ] | [ ] | [ ] |
