import IPost from './Post';

interface IComment {
    id: number;
    email: string;
    content: string;
    postId: number;
    post: IPost;
    createdAt: Date;
  }
  
  export default IComment ;