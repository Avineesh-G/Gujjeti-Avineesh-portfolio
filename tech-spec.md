# Tech Spec — Elevate Portfolio

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1 | UI framework |
| react-dom | ^19.1 | DOM renderer |
| vite | ^6.3 | Build tool |
| @vitejs/plugin-react | ^4.5 | Vite React plugin |
| typescript | ^5.8 | Type safety |
| tailwindcss | ^4.1 | Utility-first CSS |
| @tailwindcss/vite | ^4.1 | Tailwind Vite integration |
| three | ^0.175 | 3D engine (raw, not R3F — per design.md constraint) |
| gsap | ^3.13 | Animation engine, timelines, scroll-driven animations |
| @gsap/react | ^2.1 | GSAP React integration (useGSAP hook) |
| lucide-react | ^0.511 | SVG icons (chevrons, social, mail, external link) |
| clsx | ^2.1 | Conditional class composition |
| tailwind-merge | ^3.3 | Tailwind class conflict resolution |
| @fontsource/dm-sans | ^5.2 | Display font (self-hosted) |
| @fontsource/inter | ^5.2 | Body font, weights 300 + 400 (self-hosted) |

**Excluded:** No shadcn/ui — no standard UI components are needed (all components are custom styled per design spec). No react-three-fiber (design.md specifies raw Three.js).

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| AppShell | Custom | Fixed WebGL canvas + scrollable HTML overlay. Handles global intro sequence orchestration. |

### Sections

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Name, intro text, tagline, scroll indicator. HTML content fades in after intro sequence. |
| AboutSection | Custom | Philosophy statement, two-column grid (photo left, bio + resume CTA right). |
| SkillsSection | Custom | Section heading + 6 category groups, each with label and pill row. |
| ProjectsSection | Custom | Section heading, intro text, 3-column project card grid (6 cards). |
| ContactSection | Custom | Centered heading, email link, social icon row, footer bar. |

### Reusable Components

| Component | Source | Used By |
|-----------|--------|---------|
| ContentBand | Custom | All 5 sections — white background band with ScrollTrigger-driven parallax reveal (opacity 0→1, translateY -80→0). |
| PillButton | Custom | About (resume), each project card ("View Project") — coral pill with hover scale. |
| SkillPill | Custom | Skills section — white pill with accent-color hover border. |
| SocialIcon | Custom | Contact section — 40px circle icon button with hover state. |
| ProjectCard | Custom | Projects section — image, name, description, tech tags, CTA button. |

### Hooks

