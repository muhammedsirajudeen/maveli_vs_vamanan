"use client"
import { forwardRef, useImperativeHandle, useRef, useState } from "react"
// import { toast } from "@/hooks/use-toast"

interface GameOverlayProps {
  isMobile: boolean
  onRestart: () => void
  winner?: "maveli" | "vamanan"
  shareImagePath?: string
  shareText?: string
  shareUrl?: string
}

export interface GameOverlayRef {
  show: () => void
  hide: () => void
  setResult: (text: string, winner?: "maveli" | "vamanan") => void
}

const DEFAULT_SHARE_TEXT =
  "Maveli won! Win 2 Lokah movie tickets worth ₹200 — share this and tag @lokah to enter. #Onam #MaveliVsVamanan"
const DEFAULT_SHARE_IMG = "/images/maveli-win-share.png"

const GameOverlay = forwardRef<GameOverlayRef, GameOverlayProps>(
  (
    {
      isMobile,
      onRestart,
      winner: winnerProp,
      shareImagePath = DEFAULT_SHARE_IMG,
      shareText = DEFAULT_SHARE_TEXT,
      shareUrl,
    },
    ref,
  ) => {
    const overlayRef = useRef<HTMLDivElement>(null)
    const resultRef = useRef<HTMLHeadingElement>(null)
    const [winner, setWinner] = useState<"maveli" | "vamanan" | undefined>(winnerProp)
    const [sharing, setSharing] = useState(false)

    useImperativeHandle(ref, () => ({
      show: () => overlayRef.current?.classList.add("show"),
      hide: () => overlayRef.current?.classList.remove("show"),
      setResult: (text: string, w?: "maveli" | "vamanan") => {
        if (resultRef.current) resultRef.current.textContent = text
        if (w) setWinner(w)
      },
    }))

    async function handleShare() {
      try {
        setSharing(true)
        const res = await fetch(shareImagePath, { cache: "no-store" })
        const blob = await res.blob()
        const file = new File([blob], "maveli-win.jpg", { type: blob.type || "image/jpeg" })

        const canShareFiles =
          typeof navigator !== "undefined" &&
          "canShare" in navigator &&
          (navigator as any).canShare?.({ files: [file] })
        if (canShareFiles && navigator.share) {
          await navigator.share({ title: "Maveli Wins!", text: shareText, url: shareUrl, files: [file] as any })
          // toast({ title: "Shared!", description: "Thanks for sharing—good luck in the giveaway!" })
          return
        }

        if (navigator.share) {
          await navigator.share({ title: "Maveli Wins!", text: shareText, url: shareUrl })
          // toast({ title: "Shared!", description: "Thanks for sharing—good luck in the giveaway!" })
          return
        }

        const tweet = encodeURIComponent(`${shareText} ${shareUrl ?? ""}`.trim())
        const twitterUrl = `https://twitter.com/intent/tweet?text=${tweet}`
        window.open(twitterUrl, "_blank", "noopener,noreferrer")
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl ?? ""}`.trim())
          // toast({
          //   title: "Almost there!",
          //   description: "We opened Twitter and copied the text. Attach the image manually.",
          // })
        } catch {}
      } catch {
        // toast({
        //   title: "Share failed",
        //   description: "Please try again or share manually and tag @lokah.",
        //   variant: "destructive",
        // })
      } finally {
        setSharing(false)
      }
    }

    const showShare = winner === "maveli"

    return (
      <>
        <div
          ref={overlayRef}
          className="overlay fixed inset-0 z-30 bg-black/75 flex items-center justify-center opacity-0 pointer-events-none transition-opacity"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-gray-900 rounded-xl p-6 md:p-8 text-center text-white max-w-sm mx-4 border border-yellow-500 shadow-2xl">
            <h1 ref={resultRef} className="text-3xl font-bold mb-3 text-yellow-400">
              {winner === "maveli" ? "Maveli Wins!" : "Vamanan Wins!"}
            </h1>
            <p className="mb-5 text-sm text-gray-200">
              {isMobile ? (
                <span>Tap restart to play again.</span>
              ) : (
                <>
                  Press <span className="bg-gray-800 px-2 py-1 rounded text-xs">R</span> to restart.
                </>
              )}
            </p>

            {showShare && (
              <div className="mb-4">
                <div className="text-left bg-gray-800/70 border border-yellow-600/40 rounded-lg p-3 mb-3">
                  <p className="text-sm leading-6">
                    Share your win and tag <span className="font-semibold">@lokah</span> to enter. Win 2 Lokah movie
                    tickets worth ₹200!
                  </p>
                </div>
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-black font-semibold py-3 rounded-lg shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
                >
                  {sharing ? "Sharing…" : "Share Now"}
                </button>
              </div>
            )}

            <button
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
              onClick={onRestart}
            >
              Fight Again!
            </button>
          </div>
        </div>

        <style jsx>{`
          .overlay.show { opacity: 1 !important; pointer-events: auto !important; }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.85} }
          .overlay.show .bg-gray-900 { animation: pulse .6s ease-in-out; }
        `}</style>
      </>
    )
  },
)

GameOverlay.displayName = "GameOverlay"
export default GameOverlay
