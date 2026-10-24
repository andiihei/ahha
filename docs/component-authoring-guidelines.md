# AHHA Design System: Token Architecture Audit & Web Component Guidelines

---

## Part 1: Design Language Audit (Review of `design-language/*.css`)

A comprehensive audit was performed across all 8 token files in `design-language/` to identify design intent, verify mathematical formulas, check for Muse artifacts, and eliminate inconsistencies.

### 1. `colors.css` (Layer 1 Ramps & Layer 2 [data-style] × [data-mode])
- **Architecture**:
  - **Layer 1**: 6 distinct OKLCH families (11 steps each: `1000..25`, skipping 400 & 600): `neutral` (Midnight), `purple` (Purple Rain), `green` (Fern), `red` (Cerise), `yellow` (Marigold), and `blue` (Cobalt).
  - **Layer 2**: Matrix of `[data-style]` (family) × `[data-mode]` (polarity: `default`, `invert`, `system`).
  - **Slot Contract**: Defines 8 essential functional slots: `--surface-bg`, `--surface-bg-1`, `--text-fg-1`, `--text-fg-2`, `--surface-border`, `--action-bg-1`, `--action-fg-1`, `--action-border`.
- **Findings & Status**:
  - The deprecated `haze` family is preserved dormantly with explicit comments.
  - Layer 2 maps `--action-bg-1` to `--color-800` in light mode and `--color-100` in dark mode, maintaining WCAG AAA contrast against `--action-fg-1` (`--color-25` / `--color-1000`).
  - **Clean & Consistent**: No hardcoded hex or RGB colors; pure OKLCH ramps with deliberate hue torsion curves.

### 2. `typography.css` (Font Families, Fluid Interpolation & Roles)
- **Architecture**:
  - 3 brand typefaces: `--font-main` ("IBM Plex Sans"), `--font-alt` ("Fraunces"), `--font-mono` ("IBM Plex Mono").
  - Mathematical fluid type engine: shared `--_progress` computed via `progress()` with `@supports` fallback using `tan(atan2())` from Utopia configuration (360px @ 18px base → 1240px @ 20px base).
  - Explicit roles: Headings (`.u-heading-400..150`), Paragraphs (`.u-paragraph-200..100`), Actions (`.u-action-110..75`), Details (`.u-detail-100..75`).
  - Atomic modifiers: `.text-caps` applies `text-transform: uppercase; letter-spacing: var(--tracking-loose);` (+5% tracking), `.text-regular`, `.text-medium`, `.text-semibold`, `.text-bold`.
- **Findings & Status**:
  - Fully standardized and robust. Action roles map directly to button sizing:
    - `sm` → `.u-action-75` (`--step-60` / 12px)
    - `md` → `.u-action-100` (`--step-80` / 16px)
    - `lg` → `.u-action-110` (`--step-100` / 18px)

### 3. `space.css` (Fluid Spacing vs Static Spacing)
- **Architecture**:
  - **Fluid Ladder** (`--space-10` to `--space-500` + pairs): Derives from Utopia fluid progress for page layouts and responsive macro-rhythm.
  - **Static Ladder** (`--space-static-10` to `--space-static-500`): Frozen on a fixed 20px desktop anchor.
- **Rule of Engagement**:
  - Macro layout (containers, sections, grids) **MUST** use fluid tokens (`--space-*`).
  - Micro component internals (button padding, icon gaps, pill padding, toggle insets) **MUST** use static tokens (`--space-static-*`) to prevent unwanted resizing on viewport changes.

### 4. `radius.css` (Concentric Geometry)
- **Architecture**:
  - Scale: `--radius-0` to `--radius-300` (8px base 100), plus `--radius-full` (9999px pill sentinel).
  - Concentric law: inner radius = max(0, governing radius - inset).
- **Findings & Status**:
  - Highly elegant and verified. Eliminates mismatched nested border radii across cards, badges, and controls.

