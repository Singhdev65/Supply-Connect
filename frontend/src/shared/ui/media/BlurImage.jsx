import { useState } from "react";

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><rect width='100%' height='100%' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='16'>No Image</text></svg>";

const BlurImage = ({ src, alt, className = "", placeholderClassName = "" }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolvedSrc = failed || !src ? FALLBACK_IMAGE : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div
          className={`absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 to-gray-100 ${placeholderClassName}`}
        />
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={`h-full w-full object-cover transition duration-500 ${loaded ? "scale-100 blur-0" : "scale-105 blur-md"}`}
      />
    </div>
  );
};

export default BlurImage;
