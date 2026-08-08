"use client";

import Link from "next/link";
import type { ShopifyArticle } from "@/lib/shopify";
import { useState, useEffect } from "react"; 

export function YoutubeEmbed({ videos }: { videos: ShopifyArticle [] }){

  const [video, setVideo] = useState<ShopifyArticle | null>(null);

  useEffect(() => {
    if (videos.length === 0) return;
    setVideo(videos[Math.floor(Math.random() * videos.length)]);
  }, [videos]);

  if (!video) return null;

  const videoId = video.contentHtml?.match(/[?&]v=([\w-]{11})/)?.[1];
  const embedLink = videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  const watchLink = videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";


  return (
    <div className="video-responsive flex flex-col items-center py-12 w-full px-[4%] md:px-[8%]">
    <div className="w-full max-w-[853px] aspect-video">
    <iframe
      src={`${embedLink}`}
      className="w-full h-full"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
    </div>
    <Link 
        href={`${watchLink}`} 
        className="text-[#0000EE] underline py-8"
        target="_blank" 
        rel="noopener noreferrer"
    >
        Ver mas...
    </Link>
  </div>
  );

}