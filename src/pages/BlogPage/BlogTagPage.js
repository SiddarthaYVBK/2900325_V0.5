// src/pages/BlogPage/BlogTagPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import blogService from '../../services/BlogService';

const Container = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
`;

const BackButton = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #0051cc;
  }
`;

const TagLabel = styled.div`
  display: inline-block;
  background-color: #e0f0ff;
  color: #0070f3;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  margin-left: 1rem;
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const PostCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PostCardContent = styled.div`
  padding: 1.5rem;
`;

const PostTitle = styled.h3`
  color: #333;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const PostDate = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PostExcerpt = styled.div`
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
  
  /* Limit to 3 lines */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #777;
`;

const BlogTagPage = () => {
  const navigate = useNavigate();
  const { keyword } = useParams();
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    if (keyword) {
      const postsWithTag = blogService.getPostsByKeyword(keyword);
      setPosts(postsWithTag);
    }
  }, [keyword]);
  
  const handleBackClick = () => {
    navigate('/blog');
  };
  
  const handlePostClick = (postId) => {
    navigate(`/blog/post/${postId}`);
  };
  
  // Helper function to strip HTML tags for excerpt
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  // Helper function to create excerpt
  const createExcerpt = (content, length = 150) => {
    const stripped = stripHtml(content);
    if (stripped.length <= length) {
      return stripped;
    }
    return stripped.substring(0, length) + '...';
  };
  
  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Title>Posts Tagged</Title>
          <TagLabel>{keyword}</TagLabel>
        </div>
        <BackButton onClick={handleBackClick}>Back to Blog</BackButton>
      </Header>
      
      {posts.length > 0 ? (
        <PostsGrid>
          {posts.map((post) => (
            <PostCard key={post.id} onClick={() => handlePostClick(post.id)}>
              <PostCardContent>
                <PostTitle>{post.title}</PostTitle>
                <PostDate>{new Date(post.createdAt).toLocaleDateString()}</PostDate>
                <PostExcerpt>{createExcerpt(post.content)}</PostExcerpt>
              </PostCardContent>
            </PostCard>
          ))}
        </PostsGrid>
      ) : (
        <EmptyState>
          <h3>No posts found with the tag "{keyword}"</h3>
          <p>Try another keyword or go back to the blog</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default BlogTagPage;