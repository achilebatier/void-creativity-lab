
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Features from '../components/Features';

const Index = () => {
  // Set title
  useEffect(() => {
    document.title = 'Void | Minimalist Design Studio';
  }, []);

  return (
    <Layout>
      <Hero />
      <Features />
    </Layout>
  );
};

export default Index;
