---
name: Productive Farming field guide
description: An unofficial ATM11 field guide drawn as a transit network map with wayfinding signage.
colors:
  paper: "#ffffff"
  panel: "#ffffff"
  ink: "#11161b"
  ink-2: "#45505a"
  rule: "#c9d0cb"
  sign: "#11161b"
  on-sign: "#ffffff"
  on-line: "#ffffff"
  on-amber: "#11161b"
  line-green: "#15803d"
  line-brown: "#8a5425"
  line-purple: "#7038b3"
  line-red: "#cc2f27"
  line-blue: "#1767c2"
  line-orange: "#c2570a"
  line-magenta: "#bd2674"
  line-teal: "#0a7c7c"
  line-amber: "#e2a400"
  line-slate: "#56626c"
  night-paper: "#0a1433"
  night-panel: "#0f1c44"
  night-ink: "#f1f4fb"
  night-ink-2: "#b3bfdb"
  night-rule: "#2b3a6b"
  night-sign: "#050b1f"
  night-on-sign: "#f1f4fb"
  night-on-line: "#0a1433"
  night-on-amber: "#0a1433"
  night-line-green: "#34b96f"
  night-line-brown: "#c98f58"
  night-line-purple: "#ab82ea"
  night-line-red: "#f2635a"
  night-line-blue: "#58a6f5"
  night-line-orange: "#f58f35"
  night-line-magenta: "#ee69a9"
  night-line-teal: "#33b8b8"
  night-line-amber: "#f3c033"
  night-line-slate: "#8f9cbd"
typography:
  display:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.3rem, 1.3rem + 4.4vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.3rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.5vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: '"ss01", "kern"'
  label:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  control:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 700
    lineHeight: 1
  control-compact:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 600
    lineHeight: 1
  numeric:
    fontFamily: "Overpass Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.94em"
    fontWeight: 600
    fontFeature: '"tnum"'
  plate:
    fontFamily: "Overpass Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    lineHeight: 1
  tag:
    fontFamily: "Overpass, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
rounded:
  square: "0"
  focus: "2px"
  line-end: "3px"
  pill-sm: "1.1rem"
  pill-md: "1.2rem"
  pill-lg: "1.4rem"
  round: "50%"
spacing:
  gap: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  bar-h: "3.5rem"
  rail-w: "15rem"
  prose-rhythm: "1rem"
  block-rhythm: "1.6rem"
  section-top: "clamp(3.5rem, 7vw, 6rem)"
  shell-gutter: "clamp(1rem, 3vw, 2.5rem)"
  shell-column-gap: "clamp(1.5rem, 4vw, 4rem)"
  measure: "68ch"
  content-max: "68rem"
  shell-max: "88rem"
