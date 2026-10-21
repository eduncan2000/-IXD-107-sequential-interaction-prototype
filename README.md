# -IXD-107-sequential-interaction-prototype
Project 2 interaction prototype for IXD 107, built with Claude Code and published with GitHub Pages.

**Live site:** https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/

## Making a Muse (the sequential prototype)

You shape a lump of wet clay into a face, dress it, give it a body, and then your creation walks away. It is one linear sequence: each step unlocks only after the previous one is finished, and a ghost finger demonstrates every gesture (there are no words).

1. **Spin.** A raw, wet clay ball sits on a banding wheel against a blue background, with a patch of light drifting across it. Drag across the ball and it spins with swoosh sounds while the view zooms in and out. The ball becomes a smooth head.
2. **Sculpt.** The background darkens. Press and drag over the clay to push up eyes with lashes, a nose, cheeks and lips. The view zooms in slightly when you start, a squish sound follows your finger, and a wolf whistle plays when the face is done.
3. **Wig.** The head glides into a dim room where a curly red wig waits on a pedestal under a spotlight. Drag the wig onto the head and it settles with a chime as a second spotlight finds the head. If you drop it elsewhere, it floats back.
4. **Body.** The camera moves in and a headless woman in a white dress appears. Drag the head onto her neck and she walks off screen. If you drop the head elsewhere, it floats back.
5. **Ending.** "uh oh, she left!" pops up, and the room fades back to the empty banding wheel in the blue studio. **try again?** puts a fresh clay ball on the wheel and starts over.

A small **Sound** button in the top-right corner turns the sound on and off. All sound is generated in the browser and starts after your first click or touch.

### Files

```
index.html        the prototype page (open this)
css/style.css     styles
js/prototype.js   all scene building, interaction, animation and sound
.nojekyll         tells GitHub Pages to serve the files as they are
```

It is plain HTML, CSS and JavaScript: no libraries, no build step, no server. All paths are relative, so it works at the GitHub Pages address or opened straight from disk. To publish it, set **Settings → Pages** to deploy from the `main` branch, `/ (root)` folder.

### How it was built from the studies

The prototype is built on **Clay Ball**, the study that already runs all four stages in order. Its code was split into the three files above and changed as follows:

- **Tools panel removed.** Its values are fixed at the studies' defaults: background `#2563ff`, light 100%, size 100%, eyes 138 × 100%, nose 93 × 85%, mouth 130 × 107% (length × width).
- **Sound on/off** is kept, as a small corner button.
- **New ending.** After she walks off, her footsteps stop, the room fades out, and the camera returns to the empty wheel in the blue studio behind the "uh oh, she left!" message. Previously the dim room stayed on screen.
- **Bug fix.** The invisible "try again?" button could be clicked during play (it sits over the clay) and would restart the piece. It now only accepts clicks once the message is showing.

All gestures, feedback, timings, visuals and sounds are otherwise unchanged.

## Interaction studies

The original studies are kept unchanged, each in its own folder:

- [Clay Ball](clay-ball/): full sequence, all four stages. Live: https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/clay-ball/
- [Clay Face](clay-face/): stage 2 only. Live: https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/clay-face/
- [Red Wig](red-wig/): stage 3 only. Live: https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/red-wig/
- [She Left](she-left/): stage 4 only. Live: https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/she-left/

## Other pages

- [Hello world](hello-world/): the first test page, with the photo background. Live: https://eduncan2000.github.io/-IXD-107-sequential-interaction-prototype/hello-world/
