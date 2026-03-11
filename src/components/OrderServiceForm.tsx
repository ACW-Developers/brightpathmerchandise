import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  MessageSquare,
  CheckCircle,
  Rocket,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().optional(),
  
  // Service Information
  serviceType: z.string().min(1, "Please select a service type"),
  serviceCategory: z.string().optional(),
  projectTitle: z.string().min(5, "Project title must be at least 5 characters"),
  projectDescription: z.string().min(20, "Please provide a detailed description (min 20 characters)"),
  timeline: z.string().min(1, "Please specify your timeline"),
  budget: z.string().min(1, "Please indicate your budget range"),
  
  // Additional Requirements
  additionalRequirements: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "whatsapp"]),
});

type FormData = z.infer<typeof formSchema>;

interface OrderServiceFormProps {
  selectedService?: string;
  onClose: () => void;
}

const OrderServiceForm: React.FC<OrderServiceFormProps> = ({ selectedService, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: selectedService || "",
      preferredContact: "whatsapp",
    },
  });

  const serviceTypes = [
    "Professional Printing Services",
    "Website Design & Development", 
    "Custom Software Development",
    "Logo & Business Card Design",
    "Social Media Management",
    "Digital Marketing & SEO",
    "IT Consulting & Support",
    "Mobile App Development",
    "E-commerce Solutions"
  ];

  const printingCategories = [
    "T-Shirt Printing",
    "Cap & Headwear Printing", 
    "Business Cards & Stationery",
    "Document Printing & Binding",
    "Banners & Signage",
    "Promotional Products",
    "Car Branding",
    "Office Branding",
    "Wheel Cover",
    "Stickers",
    "Magazines",
    "Books"
  ];

  const budgetRanges = [
    "Under $500",
    "$500 - $1,000",
    "$1,000 - $2,500",
    "$2,500 - $5,000",
    "$5,000 - $10,000",
    "$10,000+"
  ];

  const timelineOptions = [
    "ASAP (Rush)",
    "1-2 weeks",
    "2-4 weeks", 
    "1-2 months",
    "2-3 months",
    "3+ months"
  ];

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 1:
        return ["firstName", "lastName", "email", "phone"];
      case 2:
        return ["serviceType", "projectTitle"];
      case 3:
        return ["projectDescription", "timeline", "budget"];
      case 4:
        return ["preferredContact"];
      default:
        return [];
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Format message for WhatsApp
      const message = `
🚀 *NEW SERVICE ORDER*

👤 *Client Information:*
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
${data.company ? `Company: ${data.company}` : ''}

🎯 *Service Details:*
Service Type: ${data.serviceType}
${data.serviceCategory ? `Category: ${data.serviceCategory}` : ''}
Project Title: ${data.projectTitle}

📝 *Project Description:*
${data.projectDescription}

⏰ *Timeline:* ${data.timeline}
💰 *Budget:* ${data.budget}

${data.additionalRequirements ? `📋 *Additional Requirements:*\n${data.additionalRequirements}` : ''}

📞 *Preferred Contact:* ${data.preferredContact}

---
Sent via TechCorp Order Form
      `.trim();

      // Create WhatsApp URL
      const whatsappNumber = "15207361677"; // Remove spaces and format for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      toast({
        title: "Order Submitted Successfully! 🎉",
        description: "Your order has been sent via WhatsApp. We'll contact you soon!",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 text-primary mx-auto mb-4 animate-glow-pulse" />
              <h3 className="text-2xl font-bold font-space gradient-text">Personal Information</h3>
              <p className="text-muted-foreground mt-2">Let's start with your contact details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} className="futuristic-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} className="futuristic-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" type="email" {...field} className="futuristic-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 123-4567" type="tel" {...field} className="futuristic-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} className="futuristic-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Rocket className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold font-space gradient-text">Service Selection</h3>
              <p className="text-muted-foreground mt-2">Choose your desired service and project details</p>
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <FormControl>
                    <select 
                      {...field} 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm futuristic-input"
                    >
                      <option value="">Select a service</option>
                      {serviceTypes.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("serviceType") === "Professional Printing Services" && (
              <FormField
                control={form.control}
                name="serviceCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Printing Category</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm futuristic-input"
                      >
                        <option value="">Select printing category</option>
                        {printingCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Corporate Website Redesign" {...field} className="futuristic-input" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-bold font-space gradient-text">Project Details</h3>
              <p className="text-muted-foreground mt-2">Tell us more about your project requirements</p>
            </div>

            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please describe your project in detail, including specific requirements, features needed, target audience, and any other relevant information..."
                      className="min-h-[120px] futuristic-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Timeline</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm futuristic-input"
                      >
                        <option value="">Select timeline</option>
                        {timelineOptions.map(timeline => (
                          <option key={timeline} value={timeline}>{timeline}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Range</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm futuristic-input"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(budget => (
                          <option key={budget} value={budget}>{budget}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any specific technical requirements, design preferences, or other important details..."
                      className="min-h-[80px] futuristic-input"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-spin-slow" />
              <h3 className="text-2xl font-bold font-space gradient-text">Final Step</h3>
              <p className="text-muted-foreground mt-2">Choose your preferred contact method</p>
            </div>

            <FormField
              control={form.control}
              name="preferredContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
                        { value: "email", label: "Email", icon: Mail },
                        { value: "phone", label: "Phone Call", icon: Phone }
                      ].map(({ value, label, icon: Icon }) => (
                        <label key={value} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 futuristic-border">
                          <input
                            type="radio"
                            value={value}
                            {...field}
                            checked={field.value === value}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${field.value === value ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                            {field.value === value && <div className="w-2 h-2 rounded-full bg-background" />}
                          </div>
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/30 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold mb-2 text-primary">📱 Order Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Service:</strong> {form.watch("serviceType")}</p>
                <p><strong>Project:</strong> {form.watch("projectTitle")}</p>
                <p><strong>Timeline:</strong> {form.watch("timeline")}</p>
                <p><strong>Budget:</strong> {form.watch("budget")}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground animate-glow-pulse' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
            </div>
          ))}
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 futuristic-btn"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 futuristic-btn"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Send Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OrderServiceForm;