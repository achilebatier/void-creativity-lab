
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";
import { usePlatform } from "@/contexts/PlatformContext";
import { PlatformSelector } from "@/components/PlatformSelector";
import InstagramTutorial from "@/components/InstagramTutorial";
import TwitterTutorial from "@/components/TwitterTutorial";
import { Instagram, Twitter } from "lucide-react";

// Empty script codes to prevent template string errors
const instagramScriptCode = ``;
const twitterScriptCode = ``;

const IndexPage = () => {
  const { platform } = usePlatform();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container px-4 py-8 mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            {platform === "instagram" ? (
              <>
                <Instagram className="h-8 w-8 text-pink-500" />
                <span>Instagram Non-Follower Finder</span>
              </>
            ) : (
              <>
                <Twitter className="h-8 w-8 text-blue-400" />
                <span>Twitter Non-Follower Finder</span>
              </>
            )}
          </h1>
          
          <PlatformSelector className="mb-8" />
          
          <div className="space-y-8">
            {platform === "instagram" ? (
              <InstagramTutorial />
            ) : (
              <TwitterTutorial />
            )}
            
            <div className="py-4">
              <h2 className="text-xl font-semibold mb-4">The Script</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy this script and paste it into your browser's console when you&apos;re on 
                {platform === "instagram" ? " Instagram" : " Twitter's following page"}.
              </p>
              <CodeBlock
                code={platform === "instagram" ? instagramScriptCode : twitterScriptCode}
                language="javascript"
              />
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">Important Notes:</h3>
              <ul className="mt-2 list-disc pl-5 space-y-1 text-yellow-700 dark:text-yellow-300">
                <li>This tool is for educational purposes only.</li>
                <li>The script runs entirely in your browser and no data is sent to any server.</li>
                <li>The script may stop working if {platform === "instagram" ? "Instagram" : "Twitter"} changes their website structure.</li>
                <li>Using automated tools against {platform === "instagram" ? "Instagram" : "Twitter"}'s Terms of Service may result in account limitations.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default IndexPage;
