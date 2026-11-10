# CU AR Department Directory

A static school lab activity that uses MindAR image tracking to reveal eight tappable department logos when the official Capitol University logo is recognized. Each department opens an information overlay with a 3D mascot.

## Replace these files

- `assets/targets/targets.mind`: compile your target image and place it in the targets folder.
- `assets/logos/dept1.png` through `dept8.png`: replace the numbered placeholder logos with the eight official department logos. Keep the filenames.
- `assets/models/dept1.glb` through `dept8.glb`: replace the cube placeholders with the matching animal mascot models. Keep the filenames.
- `departments.json`: replace every `REPLACE: ...` value with the official department name, mascot, and brief description. Keep the existing `logo` and `model` paths unless you also rename the assets.

## Compile `targets.mind`

1. Open the MindAR image targets compiler: https://hiukim.github.io/mind-ar-js-doc/tools/compile/
2. Upload a clear, high-contrast image of the official Capitol University logo.
3. Compile the image target and download the generated `targets.mind` file.
4. Put it at `./assets/targets/targets.mind`.
5. The official CU logo must be the first target in the compiled file because the app uses `targetIndex: 0`.

## Run locally

Camera access requires HTTPS (or localhost). Opening `index.html` directly from `file://` will not provide a reliable camera environment. Use a static HTTPS host such as GitHub Pages for the actual phone test.

## GitHub Pages

1. Create a GitHub repository and upload this folder's files, including the `assets` folders and compiled `targets.mind`.
2. In the repository, open **Settings > Pages**.
3. Choose **Deploy from a branch**, select the branch containing the app, and choose the root folder.
4. Open the generated `https://<username>.github.io/<repository>/` URL in Chrome on Android.
5. Grant camera permission. The app expects the relative paths in this repository, so it can be hosted from a project subpath.

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
