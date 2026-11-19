# DS-2.5 Gap Audit: Data Vault vs `@aakashiic/ui`

**Audit date:** 19 Nov 2026  
**Target:** `@aakashiic/ui` unblocking Data Vault DS-2.5 (replace DaisyUI and hand-built controls with the package).  
**Consumer scanned:** `vretail-data-vault-frontend` branch `chore/design-system` (460 source files in `src/`).

---

## 1. Summary Audit Table

| Group / Pattern | Data Vault Files / Count | Package Status | Proposed Change |
|---|---|---|---|
| **1. Modal / Dialog** | 45 files (`Modal.tsx`, `ConfirmModal.tsx`, `LogoutModal.tsx`, `callSummaryModal.tsx`, etc., DaisyUI `modal*`, `<dialog>`) | **COVERED** | Already covered by `Dialog` and `AlertDialog` in `@aakashiic/ui`. PR #23 resolved `--ds-z-overlay` stacking and `return-focus`; PR #25 added `showCloseButton`. Data Vault's `Modal.tsx` and `ConfirmModal.tsx` wrap them cleanly. No package changes needed. |
| **2. Tooltip** | 61 files (DaisyUI `tooltip`, `tooltip-top`, `tooltip-bottom`, `tooltip-left`, `tooltip-right`, and local `Tip.tsx`) | **COVERED** | Covered by `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` in `@aakashiic/ui` (Radix primitive with full positioning). `Tip.tsx` in Data Vault is a dismissible in-page banner (KEEP IN APP). |
| **3. Loading / Skeleton** | 33 files (`PageSkeleton.tsx`, `DeepDiveLoadingSkeleton.tsx`, `*Shimmer.tsx` components with `animate-pulse`) | **COVERED** | Covered by `Skeleton` in `@aakashiic/ui` (`animate-pulse rounded-md bg-surface-muted motion-reduce:animate-none`). Complex shimmer layouts are composed of `Skeleton` blocks in the app. Spinners tracked separately below. |
| **4. Button** | 40 files (DaisyUI `btn`, `btn-primary`, `btn-secondary`, `btn-ghost`, `btn-sm`, `btn-xs`, `btn-circle`, and local `Button.tsx` with `variant="primary"`) | **PROP/VARIANT MISSING** | Add `primary` variant alias for `default` to prevent TypeScript/runtime breaks in Data Vault (`<Button variant="primary">`). Add `size="xs"` (24px) for `btn-xs` compatibility. Update `Button`'s loading state to use the shared `Spinner` component. |
| **5. Tabs** | 25 files (`tabs-boxed`, `tab-active`, `tab-selector.tsx`, retargeting tabs) | **COVERED** | Covered by `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` in `@aakashiic/ui` (segmented control on `surface-muted` track with keyboard arrow navigation). |
| **6. Dropdown** | 32 files (DaisyUI `dropdown`, `dropdown-content`, `dropdown-end`, `menu`, local `ProjectListDropdown.tsx`, `AgentListDropdown.tsx`) | **COVERED** | Covered by `DropdownMenu` (`DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, etc.) and `ProjectSwitcher` (`@aakashiic/ui/project-switcher`). `AgentListDropdown.tsx` is domain-specific. |
| **7. Select** | 6 files (`<select className="select select-bordered ...">` in `GeneratedPdfsWrapper`, `CreateTicketForm`, `TicketList`, etc.) | **COVERED** | Covered by `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel`, `SelectSeparator` in `@aakashiic/ui`. |
| **8. Checkbox** | 11 files (`checkbox checkbox-xs checkbox-primary`, `checkbox-sm`, `form-checkbox`) | **COVERED** | Covered by `Checkbox` in `@aakashiic/ui` (Radix Checkbox with check and indeterminate minus icons, token borders and focus ring). |
| **9. Toggle (Switch)** | 10 files (references to toggle actions/callbacks; 0 DaisyUI `toggle` classes) | **COVERED** | Covered by `Switch` in `@aakashiic/ui` (Radix Switch primitive with 44px track, 20px thumb, WCAG-compliant borders). |
| **10. Badge** | 14 files (DaisyUI `badge`, `badge-primary`, `badge-success`, custom status pills with `bg-*-100` / `text-*`) | **COVERED** | Covered by `Badge` in `@aakashiic/ui` (variants: `default`, `secondary`, `outline`, `success`, `warning`, `danger`, `info`, `destructive`). |
| **11. Progress** | 22 files (linear progress bar in `ProgressCard.tsx`, plus custom SVG gauges `petal-progress.tsx`, `progress-gauge.tsx`) | **COVERED** | Linear progress covered by `Progress` in `@aakashiic/ui` (`value`, `max`, `indicatorClassName`). Custom SVG gauges (`petal-progress`, `progress-gauge`) are domain-specific visualizations (KEEP IN APP). |
| **12. Table** | 19 files (`<table>`, `table-zebra`, `border-collapse`, local `table.tsx`, `ActivityDataModalTable.tsx`, `PerformanceTabel.tsx`) | **COVERED** | Covered by `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` in `@aakashiic/ui`. Data Vault's `NewTable` in `table.tsx` is an app-specific campaign data-fetching table (KEEP IN APP). |
| **13. Spinners** (`animate-spin`, DaisyUI `loading`) | 32 files (raw `<div className="animate-spin ... border-t-transparent" />`, `loading-spinner`, `loading-dots`, and SVG loaders) | **COMPONENT MISSING** | Add standalone `Spinner` component to `@aakashiic/ui` (`size="sm"\|"md"\|"lg"`, `label` for screen readers, `role="status"`, token text/border colors). Update `Button` loading spinner to use `Spinner`. |
| **14. DaisyUI `collapse`** | 13 files (`collapse-arrow` on dropdowns, `isCollapsed` state in `productList.tsx`, expand/collapse in `call-summary-shortner.tsx`) | **COMPONENT MISSING** | Add `Collapsible` (`Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` using `@radix-ui/react-collapsible`) and `Accordion` (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` using `@radix-ui/react-accordion`) to `@aakashiic/ui`. Styled with token borders, surface, and motion tokens. |
| **15. `avatar`** | 13 files (user avatars in `header.tsx`, `SalesHeader.tsx`, `select-portal/page.tsx`, `AgentAvatar` in `lead-management`; role-based `Avatar.tsx` in chat) | **COMPONENT MISSING** | Add generic `Avatar`, `AvatarImage`, `AvatarFallback` using `@radix-ui/react-avatar` to `@aakashiic/ui`. Styled with token `bg-surface-muted`, `text-text`, `rounded-full`. Chat-specific role avatar (`role="user"\|"assistant"\|"system"`) stays in app (`KEEP IN APP`). |
| **16. `steps`** | 19 files matched (0 DaisyUI `steps` classes; all were code comments, math `step`, or tour steps) | **KEEP IN APP** | Not used in Data Vault. Any onboarding/wizard step state is domain-specific. |
| **17. `indicator`** | 8 files (1 file `FlagsElement.tsx` with `<div className="indicator">`, others were code comments) | **KEEP IN APP** | No general pattern in Data Vault; simple relative/absolute badge wrapper. Keep in app. |
| **18. `stat`** | 23 files (uses `text-stat` typography utility and KPI cards in `AnalyticsSummaryCard.tsx`) | **COVERED / KEEP IN APP** | Card container covered by `Card` in `@aakashiic/ui`. The typography scale `text-stat` is in the app CSS; KPI layout cards are domain-specific. |
| **19. `rating`** | 2 files (`FeedbackWidget.tsx` star rating buttons with state `rating`) | **KEEP IN APP** | App-specific star rating input with custom sentiment logic. |
| **20. `swap`** | 1 file (0 DaisyUI `swap` classes; word "swap" in a Redux slice test) | **KEEP IN APP** | Not used in Data Vault. |

