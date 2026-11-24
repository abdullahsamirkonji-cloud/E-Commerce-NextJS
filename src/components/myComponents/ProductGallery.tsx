"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  title,
  imageCover,
}: {
  images: string[];
  title: string;
  imageCover: string;
}) {
  const allImages = images && images.length > 0 ? images : [imageCover];
  const [selectedImage, setSelectedImage] = useState(imageCover || allImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image View */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <Image
          src={selectedImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-all duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                selectedImage === img
                  ? "border-green-600 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
