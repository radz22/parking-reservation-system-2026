
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
      contact: '09123456789',
      plateNumber: 'ABC-1234', 
      createdAt: new Date('2025-12-29'),
      updatedAt: new Date('2025-12-29'),
    },
   
  ],
};