---

## 2. Detailed Findings by Category

### Modals / Dialogs (45 files) — COVERED
Data Vault's modals center around `src/components/ui/Modal.tsx` (general dialog), `ConfirmModal.tsx` (alert dialog), and `LogoutModal.tsx`. These have already been migrated to `@aakashiic/ui`'s `Dialog` and `AlertDialog`. PR #23 solved the phone header (`z-1000`) stacking conflict via `--ds-z-overlay` and added focus restoration for triggerless dialogs. PR #25 added `showCloseButton` to `DialogContent` and `SheetContent` so modals with existing Cancel/Close buttons don't show duplicate X buttons. All requirements are met.

### Tooltips (61 files) — COVERED
Data Vault uses DaisyUI classes `tooltip`, `tooltip-top`, `tooltip-bottom`, `tooltip-left`, `tooltip-right` across 49 files, and has started using `@radix-ui/react-tooltip` directly in `lead-management/page.tsx`. `@aakashiic/ui` exports `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` supporting `side="top" | "bottom" | "left" | "right"`, which completely replaces all DaisyUI tooltip uses. `Tip.tsx` in Data Vault is a specialized dismissible callout card with `localStorage` persistence and is kept in the app.

### Skeletons & Shimmers (33 files) — COVERED
Data Vault has `PageSkeleton.tsx`, `DeepDiveLoadingSkeleton.tsx`, and 6 page-specific shimmers in `src/components/shimmers/*` (`AiAnalyticsShimmer`, `LinesShimmer`, etc.). All of them use standard `animate-pulse` boxes. `@aakashiic/ui`'s `Skeleton` provides the standard accessible `animate-pulse bg-surface-muted motion-reduce:animate-none` component. Page-level shimmer compositions are built using `Skeleton`.

