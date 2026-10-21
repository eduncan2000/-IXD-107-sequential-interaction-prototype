# She Left

Stage 4 of the clay sequence. The page opens with the wigged clay head in the dim room. The camera moves in, the controls slide away, and a headless woman in a white dress appears. Drag the head onto her neck and she walks off screen, then "uh oh, she left!" pops up with a "try again?" button.

This page shares its code with [Clay Ball](../clay-ball/), the full four-stage version. A setting at the top of the file, `__MODE=4`, makes it open at this stage.

A **Tools** panel sets the background color, saturation and lightness, the light on the clay, size, the eye/nose/mouth proportions, sound on/off, reset, and "Copy values as a prompt" (the prompt text is written for this stage).

Source: transferred unchanged from Claude artifact https://claude.ai/artifact/UPF5KGS6RuYjUrqWiQrFW9 (version 1792604512-2a14).

## Files

- `index.html`: the complete artifact. HTML, CSS, inline SVG and JavaScript are all in this one file.

## Dependencies

None. It uses no libraries, fonts, images or other asset files. All graphics are inline SVG, and all sound is generated in the browser with the Web Audio API.

## Running it

- **Live:** https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/she-left/
- **Locally:** open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari). You don't need a build step or a server.

Sound starts after your first click or touch, because browsers block audio until you interact with the page. "Copy values as a prompt" uses the clipboard, which needs a secure context (https or localhost). If copying fails, the page shows the text in a box for you to copy by hand.
