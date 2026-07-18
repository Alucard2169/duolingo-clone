"use client";

import { useState } from "react";
import Link from "next/link";
import type { SkillOut } from "@/lib/api";

const ICONS: Record<string, string> = {
  wave: "👋",
  apple: "🍎",
  paw: "🐾",
  people: "👨‍👩‍👧",
  star: "⭐",
};

interface SkillNodeProps {
  skill: SkillOut;
  lessonId: number | null;
  align: "left" | "center" | "right";
}

export function SkillNode({ skill, lessonId, align }: SkillNodeProps) {
  const [showBubble, setShowBubble] = useState(false);
  const locked = skill.status === "locked";
  const completed = skill.status === "completed";

  const alignClass =
    align === "left" ? "self-start ml-4 sm:ml-12" : align === "right" ? "self-end mr-4 sm:mr-12" : "self-center";

  const circleColor = locked
    ? "bg-duo-gray border-duo-gray-dark"
    : completed
    ? "bg-duo-yellow border-duo-yellow-dark"
    : "bg-duo-green border-duo-green-dark";

  const content = (
    <div
      className={`relative flex h-[68px] w-[68px] items-center justify-center rounded-full border-b-[6px] text-3xl ring-4 ring-white dark:ring-gray-950 shadow-sm ${circleColor} ${
        locked ? "cursor-not-allowed opacity-70" : "cursor-pointer active:translate-y-[3px] active:border-b-[3px]"
      }`}
      onClick={() => !locked && setShowBubble((v) => !v)}
    >
      {locked ? "🔒" : ICONS[skill.icon] ?? "⭐"}
      {completed && (
        <span className="absolute -top-1 -right-1 rounded-full bg-white dark:bg-gray-900 px-1.5 py-0.5 text-xs font-extrabold shadow ring-2 ring-duo-yellow">
          👑{skill.crowns}
        </span>
      )}
    </div>
  );

  return (
    <div className={`relative flex flex-col items-center ${alignClass}`}>
      {content}
      <span className="mt-2 max-w-[6rem] text-center text-xs font-bold text-gray-600 dark:text-gray-300">
        {skill.title}
      </span>

      {showBubble && !locked && lessonId && (
        <div className="absolute top-24 z-10 flex flex-col items-center rounded-2xl border-2 border-duo-gray dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-lg">
          <p className="mb-2 text-sm font-bold dark:text-gray-100">{skill.title}</p>
          <Link
            href={`/lesson/${lessonId}`}
            className="btn-duo rounded-xl bg-duo-green border-duo-green-dark px-6 py-2.5 text-sm text-white"
          >
            {completed ? "Practice" : "Start"}
          </Link>
        </div>
      )}
    </div>
  );
}