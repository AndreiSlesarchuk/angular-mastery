export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  active: boolean;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

// DTO для создания/обновления
export interface UserDto {
  name: string;
  email: string;
  role: UserRole;
  active?: boolean;
}