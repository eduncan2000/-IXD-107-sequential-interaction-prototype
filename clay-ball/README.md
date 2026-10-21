# Clay Ball

An interactive, sequential SVG piece in four stages:

1. **Spin** – drag across a wet ball of clay on a banding wheel; it spins, the view zooms in and out, and the ball becomes a smooth head.
2. **Sculpt** – the background darkens; drag over the head to push up eyes with lashes, a nose, cheeks and lips.
3. **Wig** – the head glides into a dim room; drag the red wig from the pedestal onto the head.
4. **Walk away** – drag the head onto the woman in the white dress; she walks off ("uh oh, she left!" → "try again?").

A **Tools** panel sets the background color, saturation and lightness, the light on the clay, size, the eye/nose/mouth proportions, sound on/off, reset, and "Copy values as a prompt".

Source: transferred unchanged from Claude artifact https://claude.ai/artifact/GGTjS62EZ22gEnnpBNpXcB (version 1792603178-9621).

## Files

- `index.html` – the complete artifact: HTML, CSS, inline SVG and JavaScript in one file.

## Dependencies

None. No libraries, fonts, images or other asset files. All graphics are inline SVG, and all sound (swooshes, thud, wolf whistle, chime, footsteps) is synthesized in the browser with the Web Audio API.

## Running it

- **Live:** https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/clay-ball/
- **Locally:** open `index.html` in a modern browser (Chrome, Edge, Firefox or Safari). No build step or server is needed.

Sound starts after your first click or touch, because browsers block audio until you interact with the page. "Copy values as a prompt" uses the clipboard. That needs a secure context (https or localhost). If it fails, the page shows the text in a box for you to copy by hand.
