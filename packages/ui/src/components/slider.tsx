"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../lib/utils.ts"

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /**
   * Accessible names for the thumbs, e.g. `['Minimum price', 'Maximum price']`. The thumbs are what screen
   * readers focus, so each needs a name. Without this, `aria-label` on the slider is used (numbered when
   * there are several thumbs).
   */
  thumbLabels?: string[]
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbLabels, value, defaultValue, min = 0, "aria-label": ariaLabel, ...props }, ref) => {
    // One thumb per value. V-Estate's copy always rendered one, so a range slider lost its second handle.
    const count = (value ?? defaultValue ?? [min]).length
    const labelFor = (i: number) =>
      thumbLabels?.[i] ?? (ariaLabel && count > 1 ? `${ariaLabel} ${i + 1} of ${count}` : ariaLabel)

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn("relative flex w-full touch-none select-none items-center data-disabled:opacity-50", className)}
        value={value}
        defaultValue={defaultValue}
        min={min}
        aria-label={ariaLabel}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-input">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        {Array.from({ length: count }, (_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={labelFor(i)}
            className="block size-5 rounded-full border-2 border-primary bg-surface shadow-sm transition-[box-shadow] duration-(--ds-motion-duration-fast) ease-standard focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none"
          />
        ))}
      </SliderPrimitive.Root>
    )
  }
)
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider, type SliderProps }
