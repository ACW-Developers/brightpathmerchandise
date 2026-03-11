import { Linkedin, Github, Twitter, Code } from "lucide-react";

// Using an online image for David Irihose
import ceoImage from "@/assets/team/David.png";
import amosImage from "@/assets/team/amos.jpg"; // Add this import

const teamMembers = [
  {
    name: "David Irihose",
    role: "CEO & Founder",
    image: ceoImage,
    description: "Visionary leader with 2+ years in tech innovation and digital transformation. David brings a unique combination of technical expertise and business strategy to drive our company's mission forward.",
    detailedDescription: "With a background in software engineering and business development, David founded our company with a vision to bridge the gap between cutting-edge technology and practical business solutions. David is a founder to some of the leading organizations. ",
    experience: "4 years experience in Community development, Tech innovation, and Business strategy",
    skills: ["Jikubali Africa", "Unashamed Charity", "Brightpath Technologies", "DivineAngel Care"],
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "#"
    }
  },
  {
    name: "Amos Clinton",
    role: "Software Developer",
    image: amosImage,
    description: "Experienced software developer with 4+ years specializing in website and web application development. Passionate about creating seamless user experiences and robust digital solutions.",
    detailedDescription: "Amos brings extensive expertise in modern web technologies, focusing on building scalable applications that deliver exceptional performance and user engagement. His dedication to clean code and innovative solutions drives our development projects to success.",
    experience: "4 years experience in website and webapp development",
    skills: ["React", "TypeScript", "Django", "Vue.js", "Postgres", "JavaScript", "CSS", "HTML"],
    socials: {
      linkedin: "#",
      twitter: "#",
      github: "#"
    }
  }
];

const Team = () => {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-space mb-6">
            Our <span className="gradient-text">Leadership</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Visionary leadership and technical expertise driving innovation and excellence in digital solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="glass-card group overflow-hidden w-full animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Image Section */}
                <div className="lg:w-2/5 relative">
                  <div className="relative h-80 lg:h-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Decorative Element */}
                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-primary/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                      <div className="w-8 h-8 bg-primary/30 rounded-lg flex items-center justify-center">
                        {member.role === "CEO & Founder" ? (
                          <span className="text-white font-bold text-xs">DI</span>
                        ) : (
                          <Code className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Experience Badge for Amos */}
                    {member.experience && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-accent/20 backdrop-blur-md rounded-full px-3 py-1 border border-accent/30">
                          <span className="text-sm font-semibold text-accent">4+ Years</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="lg:w-3/5 p-6 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold font-space mb-2 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary text-lg font-medium mb-3">{member.role}</p>
                    
                    {/* Experience for Amos */}
                    {member.experience && (
                      <p className="text-accent text-sm font-medium mb-3">
                        {member.experience}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                    {member.description}
                  </p>
                  
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed flex-grow">
                    {member.detailedDescription}
                  </p>

                  {/* Skills Section for Amos */}
                  {member.skills && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3">Leadership/Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Enhanced Social Links */}
                  <div className="flex space-x-3 pt-4 border-t border-border/50">
                    <a 
                      href={member.socials.linkedin}
                      className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social hover:scale-110"
                    >
                      <Linkedin className="w-4 h-4 text-primary" />
                    </a>
                    <a 
                      href={member.socials.twitter}
                      className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social hover:scale-110"
                    >
                      <Twitter className="w-4 h-4 text-primary" />
                    </a>
                    <a 
                      href={member.socials.github}
                      className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all duration-300 group/social hover:scale-110"
                    >
                      <Github className="w-4 h-4 text-primary" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;