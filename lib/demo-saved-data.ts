/**
 * Demo data for testing the Saved Items system
 * Run this in browser console to populate localStorage with sample data
 */

const STORAGE_KEY = "stemawy-saved-items";

const demoItems = [
  {
    id: "physics-g10-s1",
    type: "subject",
    title: "Physics",
    description: "Grade 10 Core Subject - Mechanics and Energy",
    category: "science",
    subcategory: "Grade 10",
    savedAt: Date.now() - 86400000 * 2,
  },
  {
    id: "chemistry-g10-s1",
    type: "subject",
    title: "Chemistry",
    description: "Grade 10 Core Subject - Atomic Structure",
    category: "science",
    subcategory: "Grade 10",
    savedAt: Date.now() - 86400000 * 1,
  },
  {
    id: "stem-scholarship",
    type: "opportunity",
    title: "STEM Excellence Scholarship Fund",
    description: "Full-tuition scholarship for prospective engineering students",
    category: "Opportunities",
    subcategory: "Undergraduate",
    savedAt: Date.now() - 3600000,
  },
  {
    id: "advanced-chem-ii",
    type: "subject",
    title: "Advanced Chemistry II",
    description: "Grade 11 Core Subject - Organic chemistry principles and laboratory techniques",
    category: "science",
    subcategory: "Grade 11",
    savedAt: Date.now() - 1800000,
  },
  {
    id: "robotics-research",
    type: "opportunity",
    title: "Summer Robotics Research Program",
    description: "6-week intensive program focusing on algorithms and robotics design",
    category: "Opportunities",
    subcategory: "Summer",
    savedAt: Date.now() - 900000,
  },
  {
    id: "genetics-video",
    type: "resource",
    title: "CRISPR and Gene Editing Basics",
    description: "A comprehensive introduction to modern genetic engineering techniques",
    category: "Biology",
    subcategory: "Genetics",
    savedAt: Date.now(),
  },
  {
    id: "python-basics",
    type: "skill",
    title: "Python Programming Fundamentals",
    description: "Learn Python from the basics to intermediate level",
    category: "Programming",
    subcategory: "Computing",
    savedAt: Date.now() - 604800000,
  },
  {
    id: "data-analysis",
    type: "skill",
    title: "Data Analysis with Pandas",
    description: "Master data manipulation and analysis using Python Pandas library",
    category: "Data Science",
    subcategory: "Computing",
    savedAt: Date.now() - 432000000,
  },
];

// Function to populate localStorage
function loadDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoItems));
  console.log(`✅ Loaded ${demoItems.length} demo items to localStorage`);
  console.log("Items:", demoItems);
}

// Function to clear all saved items
function clearAllSaved() {
  localStorage.removeItem(STORAGE_KEY);
  console.log("✅ Cleared all saved items");
}

// Function to view current items
function viewSavedItems() {
  const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  console.log(`📚 Currently saved: ${items.length} items`);
  console.table(items);
  return items;
}

// Export for use in browser console
if (typeof window !== "undefined") {
  Object.assign(window, {
    loadDemoData,
    clearAllSaved,
    viewSavedItems,
  });
}

export { loadDemoData, clearAllSaved, viewSavedItems };
