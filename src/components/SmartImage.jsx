import { useEffect, useState } from "react";

export function SmartImage({ alt, image, className = "" }) {
  const baseUrl = typeof image === "string" ? image : image?.url;
  const placeholder = typeof image === "string" ? undefined : image?.placeholder;
  const srcsetObj = typeof image === "string" ? undefined : image?.srcset;
  const [loaded, setLoaded] = useState(false);

  const srcSet = srcsetObj
    ? Object.entries(srcsetObj)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([w, url]) => `${url} ${w}w`)
        .join(", ")
    : undefined;

  useEffect(() => {
    setLoaded(false);
  }, [baseUrl]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {placeholder && (
        <img
          aria-hidden
          src={placeholder}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-300 ${
            loaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
      <img
        src={baseUrl}
        alt={alt}
        loading="lazy"
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className={`relative z-10 h-full w-full object-cover transition-transform group-hover:scale-105 ${
          loaded ? "" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
}