components:
  signage-bar:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.on-sign}"
    height: "{spacing.bar-h}"
    padding: "0 clamp(0.75rem, 2.5vw, 2rem)"
  roundel:
    backgroundColor: "{colors.line-green}"
    textColor: "{colors.on-line}"
    rounded: "{rounded.round}"
    size: "2.1rem"
  version-plate:
    textColor: "{colors.on-sign}"
    typography: "{typography.plate}"
    rounded: "{rounded.square}"
    padding: "0.42rem 0.55rem 0.34rem"
  tool:
    backgroundColor: "transparent"
    textColor: "{colors.on-sign}"
    rounded: "{rounded.pill-sm}"
    height: "2.2rem"
    padding: "0.12em 0.8rem 0"
  tool-hover:
    backgroundColor: "{colors.on-sign}"
    textColor: "{colors.sign}"
  bullet:
    backgroundColor: "{colors.line-green}"
    textColor: "{colors.on-line}"
    rounded: "{rounded.round}"
    size: "1.6rem"
  bullet-amber:
    backgroundColor: "{colors.line-amber}"
    textColor: "{colors.on-amber}"
    rounded: "{rounded.round}"
    size: "1.6rem"
  bullet-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.round}"
    size: "1.6rem"
  bullet-opener:
    backgroundColor: "{colors.line-green}"
    textColor: "{colors.on-line}"
    rounded: "{rounded.round}"
    size: "2.3rem"
  way:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.pill-lg}"
    height: "2.75rem"
    padding: "0 1.1rem 0 0.55rem"
  way-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    rounded: "{rounded.pill-lg}"
    height: "2.75rem"
    padding: "0.16em 1.3rem 0"
  button-primary-hover:
    backgroundColor: "{colors.line-amber}"
    textColor: "{colors.on-amber}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.control-compact}"
    rounded: "{rounded.pill-md}"
    height: "2.25rem"
    padding: "0.14em 0.8rem 0"
  chip-hover:
    backgroundColor: "{colors.rule}"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  search-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "3.25rem"
    padding: "0.16em 1rem 0 2.9rem"
  select:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "2.75rem"
    padding: "0.16em 2.4rem 0 0.8rem"
  segment:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    height: "2.5rem"
    padding: "0.14em 0.5rem 0"
  segment-hover:
    backgroundColor: "{colors.rule}"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sign-table-head:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.on-sign}"
    padding: "0.6rem 0.8rem 0.45rem"
  sign-table-cell:
    textColor: "{colors.ink}"
    padding: "0.65rem 0.8rem 0.55rem"
  scale-bar:
    backgroundColor: "{colors.line-red}"
    rounded: "{rounded.square}"
    height: "0.7rem"
  service-notice:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "1rem 1.2rem 1.1rem"
  network-frame:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
  platform-board:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    padding: "1.15rem 1.25rem 1.3rem"
  kind-plate:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.square}"
    height: "1.45rem"
    padding: "0.14em 0.55rem 0"
  crafting-cell:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    width: "5.6rem"
    height: "3rem"
  footer:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.on-sign}"
    padding: "2rem clamp(1rem, 3vw, 2.5rem)"
---

# Design System: Productive Farming field guide

## Overview

**Creative North Star: "The Network Map"**

Productive Farming is a network, so the guide is drawn as one. Mutation chains are lines, crops are stations, and everything around them is wayfinding: a dark signage bar across the top, a rail that lists the sections as stops on one vertical line, lettered bullets, ruled signage tables and a platform board under the map. The reference is transit diagram and signage standards, printed flat. It is a day map on white paper and a night map on navy, and the two are the same sheet with the colours re-inked.

The system is dense and plain-spoken. Readers arrive with the game open beside them and one question in mind, so every surface answers before it explains: a mark you can read without a legend, a number in mono, a bar whose length is the quantity. Nothing is decorative. Colour identifies a line, weight identifies importance, and shape identifies kind.

It refuses the fan-wiki arrangement of dirt-texture banners, pixel fonts and walls of item icons, and it refuses the dark neon gamer dashboard. The mod is All Rights Reserved, so nothing here is or resembles its artwork: items are named in type, structures are drawn as authored flat blocks.

**Key Characteristics:**
- Flat sheet: paper, ink and a fixed set of ten line colours, in a day and a night inking.
- One signage grotesque (Overpass) with its mono companion (Overpass Mono) for anything measured or coded, both self-hosted.
- Square surfaces for information, round shapes for stations, bullets and things you press.
- State and kind are carried by mark as well as hue: ring, filled dot, square, double ring, tick count.
- Drawn lengths equal real quantities.
- Heavy ink rules (2px and 6px) do the work that shadows and tinted cards do elsewhere.

## Colors

A locked palette: paper, ink, one rule grey and ten saturated line colours, each defined once for the day map and once for the night map (the `night-*` tokens). The build reads them as custom properties (`--paper`, `--ink`, `--l-red` and so on) and swaps the whole set under `prefers-color-scheme: dark` or `data-theme="dark"`.

### Primary
- **Map Ink** (`ink`): text, every structural border, the rail line, selected controls. On the night map it inverts to a cool near-white.
- **Signal Blue** (`line-blue`): the default link underline, the caret and the focus outline (3px, offset 3px). Also section E and the Farm Controller and water cells in block diagrams.