| Hook | Purpose |
|------|---------|
| useScene | Encapsulates the full WebGL scene lifecycle: renderer creation, scene/camera setup, all 3D objects (icosahedron, inner spinner, cloud, text ribbon), render loop with RAF, mouse tracking, scroll-driven camera Y position, and cleanup. |

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| 3D scene (icosahedron wireframe + inner spinner + cloud) | Three.js raw | Scene setup in useScene hook: IcosahedronGeometry with EdgesGeometry for wireframes, InstancedMesh for 1000 cloud shapes, custom cylindrical text ribbon via BufferGeometry. Full render loop via requestAnimationFrame. | 🔒 High |
| Scroll-driven camera movement | GSAP ScrollTrigger + Three.js | ScrollTrigger on the page container maps scroll progress (0–1) to camera Y via power curve `Math.pow(progress, 2.5) * 8450`. Lerp smoothing in render loop. | 🔒 High |
| Intro loading screen | GSAP timeline | GSAP timeline: "LOADING" character cycling via setInterval (50ms) for 2s, then spinner rotation + opacity fade (1s), overlay opacity fade (500ms), then hero content staggered fade-in. | 🔒 High |
| 3D text ribbon reveal | Three.js + GSAP | Text ribbon vertices animated along cylindrical path. Per-character opacity 0→1 with Z offset -20→0, 800ms per char, 100ms stagger. Entire ribbon fades out at 6.5s. | 🔒 High |
| Mouse-tracking 3D rotation | Three.js | Mouse position (desktop) or auto-rotation (touch) drives main group rotation via lerp(0.05). Implemented in render loop. | Medium |
| Inner spinner opacity pulse | Three.js | `Math.sin(time * 0.0015) * 0.3 + 0.5` in render loop, applied to LineBasicMaterial opacity. | Low |
| Content band parallax reveals | GSAP ScrollTrigger | Shared ScrollTrigger pattern on each ContentBand: start "top 90%", end "top 20%", scrub 0.5, animating opacity 0→1 + translateY -80→0. | Medium |
| Section internal stagger reveals | GSAP ScrollTrigger | Per-section ScrollTriggers for headings, paragraphs, pills, cards with stagger delays and translateY offsets. | Medium |
| Skill pill hover | CSS transitions | border-color → accent color, scale 1.03, 150ms ease-out. Pure CSS, no JS animation needed. | Low |
| Project card hover | CSS transitions | Shadow elevation, translateY -4px, border-color shift. Pure CSS. | Low |
| Button/social icon hover | CSS transitions | Background darken, scale 1.02, border/icon color shift. Pure CSS. | Low |
| Scroll indicator bounce | CSS keyframes | Infinite translateY 0→8px, 1.5s ease-in-out. Opacity tied to scroll progress via ScrollTrigger. | Low |

## State & Logic Plan

### Intro Sequence Orchestration

The 5-phase intro (loading → spinner dissolve → overlay fade → 3D text-in → hero content reveal) is a single GSAP timeline in AppShell. The timeline controls both DOM elements (overlay, spinner, hero text) and Three.js objects (text ribbon opacity). This requires a shared timeline reference passed from the React layer into the render loop for the text ribbon phase.

**Key decision**: The loading screen and its animation are React DOM elements controlled by GSAP. The 3D text ribbon is a Three.js object whose material opacity is also controlled by the same GSAP timeline. This cross-system coordination happens via GSAP's `onUpdate` callbacks that write to Three.js material properties.

### 3D ↔ React Bridge

The WebGL scene runs entirely outside React's render cycle. Communication is one-way:
- React provides: scroll progress (via ScrollTrigger), mouse position (via window event listener), intro timeline state (via GSAP callbacks).
- Three.js consumes: writes to camera.position, group.rotation, material.opacity in its render loop.

**Implementation**: `useScene(canvasRef)` returns nothing — it sets up the scene imperatively and reads from shared refs (scrollProgressRef, mousePosRef) that React updates. The render loop reads these refs each frame via lerp interpolation.

### Scroll-Camera Coupling

Scroll progress (0–1) is computed once by a single ScrollTrigger on the scroll container and stored in a ref. The render loop reads this ref and applies the power-curve mapping to camera Y position. The camera position is lerped per-frame (not directly set) to ensure smooth movement regardless of scroll input irregularity.

## Other Key Decisions

### Raw Three.js over R3F

Design.md explicitly requires raw Three.js (not React Three Fiber). All 3D code is imperative in a single `useScene` hook. The scene graph is managed manually — no declarative JSX for 3D objects.

### No shadcn/ui

The design has no standard UI patterns (no forms, dialogs, dropdowns, tables). Every element is custom-styled per design spec. Adding shadcn would introduce unnecessary boilerplate. The only shared utilities needed are `clsx` + `tailwind-merge` for class composition in the PillButton and SkillPill components.

### Asset Strategy

- 6 project images, 1 about portrait, 1 hero fallback background — all AI-generated or placeholder images.
- 7 SVG icons (favicon, scroll indicator, LinkedIn, GitHub, Twitter, mail, external link) — inlined as React components or loaded as SVG files. Lucide handles standard icons (chevrons, external link). Custom social icons (LinkedIn, GitHub, Twitter) are inline SVGs in the SocialIcon component.
