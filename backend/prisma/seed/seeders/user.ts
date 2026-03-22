
import { User } from '../../schema/interfaces';
export const testUsers: {
  __type: 'user';
  data: User[];
} = {
  __type: 'user',
  data: [
    {
      id: '9c06059c-5bcd-4621-974a-813cbc209655',
      email: 'admin@gmail.com',
      username: 'admin',
      password: 'admin123', 
      role: 'ADMIN',
      createdAt: new Date('2025-12-29'),
      updatedAt: new Date('2025-12-29'),
    },
    {
      id: '9c06059c-5bcd-4621-974a-813cbc209567',
      email: 'user@gmail.com',
      username: 'user123',
      password: 'user123',
      role: 'USER',
      createdAt: new Date('2025-12-29'),
      updatedAt: new Date('2025-12-29'),
    },
  ],
};
