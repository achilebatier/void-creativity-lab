
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ 
  text, 
  className,
  delay = 0,
  once = true
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-text-reveal', 'opacity-100');
          }, delay);
          
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('animate-text-reveal', 'opacity-100');
        }
      });
    }, {
      threshold: 0.1
    });
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, once]);
  
  return (
    <div 
      ref={elementRef} 
      className={cn(
        'opacity-0 transform translate-y-4 transition-all duration-700',
        className
      )}
    >
      {text}
    </div>
  );
};

export default AnimatedText;
