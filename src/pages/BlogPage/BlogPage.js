// src/pages/BlogPage/BlogPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import blogService from '../../services/BlogService';

const BlogContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 200px);
  padding: 2rem;
  background-color: #f8f9fa;
  gap: 2rem;
`;

const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 240px);
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 240px);
`;

const TagsContainer = styled.div`
  width: 220px;
  flex-shrink: 0;
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  max-height: calc(100vh - 240px);
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const BlogList = styled.div`
  margin-top: 1.5rem;
`;

const YearSection = styled.div`
  margin-bottom: 1.2rem;
`;

const YearTitle = styled.h3`
  color: #444;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
`;

const MonthSection = styled.div`
  margin-left: 1.5rem;
  margin-bottom: 0.5rem;
`;

const MonthTitle = styled.h4`
  color: #555;
  margin-bottom: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const PostsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: 1.5rem;
`;

const PostItem = styled.li`
  margin-bottom: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => props.active ? '#0070f3' : '#666'};
  background-color: ${props => props.active ? '#f0f7ff' : 'transparent'};
  transition: all 0.2s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:hover {
    color: #0070f3;
    background-color: #f0f7ff;
  }
`;

const PostTitle = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  visibility: hidden;
  ${PostItem}:hover & {
    visibility: visible;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.delete ? '#dc3545' : '#0070f3'};
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: ${props => props.delete ? '#ffebee' : '#e3f2fd'};
  }
`;

const TagsTitle = styled.h3`
  color: #444;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background-color: #e0f0ff;
  color: #0070f3;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #c0e0ff;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
  color: #777;
  text-align: center;
`;

const CreateButton = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #0051cc;
  }
`;

const BlogPostTitle = styled.h1`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  line-height: 1.3;
`;

const BlogPostMeta = styled.div`
  color: #666;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
`;

const BlogPostDate = styled.span`
  font-size: 0.9rem;
`;

const PostActionBar = styled.div`
  display: flex;
  gap: 1rem;
`;

const BlogPostContent = styled.div`
  line-height: 1.6;
  color: #333;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    margin-bottom: 1.25rem;
  }
  
  ul, ol {
    margin-bottom: 1.25rem;
    padding-left: 2rem;
  }
  
  blockquote {
    border-left: 4px solid #0070f3;
    padding-left: 1rem;
    margin-left: 0;
    margin-bottom: 1.25rem;
    color: #555;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin: 1.5rem 0;
    border-radius: 4px;
  }
  
  a {
    color: #0070f3;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 1.25rem;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.25rem;
    
    th, td {
      border: 1px solid #eee;
      padding: 0.5rem;
    }
    
    th {
      background-color: #f5f5f5;
    }
  }
