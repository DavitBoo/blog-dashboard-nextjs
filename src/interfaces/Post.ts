import { ILabel } from "./Label";
import  IUser  from "./User";
import  IComment  from "./Comment";

interface IPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  author: IUser;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  labels: ILabel[];
}

export default IPost;