### Secondary
The ten line colours. Each is a role, not a decoration, and each is used at full strength as a fill, a stroke or an underline.
- **Line Green** (`line-green`): section A, the PF roundel, the Pepper line, plant cells.
- **Line Brown** (`line-brown`): section B, farmland and fence-post cells.
- **Line Purple** (`line-purple`): section C, the Grape line.
- **Line Red** (`line-red`): section D, the Roma line, the legend's sample marks.
- **Line Blue** (`line-blue`): section E; see Primary.
- **Line Orange** (`line-orange`): section F, the Cherry line.
- **Line Magenta** (`line-magenta`): section G, the Berry line.
- **Line Teal** (`line-teal`): section H.
- **Line Amber** (`line-amber`): section I, the Corn line, the service-notice triangle, text selection, the primary button's hover, focus outlines on sign-coloured surfaces.
- **Line Slate** (`line-slate`): section K, and the colour a station or line tag takes when it recedes.

Sections J and L take Map Ink as their line.

### Neutral
- **Map Paper** (`paper`): the page ground. White by day, deep navy by night.
- **Panel** (`panel`): the ground inside framed figures, fields and cells. Identical to paper by day; one step lighter than paper on the night map, which is the only tonal layering in the system.
- **Second Ink** (`ink-2`): captions, legends, status lines, definition terms, chance labels on the map, dirt cells.
- **Rule** (`rule`): 1px row dividers, the unearned level ticks, the hover fill on chips and segments, and the colour a route takes when it recedes.
- **Sign** and **On Sign** (`sign`, `on-sign`): the signage bar, table heads and footer, and the type on them.
- **On Line** and **On Amber** (`on-line`, `on-amber`): type set on a line colour. White on the day map, navy on the night map; amber takes dark type in both.

### Named Rules
**The Locked Palette Rule.** Every colour on a surface is one of the tokens at full strength. There are no in-between tones: no opacity-derived tints, no colour mixing, no gradients. A thing that needs to be quieter moves to Second Ink, Rule or Line Slate.

**The Local Meaning Rule.** A line colour means one thing per diagram. In the rail and section openers it means the section; on the network map it means the crop family; in a block diagram it means the material. Set the colour through `--line` (sections) or `--c` (marks) on the nearest container and let links, list markers, step numerals and scale bars inherit it.

**The Amber Takes Ink Rule.** Amber never carries light type and never appears as text on paper. It is a fill with dark type on it, or a stroke.

**The Data Colour Exception.** Flower discs and blend samples are filled with the colour value the data records for that flower. That colour is the content. It always sits inside a 2.5px to 3px ink ring and never leaves the disc.

## Typography

**Display Font:** Overpass (with Helvetica Neue, Arial, sans-serif), variable 100 to 900, self-hosted woff2
**Body Font:** Overpass, same file
**Label/Mono Font:** Overpass Mono (with ui-monospace, SFMono-Regular, Menlo), variable 300 to 700, self-hosted woff2

**Character:** A grotesque descended from highway lettering, used the way a signage standard uses it: one family, a few weights, tight heavy headings and open regular text. The mono companion is reserved for values the reader will copy or compare.

### Hierarchy
- **Display** (800, `clamp(2.3rem, 1.3rem + 4.4vw, 4.4rem)`, 0.98, -0.028em): the page title only, held to 16ch.
- **Headline** (800, `clamp(1.6rem, 1.2rem + 1.6vw, 2.3rem)`, 1.08, -0.02em): section titles beside their bullet, and the map's title.
- **Title** (800, 1.25rem, 1.08, -0.01em): sub-headings in prose and panel headings. Cell-level headings (steps, forms, points, notices) drop to about 1.05 to 1.12rem at 1.25 leading and keep the 800 weight.
- **Lede** (400, `clamp(1.1rem, 1rem + 0.5vw, 1.3rem)`, 1.5): the opening paragraph, 62ch.
- **Body** (400, 1.0625rem, 1.6, `ss01` and kerning on): prose at 68ch. Bold is 700.
- **Label** (400 to 600, 0.875rem): captions, legends, status lines, the fine print. Usually in Second Ink.
- **Control** (700, 0.98rem, line-height 1; compact 600 to 700 at 0.8 to 0.88rem): pills, chips, segments. Controls carry a small top padding (0.12em to 0.16em) because Overpass sits high in its box.
- **Numeric** (Overpass Mono 600, 0.94em, tabular figures, no wrap): inline quantities, table number columns (right-aligned), the board's large chance figure (700, 1.5rem), item IDs, hex values, chip counts.
- **Plate** (Overpass Mono 500, 0.78rem): the version plates in the signage bar, value in 700.
- **Tag** (700 to 800, 0.7rem or 13 map units, 0.06em, uppercase): line name tags on the map and the kind plate on a recipe row.

