import { useState, useEffect,useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";


const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState("");
  const blogFormRef = useRef();


  useEffect(() => {
  const loggedUserJSON = window?.localStorage?.getItem("token");
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    setUser(user);
  }
}, []); 

  useEffect(() => {
    if (user) {
      blogService.getAll(user?.token).then((data) => {
        setBlogs(data);
      });
    }
  }, [user]);

  const handleLike = async (id, updatedBlog) => {
    const token = user?.token;

    const returnedBlog = await blogService.put(id, updatedBlog, token);

    setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)));
  };


  const handleLogin = async (event) => {
    event?.preventDefault();
    try {
      const loggedUser = await blogService.login({
        username,
        password,
      });
      setUser(loggedUser);
      window?.localStorage?.setItem("token", JSON.stringify(loggedUser));
      setUsername("");
      setPassword("");
      setNotification(`Welcome ${loggedUser?.name}`, "green");
      setTimeout(() => {
        setNotification("");
      }, 2000);
    } catch (error) {
      setNotification(error.response?.data?.error || "Wrong username or password","red")
      setTimeout(() => {
        setNotification("");
      }, 2000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    window?.localStorage?.removeItem("token");
    setNotification("Logged out successfully", "green");
    setTimeout(() => {
      setNotification("");
    }
    , 2000);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    
    const newBlog = {
      title: event?.target?.Title?.value,
      author: event?.target?.Author?.value,
      url: event?.target?.Url?.value,
    };


    const createdBlog = await blogService.create(newBlog, user?.token);
    setBlogs(blogs?.concat(createdBlog));

    blogFormRef.current.toggleVisibility();

    event.target.Title.value = "";
    event.target.Author.value = "";
    event.target.Url.value = "";
    setNotification(`A new blog "${createdBlog?.title}" by ${createdBlog?.author} added`, "green");
    setTimeout(() => {
      setNotification("");
    }, 2000);
  };

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target?.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target?.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Notification message={notification} />
      <h2>blogs</h2>

      <p>{user?.name} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <h2>Create new blog</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm handleSubmit={handleSubmit} />
      </Togglable>

      {blogs?.length === 0 ? (
        <p>No blogs available</p>
      ) : (
        [...blogs]?.sort((a, b) => b.likes - a.likes)?.map((blog) => <Blog key={blog?.id} blog={blog} handleLike={handleLike} />)
      )}
    </div>
  );
};

export default App;
