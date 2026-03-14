import { useState, useEffect, useCallback } from "react";
import { useBanners } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


interface Props {
  position: string;
  className?: string;
}

const heightMap: Record<string, string> = {
  hero: "h-[150px] md:h-[150px]",
  "home-mid": "h-[120px] md:h-[130px]",
  "home-bottom": "h-[100px] md:h-[120px]",
  "shop-top": "h-[100px] md:h-[120px]",
  "shop-mid": "h-[100px] md:h-[110px]",
  "shop-bottom": "h-[100px] md:h-[120px]",
  sidebar: "h-auto",
};

// Different animation variants for visual variety
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    scale: 0.95,
  }),
};

const fadeZoomVariants = {
  enter: () => ({
    opacity: 0,
    scale: 1.08,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: () => ({
    opacity: 0,
    scale: 0.92,
    filter: "blur(4px)",
  }),
};

const variantSets = [slideVariants, fadeZoomVariants];

const MarketingBanner = ({ position, className = "" }: Props) => {
  const { data: banners = [] } = useBanners(position);
  const hClass = heightMap[position] || "h-[120px]";
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const variantIdx = position.includes("mid") ? 1 : 0;
  const variants = variantSets[variantIdx % variantSets.length];

  const advance = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(advance, 4500);
    return () => clearInterval(timer);
  }, [banners.length, advance]);

  if (banners.length === 0) return null;

  // Single banner — simple render
  if (banners.length === 1) {
    const b = banners[0];
    const img = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-primary/20 transition-shadow duration-500 ${className}`}
      >
        <img
          src={b.image_url}
          alt={b.title}
          className={`w-full ${hClass} object-cover`}
          loading="lazy"
        />
      </motion.div>
    );
    return b.link_url ? <Link to={b.link_url}>{img}</Link> : img;
  }

  // Multiple banners — animated carousel
  const b = banners[current];

  const content = (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 shadow-lg ${className}`}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${position}-${current}`}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <img
            src={b.image_url}
            alt={b.title}
            className={`w-full ${hClass} object-cover`}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-5 bg-white shadow-md"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return b.link_url ? <Link to={b.link_url}>{content}</Link> : content;
};

export default MarketingBanner;