### Named Rules
**The One Family Rule.** Overpass and Overpass Mono are the whole type system. Hierarchy comes from weight (400, 500 to 600, 700, 800) and size, not from a second face.

**The Mono Means Measured Rule.** Mono is for numbers, percentages, units, versions, IDs and hex values. Words stay in the sans.

**The Signs Only Rule.** Uppercase with tracking exists in exactly two places, both of them plates that name a category: the line tag and the recipe kind plate. Headings, labels and buttons are sentence case.

## Layout

A two-column shell, 88rem at most, with gutters of `clamp(1rem, 3vw, 2.5rem)`: a 15rem sticky rail and one fluid main column, separated by `clamp(1.5rem, 4vw, 4rem)`. A 3.5rem signage bar is sticky above both, and scroll targets are offset by the bar height plus 1rem. Everything in the main column is left-aligned to one edge. Prose holds to 68ch; tables, lists and figures run to 68rem; the network figure runs the full column.

Vertical rhythm is three steps: 1rem between prose blocks, 1.6rem between the blocks of a section, and `clamp(3.5rem, 7vw, 6rem)` above each section. Lists of like things (forms, points, flowers, crop rows, recipe rows, credits) are ruled lists: a 2px ink rule on top, a 1px rule line under each item, no boxes. Grids use `auto-fit` or `auto-fill` with a minimum column width so they reflow without breakpoints.

Responsive behaviour, as built:
- **Below 80rem:** the platform board drops from four columns to two.
- **Below 62rem:** the rail leaves the grid and becomes a drawer fixed under the bar, opened by a Contents tool and closed by a link, a second press or Escape. Version plates are hidden. Rail links grow to 1.05rem with taller rows.
- **Below 44rem:** tools become 2.75rem icon-only circles and the title loses its sub-label. Signage tables turn into stacked records: the head is visually hidden, each row is a block, and each cell is prefixed with its column name in Second Ink. Scale bars go full width. Crop rows keep mark, name and source and drop the form and food columns. Recipe rows stack. Finders stop being sticky. The board is one column. Two-up panels divide with a horizontal rule instead of a vertical one.
- **The map does not shrink below 46rem.** It scrolls sideways inside its frame, and a cue line with an arrow says so at the top of the frame.
- **Print:** the bar, rail, finders, way-forward links and footer are removed and the shell becomes a single column on white.

### Named Rules
**The To-Scale Rule.** A drawn length is a real quantity. Scale bars, the board's meter and the level ticks are sized from the data, every bar in one table shares one stated scale, and the column is headed "To scale". Never draw a bar whose length is approximate or ornamental.

## Elevation & Depth

Flat. There is no cast shadow, no blur, no glow and no layered translucency anywhere in the system. Separation comes from ink: a 2px border frames a figure or field, a 6px rule opens a figure or underlines a section, a 1px rule line divides rows. Sticky layers (the signage bar, the finder, the rail drawer) are opaque and end in a rule, so content passes under a hard edge.

On the night map, framed surfaces take the Panel colour, one step up from the paper. That single step is the only tonal depth.

### Named Rules
**The Flat Sheet Rule.** Nothing floats. If a surface needs to read as separate, give it an ink border or a rule; do not lift it.

**The Knockout Ring Rule.** Where a round mark sits on a line, it carries a ring in the ground colour so the line appears to stop short of it (2px to 3px, built as a zero-offset, zero-blur spread in Map Paper on bullets, and as a Panel-coloured stroke on map dots). This is a print keyline, not elevation, and it is the only use of the shadow property.

## Shapes

