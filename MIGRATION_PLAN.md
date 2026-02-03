# Chakra UI to shadcn/ui + Tailwind Migration Plan

## Overview

This plan migrates the life-calendar PWA from Chakra UI to shadcn/ui + Tailwind CSS incrementally, allowing both systems to coexist during the transition.

**Goals:**
- Learn Tailwind CSS through hands-on migration
- Maintain working app throughout migration
- Remove Chakra UI completely before upgrading to React 19

---

## Phase 1: Setup (Parallel Installation)

### 1.1 Install Tailwind CSS

```bash
cd pwa
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 1.2 Configure Tailwind

Create/update `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // We'll add custom colors matching Chakra's palette
      colors: {
        // Map Chakra colors to Tailwind for consistency during migration
      },
    },
  },
  plugins: [],
}
```

### 1.3 Add Tailwind to CSS

Update `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Keep existing styles during migration */
```

### 1.4 Install shadcn/ui

```bash
npx shadcn@latest init
```

Configuration choices:
- Style: Default
- Base color: Slate (or Zinc for closer match to Chakra dark theme)
- CSS variables: Yes
- React Server Components: No (this is a Vite app)
- Components directory: src/components/ui

### 1.5 Add Dark Mode Support

Since Chakra defaults to dark mode, configure the app to use dark mode:
- Add `class="dark"` to `<html>` element in `index.html`
- Or manage via a theme toggle (can add later)

---

## Phase 2: Component Migration Order

### Migration Batches (Simple → Complex)

| Batch | Components | Chakra Features | Estimated Effort |
|-------|------------|-----------------|------------------|
| **1** | AudioPlayer | None (already pure HTML) | Trivial |
| **2** | TodayButton, MobileViewSwitcher | IconButton | Simple |
| **3** | NavBar | Box, Flex | Simple |
| **4** | DateLink | Link | Simple |
| **5** | App, AppleTouchIconGenerator | Box, Flex | Simple |
| **6** | SearchButton, SyncButton, LayerButton | Button, IconButton, useDisclosure | Medium |
| **7** | FirstTimeSetupModal | Modal, Input, Button | Medium |
| **8** | SearchModal | Modal, Input, Button | Medium |
| **9** | DatabaseStats | Table components | Medium |
| **10** | SyncModal | Modal, Button, Stack | Medium |
| **11** | HighlightedText | Box | Medium |
| **12** | ScannedPage | AspectRatio, Image, Box, keyframes | Medium |
| **13** | Day | Box, Heading | Medium |
| **14** | ScrollList | Box | Medium |
| **15** | Timeline | Box, Flex, Button | Medium |
| **16** | Calendar | Box, useBreakpointValue | Medium |
| **17** | Markdown | 16+ elements (Heading, Text, List, Table, etc.) | Complex |
| **18** | LayerModal | Modal, Accordion, Checkbox, Stack | Complex |
| **19** | Remove Chakra, ChakraProvider | Final cleanup | Simple |

---

## Phase 3: Detailed Migration Guide

### Batch 1: AudioPlayer (Warmup)

**Current:** Already uses native HTML, no Chakra components
**Action:** Add Tailwind classes for consistency

```tsx
// Before
<audio controls src={url} style={{maxWidth: "100%"}} />

// After
<audio controls src={url} className="w-full max-w-full" />
```

**Tailwind concepts introduced:**
- `w-full` = `width: 100%`
- `max-w-full` = `max-width: 100%`

---

### Batch 2: Icon Buttons (TodayButton, MobileViewSwitcher)

**shadcn components needed:**
```bash
npx shadcn@latest add button
```

**Chakra → Tailwind/shadcn mapping:**

| Chakra | shadcn/Tailwind |
|--------|-----------------|
| `<IconButton icon={<Icon />} />` | `<Button variant="ghost" size="icon"><Icon /></Button>` |
| `colorScheme="blue"` | `className="text-blue-400 hover:bg-blue-400/10"` |
| `aria-label="..."` | `aria-label="..."` (same) |
| `onClick={...}` | `onClick={...}` (same) |

**Example migration:**
```tsx
// Before (Chakra)
<IconButton
  colorScheme="blue"
  variant="ghost"
  aria-label="Jump to today"
  icon={<BsFastForwardFill />}
  onClick={handleClick}
/>

// After (shadcn + Tailwind)
<Button
  variant="ghost"
  size="icon"
  aria-label="Jump to today"
  onClick={handleClick}
  className="text-blue-400 hover:bg-blue-400/10"
>
  <BsFastForwardFill />
