# assets-inbox

Drop the Higgsfield downloads here using the exact filenames below (any of
.jpg / .jpeg / .png / .webp / .avif for images, .mp4 / .mov for clips), then
run:

```bash
pnpm assets
```

That rebuilds `public/story/` and `data/story-manifest.json`. Anything missing
gets a labelled placeholder, so the site always builds. Commit the images in
this folder and the generated output. Video clips (`*.mp4`) are git-ignored
because they are large: the frames extracted from them in `public/story/frames`
are committed, and the pipeline keeps those frames when the clips are absent.

Current set: generated in Higgsfield on Oct 29, 2026 (Nano Banana Pro
keyframes, Seedream 4.5 game slab, Kling 3.0 Pro clips). Phone (9x16) images
are center crops of the 16x9 keyframes so dirty/clean pairs stay aligned.
Optional (not used by the current design): the mid keyframes, g2/g3, the
t-* tiles, h1-house-iso and e2-mist.

```
k0-final-clean-16x9      k4-final-dirty-16x9
k1-driveway-clean-16x9   k1-driveway-dirty-16x9   k1-driveway-mid-16x9
k2-roof-clean-16x9       k2-roof-dirty-16x9       k2-roof-mid-16x9
k3-siding-clean-16x9     k3-siding-dirty-16x9     k3-siding-mid-16x9
k0-final-clean-9x16      k4-final-dirty-9x16
k1-driveway-clean-9x16   k1-driveway-dirty-9x16
k2-roof-clean-9x16       k2-roof-dirty-9x16
k3-siding-clean-9x16     k3-siding-dirty-9x16
g1-driveway-topdown-clean  g2-driveway-topdown-dirty  g3-grime-map
t-siding t-roof t-concrete t-deck t-pavers t-brick t-fence t-stucco
h1-house-iso  (optional: h1-house-iso-dirty)
e1-og-bg  e2-mist
v1-driveway-16x9.mp4  v2-roof-16x9.mp4  v3-siding-16x9.mp4  v4-final-16x9.mp4
```
