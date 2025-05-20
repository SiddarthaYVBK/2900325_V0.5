// src/pages/BlogPage/BlogEditorPage.js
import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '../../components/CustomCKEditor';
import MyUploadAdapter from '../../components/MyUploadAdapter';
import { useNavigate, useParams } from 'react-router-dom';
import blogService from '../../services/BlogService';
import styled from 'styled-components';

// Styled Components
const EditorContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  min-height: 300px;
  transition: height 0.1s ease;
  height: ${props => props.height}px;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 10px;
  background-color: #f0f0f0;
  cursor: ns-resize;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  &:before {
    content: "";
    width: 30px;
    height: 4px;
    background-color: #ccc;
    border-radius: 2px;
  }
`;

const BlogEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [wordCount, setWordCount] = useState({ words: 0, characters: 0 });
  const [editorHeight, setEditorHeight] = useState(400); // Default height
  const resizeRef = useRef(null);
  const editorRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const post = blogService.getPostById(id);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category || '');
        setTags(post.keywords ? post.keywords.join(', ') : '');
        updateWordCount(post.content);
      } else {
        setError('Post not found');
      }
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizeRef.current && resizeRef.current.dragging) {
        e.preventDefault();
        const deltaY = e.clientY - startYRef.current;
        const newHeight = Math.max(300, startHeightRef.current + deltaY);
        setEditorHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      if (resizeRef.current) {
        resizeRef.current.dragging = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleResizeStart = (e) => {
    e.preventDefault();
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    if (resizeRef.current) {
      resizeRef.current.dragging = true;
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';
    }
  };

  const updateWordCount = (text) => {
    // Remove HTML tags to get only text content
    const textOnly = text.replace(/<[^>]*>/g, '');
    const characters = textOnly.length;
    const words = textOnly.trim() ? textOnly.trim().split(/\s+/).length : 0;
    setWordCount({ words, characters });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
    updateWordCount(data);
  };

  const handleSave = async (status = 'draft') => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        content,
        category: category.trim(),
        keywords: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: 'Your Name', // Replace with user's name
      };

      let post;
      if (id) {
        post = blogService.updatePost(id, postData);
        if (status === 'published') {
          blogService.publishPost(id);
        } else {
          blogService.unpublishPost(id);
        }
        setNotification('Post updated successfully');
      } else {
        post = blogService.createPost(postData);
        if (status === 'published') {
          blogService.publishPost(post.id);
        }
        setNotification('Post created successfully');
      }

      if (status === 'published') {
        // Redirect to blog page after short delay to show notification
        setTimeout(() => navigate('/blog'), 1500);
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save the post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.errorNotification}>
          {error}
        </div>
      )}
      {notification && (
        <div style={styles.successNotification}>
          {notification}
        </div>
      )}

      <div style={styles.titleContainer}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          style={styles.titleInput}
          autoFocus
        />
      </div>

      <EditorContainer 
        ref={editorRef}
        height={editorHeight}
      >
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={handleEditorChange}
          config={{
            toolbar: {
              items: [
                'undo', 'redo',
                '|',
                'heading',
                '|',
                'bold', 'italic', 'underline', 'strikethrough',
                '|',
                'link', 'bulletedList', 'numberedList', 'blockQuote',
                '|',
                'insertTable', 'mediaEmbed'
              ]
            },
            placeholder: 'Write your blog post...'
          }}
          onReady={editor => {
            // Insert the upload adapter
            editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
              return new MyUploadAdapter(loader);
            };
          }}
        />
        <ResizeHandle 
          ref={resizeRef}
          onMouseDown={handleResizeStart}
        />
      </EditorContainer>
      
      <div style={styles.wordCount}>
        {wordCount.words} words | {wordCount.characters} characters
      </div>

      <div style={styles.metadataContainer}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Separate tags with commas"
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.actionBar}>
        <button 
          style={styles.cancelButton}
          onClick={() => navigate('/blog')}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button 
          style={styles.saveButton}
          onClick={() => handleSave('draft')}
          disabled={isSaving}
        >
          Save Draft
        </button>
        <button 
          style={styles.publishButton}
          onClick={() => handleSave('published')}
          disabled={isSaving}
        >
          {isSaving ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: 'calc(100vh - 200px)',
  },
  titleContainer: {
    marginBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  titleInput: {
    width: '100%',
    padding: '10px 0',
    fontSize: '24px',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    borderBottom: '2px solid #ff5722',
  },
  wordCount: {
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginBottom: '20px',
  },
  metadataContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    flex: '1 1 45%',
    minWidth: '250px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  errorNotification: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  successNotification: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px 15px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  cancelButton: {
    padding: '10px 16px',
    backgroundColor: '#e9ecef',
    color: '#495057',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '10px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  publishButton: {
    padding: '10px 16px',
    backgroundColor: '#ff5722', // Blogger-like orange
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default BlogEditorPage;