### Buttons (40 files) — PROP/VARIANT MISSING
Data Vault's local `src/components/ui/button.tsx` defines:
```ts
variant?: "primary" | "secondary" | "outline";
```
In `@aakashiic/ui`, the primary button variant is named `default`. Passing `variant="primary"` in Data Vault components (such as `create-rerun-campaign.tsx` and `RetargetLead.tsx`) causes TypeScript errors. Adding `primary` as an alias for `default` resolves this cleanly.
Additionally, Data Vault uses `btn-xs` (24px) in 3 files (`SentimentConclusionCard.tsx`, `audioPlayerSmall.tsx`, `auplayer.tsx`). Adding `size="xs"` (`h-6 px-2 text-xs rounded-md`) provides drop-in compatibility.
Finally, `Button`'s loading state should use the new shared `Spinner` component.

### Tabs (25 files) — COVERED
Used in `data-vault-plus.tsx` (`tabs-boxed`, `tab-active`), `tab-selector.tsx`, and retargeting modals. `@aakashiic/ui`'s `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` match the segmented control design and provide keyboard arrow-key navigation.

### Dropdowns (32 files) — COVERED
DaisyUI `dropdown` + `dropdown-content` + `menu` is used for action menus, filter dropdowns, and project selection. `@aakashiic/ui`'s `DropdownMenu` provides accessible popover menus with keyboard navigation, destructive item variants, and checkbox/radio items. Project selection is covered by `@aakashiic/ui/project-switcher`.

### Select (6 files) — COVERED
Native `<select className="select select-bordered ...">` elements are used in 6 files (`GeneratedPdfsWrapper`, `CreateTicketForm`, `TicketList`, etc.). `@aakashiic/ui`'s Radix `Select` covers custom trigger, scrollable popover content, item selection, and overlay z-index.

### Checkbox (11 files) — COVERED
Used with `checkbox checkbox-xs checkbox-primary` and `form-checkbox`. `@aakashiic/ui`'s `Checkbox` covers checked, unchecked, and indeterminate (`Minus` icon) states with token borders and focus rings.

### Toggle / Switch (10 files) — COVERED
All 10 occurrences in Data Vault were callbacks, method names, or comments; no DaisyUI `toggle` classes are actively used. `@aakashiic/ui`'s `Switch` component (Radix primitive with 44px track, 20px thumb) covers all toggle switch needs.

