"use client"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type Props = {
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  ariaDescribedBy?: string
  onClick:()=>void
}

export function PlayNowButton({ className, size = "lg", ariaDescribedBy }: Props) {
  const router = useRouter()

  const handleStart = () => {
    try {
      router.push("/game")
    } catch (e) {
      console.log("[v0] navigate error", e)
    }
  }

  return (
    <Button
      aria-label="Play Now"
      aria-describedby={ariaDescribedBy}
      onClick={handleStart}
      size={size}
      className={cn(
        // high-contrast, no gradient: amber on dark, dark text for legibility
        "bg-amber-500 text-black hover:bg-amber-400 focus-visible:ring-amber-400",
        "font-semibold rounded-full px-8 py-6 text-base md:text-lg",
        "shadow-[0_8px_24px_rgba(245,158,11,0.35)]",
        className,
      )}
    >
      <Play className="mr-2 h-5 w-5" aria-hidden="true" />
      Play Now
    </Button>
  )
}
