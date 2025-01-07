const DashboardHome = () => {
    return (
      <div className="container">
        <h1>Dashboard</h1>
        <ul>
          <li><a href="/dashboard/posts">Manage Posts</a></li>
          <li><a href="/dashboard/posts/new">Create New Post</a></li>
          <li><a href="/dashboard/comments">Manage Comments</a></li>
        </ul>
      </div>
    );
  };
  
  export default DashboardHome;
  