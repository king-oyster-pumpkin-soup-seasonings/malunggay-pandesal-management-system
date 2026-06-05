"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Bowlby_One } from "next/font/google";

const bowlbyOne = Bowlby_One({
  subsets: ["latin"],
  weight: "400",
});

const SLIDE_INDEX_STORAGE_KEY = "slides-current-index";

const slides = [
  {
    title: "Tech Stack",
    content: "Next.js, React, Tailwind CSS, TypeScript, PostgreSQL",
    images: [
      { src: "nextjs-react.png", size: "medium" },
      { src: "tailwindcss.webp", size: "medium" },
      { src: "typescript.png", size: "small" },
      { src: "postgresql.jpg", size: "medium" },
    ],
  },
  {
    title: "ERD",
    content: "Products, Ingredients, Recipes, Production, Production Logs",
    images: [{ src: "erd-hd.png", size: "large" }],
  },
  {
    title: "Trigger",
    content: "Tables with relationships and constraints",
    images: [{ src: "trigger.png", size: "large" }],
  },
  {
    title: "Stored Procedure",
    content: "Tables with relationships and constraints",
    images: [{ src: "stored-procedure.png", size: "large" }],
  },
];

export default function SlidesPage() {
  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") {
      return 0;
    }
    const savedIndex = window.localStorage.getItem(SLIDE_INDEX_STORAGE_KEY);
    if (savedIndex === null) {
      return 0;
    }
    const parsedIndex = Number(savedIndex);
    if (Number.isNaN(parsedIndex)) {
      return 0;
    }
    return Math.max(0, Math.min(parsedIndex, slides.length - 1));
  });
  const currentSlide = slides[index];

  useEffect(() => {
    window.localStorage.setItem(SLIDE_INDEX_STORAGE_KEY, String(index));
  }, [index]);

  function nextSlide() {
    setIndex((prev) => (prev + 1) % slides.length);
  }

  function prevSlide() {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-green-300 gap-3">
      <button
        onClick={prevSlide}
        className="text-6xl active:scale-67 transition-transform hover:scale-125">
        👈
      </button>
      <div className="bg-white p-12 w-md min-w-6/12 text-center">
        <h1 className={`text-4xl text-green-400 ${bowlbyOne.className}`}>
          {currentSlide.title}
        </h1>
        <p className="text-xl mt-4">{currentSlide.content}</p>

        {currentSlide.images && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {currentSlide.images.map((img) => (
              <div key={img.src} className="flex justify-center">
                <Image
                  src={`/${img.src}`}
                  alt={currentSlide.title}
                  width={
                    img.size === "large" ? 567
                    : img.size === "medium" ?
                      400
                    : 200
                  }
                  height={img.size === "large" ? 400 : 200}
                  className="rounded object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={nextSlide}
          className="text-6xl active:scale-67 transition-transform hover:scale-125">
          👉
        </button>
      </div>
    </div>
  );
}
