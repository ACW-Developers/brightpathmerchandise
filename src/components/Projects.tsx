import { ExternalLink, Calendar, Users, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import project images
import inventorySystemImage from "@/assets/projects/city.png";
import crmPlatformImage from "@/assets/projects/jikubali.png";
import healthcareSystemImage from "@/assets/projects/mite.png";

const projects = [
  {
    title: "Attendance Management System",
    description:
      "A smart attendance management platform designed to streamline tracking of employee and student attendance.",
    image: inventorySystemImage,
    tech: ["Vue.js", "Django", "PostgreSQL", "Hospinnacle"],
    category: "Enterprise Software",
    year: "2024",
    teamSize: "2 developers",
    duration: "1 month",
    features: [
      "Real-time attendance tracking",
      "Automated reporting and analytics",
      "User-friendly dashboard",
      "Multi-role access control (Admin, Staff, Students)",
      "Cloud-based data storage and backup",
    ],
    link: "https://mycityradiusattendance.com/",
    gradient: "from-primary/20 to-secondary/20",
  },
  {
    title: "Jikubali Africa Website",
    description:
      "A dynamic and engaging website built for Jikubali Africa to raise awareness on mental health issues.",
    image: crmPlatformImage,
    tech: ["React", "Django", "Postgres"],
    category: "Non-Profit Website",
    year: "2024",
    teamSize: "1 developer",
    duration: "3 weeks",
    features: [
      "Informative pages on mental health awareness",
      "Events and programs section",
      "Blog and resource hub",
      "Contact and support channels",
      "Responsive and user-friendly design",
    ],
    link: "https://jikubaliafrica.org/",
    gradient: "from-accent/20 to-primary/20",
  },
  {
    title: "Mite Explorers Tours and Travel Website",
    description:
      "An interactive tours and travel booking platform designed for seamless trip planning and bookings.",
    image: healthcareSystemImage,
    tech: ["Vue.js", "Django", "PostgreSQL"],
    category: "Travel & Tourism",
    year: "2023",
    teamSize: "2 developers",
    duration: "2 months",
    features: [
      "Online booking system for tours and packages",
      "Destination exploration and details",
      "Travel guides and itineraries",
      "Secure payment integration",
      "Responsive design for mobile and desktop",
    ],
    link: "https://miteexplorers.com",
    gradient: "from-secondary/20 to-accent/20",
  },
];

const Projects = () => {
  return (
    <section className="py-24 px-6 relative">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Our Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our expertise through successful software solutions that have transformed businesses across various industries.
          </p>
        </div>

        {/* Featured Projects - Alternating Layout */}
        <div className="space-y-20">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-8 items-center`}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2 group">
                <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${project.gradient} p-1`}>
                  <div className="relative h-80 lg:h-96 overflow-hidden rounded-xl">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary/20 backdrop-blur-md text-primary text-xs font-medium px-3 py-1 rounded-full border border-primary/30">
                        {project.category}
                      </span>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="glass" className="gap-2">
                          View Live Demo
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold font-space">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{project.year} • {project.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{project.teamSize}</span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-foreground">Key Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="futuristic-btn group mt-4">
                    View Live Demo
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
