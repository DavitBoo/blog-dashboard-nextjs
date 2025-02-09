import IPost from './Post';

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

interface IUser {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: Role;
  posts: IPost[];
  createdAt: Date;
  updatedAt: Date;
}

export default IUser;