Two corner languages and nothing between them. Surfaces that hold information are square (0 radius): figure frames, tables, notices, fields, selects, segments, crafting cells, kind plates, version plates. Things that are stations or that you press are fully round: bullets, the roundel, map dots, discs, and pills whose radius is half their height (1.1rem, 1.2rem, 1.4rem for heights of 2.2rem, 2.25rem and 2.75rem).

Lines have round ends: routes use round caps and joins, and the rail line, opener line and blend line are capped at 2px to 3px. Routes run horizontal and branch on a diagonal, never on a curve.

Stroke weights are a short fixed set: 1px rule lines; 1.5px on small outlined controls (chips, tools, kind plates, crafting cells); 2px ink on frames, fields and list heads; 4px for the rail line; 6px for figure and section rules. Dashed strokes mean absent or optional (an empty crafting cell, an optional corner block) and nothing else.

## Components

### Signage bar
A 3.5rem sticky bar in Sign with a 1px rule under it. Left: the PF roundel (2.1rem green circle, 800) and the guide title (800, 1.05rem) with a regular-weight sub-label. Right: version plates (mono, 1px On Sign outline, square) and tools. Tools are outlined pills (1.5px On Sign, 2.2rem tall, 700 at 0.82rem, an inline stroked SVG icon) that invert to On Sign fill on hover and while expanded. Focus outlines on the bar are amber. The footer uses the same Sign ground with amber link underlines.

### Rail
The twelve sections as stops on one 4px ink line with round ends. Each link is a lettered bullet and a label (500, 0.95rem). Bullets carry a 3px paper knockout ring. Hover underlines the label in the section's line colour. The current section's label goes to 800 and its bullet scales to 1.22 (0.25s).

### Lettered bullet
A filled circle in the line colour with an 800 capital letter, A to L in page order. 1.6rem in the rail and way-forward links, 2.3rem in a section opener. Amber bullets take dark type; ink bullets take paper type.

### Section opener
Bullet and headline on one row. Beneath them a 6px round-ended line in the section colour runs to the right edge, starting at a small station dot (16px, paper fill, 4px line-colour ring) under the bullet. Every section opens this way and sets `--line` for everything inside it.

### Way-forward links and buttons
- **Way link:** an outlined pill (2px ink, 2.75rem tall, 700) with a section bullet at its left; fills ink on hover.
- **Primary button:** a solid ink pill of the same size, used for "show all"; turns amber with dark type on hover.
- **Text link:** inherits text colour, 2px underline in the section's line colour (blue by default), thickening to 4px on hover.
- **Focus:** a 3px blue outline offset 3px on everything; amber on Sign surfaces; flush (offset 0) on the search field.

### Network map
The signature figure. A 6px ink rule and a headline with a two-line caption open it; the map sits in a 2px ink frame on Panel, with the platform board in the same frame under a 2px rule, and the key beneath.

Marks and their meanings:
- **Route:** a 9-unit round-capped stroke in the line's colour. One line is one family of crosses in unlock order.
- **Feeder:** a 3.5-unit stroke in the line's colour from a pollen donor to the station it serves.
- **Ring** (Panel fill, 4.5-unit line-colour stroke): a crop sold by farmer villagers.
- **Filled dot with a Panel centre** (and a 2-unit Panel keyline): a crop you can only get by mutation.
- **Square** (Panel fill, 3-unit ink stroke): a vanilla pollen donor, a stop that is not part of the mod.
- **Interchange:** an extra ink ring around the station's own mark, and a hollow ink connector (9-unit ink stroke with a 4-unit Panel core) joining the two stations. It means one line feeds another. It is permanent and always ink.
- **Line tag:** a pill filled with the line colour, name in uppercase Tag type, at the line's origin.
- **Labels:** station name at 17 units, 700; base chance beside it in mono 600, Second Ink; donor names at 14.5 units, 500, Second Ink.

