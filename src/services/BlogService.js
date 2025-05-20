// src/services/BlogService.js
// Simple mock implementation for blog services

// Mock storage for blog posts
let posts = [
  // Some initial posts can be added here
];

// Generate a unique ID for new posts
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Create a new post
const createPost = (postData) => {
  const newPost = {
    id: generateId(),
    title: postData.title,
    content: postData.content,
    category: postData.category || '',
    keywords: postData.keywords || [],
    author: postData.author || 'Anonymous',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: false,
    publishedAt: null
  };
  
  posts.push(newPost);
  return newPost;
};

// Get all posts (published and drafts)
const getAllPosts = () => {
  return [...posts];
};

// Get only published posts
const getPublishedPosts = () => {
  return posts.filter(post => post.published);
};

// Get a post by ID
const getPostById = (id) => {
  return posts.find(post => post.id === id) || null;
};

// Update an existing post
const updatePost = (id, postData) => {
  const index = posts.findIndex(post => post.id === id);
  
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      title: postData.title,
      content: postData.content,
      category: postData.category || posts[index].category,
      keywords: postData.keywords || posts[index].keywords,
      updatedAt: new Date().toISOString()
    };
    
    return posts[index];
  }
  
  return null;
};

// Delete a post
const deletePost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  
  if (index !== -1) {
    const deletedPost = posts[index];
    posts = posts.filter(post => post.id !== id);
    return deletedPost;
  }
  
  return null;
};

// Publish a post
const publishPost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      published: true,
      publishedAt: new Date().toISOString()
    };
    
    return posts[index];
  }
  
  return null;
};

// Unpublish a post
const unpublishPost = (id) => {
  const index = posts.findIndex(post => post.id === id);
  
  if (index !== -1) {
    posts[index] = {
      ...posts[index],
      published: false
    };
    
    return posts[index];
  }
  
  return null;
};

// Get all unique keywords from all posts
const getAllKeywords = () => {
  const allKeywords = posts.reduce((keywords, post) => {
    return [...keywords, ...post.keywords];
  }, []);
  
  return [...new Set(allKeywords)];
};

// Get posts by keyword
const getPostsByKeyword = (keyword) => {
  return posts.filter(post => 
    post.keywords.includes(keyword) && post.published
  );
};

// Get posts by category
const getPostsByCategory = (category) => {
  return posts.filter(post => 
    post.category === category && post.published
  );
};

// Get all years that have posts
const getYearsWithPosts = () => {
  const years = posts.map(post => {
    const date = new Date(post.createdAt);
    return date.getFullYear();
  });
  
  return [...new Set(years)].sort((a, b) => b - a); // Sort descending
};

// Get all months in a specific year that have posts
const getMonthsWithPostsForYear = (year) => {
  const months = posts
    .filter(post => {
      const date = new Date(post.createdAt);
      return date.getFullYear() === year;
    })
    .map(post => {
      const date = new Date(post.createdAt);
      return date.getMonth();
    });
  
  return [...new Set(months)].sort((a, b) => a - b); // Sort ascending
};

// Get posts for a specific year and month
const getPostsByYearAndMonth = (year, month) => {
  return posts
    .filter(post => {
      const date = new Date(post.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by date descending
};

// Count posts in a specific month
const countPostsInMonth = (year, month) => {
  return posts.filter(post => {
    const date = new Date(post.createdAt);
    return date.getFullYear() === year && date.getMonth() === month;
  }).length;
};

// Get recent posts, limited by count
const getRecentPosts = (count = 5) => {
  return [...posts]
    .filter(post => post.published)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, count);
};

// Export all service functions
const blogService = {
  createPost,
  getAllPosts,
  getPublishedPosts,
  getPostById,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost,
  getAllKeywords,
  getPostsByKeyword,
  getPostsByCategory,
  getYearsWithPosts,
  getMonthsWithPostsForYear,
  getPostsByYearAndMonth,
  countPostsInMonth,
  getRecentPosts
};

export default blogService;