</Button>
```

**Tailwind concepts introduced:**
- `text-blue-400` = text color (400 is medium brightness)
- `hover:bg-blue-400/10` = on hover, blue background at 10% opacity
- `/10` syntax = opacity modifier (10%, 20%, etc.)

---

### Batch 3: NavBar (Layout Introduction)

**Chakra → Tailwind layout mapping:**

| Chakra | Tailwind |
|--------|----------|
| `<Flex>` | `<div className="flex">` |
| `<Box>` | `<div>` |
| `flexDirection="column"` | `flex-col` |
| `justifyContent="space-between"` | `justify-between` |
| `alignItems="center"` | `items-center` |
| `gap={2}` | `gap-2` |
| `p={4}` | `p-4` |
| `px={4}` | `px-4` |
| `bg="blue.400"` | `bg-blue-400` |
| `height="72px"` | `h-[72px]` or `h-18` |

**Example migration:**
```tsx
// Before (Chakra)
<Flex
  bg="blue.400"
  height="72px"
  alignItems="center"
  justifyContent="space-between"
  px={4}
  gap={2}
>
  {children}
</Flex>

// After (Tailwind)
<div className="flex h-[72px] items-center justify-between bg-blue-400 px-4 gap-2">
  {children}
</div>
```

**Tailwind concepts introduced:**
- Flexbox: `flex`, `flex-col`, `items-center`, `justify-between`
- Spacing: `p-4` (padding 1rem), `px-4` (horizontal padding), `gap-2` (gap 0.5rem)
- Arbitrary values: `h-[72px]` for exact pixel values
- Color naming: `bg-blue-400` (bg = background, blue = color, 400 = shade)

---

### Batch 4: DateLink

**shadcn components needed:** None (use native or shadcn Button with `asChild`)

```tsx
// Before (Chakra)
<Link color="teal.300" onClick={handleClick}>
  {children}
</Link>

// After (Tailwind)
<button
  onClick={handleClick}
  className="text-teal-300 hover:text-teal-200 hover:underline cursor-pointer"
>
  {children}
</button>
```

**Tailwind concepts introduced:**
- `cursor-pointer` = shows pointer cursor
- `hover:underline` = underline on hover
- State variants: `hover:`, `focus:`, `active:`

---

### Batch 5: App, AppleTouchIconGenerator

**App.tsx layout migration:**
```tsx
// Before (Chakra)
<Flex height="100vh" flexDirection="column">
  <Box>...</Box>
  <Flex flex="1" overflow="hidden">
    <Box
      position={{base: "absolute", md: "relative"}}
      opacity={{base: mobileView === "calendar" ? 1 : 0, md: 1}}
      width={{base: "100%", md: "auto"}}
    >
      <Calendar />
    </Box>
  </Flex>
</Flex>

// After (Tailwind)
<div className="flex h-screen flex-col">
  <div>...</div>
  <div className="flex flex-1 overflow-hidden">
    <div
      className={`
        absolute md:relative
        w-full md:w-auto
        ${mobileView === "calendar" ? "opacity-100" : "opacity-0"} md:opacity-100
      `}
    >
      <Calendar />
    </div>
  </div>
</div>
```

**Tailwind concepts introduced:**
- `h-screen` = `height: 100vh`
- `flex-1` = `flex: 1 1 0%` (grow to fill space)
- `overflow-hidden` = `overflow: hidden`
- Responsive prefixes: `md:` = applies at medium breakpoint and up
- `absolute` / `relative` = position values
- Template literals for conditional classes

---

### Batch 6: Button Components (SearchButton, SyncButton, LayerButton)

**Replacing useDisclosure:**
```tsx
// Before (Chakra)
const {isOpen, onOpen, onClose} = useDisclosure()

// After (React state)
const [isOpen, setIsOpen] = useState(false)
const onOpen = () => setIsOpen(true)
const onClose = () => setIsOpen(false)
```

**Button variants:**
```tsx
// Before (Chakra)
<Button colorScheme="blue" variant="ghost" leftIcon={<Icon />}>
  Label
</Button>

// After (shadcn)
<Button variant="ghost" className="text-blue-400">
  <Icon className="mr-2 h-4 w-4" />
  Label
</Button>
```

**Tailwind concepts introduced:**
- `mr-2` = margin-right 0.5rem
- `h-4 w-4` = height/width 1rem (common icon size)
- Sizing scale: 1 = 0.25rem, 2 = 0.5rem, 4 = 1rem, 8 = 2rem, etc.

---

### Batch 7-8: Modals (FirstTimeSetupModal, SearchModal)

**shadcn components needed:**
```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
```

**Modal → Dialog migration:**
```tsx
// Before (Chakra)
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalCloseButton />
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button onClick={onClose}>Cancel</Button>
      <Button colorScheme="blue">Submit</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

