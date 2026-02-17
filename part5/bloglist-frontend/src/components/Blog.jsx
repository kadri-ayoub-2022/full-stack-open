import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog,handleLike:hl }) => {

  const [likes, setLikes] = useState(blog?.likes || 0);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleLike = () => {
    setLikes(likes + 1); // increment locally immediately

    const token = JSON.parse(window?.localStorage?.getItem("token"))?.token;
    const updatedBlogData = { ...blog, likes: likes + 1 };
    hl(blog?.id, updatedBlogData); 

    blogService
      .put(blog.id, updatedBlogData, token)
      .then((updatedBlog) => setLikes(updatedBlog.likes))
      .catch((err) => {
        console.error(err);
        setLikes(likes); // rollback on error
      });
  };

  const handleRemove = () => {
    const token = JSON.parse(window?.localStorage?.getItem("token"))?.token;
    if (window.confirm(`Remove blog ${blog?.title} by ${blog?.author}?`)) {
      blogService
        .remove(blog.id, token)
        .then(() => window.location.reload())
        .catch((err) => console.error(err));
    } else {
      console.log("Blog removal cancelled");
    }
  };

  return (
  <div style={blogStyle} className="blog">
    {blog?.title} {blog?.author}
    <button onClick={toggleDetails}>{showDetails ? "hide" : "view"}</button>
    {showDetails && (
      <div>
        <p>{blog?.url}</p>
        <p>{likes} likes <button onClick={handleLike}>like</button></p>
        <p>added by {blog?.user?.name}</p>
      </div>
    )}
    <button onClick={handleRemove}>remove</button>
  </div>
  )  
}

export default Blog