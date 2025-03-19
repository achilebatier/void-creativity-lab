
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import { motion } from "framer-motion";
import { usePlatform } from "@/contexts/PlatformContext";
import { PlatformSelector } from "@/components/PlatformSelector";
import InstagramTutorial from "@/components/InstagramTutorial";
import TwitterTutorial from "@/components/TwitterTutorial";
import { Instagram, Twitter } from "lucide-react";

const instagramScriptCode = `
function getCookie(cookieName) {
    let cookies = document.cookie,
        parts = cookies.split(\`; \${cookieName}=\`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function afterUrlGenerator(cursor) {
    return \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"\${cursor}"}\`;
}

let csrftoken = getCookie("csrftoken"),
    ds_user_id = getCookie("ds_user_id"),
    initialURL = \`https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"\${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}\`,
    doNext = true,
    nonFollowers = [],
    processedCount = 0;

async function startScript() {
    console.log("%c INSTAGRAM NON-FOLLOWER FINDER ", "background: #1e40af; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
    console.log("%c Collecting data, please wait...", "color: #6b7280; font-style: italic;");

    while (doNext) {
        let response;
        try {
            response = await fetch(initialURL).then(res => res.json());
        } catch (error) {
            console.log("%c Network error, retrying...", "color: #ef4444;");
            continue;
        }

        doNext = response.data.user.edge_follow.page_info.has_next_page;
        initialURL = afterUrlGenerator(response.data.user.edge_follow.page_info.end_cursor);

        response.data.user.edge_follow.edges.forEach(edge => {
            if (!edge.node.follows_viewer) {
                nonFollowers.push(edge.node);
            }
        });

        processedCount += response.data.user.edge_follow.edges.length;
        console.clear();
        console.log(\`%c Processed: \${processedCount} accounts...\`, "color: #6b7280;");
        
        await sleep(1000);
    }

    console.log("%c Analysis complete! Injecting UI...", "color: #10b981; font-weight: bold;");
    injectUI(nonFollowers);
}

function injectUI(nonFollowers) {
    // Create styles for the component
    const styleSheet = document.createElement("style");
    styleSheet.textContent = \`
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .non-follower-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            height: 60px;
            border-radius: 12px;
            margin-bottom: 10px;
        }
        
        .non-follower-container {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 350px;
            max-height: 600px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 9999;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            animation: slideIn 0.4s ease-out forwards;
            overflow: hidden;
            border: 1px solid rgba(229, 231, 235, 0.8);
        }
        
        .non-follower-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(229, 231, 235, 0.8);
        }
        
        .non-follower-title {
            font-size: 18px;
            color: #1e40af;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .non-follower-title-count {
            background: #3b82f6;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .non-follower-close {
            background: none;
            border: none;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #64748b;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        
        .non-follower-close:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #1e293b;
        }
        
        .non-follower-search {
            position: relative;
            margin-bottom: 5px;
        }
        
        .non-follower-search input {
            width: 100%;
            padding: 10px 15px 10px 40px;
            border-radius: 12px;
            border: 1px solid rgba(229, 231, 235, 0.8);
            font-size: 14px;
            background: rgba(249, 250, 251, 0.8);
            transition: all 0.2s ease;
            box-sizing: border-box;
        }
        
        .non-follower-search input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .non-follower-search input {
            color: #333;
        }
        
        .non-follower-search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 16px;
        }
        
        .non-follower-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-height: 450px;
            overflow-y: auto;
            padding-right: 5px;
            scroll-behavior: smooth;
        }
        
        .non-follower-list::-webkit-scrollbar {
            width: 6px;
        }
        
        .non-follower-list::-webkit-scrollbar-track {
            background: rgba(243, 244, 246, 0.5);
            border-radius: 10px;
        }
        
        .non-follower-list::-webkit-scrollbar-thumb {
            background: rgba(209, 213, 219, 0.8);
            border-radius: 10px;
        }
        
        .non-follower-list::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.8);
        }
        
        .non-follower-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 15px;
            background: rgba(249, 250, 251, 0.8);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            opacity: 0;
            transform: translateY(8px);
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        .non-follower-item:hover {
            background: white;
            border-color: rgba(59, 130, 246, 0.3);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
        
        .non-follower-item:active {
            transform: scale(0.98);
        }
        
        .non-follower-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .non-follower-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(45deg, #3b82f6, #4f46e5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }
        
        .non-follower-details {
            display: flex;
            flex-direction: column;
        }
        
        .non-follower-username {
            color: #0369a1;
            font-size: 14px;
            font-weight: 600;
        }
        
        .non-follower-action {
            display: flex;
            gap: 10px;
        }
        
        .non-follower-button {
            background: none;
            border: none;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #64748b;
        }
        
        .non-follower-button:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #1e293b;
        }
        
        .non-follower-button.view:hover {
            color: #0284c7;
        }
        
        .non-follower-button.follow {
            background: #3b82f6;
            color: white;
        }
        
        .non-follower-button.follow:hover {
            background: #2563eb;
            animation: pulse 1.5s infinite;
        }
        
        .non-follower-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid rgba(229, 231, 235, 0.8);
            font-size: 13px;
            color: #64748b;
        }
        
        .non-follower-stats {
            display: flex;
            gap: 5px;
            align-items: center;
        }
        
        .non-follower-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #64748b;
            gap: 10px;
        }
        
        .non-follower-spinner {
            height: 20px;
            width: 20px;
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            border-top-color: #3b82f6;
            animation: spin 1s infinite linear;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        .non-follower-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px 20px;
            text-align: center;
            color: #64748b;
        }
        
        .non-follower-empty-icon {
            font-size: 40px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
    \`;
    document.head.appendChild(styleSheet);
    
    // Create container
    const container = document.createElement("div");
    container.id = "nonFollowerList";
    container.className = "non-follower-container";
    
    // Create header
    const header = document.createElement("div");
    header.className = "non-follower-header";
    
    const title = document.createElement("h3");
    title.className = "non-follower-title";
    title.innerHTML = \`Non-Followers <span class="non-follower-title-count">\${nonFollowers.length}</span>\`;
    
    const closeButton = document.createElement("button");
    closeButton.className = "non-follower-close";
    closeButton.innerHTML = "✕";
    closeButton.addEventListener("click", () => {
        container.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => container.remove(), 300);
    });
    
    header.appendChild(title);
    header.appendChild(closeButton);
    container.appendChild(header);
    
    // Create search box
    const searchBox = document.createElement("div");
    searchBox.className = "non-follower-search";
    
    const searchIcon = document.createElement("span");
    searchIcon.className = "non-follower-search-icon";
    searchIcon.innerHTML = "🔍";
    
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search by username...";
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = listContainer.querySelectorAll(".non-follower-item");
        
        items.forEach(item => {
            const username = item.querySelector(".non-follower-username").textContent.toLowerCase();
            if (username.includes(searchTerm)) {
                item.style.display = "flex";
            } else {
                item.style.display = "none";
            }
        });
        
        // Show empty state if no results
        const hasVisibleItems = Array.from(items).some(item => item.style.display !== "none");
        updateEmptyState(hasVisibleItems ? null : "No results found");
    });
    
    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    container.appendChild(searchBox);
    
    // Create list container
    const listContainer = document.createElement("div");
    listContainer.className = "non-follower-list";
    
    // Create empty state element (hidden by default)
    const emptyState = document.createElement("div");
    emptyState.className = "non-follower-empty";
    emptyState.style.display = "none";
    
    function updateEmptyState(message = null) {
        if (message) {
            emptyState.innerHTML = \`
                <div class="non-follower-empty-icon">🔎</div>
                <div>\${message}</div>
            \`;
            emptyState.style.display = "flex";
        } else {
            emptyState.style.display = "none";
        }
    }
    
    listContainer.appendChild(emptyState);
    
    // Show loading skeletons first
    for (let i = 0; i < 5; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "non-follower-skeleton";
        listContainer.appendChild(skeleton);
    }
    
    // After a brief delay, remove skeletons and show actual content
    setTimeout(() => {
        // Remove skeletons
        const skeletons = listContainer.querySelectorAll(".non-follower-skeleton");
        skeletons.forEach(skeleton => skeleton.remove());
        
        // Add user items with staggered animation
        if (nonFollowers.length === 0) {
            updateEmptyState("No non-followers found");
        } else {
            nonFollowers.forEach((user, index) => {
                const userElement = document.createElement("div");
                userElement.className = "non-follower-item";
                userElement.style.animationDelay = \`\${index * 0.05}s\`;
                
                // Get initials for avatar
                const initials = user.username.substring(0, 2).toUpperCase();
                
                userElement.innerHTML = \`
                    <div class="non-follower-info">
                        <div class="non-follower-avatar">\${initials}</div>
                        <div class="non-follower-details">
                            <span class="non-follower-username">@\${user.username}</span>
                        </div>
                    </div>
                    <div class="non-follower-action">
                        <button class="non-follower-button view" title="View Profile">👁️</button>
                    </div>
                \`;
                
                // Add event listeners
                const viewButton = userElement.querySelector(".non-follower-button.view");
                viewButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    window.open(\`https://www.instagram.com/\${user.username}/\`, "_blank");
                });
                
                
                // Add user element to container
                listContainer.appendChild(userElement);
            });
        }
    }, 800);
    
    container.appendChild(listContainer);
    
    // Add footer with stats
    const footer = document.createElement("div");
    footer.className = "non-follower-footer";
    footer.innerHTML = \`
        <div class="non-follower-stats">
            <span>Total: \${nonFollowers.length}</span>
        </div>
        <div>Updated just now</div>
    \`;
    container.appendChild(footer);
    
    // Add to document
    document.body.appendChild(container);
    
    // Focus search input
    setTimeout(() => searchInput.focus(), 500);
    
    // Return API for controlling the UI
    return {
        close: () => {
            container.style.animation = "fadeOut 0.3s forwards";
            setTimeout(() => container.remove(), 300);
        },
        refresh: (newNonFollowers) => {
            const count = document.querySelector(".non-follower-title-count");
            count.textContent = newNonFollowers.length;
            
            // Clear existing items
            const items = listContainer.querySelectorAll(".non-follower-item");
            items.forEach(item => item.remove());
            
            // Show loading state
            for (let i = 0; i < 3; i++) {
                const skeleton = document.createElement("div");
                skeleton.className = "non-follower-skeleton";
                listContainer.appendChild(skeleton);
            }
            
            // After a brief delay, remove skeletons and show actual content
            setTimeout(() => {
                // Remove skeletons
                const skeletons = listContainer.querySelectorAll(".non-follower-skeleton");
                skeletons.forEach(skeleton => skeleton.remove());
                
                if (newNonFollowers.length === 0) {
                    updateEmptyState("All caught up!");
                } else {
                    newNonFollowers.forEach((user, index) => {
                        // Create new user elements similar to original code
                        // ...
                    });
                }
                
                // Update footer stats
                const statsEl = footer.querySelector(".non-follower-stats");
                statsEl.innerHTML = \`<span>Total: \${newNonFollowers.length}</span>\`;
                
                // Update "Updated" text
                footer.querySelector("div:last-child").textContent = "Updated just now";
            }, 800);
        }
    };
}

startScript();
`;