// After (shadcn)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <div className="py-4">Content</div>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button>Submit</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Input migration:**
```tsx
// Before (Chakra)
<Input placeholder="Enter URL" value={value} onChange={onChange} />

// After (shadcn)
<Input placeholder="Enter URL" value={value} onChange={onChange} />
// (shadcn Input has similar API!)
```

**Tailwind concepts introduced:**
- `py-4` = padding vertical (top and bottom)
- shadcn components come with sensible defaults

---

### Batch 9: DatabaseStats (Tables)

**shadcn components needed:**
```bash
npx shadcn@latest add table
```

**Table migration:**
```tsx
// Before (Chakra)
<Table size="sm">
  <TableCaption>Caption</TableCaption>
  <Thead>
    <Tr>
      <Th>Header</Th>
    </Tr>
  </Thead>
  <Tbody>
    <Tr>
      <Td>Cell</Td>
    </Tr>
  </Tbody>
</Table>

// After (shadcn)
<Table>
  <TableCaption>Caption</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Header</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Cell</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Batch 10: SyncModal

Combines patterns from Batch 7-8 (modals) with:
- Stack → `<div className="flex flex-col gap-4">`
- Loading states on buttons

---

### Batch 11: HighlightedText

```tsx
// Before (Chakra)
<Box as="span" bg="orange.500" color="white">
  {highlighted}
</Box>

// After (Tailwind)
<span className="bg-orange-500 text-white">
  {highlighted}
</span>
```

**Tailwind concepts introduced:**
- `as` prop replacement: just use the element directly
- `text-white` = white text color

---

### Batch 12: ScannedPage

**shadcn components needed:**
```bash
npx shadcn@latest add aspect-ratio  # Or use native CSS aspect-ratio
```

**AspectRatio migration:**
```tsx
// Before (Chakra)
<AspectRatio ratio={width / height}>
  <Image src={url} />
</AspectRatio>

// After (Tailwind)
<div style={{ aspectRatio: `${width} / ${height}` }}>
  <img src={url} className="w-full h-full object-cover" />
</div>
```

**Keyframe animations:**
```tsx
// Before (Chakra)
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
<Box animation={`${fadeIn} 0.5s ease-out`}>

// After (Tailwind)
// Add to tailwind.config.js:
// animation: { 'fade-in': 'fadeIn 0.5s ease-out' }
// keyframes: { fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } } }
<div className="animate-fade-in">
```

---

### Batch 13-15: Day, ScrollList, Timeline

These are layout-heavy components. Key patterns:

**Sticky positioning:**
```tsx
// Before: position="sticky" top={0}
// After: className="sticky top-0"
```

**Z-index:**
```tsx
// Before: zIndex={10}
// After: className="z-10"
```

**Overflow:**
```tsx
// Before: overflow="auto" overflowX="hidden"
// After: className="overflow-auto overflow-x-hidden"
```

---

### Batch 16: Calendar

**useBreakpointValue replacement:**
```tsx
// Before (Chakra)
const isMobile = useBreakpointValue({base: true, md: false})

// After (custom hook)
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])
  return matches
}

// Usage
const isMobile = !useMediaQuery("(min-width: 768px)")
```

---

### Batch 17: Markdown (Complex)

**shadcn components needed:**
```bash
npx shadcn@latest add checkbox
```

**Strategy:** Create a mapping object similar to current approach:

```tsx
const components: Components = {
  h1: ({children}) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
  h2: ({children}) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
  p: ({children}) => <p className="mb-4">{children}</p>,
  a: ({href, children}) => (
    <a href={href} className="text-blue-400 hover:underline">{children}</a>
  ),
  ul: ({children}) => <ul className="list-disc list-inside mb-4">{children}</ul>,
  ol: ({children}) => <ol className="list-decimal list-inside mb-4">{children}</ol>,
  li: ({children}) => <li className="mb-1">{children}</li>,
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4">
      {children}
    </blockquote>
  ),
  code: ({children}) => (
    <code className="bg-gray-700 px-1 py-0.5 rounded text-sm">{children}</code>
  ),
  pre: ({children}) => (
    <pre className="bg-gray-800 p-4 rounded overflow-x-auto my-4">{children}</pre>
  ),
  table: ({children}) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({children}) => (
    <th className="border border-gray-600 px-4 py-2 bg-gray-700">{children}</th>
  ),
  td: ({children}) => (
    <td className="border border-gray-600 px-4 py-2">{children}</td>
  ),
  // ... etc
}
```

**Tailwind concepts introduced:**
- Typography: `text-2xl`, `font-bold`, `italic`
- Lists: `list-disc`, `list-inside`, `list-decimal`
- Borders: `border-l-4`, `border-gray-500`
- Code styling: `rounded`, `overflow-x-auto`

---

### Batch 18: LayerModal (Complex)

**shadcn components needed:**
```bash
npx shadcn@latest add accordion
npx shadcn@latest add checkbox
```

**Accordion migration:**
```tsx
// Before (Chakra)
<Accordion allowMultiple>
  <AccordionItem>
    <AccordionButton>
      <Box flex="1">Title</Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel>Content</AccordionPanel>
  </AccordionItem>
