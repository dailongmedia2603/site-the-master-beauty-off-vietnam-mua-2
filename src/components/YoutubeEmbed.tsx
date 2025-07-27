import React from "react";

interface YoutubeEmbedProps {
  embedId: string;
}

const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ embedId }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0 bg-black">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default YoutubeEmbed;