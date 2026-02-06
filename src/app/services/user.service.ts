import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];
  
  constructor() {
    console.log('UserService created (DI работает!)');
  }
  
  // Получение всех пользователей
  getUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(500));
  }
  
  createUser(userData: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: Date.now(),
      createdAt: new Date()
    };
    
    this.users = [...this.users, newUser];
    return of(newUser).pipe(delay(300));
  }
  
  updateUser(id: number, userData: Partial<User>): Observable<User> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return of(this.users[index]).pipe(delay(300));
    }
    
    throw new Error(`User with id ${id} not found`);
  }
  
  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter(user => user.id !== id);
    return of(void 0).pipe(delay(300));
  }
}