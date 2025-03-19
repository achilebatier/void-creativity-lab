
import React, { useRef, useEffect, useState } from 'react';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const features: Feature[] = [
    {
      title: "Minimalist Aesthetic",
      description: "We embrace simplicity and clarity in every design, removing unnecessary elements to focus on what truly matters.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      )
    },
    {
      title: "Intuitive Interactions",
      description: "We design interactions that feel natural and obvious, requiring minimal learning and providing maximum satisfaction.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      )
    },
    {
      title: "Pixel Perfect Precision",
      description: "We meticulously craft every detail with precision, ensuring flawless execution of our design vision across all devices.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M15 14c.2-1 .7-1.7 1.5-2"/>
          <path d="M6.5 15.5c0-1.8.8-3.3 2-4.5"/>
          <path d="M9 11.5c1.7-1 3.5-1.5 5.5-1.5"/>
          <path d="M18.5 8.5c.3 1.2.5 2.3.5 3.5 0 4.1-3.4 7.5-7.5 7.5-.5 0-1 0-1.5-.1"/>
          <path d="M7.5 12.5C7.1 11.5 7 10.3 7 9c0-4.1 3.4-7.5 7.5-7.5 1.9 0 3.7.7 5 2"/>
          <path d="M11 21c-.5-1.4-2-3-2-3l2 5Z"/>
          <path d="M22 22c-2-2.8-7.7-6-7.7-6l1.5 3"/>
          <path d="M2 19c2-2.3 5.5-3 5.5-3l-3 4"/>
        </svg>
      )
    },
    {
      title: "Thoughtful Motion",
      description: "We use purposeful animations and transitions to enhance user experience, guide attention, and add delight.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
          <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h3.8a2 2 0 0 1 2 2v2.4Z"/>
          <circle cx="11" cy="13" r="2"/>
          <path d="m16 18-2-2"/>
          <path d="m8 18 2-2"/>
          <path d="m12 12 2 2"/>
          <path d="m12 12-2 2"/>
        </svg>
      )
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [features.length]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
        }
      },
      { threshold: 0.1 }
    );
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      id="features" 
      ref={featuresRef}
      className="py-24 bg-secondary/30 opacity-0 transition-opacity duration-1000"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary text-sm font-medium">
            Our Approach
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <AnimatedText 
              text="Design Principles" 
              className="inline-block"
              delay={200}
            />
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our work is guided by these core principles, ensuring every project meets our high standards of excellence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 rounded-lg transition-all duration-500 ease-in-out",
                    "cursor-pointer transform hover:scale-[1.02]",
                    activeFeature === index 
                      ? "bg-background shadow-lg" 
                      : "hover:bg-background/50"
                  )}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex items-center justify-center rounded-lg p-2",
                      "bg-secondary-foreground/5",
                      activeFeature === index && "text-accent"
                    )}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-tr from-secondary-foreground/5 to-accent/10 p-1 overflow-hidden">
              <div className="relative size-full rounded-xl bg-background/70 backdrop-blur-sm overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center p-8",
                      "transition-all duration-700 ease-in-out",
                      activeFeature === index 
                        ? "opacity-100 transform scale-100" 
                        : "opacity-0 transform scale-90"
                    )}
                  >
                    <div className="text-6xl text-accent">
                      {feature.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div 
              className="absolute -bottom-6 -right-6 size-24 bg-accent/10 rounded-full filter blur-2xl z-0"
              style={{
                animation: "pulse 10s infinite alternate",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
