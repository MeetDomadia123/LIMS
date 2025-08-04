// Mock authentication and user management
class MockAuth {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    // Initialize with admin user if not exists
    const users = this.getUsers();
    if (!users.find(user => user.role === 'admin')) {
      const adminUser = {
        id: 'admin-1',
        fullName: 'System Administrator',
        email: 'admin@company.com',
        password: 'Admin123!',
        role: 'admin',
        aadharNumber: '123456789012',
        isApproved: true,
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      };
      users.push(adminUser);
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('mock_users') || '[]');
  }

  saveUsers(users) {
    localStorage.setItem('mock_users', JSON.stringify(users));
  }

  async signup(userData) {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      isApproved: userData.role === 'admin', // Auto-approve admin
      createdAt: new Date().toISOString(),
      approvedAt: userData.role === 'admin' ? new Date().toISOString() : null
    };

    users.push(newUser);
    this.saveUsers(users);

    return { 
      success: true, 
      message: userData.role === 'admin' 
        ? 'Admin account created successfully' 
        : 'Signup request sent. You\'ll be notified after admin approval.'
    };
  }

  async login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isApproved) {
      throw new Error('Your signup is pending approval by the admin.');
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    const authData = {
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_data', JSON.stringify(authData.user));

    return authData;
  }

  async mockSocialLogin(provider, role) {
    const mockUser = {
      id: `${provider}-${Date.now()}`,
      fullName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.com`,
      role,
      isApproved: role === 'admin',
      createdAt: new Date().toISOString(),
      approvedAt: role === 'admin' ? new Date().toISOString() : null
    };

    const users = this.getUsers();
    users.push(mockUser);
    this.saveUsers(users);

    if (role === 'admin') {
      const token = `mock-token-${mockUser.id}-${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      return { user: mockUser, token };
    }

    return { 
      success: true, 
      message: 'Social login successful. Awaiting admin approval.' 
    };
  }

  getCurrentUser() {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (!token || !userData) return null;
    
    return JSON.parse(userData);
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  getPendingUsers() {
    return this.getUsers().filter(user => user.role !== 'admin' && !user.isApproved);
  }

  approveUser(userId) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].isApproved = true;
      users[userIndex].approvedAt = new Date().toISOString();
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  rejectUser(userId) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    this.saveUsers(filteredUsers);
    return true;
  }
}

export const mockAuth = new MockAuth();