</Accordion>

// After (shadcn)
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Title</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

**Checkbox with indeterminate state:**
```tsx
// Before (Chakra)
<Checkbox isChecked={checked} isIndeterminate={indeterminate} onChange={onChange}>
  Label
</Checkbox>

// After (shadcn)
<div className="flex items-center gap-2">
  <Checkbox
    checked={indeterminate ? "indeterminate" : checked}
    onCheckedChange={onChange}
  />
  <label>Label</label>
</div>
```

---

### Batch 19: Final Cleanup

1. Remove ChakraProvider from `index.tsx`
2. Remove theme configuration
3. Uninstall Chakra packages:
   ```bash
   npm uninstall @chakra-ui/react @emotion/react @emotion/styled framer-motion
   ```
4. Remove any remaining Chakra imports
5. Run build and tests
6. Proceed with React 19 upgrade

---

## Appendix A: Tailwind Cheat Sheet

### Spacing Scale
| Class | Value |
|-------|-------|
| `*-0` | 0 |
| `*-1` | 0.25rem (4px) |
| `*-2` | 0.5rem (8px) |
| `*-4` | 1rem (16px) |
| `*-6` | 1.5rem (24px) |
| `*-8` | 2rem (32px) |

### Colors
- Format: `{property}-{color}-{shade}`
- Properties: `bg`, `text`, `border`
- Shades: 50 (lightest) → 950 (darkest)
- Example: `bg-blue-500`, `text-gray-300`

### Responsive Prefixes
| Prefix | Min-width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

### Common Patterns
```tsx
// Centering
<div className="flex items-center justify-center">

// Card
<div className="rounded-lg border bg-card p-6 shadow-sm">

// Truncate text
<span className="truncate">

// Screen reader only
<span className="sr-only">
```

---

## Appendix B: shadcn Components to Install

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add table
npx shadcn@latest add checkbox
npx shadcn@latest add accordion
```

---

## Appendix C: Chakra → Tailwind Color Mapping

| Chakra | Tailwind |
|--------|----------|
| `blue.400` | `blue-400` |
| `blue.500` | `blue-500` |
| `teal.300` | `teal-300` |
| `orange.500` | `orange-500` |
| `gray.600` | `gray-600` |
| `gray.700` | `gray-700` |
| `gray.800` | `gray-800` |
| `white` | `white` |

---

## Progress Tracker

- [x] Phase 1: Setup (Tailwind v4 + shadcn/ui installed)
- [x] Batch 1: AudioPlayer
- [x] Batch 2: TodayButton, MobileViewSwitcher
- [x] Batch 3: NavBar
- [x] Batch 4: DateLink
- [x] Batch 5: App, AppleTouchIconGenerator
- [x] Batch 6: SearchButton, SyncButton, LayerButton
- [x] Batch 7: FirstTimeSetupModal
- [x] Batch 8: SearchModal
- [x] Batch 9: DatabaseStats
- [x] Batch 10: SyncModal
- [x] Batch 11: HighlightedText
- [x] Batch 12: ScannedPage
- [x] Batch 13: Day
- [x] Batch 14: ScrollList
- [x] Batch 15: Timeline
- [x] Batch 16: Calendar
- [x] Batch 17: Markdown
- [x] Batch 18: LayerModal
- [x] Batch 19: Remove Chakra (Bundle: 780KB → 476KB, -39%)
- [ ] React 19 Upgrade

## Notes from Migration

### Chakra + Tailwind Coexistence
- Chakra's Emotion styles override Tailwind utilities via global `button { background: transparent }` reset
- **Workaround:** Use `!` prefix on Tailwind classes (e.g., `!bg-blue-400`) to add `!important`
- Remove `!` prefixes after Chakra is fully removed

### Custom Button Variant
Added `variant="nav"` to shadcn Button for nav bar buttons:
```tsx
nav: "!bg-blue-300 !text-black hover:!bg-blue-200 !rounded-sm"
```

### Dynamic Tailwind Classes
Tailwind uses static analysis - dynamically constructed classes won't work:
```tsx
// ❌ Won't work
className={`h-[${HEIGHT}px]`}

// ✅ Use inline style for dynamic values
style={{ height: HEIGHT }}
```

### Replaced Patterns
- `useDisclosure()` → `useState(false)` + `setIsOpen(true/false)`
- `<Box>` / `<Flex>` → `<div>` with Tailwind classes
- Responsive props `{base: "x", md: "y"}` → `"x md:y"` classes