State vocabulary:
- **Hover:** a thin (2-unit) halo in the line colour, set off from the mark.
- **Selected:** a 5-unit halo in the line colour and an underlined station name. The halo is a ring at a larger radius than any mark and always in the line's colour, so it cannot be mistaken for the ink interchange ring.
- **Keyboard focus:** the same 5-unit halo in Signal Blue; the default outline is suppressed on stations only.
- **Receded:** once the reader has picked a station, everything not on its route recedes in solid colour. Routes turn Rule and thin from 9 to 5 units; feeders and connectors turn Rule; station marks and line tags turn Line Slate; names drop to 500 in Second Ink. Clicking empty map restores the whole network. Nothing is ever faded with opacity.

Motion: on load, routes draw along their length (1.4s, staggered 0.12s per line) and stations arrive by opacity (0.5s, staggered 0.07s per stop). Route recolouring takes 0.3s and the halo 0.2s. All easing is `cubic-bezier(0.16, 1, 0.3, 1)`. With reduced motion the draw-on is skipped, the map renders complete, and every transition collapses.

### Platform board
The selected station's readout, in up to four columns: a head (line-colour dot, crop name at 1.5rem 800, line name beneath), a definition list (term in Second Ink, value in 700, a quieter how-to-get line under each), the controls, and a meter. Controls are a segmented stepper (2px ink frame, 2px ink dividers, square, selected segment filled ink) and a square 1.25rem checkbox with a drawn tick. The meter is a large mono percentage, one line of plain-language odds, and a to-scale track (0.9rem tall, 2px ink frame, filled in the line colour). A full-width line lists the whole route in order with the destination in bold.

### Signage tables
Caption above in Label type. Head row in Sign with 700 type at 0.86rem. Rows divided by 1px rule lines; the table ends on a 2px ink rule. Row headers are 800. Number columns are mono, right-aligned and unwrapped. A "To scale" column holds a 0.7rem solid bar in the section's line colour, sized from the row's value, with a 2px minimum so a small value still registers. Level ticks (four 5px by 0.85rem bars, ink for earned, Rule for the rest) sit before a villager level name.

### Service notice
The one mark for bugs, corrections and disagreements between the quest book and the code. A square 2px ink frame on Panel, 68ch wide, with an 800 heading led by a warning triangle (amber fill, dark stroke, inline SVG) and a short paragraph. It is never tinted and never coloured by severity.

### Numbered steps
Used only where order matters. A grid of square cells sharing 2px ink borders; each cell has a mono numeral in a 1.75rem ring of the section's line colour, an 800 heading and a short paragraph.

### Block diagrams
Structures drawn as a grid of flat square cells (1.4rem, or `clamp(1.5rem, 4.6vw, 2.3rem)` for plans and sections) with 2px gaps, generated from a short text map and labelled for assistive technology as one image. Material is carried by colour and by cut: farmland is a full brown cell; dirt is Second Ink; wall is ink; water is blue cut down from the top; plants are green in distinct silhouettes (full, low, domed, narrow stem, half-round); the fence post is a narrow brown strip; the composter is Second Ink with a 3px ink border; the controller is blue with a Panel dot; fruit is amber with softened corners; an optional block is a dashed outline. A key of 0.9rem cells sits under each diagram.

### Chips
Outlined pills (1.5px ink, 2.25rem tall, 600 at 0.88rem) in a fieldset with a Label-type legend at its left. Hover fills Rule; the selected chip fills ink with paper type. A count follows the label in mono. Chips act as single-choice filters, and a chip is also the reset action inside an empty state.

### Search field and select
- **Search:** a square field, 3.25rem tall, 2px ink border on Panel, 600 at 1.1rem, with a stroked magnifier inside the left edge and a Second Ink placeholder that gives example queries.
- **Select:** square, 2.75rem tall, 2px ink border, 700, with a stroked chevron at the right.
- **Finder:** search, chip groups and a live status line stacked together, sticky under the signage bar on paper with a 2px ink rule beneath.

### Crop index rows
A ruled list of disclosure rows. Each summary is a five-column grid: station mark, name (800) over its Latin name (0.84rem, Second Ink), form, source, food. The station mark is the map's vocabulary at 1.25rem: ring for sold, filled dot with Panel centre for cross only, ink square for vanilla, in the section's line colour. The source column leads with level ticks when a villager sells the crop. Hover underlines the name in the line colour. An open row is bracketed by 2px ink rules above and below and reveals a grid of term-over-value facts, with the item ID in mono. Lists are capped (30 crops, 24 recipes) with a primary button to show all; an empty result says "Nothing matches" at Title size and offers a reset chip.

