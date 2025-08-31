"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PlayNowButton } from "./play-now-button";

export default function Hero() {
  const helperId = useRef(`hero-helper`);
  const router = useRouter();

  // 🔥 Fullscreen & Orientation Handler
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handlePlayNow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="relative w-full bg-neutral-950 text-white">
      <div className="mx-auto max-w-5xl px-6 pt-14 pb-36 md:pt-24 md:pb-44">
        <div className="flex flex-col items-center text-center gap-6">
          <h1 className="text-balance font-bold text-4xl md:text-6xl tracking-tight">
            <span className="text-amber-400">മാവേലി</span>
            <span className="mx-3 text-neutral-400 text-2xl align-middle md:text-3xl">vs</span>
            <span className="text-sky-300">വാമനൻ</span>
          </h1>

          <p
            id={helperId.current}
            className="max-w-prose text-neutral-300 leading-relaxed"
          >
            MAVELI vs VAMANAN • Epic Onam showdown. Press Enter or Space to play.
          </p>

          <PlayNowButton
            ariaDescribedBy={helperId.current}
            className="mt-2"
            onClick={()=>{
                handlePlayNow()
            }}
          />
          <span className="sr-only" id="main-play-btn" />

          <div className="rounded-2xl ring-1 ring-neutral-800 overflow-hidden">
            <Image
              src="/main.png"
              alt="Maveli vs Vamanan game cover art"
              width={200}
              height={200}
              priority
              className="h-auto w-[min(720px,90vw)] object-cover"
            />
          </div>

          <button
            aria-label="Play from cover image"
            onClick={handlePlayNow}
            className="absolute inset-x-1/2 -translate-x-1/2 top-[88px] h-[400px] w-[min(720px,90vw)] md:top-[112px] rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{ background: "transparent" }}
          />
        </div>
      </div>
    </section>
  );
}
