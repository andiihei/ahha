# Task Planning & Effort Level Heuristic

When working on the AHHA Design System, evaluate every incoming task against this heuristic and declare an upfront **Effort Recommendation** banner before taking action.

---

## 1. Effort Level Matrix

| Level | Scope & Characteristics | Trigger Scenarios | Mandatory Actions |
| :---: | :--- | :--- | :--- |
| **Low** | **Tactical, Localized, Non-Breaking**<br>Single-file or single-component cosmetic polish, CSS tweak, documentation copy edit, minor story prop update, or HUD inspector adjustment. | - CSS property / formatting tweaks<br>- Storybook HUD inspector formatting<br>- Copywriting / doc revisions<br>- Isolated bug fix in one component | - Fast direct edit<br>- Verify against `npm test` or local dev server<br>- Clean git commit & push |
| **Medium** | **Feature Expansion, Component Codification, Tooling**<br>Adding a new web component (`<ads-card>`, form field), creating new Storybook stories with Vitest interaction `play` tests, updating build/test configs. | - New Web Component (`src/components/*.ts`)<br>- Writing interaction tests / play functions<br>- Storybook / Vitest tool configuration<br>- Adding specimen showcase sections | - Light DOM custom element architecture (`createRenderRoot() { return this; }`)<br>- WCAG 2.1 / Section 508 / APCA contrast check<br>- Label in Name (SC 2.5.3) conformance<br>- Vitest interaction test suite with 100% pass |
| **High** | **Architectural, Systemic, Multi-Layer Ripple**<br>Modifying Layer 1 primitive scales (OKLCH curves, fluid Utopia `progress()`), changing Layer 2 semantic slots (`--surface-bg`, `--text-fg-1`, etc.), altering global container query breakpoints (`xCompact`, `Compact`), or changing contrast methodologies. | - OKLCH ramp or hue curve changes<br>- Fluid type / space progress math updates<br>- Breakpoint boundary adjustments<br>- Modifying semantic color mappings (`[data-mode]`, `[data-style]`)<br>- Refactoring global CSS architecture | - Comprehensive impact analysis across all specimen pages (`index.html`, `components.html`, `status.html`, `strategy.html`)<br>- Verify contrast across both light & dark/invert modes<br>- Update `docs/design-decisions-and-principles.md`<br>- Full test suite validation (`npm test`) |

---

## 2. Upfront Declaration Requirement

At the start of every response addressing a new task, the assistant MUST provide an upfront recommendation banner in this format:

```markdown
> 💡 **Effort Recommendation: [Low | Medium | High]**
> *Rationale*: [1-2 sentences explaining blast radius, architectural impact, and verification scope]
```
