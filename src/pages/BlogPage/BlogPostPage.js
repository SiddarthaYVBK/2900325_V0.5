// src/pages/BlogPage/BlogPostPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import blogService from '../../services/BlogService';

const Container = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background-color: transparent;
  color: #0070f3;
  padding: 0.5rem 1rem;
  border: 1px solid #0070f3;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f8ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EditButton = styled.button`
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #0051cc;
  }
`;

const Title = styled.h1`
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const Metadata = styled.div`
  margin-bottom: 2rem;
  color: #777;
  font-size: 0.9rem;
`;

const Content = styled.div`
  color: #333;
  line-height: 1.6;
  font-size: 1.1rem;
  
  h1, h2, h3, h4, h5, h6 {
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1.5rem 0;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  blockquote {
    border-left: 4px solid #0070f3;
    padding-left: 1rem;
    font-style: italic;
    color: #555;
    margin: 1.5rem 0;
  }
  
  pre {
    background-color: #f4f4f4;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  
  code {
    background-color: #f4f4f4;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }
  
  a {
    color: #0070f3;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const TagsContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
`;

const TagsTitle = styled.h3`
  color: #555;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const TagsList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  background-color: #e0f0ff;
  color: #0070f3;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background-color: #c0e0ff;
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const BlogPostPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    if (id) {
      const foundPost = blogService.getPostById(id);
      setPost(foundPost);
    }
  }, [id]);
  
  const handleBackClick = () => {
    navigate('/blog');
  };
  
  const handleEditClick = () => {
    navigate(`/blog/edit/${id}`);
  };
  
  const handleTagClick = (keyword) => {
    navigate(`/blog/tag/${keyword}`);
  };
  
  if (!post) {
    return (
      <Container>
        <NotFound>
          <h2>Post Not Found</h2>
          <p>The blog post you're looking for doesn't exist or has been removed.</p>
          <BackButton onClick={handleBackClick}>Back to Blog</BackButton>
        </NotFound>
      </Container>
    );
  }
  
  const { title, content, author, createdAt, updatedAt, keywords } = post;
  
  return (
    <Container>
      <ContentContainer>
        <Header>
          <BackButton onClick={handleBackClick}>← Back to Blog</BackButton>
          <ButtonGroup>
            <EditButton onClick={handleEditClick}>Edit Post</EditButton>
          </ButtonGroup>
        </Header>
        
        <Title>{title}</Title>
        
        <Metadata>
          <div>By {author}</div>
          <div>Published: {new Date(createdAt).toLocaleDateString()}</div>
          {createdAt !== updatedAt && (
            <div>Last updated: {new Date(updatedAt).toLocaleDateString()}</div>
          )}
        </Metadata>
        
        <Content dangerouslySetInnerHTML={{ __html: content }} />
        
        {keywords && keywords.length > 0 && (
          <TagsContainer>
            <TagsTitle>Keywords</TagsTitle>
            <TagsList>
              {keywords.map((keyword, index) => (
                <Tag key={index} onClick={() => handleTagClick(keyword)}>
                  {keyword}
                </Tag>
              ))}
            </TagsList>
          </TagsContainer>
        )}
      </ContentContainer>
    </Container>
  );
};

export default BlogPostPage;