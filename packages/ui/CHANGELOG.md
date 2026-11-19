# @aakashiic/ui

## 0.1.1

### Patch Changes

- 9cc5327: Support react-day-picker 10 and recharts 3 alongside 9 and 2, so Data Vault (react-day-picker 10, recharts 3) can install the package next to V-Estate (9 and 2).

  - **Peer ranges:** `react-day-picker` is now `^9.9.0 || ^10.0.0` and `recharts` is `^2.15.4 || ^3.0.0`. npm refused to install 0.1.0 in an app with the newer majors, even though both are optional peers.
  - **`ChartTooltipContent` and `ChartLegendContent`:** their props are now declared in the package (`ChartTooltipItem`, `ChartLegendItem`) instead of taken from Recharts' Tooltip and Legend props, whose types changed in recharts 3. Use them as before: `<ChartTooltip content={<ChartTooltipContent />} />`.
  - **`Calendar`:** the grid's class now goes on `month_grid`. The old `table` key isn't a react-day-picker key in 9 or 10, so that class was never applied.

  Typechecked and tested against both react-day-picker 9.9 / recharts 2.15 and react-day-picker 10 / recharts 3.

## 0.1.0

### Minor Changes

- 2f6af3a: Add the central portal's app switcher (DS-3.7): `AppSwitcher` and `AppLauncher`, with the `AppItem` type. Built from Data Vault's `select-portal` page and portal rail, using only tokens. This completes the Phase 3 app shell.

  - **`AppSwitcher`:** a "Switch app" grid button for the header. It opens the apps as tiles in a popover, with the current app `aria-current="page"` and an optional "All workspaces" link (`allAppsHref`).
  - **`AppLauncher`:** the "Select your workspace" page, one card per app (icon, category, heading, description, call to action). The current app's card is outlined and reads "Continue in …".
  - **Every app is a link,** with `linkAs` for the router. Data Vault's cards were a `<div role="button">` around a second `<button>`, which is nested interactive content.
  - **Accessible names:** each launcher card is named by its heading and described by its description.
  - **`external` apps** open in a new tab with `rel="noopener noreferrer"` and announce "(opens in a new tab)".
  - **`onSelect`** runs before navigation, for analytics (Data Vault's `portal_selected` event).

- 5693b20: Restyle `Button` to the tokens (DS-3.3b), in Data Vault's look: `rounded-lg`, `text-sm` medium, token heights (40px default, 32px `sm`, 48px `lg`) and token colours only.

  - **Variants:** `default`, `secondary`, `outline`, `ghost`, `muted`, `link`, `destructive`, `success`, `warning`.
    - **Removed:** V-Estate's app-specific `grey`, `edit`, `delete`, `block` and `green` (they used V-Estate-only CSS variables).
    - **Default variant** is now `default` (primary), not `grey`.
    - `secondary` is now the navy/charcoal fill; the old light-grey `secondary` is `muted`.
  - **Status variants** (`destructive`, `success`, `warning`) are tinted backgrounds with the strong status colour as text. White text on status colours fails AA.
  - **`link`** uses body-coloured text with a brand-coloured underline, so it passes contrast in V-Estate's gold theme too.
  - **New `icon-sm` size** (32px square).
  - **`sm`** uses `text-xs` and no longer forces `w-fit`.
  - **New `loading` prop:** shows a spinner, disables the button and sets `aria-busy`.
  - **Alert dialog:** Action and Cancel now render as the primary and outline buttons in every app.

  The README has a V-Estate migration table (from its variant names to these).

- d8c33fd: Restyle the data-display components to the tokens (DS-3.3e): table, badge, card, progress, skeleton, separator and scroll-area now use only token colours, radii, sizes and motion. With this, all 25 components in the DS-3.3 groups are tokens-only. Calendar, chart, drawer and sonner aren't in a group yet and still use shadcn colour names.

  - **Card:** Data Vault's card (`rounded-2xl`, `border-border`, `bg-surface`, no shadow). V-Estate's copy forced `rounded-2xl! border! shadow-none!`, which silently ignored `className` overrides; they now apply. `CardTitle` is `text-lg`.
  - **Table:**
    - A `surface-muted` header with small uppercase `text-text-muted` labels, `border-border` rows (a bare `border` is `currentColor` in Tailwind v4), a soft row hover, and `primary-soft` for `data-state="selected"`.
    - The header no longer reads V-Estate's `--custom-bg`.
  - **Badge:**
    - Now a `<span>`, so it's valid inside a paragraph.
    - New status variants `success`, `warning`, `danger` and `info` (soft background + strong text). `destructive` is the same as `danger`.
    - No hover colour, since it isn't interactive.
  - **Progress:**
    - 8px `bg-primary` bar on a `surface-muted` track (was a 16px hard-coded gold gradient).
    - Now fills as a share of `max` (it assumed 100).
    - New `indicatorClassName` for status colours. Motion is token-timed and off under reduced motion.
  - **Skeleton:** `bg-surface-muted`, hidden from screen readers, and no pulse under reduced motion.
  - **ScrollArea:**
    - The thumb is `text-subtle`, which meets 3:1 against the surface (was the faint `border`).
    - The viewport shows a focus ring for keyboard scrolling.
  - **Separator:** unchanged look (`bg-border`), now covered by the tokens-only check.

- 4d26301: Restyle the form controls to the tokens (DS-3.3c): input, textarea, select, checkbox, radio-group, switch, slider, label and form now use only token colours, radii, sizes and motion.

  - **Fields** (input, textarea, select trigger):
    - 40px `h-control-md`, `rounded-lg`, `border-input` on `bg-surface`, `text-text-subtle` placeholders.
    - Focus is a `ring`-coloured border with a 3px soft halo (was an offset ring).
    - `aria-invalid` turns the border `danger`.
  - **Select menu:** matches the popover (`rounded-xl`, `bg-surface`, `shadow-md`). The highlighted option is `bg-surface-muted` and the check mark is `text-primary`.
  - **Checkbox, radio, switch:** unchecked borders (`text-muted`) and the unchecked switch track (`text-subtle`) now meet 3:1 against the surface (WCAG 1.4.11). The checked state uses the brand colour. The switch is now 44 × 24px with a 20px thumb.
  - **Checkbox** shows a dash for `checked="indeterminate"`.
  - **Slider:**
    - Renders one thumb per value. V-Estate's copy always rendered one, so range sliders lost their second handle.
    - New `thumbLabels` prop to name each thumb (falls back to `aria-label`, numbered for ranges).
  - **Label `required`:** the asterisk is now `text-danger-strong` and hidden from screen readers (they announce the field's own `required`).
  - **Form:** label, description and message use `text-danger-strong` and `text-text-muted`.

- 67de789: Add the app shell header (DS-3.5): `AppHeader`, `AppHeaderBack`, `AppHeaderTitle`, `AppHeaderActions`, `AppHeaderEnd` and `SkipToContent`. Built from Data Vault's `HeroIntro` and V-Estate's `MainLayout` header, using only tokens.

  - **`AppHeader`:** sticky, with no measured spacer (Data Vault's is `fixed` with one). Once the page scrolls it gains the `surface` background, a border and `shadow-sm`.
  - **`AppHeaderTitle`:** the page's `<h1>` (`asChild` for another level). V-Estate's title wasn't a heading.
  - **`AppHeaderBack`:** a real button named "Go back", or the router's link with `asChild`. V-Estate's was a `<div onClick>`, unreachable by keyboard and unnamed.
  - **`AppHeaderActions`:** filters and page actions. Inline on desktop, a full-width row on phones; with `mobileToggleLabel` the row hides behind a toggle with `aria-expanded`, like Data Vault's "Show filters".
  - **`AppHeaderEnd`:** notifications, theme toggle and the like, kept in the top row on every screen.
  - **`SkipToContent`:** a "Skip to content" link shown only on focus, so keyboard users can skip the sidebar.
  - `preview/shell.html` now shows the header with the sidebar.

- b6c201e: Restyle the navigation components to the tokens (DS-3.3d): tabs, dropdown-menu and command now use only token colours, radii, sizes and motion.

  - **Tabs:** Data Vault's segmented control. A `surface-muted` track (`rounded-xl`, `h-control-md`) with the active tab raised on `surface` with `shadow-sm`.
  - **Menus** (dropdown-menu, command) share the select menu's panel: `rounded-xl`, `bg-surface`, `border-border`, `shadow-md`. The highlighted row is `bg-surface-muted`, checks and radio dots are `text-primary`, and labels and shortcuts are `text-text-muted`.
  - **DropdownMenuItem:**
    - New `variant="destructive"` (`text-danger-strong`, `bg-danger-soft` when highlighted).
    - Disabled items are now dimmed (V-Estate's copy had no disabled style).
  - **CommandDialog:**
    - New `title` and `description` props (visually hidden, default "Command palette"). The dialog had no name before.
    - The title also names the search input.
  - **CommandInput:** keeps `aria-activedescendant` on the highlighted option. cmdk 1.1.1 sets it one step late, so screen readers announced the wrong option or none.
  - **CommandItem:** disabled items are dimmed. cmdk sets `data-disabled="false"` on every item, so the style matches `data-[disabled=true]`.
  - **CommandSeparator:** hidden from assistive tech. cmdk forces `role="separator"`, which isn't allowed inside the listbox.

- 77ab2d8: Restyle the overlays to the tokens (DS-3.3a): dialog, alert-dialog, sheet, popover and tooltip now use only token colours, radii, shadows and motion, in the Data Vault look. **Needs `@aakashiic/tokens` 0.5.0 or later set up in the app** (for `bg-overlay`); in V-Estate, import the tokens before upgrading.

  - **Backdrop:** `bg-overlay` plus `backdrop-blur-sm` (was `bg-black/80`).
  - **Dialog and alert dialog:**
    - `rounded-2xl` panel on `bg-surface` with `shadow-lg`, title `text-xl` semibold, description `text-text-muted`.
    - They fade and zoom in. The old diagonal slide (a Tailwind v3 pattern) is gone.
    - Footers use `gap-2` instead of `space-x-2`, and `AlertDialogCancel` no longer adds its own top margin.
  - **Close button** (dialog, sheet): a 32px (`size-control-sm`) target with a `surface-muted` hover and a visible focus ring.
  - **Sheet:** `bg-surface` with a `border-border` edge, and it slides in 200ms (was 500ms).
  - **Popover:** `rounded-xl`, `bg-surface`, `border-border`, `shadow-md`. It no longer turns every icon inside it `text-primary`.
  - **Tooltip:** inverted `bg-text` with `text-surface`, `text-xs` medium, no border.
  - **Motion:** every overlay uses `ease-standard` and the token durations.
  - **Headers:** dialog and sheet headers reserve `pr-8` so long titles don't run under the close button.

  alert-dialog's Action and Cancel still use `buttonVariants`, which is restyled in DS-3.3b.

- 5645d24: Add the project switcher (DS-3.6): `ProjectSwitcher` and `formatProjectName`, on their own path `@aakashiic/ui/project-switcher` (they need `cmdk`). A searchable picker in a popover, built from Data Vault's `ProjectListDropdown` and V-Estate's `ProjectBox` on `Popover` + `Command`, using only tokens.

  - **Value:** the selected project id, or `null` for "all projects" (`allLabel`; `null` removes that row).
  - **Search:** a substring match on names, cleared each time the switcher opens.
  - **Display:** `showCount` ("N projects", V-Estate), `meta` per row (Data Vault's score), and `formatName` (`formatProjectName` is Data Vault's title-casing, "L&t" → "L&T").
  - **Pins:** a "Pinned" group, toggled with **Alt+P** on the highlighted row (plus a mouse-only icon), instead of Data Vault's `role="button"` nested inside an option.
  - **Accessibility:**
    - The trigger reads "Project: Acme", and the popover and search are named.
    - The highlighted row is announced (`aria-activedescendant`), and the current project is `aria-checked`.
    - Rows aren't Tab stops, and each instance has its own ids (Data Vault hard-coded `project-list-options`).
  - On phones the popover keeps 12px from the screen edges.

- c01cb97: Restyle calendar, chart, drawer and sonner to the tokens (DS-3.3f). These four weren't in a DS-3.3 group, so they still used shadcn colour names. All 29 components now use only token names, and apps no longer need to define shadcn's colours.

  - **Calendar:**
    - Selected days and range ends are `bg-primary` / `text-on-primary`. The middle of a range is `primary-soft` (was shadcn's `accent`, which is the brand purple in the tokens). Today is bold on `surface-muted`.
    - Weekday labels are `text-xs text-text-muted`.
  - **Chart:**
    - Tooltip and legend swatches now show their colour. They used `bg-[--color-bg]`, which Tailwind v4 compiles to an invalid `background-color: --color-bg`; now `bg-(--color-bg)`.
    - The tooltip shows zero values (`item.value && …` hid them).
    - The tooltip uses the token surface, border and `shadow-lg`, and axis text is `text-muted`.
    - A config `theme.dark` colour applies under `.dark` or `data-theme="dark"`, like the tokens (was `.dark` only).
  - **Drawer:** the dialogs' `overlay` scrim, a `rounded-t-2xl` `bg-surface` panel, a decorative `text-subtle` drag handle, and the overlay title and description styles.
  - **Toaster:**
    - Sets sonner's colour variables (`--normal-*`, `--success-*`, `--error-*`, …) to the tokens, so plain and `richColors` toasts follow the theme. Status toasts are soft background + strong text.
    - Sonner's own description colour (`#3f3f3f`) beat V-Estate's shadcn classes; descriptions are now `text-muted` and the action button is primary.
    - An app's `style` and `toastOptions.classNames` are merged with these instead of replacing them.

- cf9219c: New package: shared React components (DS-3.1). Scaffolded from V-Estate's 29 generic shadcn components (Radix + Tailwind v4), not yet restyled to the tokens. `Calendar` takes `startMonth`/`endMonth` instead of reading V-Estate's store, and `Toaster` takes `theme` instead of using `next-themes`. calendar, chart, command, drawer and form are imported from their own paths because they need an optional peer dependency.
- 895d423: Add the app shell sidebar (DS-3.4): `SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarLabel`, `SidebarNav`, `SidebarNavItem`, `SidebarTrigger`, `SidebarCollapseButton` and `useSidebar`. Built from Data Vault's sidebar and V-Estate's `MainLayout`, using only tokens.

  - **Desktop (md and up):** a fixed 256px sidebar or an 80px icon rail. `defaultCollapsed`, or controlled with `collapsed` / `onCollapsedChange`. `SidebarInset` pads the page to match.
    - `expandOnHover` gives Data Vault's rail that widens over the page. It also widens on keyboard focus; Data Vault's only widened on hover.
    - Without it, the rail shows each label as a tooltip on hover or keyboard focus.
  - **Phones:** the same content in a left `Sheet` (focus trap, Escape, scrim), opened by `SidebarTrigger`. It closes when an item is followed.
  - **Items are links:**
    - `asChild` takes the app's router link (`<Link href="/" />`).
    - `active` sets `aria-current="page"` and a `primary-soft`, semibold style.
    - Labels stay in the accessibility tree on the rail.
    - `badge` adds a count that's read as part of the name.
  - Routes, roles and feature flags stay in the app.
  - New preview page: `preview/shell.html`.

- aa27339: Add `@aakashiic/ui/styles.css` (DS-3.2). Import it once in the app's global CSS: it points Tailwind v4's `@source` at the package's components (Tailwind never scans `node_modules`, so without it the component classes are never generated) and brings in `tw-animate-css` for the overlay animations. `tailwindcss` 4.1+ is now a peer dependency. The README covers app setup: install, global CSS, colours until DS-3.3, and moving V-Estate's imports.