### Recipe rows and crafting grid
A ruled list with a fixed 6.5rem column for the kind plate (square, 1.5px ink outline, Tag type) and a body of title (800) and description (Second Ink, ingredients in ink 600). Shaped recipes add a crafting grid: 5.6rem by 3rem square cells with 2px gaps, 1.5px ink outline on Panel, the ingredient's name in 600 at 0.72rem. Empty slots are dashed Rule outlines with no fill. Items are always named, never pictured.

### Flower discs and blend preview
Flowers are a ruled list of 2rem discs (data colour, 2.5px ink ring) with name and dye. The blend preview is a square 2px ink panel with two selects and five 2.5rem discs set as stations on a 6px ink line, each labelled with its nearest dye and mono hex.

### Named Rules
**The Mark Before Hue Rule.** Kind and state are readable in one ink. Sold, cross-only, vanilla and interchange are four different shapes; villager level is a tick count; selection is a ring and an underline. Colour agrees with the mark and never replaces it.

**The Halo Is Not A Ring Rule.** The interchange ring is ink, permanent and tight to the mark. The selection halo is the line's colour, transient and set wide. Do not draw either in the other's colour or radius.

**The Solid Recede Rule.** Dimmed means re-inked in Rule, Second Ink or Line Slate, and thinned or lightened in weight. It never means lower opacity.

**The Letter And Number Rule.** Sections are lettered and every section has a bullet. Numerals appear only where the order of steps matters.

**The One Gotcha Mark Rule.** Every bug, book correction and caveat uses the service notice with the amber triangle. No second callout style exists.

**The Names Not Icons Rule.** Game items appear as their names in type. Icons are limited to a handful of stroked interface glyphs (contents, theme, search, arrow, warning) drawn inline.

## Do's and Don'ts

### Do:
- **Do** set `--line` on a section or `--c` on a mark and let underlines, markers, numerals and bars inherit it.
- **Do** define any new colour twice, once for the day map and once for the night map, and check type on it in both.
- **Do** frame figures and fields with 2px ink and divide rows with 1px Rule; open a figure or a section with a 6px rule.
- **Do** keep information surfaces square and stations, bullets and pressable pills fully round.
- **Do** put every measured value in Overpass Mono with tabular figures, and right-align number columns.
- **Do** size every bar, meter and tick from the data and say what the scale is.
- **Do** give every state a mark as well as a colour, and recede unrelated marks in solid Rule or Line Slate.
- **Do** give a wide diagram a minimum width and let it scroll inside its frame with a visible cue, and turn tables into labelled stacked records below 44rem.
- **Do** keep the draw-on and all transitions behind the reduced-motion preference, on the one easing curve.
- **Do** use the service notice for every caveat, and name game items in words.

### Don't:
- **Don't** use tints: no opacity on colour, no `color-mix`, no lighter or darker step of a line colour. The Panel step on the night map and Rule as a hover fill are the only quiet grounds.
- **Don't** use gradients of any kind, on fills, text, borders or the map.
- **Don't** use cast shadows, blur or glow. The paper knockout ring around a mark on a line is the only shadow-property use.
- **Don't** use mod textures, item sprites, models, or anything traced, sampled or derived from the mod's artwork. Authored flat geometry and colour values from the data only.
- **Don't** use pixel fonts, dirt-texture banners or walls of item icons, and don't build a dark neon dashboard; the night map is the day map re-inked on navy.
- **Don't** round a frame, table, field or cell, and don't square a bullet, station or pill.
- **Don't** put light type on amber or set amber as text on paper.
- **Don't** fade a dimmed route or station with opacity.
- **Don't** draw the selection halo in ink or the interchange ring in a line colour.
- **Don't** number things whose order does not matter, or letter anything that is not a section.
- **Don't** add a second typeface, a second callout style, or uppercase tracked type outside line tags and kind plates.
