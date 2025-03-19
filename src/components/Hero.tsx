
import React, { useEffect, useRef } from 'react';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current || !imageRef.current) return;
      
      const rect = heroRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / 50;
      const moveY = (e.clientY - centerY) / 50;
      
      imageRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0"></div>
      
      <div ref={imageRef} className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 size-64 bg-accent/10 rounded-full filter blur-[100px] animate-blur-in"></div>
        <div className="absolute bottom-1/4 right-1/4 size-64 bg-primary/10 rounded-full filter blur-[100px] animate-blur-in delay-300"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-secondary text-sm font-medium animate-fade-in opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Minimalist Design Studio
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <AnimatedText 
              text="Crafting Digital" 
              className="block"
              delay={300}
            />
            <AnimatedText 
              text="Experiences with" 
              className="block"
              delay={500}
            />
            <AnimatedText 
              text="Purpose" 
              className="block text-gradient"
              delay={700}
            />
          </h1>
          
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '1s', animationFillMode: 'forwards' }}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We create minimalist, intuitive digital products that prioritize user experience above all else.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#features" 
                className={cn(
                  "inline-flex items-center justify-center h-12 px-6 rounded-md",
                  "bg-primary text-primary-foreground font-medium",
                  "transition-all duration-300 ease-in-out",
                  "hover:bg-primary/90 hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                )}
              >
                Explore Our Work
              </a>
              <a 
                href="#contact" 
                className={cn(
                  "inline-flex items-center justify-center h-12 px-6 rounded-md",
                  "bg-secondary text-secondary-foreground font-medium",
                  "transition-all duration-300 ease-in-out",
                  "hover:bg-secondary/80 hover:scale-105",
                  "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
                )}
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#features" aria-label="Scroll down">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Hero;
