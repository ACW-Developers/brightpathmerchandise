import { useState, useRef, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  quality?: number;
}

/**
 * Adds Supabase image transform params for on-the-fly compression.
 * Falls back to original URL for non-Supabase images.
 */
const getOptimizedUrl = (src: string, width?: number, quality = 75): string => {
  if (!src) return src;

  // Supabase storage URLs support render/image transforms
  if (src.includes("supabase.co/storage/v1/object/public/")) {
    const base = src.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/"
    );
    const params = new URLSearchParams();
    if (width) params.set("width", String(width));
    params.set("quality", String(quality));
    params.set("format", "origin"); // keep original format but compress
    return `${base}?${params.toString()}`;
  }

  return src;
};

const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  loading = "lazy",
  quality = 70,
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(loading === "eager");
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading === "eager") return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading]);

  const optimizedSrc = getOptimizedUrl(src, width || 800, quality);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {inView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
};

export { getOptimizedUrl };
export default OptimizedImage;
