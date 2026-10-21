# Red Wig

Stage 3 of the clay sequence. The page opens with the finished clay head gliding into a dim room, where a curly red wig waits on a pedestal under a spotlight. A ghost finger shows you to drag the wig onto the head. It settles with a chime and a second spotlight finds the head. The piece stops here.

This page shares its code with [Clay Ball](../clay-ball/), the full four-stage version. A setting at the top of the file, `__MODE=3`, makes it open at this stage.

A **Tools** panel sets the background color, saturation and lightness, the light on the clay, size, the eye/nose/mouth proportions, sound on/off, reset, and "Copy values as a prompt" (the prompt text is written for this stage).

Source: transferred unchanged from Claude artifact https://claude.ai/artifact/4WEn3PmjB9tcsb5cLNvsG3 (version 1792604511-d3b9).

## Files

- `index.html`: the complete artifact. HTML, CSS, inline SVG and JavaScript are all in this one file.

## Dependencies

None. It uses no libraries, fonts, images or other asset files. All graphics are inline SVG, and all sound is generated in the browser with the Web Audio API.

## Running it

- **Live:** https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/red-wig/
- **Locally:** open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari). You don't need a build step or a server.

Sound starts after your first click or touch, because browsers block audio until you interact with the page. "Copy values as a prompt" uses the clipboard, which needs a secure context (https or localhost). If copying fails, the page shows the text in a box for you to copy by hand.
