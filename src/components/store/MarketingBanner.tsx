import { useBanners } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

const MarketingBanner = ({ position, className = "" }: Props) => {
  const { data: banners = [] } = useBanners(position);
  const hClass = heightMap[position] || "h-[120px]";

  if (banners.length === 0) return null;

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
        <img src={b.image_url} alt={b.title} className={`w-full object-cover ${hClass}`} loading="lazy" />
      </motion.div>
    );
    return b.link_url ? <Link to={b.link_url}>{img}</Link> : img;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {banners.map((b, i) => {
        const img = (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:shadow-primary/20 transition-shadow duration-500"
          >
            <img src={b.image_url} alt={b.title} className={`w-full object-cover ${hClass}`} loading="lazy" />
          </motion.div>
        );
        return b.link_url ? <Link key={b.id} to={b.link_url}>{img}</Link> : <div key={b.id}>{img}</div>;
      })}
    </div>
  );
};

export default MarketingBanner;
