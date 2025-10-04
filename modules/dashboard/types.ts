export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  template: string;
  craetedAt: Date;
  updateAt: Date;
  userid: string;
  user: User;
  StarMark: { isMarked: boolean }[];
}
