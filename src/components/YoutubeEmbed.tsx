import React from "react";

interface YoutubeEmbedProps {
  embedId: string;
  isShort?: boolean;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId, isShort = false }) => (
  <div className={`relative overflow-hidden h-0 bg-black ${isShort ? "pb-[177.78%]" : "pb-[56.25%]"}`}>
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={`https://www.youtube.com/embed/${embedId}?loop=1&playlist=${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default YoutubeEmbed;