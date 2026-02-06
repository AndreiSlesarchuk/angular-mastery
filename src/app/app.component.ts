import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

import { User } from './models/user.model';
import { UserService } from './services/user.service';

import { UserRole as UserRoleEnum } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class App implements OnInit {
  // === EXPORT ENUM FOR TEMPLATE ===
  // Make UserRole available in the template.
  readonly UserRole = UserRoleEnum;
  
  // === SIGNALS ===
  title = signal('🚀 Angular v21 + Spring Boot Experience');
  users = signal<User[]>([]);
  isLoading = signal(true);
  
  // === FORM STATE ===
  newUser = {
    name: '',
    email: '',
    role: UserRoleEnum.USER
  };
  
  editingUserId: number | null = null;
  
  // === COMPUTED VALUES ===
  activeUsersCount = computed(() => 
    this.users().filter(user => user.active).length
  );
  
  activeUsersPercentage = computed(() => {
    const total = this.users().length;
    return total > 0 ? Math.round((this.activeUsersCount() / total) * 100) : 0;
  });
  
  // === FILTERING ===
  currentFilter: UserRoleEnum | 'ALL' = 'ALL';
  
  filteredUsers = computed(() => {
    const users = this.users();
    if (this.currentFilter === 'ALL') return users;
    return users.filter(user => user.role === this.currentFilter);
  });
  
  // === CONSTRUCTOR ===
  constructor(private userService: UserService) {
    console.log('App component created with UserService injected');
  }
  
  // === LIFECYCLE ===
  ngOnInit(): void {
    this.loadUsers();
    
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1000);
  }
  
  // === METHODS ===
  loadUsers(): void {
    const mockUsers: User[] = [
      {
        id: 1,
        name: 'Ivan (Spring Developer)',
        email: 'ivan@springboot.com',
        role: UserRoleEnum.ADMIN,
        createdAt: new Date('2024-01-15T10:30:00'),
        active: true
      },
      {
        id: 2,
        name: 'Maria (React Developer)',
        email: 'maria@react.com',
        role: UserRoleEnum.USER,
        createdAt: new Date('2024-02-20T14:45:00'),
        active: true
      },
      {
        id: 3,
        name: 'Alex (Angular Developer)',
        email: 'alex@angular.com',
        role: UserRoleEnum.USER,
        createdAt: new Date('2024-03-10T09:15:00'),
        active: false
      },
      {
        id: 4,
        name: 'Kate (Full Stack)',
        email: 'kate@fullstack.com',
        role: UserRoleEnum.ADMIN,
        createdAt: new Date('2024-01-25T16:20:00'),
        active: true
      },
      {
        id: 5,
        name: 'Dmitry (DevOps)',
        email: 'dmitry@devops.com',
        role: UserRoleEnum.GUEST,
        createdAt: new Date('2024-03-01T11:00:00'),
        active: true
      }
    ];
    
    this.users.set(mockUsers);
  }
  
  addUser(): void {
    if (!this.newUser.name.trim() || !this.newUser.email.trim()) {
      alert('Please fill name and email fields');
      return;
    }
    
    const newUser: User = {
      id: Date.now(),
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      createdAt: new Date(),
      active: true
    };
    
    this.users.update(currentUsers => [...currentUsers, newUser]);
    this.resetForm();
    
    console.log('User added:', newUser);
  }
  
  startEdit(user: User): void {
    this.editingUserId = user.id;
    this.newUser = {
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
  
  updateUser(): void {
    if (this.editingUserId === null) return;
    
    this.users.update(currentUsers =>
      currentUsers.map(user =>
        user.id === this.editingUserId
          ? {
              ...user,
              name: this.newUser.name,
              email: this.newUser.email,
              role: this.newUser.role,
            }
          : user
      )
    );
    
    this.cancelEdit();
  }
  
  cancelEdit(): void {
    this.editingUserId = null;
    this.resetForm();
  }
  
  resetForm(): void {
    this.newUser = {
      name: '',
      email: '',
      role: UserRoleEnum.USER
    };
  }
  
  toggleUserActive(id: number): void {
    this.users.update(currentUsers =>
      currentUsers.map(user =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  }
  
  deleteUser(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    this.users.update(currentUsers => 
      currentUsers.filter(user => user.id !== id)
    );
    
    console.log('User deleted with id:', id);
  }
  
  setFilter(filter: UserRoleEnum | 'ALL'): void {
    this.currentFilter = filter;
  }
  
  getFilterButtonClass(filter: UserRoleEnum | 'ALL'): string {
    return this.currentFilter === filter ? 'btn-active' : 'btn-outline';
  }
  
  getRoleStats(role: UserRoleEnum): { count: number, active: number } {
    const roleUsers = this.users().filter(user => user.role === role);
    return {
      count: roleUsers.length,
      active: roleUsers.filter(u => u.active).length
    };
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
