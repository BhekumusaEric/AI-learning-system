"use client";

import React from 'react';

interface VideoEmbedProps {
  src: string;
  title?: string;
}

export default function VideoEmbed({ src, title = "Video Tutorial" }: VideoEmbedProps) {
  // Convert youtu.be or youtube.com/watch links to embed links if necessary
  let embedUrl = src;
  if (src.includes('youtube.com/watch?v=')) {
    embedUrl = src.replace('youtube.com/watch?v=', 'youtube.com/embed/');
  } else if (src.includes('youtu.be/')) {
    embedUrl = src.replace('youtu.be/', 'youtube.com/embed/');
  }

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-border-subtle aspect-video bg-black/40 shadow-2xl">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
