import { useBanners } from "@/hooks/useProducts";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  position: string;
  className?: string;
}

const MarketingBanner = ({ position, className = "" }: Props) => {
  const { data: banners = [] } = useBanners(position);

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
        <img src={b.image_url} alt={b.title} className="w-full h-auto object-cover" loading="lazy" />
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
            <img src={b.image_url} alt={b.title} className="w-full h-auto object-cover" loading="lazy" />
          </motion.div>
        );
        return b.link_url ? <Link key={b.id} to={b.link_url}>{img}</Link> : <div key={b.id}>{img}</div>;
      })}
    </div>
  );
};

export default MarketingBanner;