`;

const PostActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${props => props.primary ? '#0070f3' : props.danger ? '#dc3545' : '#f0f0f0'};
  color: ${props => props.primary || props.danger ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.primary ? '#0051cc' : props.danger ? '#c82333' : '#e0e0e0'};
  }
`;

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const DialogTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #333;
`;

const DialogText = styled.p`
  margin-bottom: 1.5rem;
  color: #666;
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Notification = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  background-color: ${props => props.success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.success ? '#155724' : '#721c24'};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const BlogPage = () => {
  const navigate = useNavigate();
  const [expandedYears, setExpandedYears] = useState({});
  const [expandedMonths, setExpandedMonths] = useState({});
  const [years, setYears] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [notification, setNotification] = useState(null);
  
  useEffect(() => {
    loadBlogData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const loadBlogData = () => {
    // Load years with posts
    const yearsWithPosts = blogService.getYearsWithPosts();
    setYears(yearsWithPosts);
    
    // Auto-expand current year if it has posts
    const currentYear = new Date().getFullYear();
    if (yearsWithPosts.includes(currentYear)) {
      setExpandedYears({...expandedYears, [currentYear]: true});
    } else if (yearsWithPosts.length > 0) {
      // Otherwise expand the most recent year
      setExpandedYears({...expandedYears, [yearsWithPosts[0]]: true});
    }
    
    // Load all keywords
    setKeywords(blogService.getAllKeywords());
    
    // If there are published posts, select the most recent one
    const publishedPosts = blogService.getAllPosts();
    if (publishedPosts.length > 0) {
      const latestPost = publishedPosts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      setSelectedPostId(latestPost.id);
    }
  };

  const toggleYear = (year) => {
    setExpandedYears({
      ...expandedYears,
      [year]: !expandedYears[year]
    });
  };

  const toggleMonth = (year, month) => {
    const key = `${year}-${month}`;
    setExpandedMonths({
      ...expandedMonths,
      [key]: !expandedMonths[key]
    });
  };

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
  };

  const handleTagClick = (keyword) => {
    navigate(`/blog/tag/${keyword}`);
  };

  const handleCreatePost = () => {
    navigate('/blog/new');
  };
  
  const handleEditPost = (postId) => {
    navigate(`/blog/edit/${postId}`);
  };
  
  const confirmDeletePost = (postId, e) => {
    e.stopPropagation();
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };
  
  const handleDeletePost = () => {
    try {
      blogService.deletePost(postToDelete);
      
      // If the deleted post was the selected one, clear selection
      if (postToDelete === selectedPostId) {
        setSelectedPostId(null);
      }
      
      // Close dialog and show notification
      setShowDeleteDialog(false);
      setPostToDelete(null);
      setNotification({
        type: 'success',
        message: 'Post deleted successfully'
      });
      
      // Reload blog data
      loadBlogData();
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting post:', err);
      setNotification({
        type: 'error',
        message: 'Failed to delete the post'
      });
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };
  
  const cancelDeletePost = () => {
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };

  const renderYearSections = () => {
    if (years.length === 0) {
      return (
        <EmptyState>
          <p>No blog posts yet</p>
        </EmptyState>
      );
    }

    return years.map(year => {
      const months = blogService.getMonthsWithPostsForYear(year);
      const isExpanded = expandedYears[year] || false;
      
      return (
        <YearSection key={year}>
          <YearTitle onClick={() => toggleYear(year)}>
            <span>{isExpanded ? '▼' : '►'} {year}</span>
          </YearTitle>
          
          {isExpanded && (
            <>
              {months.map(month => {
                const monthKey = `${year}-${month}`;
                const isMonthExpanded = expandedMonths[monthKey] || false;
                const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
                const postsCount = blogService.countPostsInMonth(year, month);
                
                return (
                  <MonthSection key={monthKey}>
                    <MonthTitle onClick={() => toggleMonth(year, month)}>
                      <span>{isMonthExpanded ? '▼' : '►'} {monthName} ({postsCount})</span>
                    </MonthTitle>
                    
                    {isMonthExpanded && (
                      <PostsList>
                        {blogService.getPostsByYearAndMonth(year, month).map(post => (
                          <PostItem 
                            key={post.id} 
                            active={post.id === selectedPostId}
                            onClick={() => handlePostClick(post.id)}
                          >
                            <PostTitle>{post.title}</PostTitle>
                            <ItemActions>
                              <ActionButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPost(post.id);
                                }}
                              >
                                <FaEdit size={14} />
                              </ActionButton>
                              <ActionButton 
                                delete 
                                onClick={(e) => confirmDeletePost(post.id, e)}
                              >
                                <FaTrashAlt size={14} />
                              </ActionButton>
                            </ItemActions>
                          </PostItem>
                        ))}
                      </PostsList>
                    )}
                  </MonthSection>
                );
              })}
            </>
          )}
        </YearSection>
      );
    });
  };

  const selectedPost = selectedPostId ? blogService.getPostById(selectedPostId) : null;

  return (
    <BlogContainer>
      <Sidebar>
        <Title>Blog Posts</Title>
        <CreateButton onClick={handleCreatePost}>Create New Post</CreateButton>
        <BlogList>
          {renderYearSections()}
        </BlogList>
      </Sidebar>
      
      <MainContent>
        {selectedPost ? (
          <>
            <BlogPostTitle>{selectedPost.title}</BlogPostTitle>
            <BlogPostMeta>
              <BlogPostDate>{new Date(selectedPost.createdAt).toLocaleDateString()}</BlogPostDate>
              <PostActionBar>
                <PostActionButton 
                  primary
                  onClick={() => handleEditPost(selectedPost.id)}
                >
                  <FaEdit /> Edit
                </PostActionButton>
                <PostActionButton 
                  danger
                  onClick={() => {
                    setPostToDelete(selectedPost.id);
                    setShowDeleteDialog(true);
                  }}
                >
                  <FaTrashAlt /> Delete
                </PostActionButton>
              </PostActionBar>
            </BlogPostMeta>
            <BlogPostContent dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
          </>
        ) : (
          <EmptyState>
            <p>Select a post to read or create a new one</p>
          </EmptyState>
        )}
      </MainContent>
      
      <TagsContainer>
        <TagsTitle>Keywords</TagsTitle>
        <TagsList>
          {keywords.length > 0 ? (
            keywords.map(keyword => (
              <Tag key={keyword} onClick={() => handleTagClick(keyword)}>
                {keyword}
              </Tag>
            ))
          ) : (
            <p>No keywords yet</p>
          )}
        </TagsList>
      </TagsContainer>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog>
          <DialogContent>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogText>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogText>
            <DialogActions>
              <PostActionButton onClick={cancelDeletePost}>
                Cancel
              </PostActionButton>
              <PostActionButton danger onClick={handleDeletePost}>
                Delete
              </PostActionButton>
            </DialogActions>
          </DialogContent>
        </ConfirmDialog>
      )}
      
      {/* Notification */}
      {notification && (
        <Notification success={notification.type === 'success'}>
          {notification.message}
        </Notification>
      )}
    </BlogContainer>
  );
};

export default BlogPage;