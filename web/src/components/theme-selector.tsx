"use client"

import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useEffect, useState } from "react"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Evita hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-3">
        <Label className="text-base">Aparência</Label>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" disabled>
            <IconSun className="size-4" />
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <IconMoon className="size-4" />
          </Button>
          <Button variant="outline" className="flex-1" disabled>
            <IconDeviceDesktop className="size-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label className="text-base">Aparência</Label>
      <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-2">
        <div>
          <RadioGroupItem value="light" id="light" className="peer sr-only" />
          <Label
            htmlFor="light"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <IconSun className="size-6" />
            <span className="text-sm font-medium">Claro</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
          <Label
            htmlFor="dark"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <IconMoon className="size-6" />
            <span className="text-sm font-medium">Escuro</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem value="system" id="system" className="peer sr-only" />
          <Label
            htmlFor="system"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <IconDeviceDesktop className="size-6" />
            <span className="text-sm font-medium">Sistema</span>
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}