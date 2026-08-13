# Rendering PPTX Stimuli to Images

Tried to export slides from `stimuli and results simple goats.pptx` as PNGs to
reuse the field-study diagrams in the web experiment.

What went wrong: neither LibreOffice nor a scriptable renderer was available.
Driving Microsoft PowerPoint via AppleScript (`save ... as save as PNG`)
silently wrote nothing when targeting `/tmp` (App Sandbox), then failed with
`AppleEvent timed out` and `User canceled. (-128)` when targeting
`~/Documents` — it raises permission dialogs that block headless/automated use.

Resolution: don't rasterize the slides at all. The pptx is a zip; the media
assets live in `ppt/media/` (goat photo, maize-bag photo, person-icon SVG) and
the layout/geometry is readable from `ppt/slides/slideN.xml`. Extract the
assets, then rebuild the diagram as a parameterized Vue component
(`GoatDiagram.vue`) that reproduces the slide layout. This also handles all
count variants (goats/bags per vignette) with one component instead of five
exported images. `qlmanage -t` on the pptx gives a quick reference render of
slide 1 to check the intended layout against.
