"use client"
import { useRouter } from "next/navigation"
import { PlayNowButton } from "./play-now-button"

export function StickyCTA() {
    const router=useRouter()
      const handleStart = () => {
    try {
      router.push("/game")
    } catch (e) {
      console.log("[v0] navigate error", e)
    }
  }
    const enterFullscreenAndLandscape = async () => {
    try {
      // Fullscreen API
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      }

      // Orientation Lock (TypeScript-safe)
      const orientation = (screen.orientation || (screen as any).msOrientation || (screen as any).mozOrientation) as ScreenOrientation & {
        lock?: (orientation: string) => Promise<void>;
      };

      if (orientation?.lock) {
        try {
          await orientation.lock("landscape");
        } catch {
          console.warn("Orientation lock not supported");
        }
      }
    } catch (err) {
      console.warn("Fullscreen/landscape request failed:", err);
    }
  };

  const handlePlayNow = async () => {
    await enterFullscreenAndLandscape();
    router.push("/game");
  };

  return (
    <div
      role="region"
      aria-label="Play Now Sticky Bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800"
    >
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <p id="cta-helper" className="text-sm text-neutral-300">
          Instant play. No sign up.
        </p>
        <PlayNowButton ariaDescribedBy="cta-helper" className="min-w-[150px]" onClick={()=>{
            handlePlayNow()

        }} />
      </div>
    </div>
  )
}
