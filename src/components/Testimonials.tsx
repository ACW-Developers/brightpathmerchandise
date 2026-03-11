import { Star, Quote, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

const testimonials = [
  {
    name: "Kwame Osei",
    role: "CEO, Jikubali Africa",
    company: "Jikubali Africa",
    rating: 5,
    text: "BrightPath Technologies transformed our digital presence across 12 African markets. Their custom software solution increased our operational efficiency by 300%. The team's expertise and cultural understanding are unmatched.",
  },
  {
    name: "Naledi Mbeki",
    role: "Marketing Director, Mite Explorers",
    company: "Mite Explorers",
    rating: 5,
    text: "Working with BrightPath was a game-changer for our tourism platform. They delivered a robust, scalable solution that exceeded our expectations. Our online bookings increased by 250% within the first quarter.",
  },
  {
    name: "Chinedu Okoro",
    role: "Founder, MyCityRadius",
    company: "MyCityRadius",
    rating: 5,
    text: "The mobile app developed by BrightPath has revolutionized how urban Africans discover local services. The user experience is exceptional, and the technical implementation is flawless. Highly recommended!",
  },
  {
    name: "Amina Diallo",
    role: "Operations Manager, Unashamed",
    company: "Unashamed",
    rating: 5,
    text: "BrightPath delivered our content management system on time and within budget. The solution has streamlined our operations and improved audience engagement significantly across the continent.",
  },
  {
    name: "Tendai Moyo",
    role: "CTO, Wakafreight Forwarders",
    company: "Wakafreight Forwarders",
    rating: 5,
    text: "Their logistics optimization software helped us achieve a 400% increase in delivery efficiency. BrightPath truly understands how to drive business growth through technology in African contexts.",
  },
  {
    name: "Fatou Camara",
    role: "Brand Manager, Jikubali Africa",
    company: "Jikubali Africa",
    rating: 5,
    text: "The brand identity and website design created by BrightPath perfectly captured our pan-African vision. Our brand recognition has improved dramatically, and customer engagement is at an all-time high.",
  }
];

const Testimonials = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;
    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(autoplayInterval);
  }, [emblaApi]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Client <span className="gradient-text">Testimonials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients say about their experience working with BrightPath Technologies.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 glass-card flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
            disabled={!canScrollPrev}
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 glass-card flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50"
            disabled={!canScrollNext}
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>

          <div className="overflow-hidden mx-8" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="flex-none w-full sm:w-1/2 lg:w-1/3"
                >
                  <div className="glass-card p-6 h-full relative group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-4 right-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                      <Quote className="w-8 h-8" />
                    </div>

                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-primary/20 flex items-center justify-center bg-primary/10 group-hover:border-primary/40 transition-colors">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-primary fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic line-clamp-4">
                      "{testimonial.text}"
                    </p>

                    <div className="text-center mt-auto">
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-primary text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedIndex === index
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center flex-wrap justify-center gap-8 glass-card px-8 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary">10+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">5★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
