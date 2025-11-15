export type UserRole = 'admin' | 'agent';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}