### Badge (14 files) — COVERED
DaisyUI `badge`, `badge-primary`, `badge-success`, and raw `bg-*-100 text-*` pills. `@aakashiic/ui`'s `Badge` provides pill shapes in `default`, `secondary`, `outline`, `success`, `warning`, `danger`, and `info` with soft background + strong text.

### Progress (22 files) — COVERED
Linear progress bars are used in `ProgressCard.tsx`. `@aakashiic/ui`'s `Progress` component (`value`, `max`, `indicatorClassName`) replaces them. Custom SVG speedometer/petal dials (`petal-progress.tsx`, `progress-gauge.tsx`) are app-specific data visualizations (KEEP IN APP).

### Table (19 files) — COVERED
Table primitives in `@aakashiic/ui` (`Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`) cover standard table layouts with `surface-muted` headers, small uppercase labels, and hover rows. Data Vault's `NewTable` in `components/ui/table.tsx` is an application-specific data-fetching table (KEEP IN APP).

### Spinners (32 files) — COMPONENT MISSING
Spinners are used across 32 files in Data Vault, including DaisyUI `loading-spinner`, `loading-dots`, and inline `<div className="animate-spin rounded-full border-2 border-primary border-t-transparent" />`. There is no standalone spinner in `@aakashiic/ui`.
A `Spinner` component with `size="sm" | "md" | "lg"`, `label` for screen readers (default "Loading..."), `role="status"`, and token color support is required. `Button`'s loading spinner should also use this component.

### Collapse / Accordion (13 files) — COMPONENT MISSING
Data Vault uses expand/collapse patterns in product sidebars (`productList.tsx`), summary cards (`call-summary-shortner.tsx`), and retargeting filters. Adding `Collapsible` (`@radix-ui/react-collapsible`) and `Accordion` (`@radix-ui/react-accordion`) to `@aakashiic/ui` provides accessible single and multi-section collapsible controls with smooth animations.

### Avatar (13 files) — COMPONENT MISSING
Generic user avatars with image loading and initials fallback are used in `header.tsx`, `SalesHeader.tsx`, `select-portal/page.tsx`, and `AgentAvatar` in `lead-management`. Adding `Avatar`, `AvatarImage`, `AvatarFallback` (`@radix-ui/react-avatar`) to `@aakashiic/ui` standardizes user avatar rendering across applications. Chat role-based avatars (`role="user" | "assistant" | "system"`) remain in the app (`KEEP IN APP`).

### Steps, Indicator, Stat, Rating, Swap — KEEP IN APP
- **`steps`**: 0 DaisyUI steps classes; all matches were variable names, tour steps, or comments.
- **`indicator`**: 1 isolated use in `FlagsElement.tsx`. Can be styled with standard Tailwind utility classes.
- **`stat`**: Covered by `Card` and the app's `text-stat` typography scale; KPI card layouts are app-specific.
- **`rating`**: App-specific star rating input in `FeedbackWidget.tsx`.
- **`swap`**: 0 DaisyUI swap classes.

---

## 3. Implementation Plan (3 Targeted PRs)

1. **PR 1 (`feat/ui-spinner`):**
   - Add `Spinner` component (`size="sm" | "md" | "lg"`, `label`, `role="status"`).
   - Update `Button`: add `variant="primary"` alias, `size="xs"`, use `Spinner` for loading.
   - Include this gap audit document (`docs/ds-2.5-gap-audit.md`) and update `docs/phase-3-plan.md`.

2. **PR 2 (`feat/ui-collapsible-accordion`):**
   - Add `@radix-ui/react-collapsible` and `@radix-ui/react-accordion`.
   - Add `Collapsible` and `Accordion` components styled with token names.

3. **PR 3 (`feat/ui-avatar`):**
   - Add `@radix-ui/react-avatar`.
   - Add `Avatar`, `AvatarImage`, and `AvatarFallback` components styled with token names.
