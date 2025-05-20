// src/models/BlogPost.js
class BlogPost {
  constructor(id = null, title = '', content = '', author = '', createdAt = new Date(), updatedAt = new Date(), status = 'draft', keywords = []) {
    this.id = id || crypto.randomUUID();
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    this.status = status; // 'draft' or 'published'
    this.keywords = keywords;
  }

  publish() {
    this.status = 'published';
    this.updatedAt = new Date();
    return this;
  }

  unpublish() {
    this.status = 'draft';
    this.updatedAt = new Date();
    return this;
  }

  update(data) {
    const { title, content, keywords } = data;
    
    if (title !== undefined) this.title = title;
    if (content !== undefined) this.content = content;
    if (keywords !== undefined) this.keywords = keywords;
    
    this.updatedAt = new Date();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      status: this.status,
      keywords: this.keywords
    };
  }

  static fromJSON(json) {
    return new BlogPost(
      json.id,
      json.title,
      json.content,
      json.author,
      new Date(json.createdAt),
      new Date(json.updatedAt),
      json.status,
      json.keywords
    );
  }
}

export default BlogPost;