### 5. `elevation.css` (Natural OKLCH Shadows)
- **Architecture**:
  - Smooth multi-layer shadow umbra/penumbra definitions using `color-mix(in oklch, var(--shadow-color) X%, transparent)` anchored to `--neutral-1000`.
  - Levels: `--elevation-low`, `--elevation-medium`, `--elevation-high`, `--elevation-very-high`.

### 6. `motion.css` & `opacity.css`
- **Motion**: Polysemic durations (`--duration-0` to `--duration-400`, base 200ms) with `prefers-reduced-motion` zeroing; standard cubic-bezier curves (`--ease-in`, `--ease-out`, `--ease-in-out`, `--ease-emphasized`).
- **Opacity**: Global percentage stops (`--opacity-0` to `--opacity-100`). State layers standard: hover = `--opacity-10`, active = `--opacity-15`, disabled = `--opacity-40`.

---

## Part 2: Web Component Construction Rules & Principles

To ensure all future AHHA Web Components (`<ads-card>`, `<ads-nav-menu>`, `<ads-field>`, `<ads-accordion>`, `<ads-toast>`, etc.) are built consistently, adhere to the following principles:

### Rule 1: Light DOM Rendering (`createRenderRoot() { return this; }`)
- **Requirement**: All AHHA custom elements must render into the Light DOM.
- **Rationale**: Allows the AHHA design language tokens, typography roles, atomic modifiers (`.text-caps`), and contextual `[data-style]` / `[data-mode]` scope cascades to apply without piercing or duplicating styles across Shadow DOM boundaries.

### Rule 2: Token-First Styling (Zero Raw Pixels or Raw Colors)
- **Color Slots Only**: Never reference Layer 1 colors directly (`--neutral-800`, `#333`, etc.) inside component stylesheets. Always bind to Layer 2 slots:
  - Surfaces: `--surface-bg`, `--surface-bg-1`, `--surface-border`
  - Text: `--text-fg-1` (primary ink), `--text-fg-2` (secondary ink)
  - Actions: `--action-bg-1`, `--action-fg-1`, `--action-border`
- **Spacing Distinction**:
  - Component padding, margins, gaps, and borders must strictly use `--space-static-*`.
- **State Layers**:
  - Interactive highlights on hover/active should use an inset shadow or pseudo-element with `--opacity-10` / `--opacity-15` mixed with `--state-ink`.

### Rule 3: Uniform Sizing Contract (`sm`, `md`, `lg`)
- All interactive controls (Buttons, Selectors, Form Inputs, Toggles) must support uniform sizing:
  - `sm`: Font step `--step-60`, compact static padding (e.g. `--space-static-30` × `--space-static-50` or `--space-static-60`), `--radius-50` (or `--radius-full`).
  - `md`: Default size. Font step `--step-80`, standard static padding (e.g. `--space-static-50` × `--space-static-80`), `--radius-100` (or `--radius-full`).
  - `lg`: Font step `--step-100`, relaxed static padding (e.g. `--space-static-60` × `--space-static-100`), `--radius-100` (or `--radius-full`).

### Rule 4: Feature Flags & Atomic Composition
- Specialized visual states (such as `critical`) should reflect as boolean attributes and compose with the atomic utility ladder:
  - e.g. `critical` on `<ads-button>` maps to `.text-caps` (`text-transform: uppercase; letter-spacing: var(--tracking-loose);`).

### Rule 5: State Naming Standards
- Controls with binary states use web standards:
  - `<ads-toggle>`: uses `checked` (boolean attribute & property), matching HTML `<input type="checkbox">` and ARIA `aria-checked`.
- Selections use standard properties:
  - `<ads-selector-button>`: uses `value` and emits a `select` event.

### Rule 6: Accessible Name & Labeling Fidelity
- **Label in Name (WCAG 2.1 SC 2.5.3)**:
  - If a control has visible text (e.g. "Alpha"), any programmatic `aria-label` applied to the trigger element **must include the visible text string** (e.g. `aria-label="Alpha, Demo selector"`), never replace it with an unrelated string.
  - Chevron icons and purely decorative glyphs must have `aria-hidden="true"`.