const twitterScriptCode = `
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startScript() {
    console.log("%c TWITTER NON-FOLLOWER FINDER ", "background: #1DA1F2; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;");
    console.log("%c Collecting data, please wait...", "color: #6b7280; font-style: italic;");
    
    if (!window.location.href.includes('twitter.com/following')) {
        console.log("%c Please navigate to https://twitter.com/following to use this script", "color: #ef4444; font-weight: bold;");
        return;
    }
    
    let nonFollowers = [];
    let processedCount = 0;
    
    // First, we need to get all the users you're following
    const followingUsers = new Set();
    let lastHeight = 0;
    let scrollAttempts = 0;
    
    console.log("%c Collecting users you follow...", "color: #1DA1F2;");
    
    while (true) {
        // Get all following users currently visible
        document.querySelectorAll('[data-testid="primaryColumn"] [data-testid="UserCell"]').forEach(el => {
            const usernameEl = el.querySelector('[data-testid="UserCell"] [dir="ltr"] span');
            if (usernameEl) {
                const username = usernameEl.textContent.trim();
                if (username.startsWith('@')) {
                    followingUsers.add(username.substring(1)); // remove @ symbol
                }
            }
        });
        
        // Scroll down to load more
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(1500);
        
        // Check if we've reached the end
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
            scrollAttempts++;
            if (scrollAttempts >= 3) {
                break; // We've reached the end
            }
        } else {
            scrollAttempts = 0;
            lastHeight = newHeight;
        }
        
        processedCount = followingUsers.size;
        console.clear();
        console.log(\`%c Processed: \${processedCount} accounts you follow...\`, "color: #6b7280;");
    }
    
    console.log(\`%c Found \${followingUsers.size} accounts you follow\`, "color: #10b981;");
    
    // Now, we need to go to the followers page to see who follows you
    console.log("%c Navigating to your followers page...", "color: #1DA1F2;");
    
    // Extract your username from the current page
    const yourUsername = window.location.pathname.split('/')[1];
    window.location.href = \`https://twitter.com/\${yourUsername}/followers\`;
    
    // We need to wait for the page to load
    await new Promise(resolve => {
        const checkLoaded = setInterval(() => {
            if (window.location.href.includes('followers')) {
                clearInterval(checkLoaded);
                resolve();
            }
        }, 500);
    });
    
    await sleep(2000); // Give extra time for the page to fully load
    
    console.log("%c Collecting your followers...", "color: #1DA1F2;");
    
    // Now collect your followers
    const followerUsers = new Set();
    lastHeight = 0;
    scrollAttempts = 0;
    
    while (true) {
        // Get all follower users currently visible
        document.querySelectorAll('[data-testid="primaryColumn"] [data-testid="UserCell"]').forEach(el => {
            const usernameEl = el.querySelector('[data-testid="UserCell"] [dir="ltr"] span');
            if (usernameEl) {
                const username = usernameEl.textContent.trim();
                if (username.startsWith('@')) {
                    followerUsers.add(username.substring(1)); // remove @ symbol
                }
            }
        });
        
        // Scroll down to load more
        window.scrollTo(0, document.body.scrollHeight);
        await sleep(1500);
        
        // Check if we've reached the end
        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) {
            scrollAttempts++;
            if (scrollAttempts >= 3) {
                break; // We've reached the end
            }
        } else {
            scrollAttempts = 0;
            lastHeight = newHeight;
        }
        
        processedCount = followerUsers.size;
        console.clear();
        console.log(\`%c Processed: \${processedCount} of your followers...\`, "color: #6b7280;");
    }
    
    console.log(\`%c Found \${followerUsers.size} accounts that follow you\`, "color: #10b981;");
    
    // Now find who doesn't follow you back
    for (const username of followingUsers) {
        if (!followerUsers.has(username)) {
            nonFollowers.push({ username });
        }
    }
    
    console.log(\`%c Found \${nonFollowers.length} accounts that don't follow you back\`, "color: #ef4444;");
    
    // Return to the following page
    window.location.href = \`https://twitter.com/\${yourUsername}/following\`;
    
    // Wait for the page to load
    await new Promise(resolve => {
        const checkLoaded = setInterval(() => {
            if (window.location.href.includes('following')) {
                clearInterval(checkLoaded);
                resolve();
            }
        }, 500);
    });
    
    await sleep(2000);
    
    console.log("%c Analysis complete! Injecting UI...", "color: #10b981; font-weight: bold;");
    injectUI(nonFollowers);
}

function injectUI(nonFollowers) {
    // Create styles for the component
    const styleSheet = document.createElement("style");
    styleSheet.textContent = \`
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(29, 161, 242, 0.5); }
            70% { box-shadow: 0 0 0 10px rgba(29, 161, 242, 0); }
            100% { box-shadow: 0 0 0 0 rgba(29, 161, 242, 0); }
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        .non-follower-skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            height: 60px;
            border-radius: 12px;
            margin-bottom: 10px;
        }
        
        .non-follower-container {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 350px;
            max-height: 600px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            z-index: 9999;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            animation: slideIn 0.4s ease-out forwards;
            overflow: hidden;
            border: 1px solid rgba(229, 231, 235, 0.8);
        }
        
        .non-follower-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(229, 231, 235, 0.8);
        }
        
        .non-follower-title {
            font-size: 18px;
            color: #1DA1F2;
            font-weight: 700;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .non-follower-title-count {
            background: #1DA1F2;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .non-follower-close {
            background: none;
            border: none;
            height: 32px;
            width: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #64748b;
            font-size: 16px;
            transition: all 0.2s ease;
        }
        
        .non-follower-close:hover {
            background: rgba(0, 0, 0, 0.05);
            color: #1e293b;
        }
        
        .non-follower-search {
            position: relative;
            margin-bottom: 5px;
        }
    \`;
    document.head.appendChild(styleSheet);

    // Continue with the UI implementation
    // ...
}

startScript();
\`;

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
