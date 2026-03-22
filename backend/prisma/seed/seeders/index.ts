import { testUsers } from './user';
import { hashText } from '../../../src/utils/brycpt';

export const getSeedData = async () => {
  // Pre-hash passwords for all users in the seed data
  const hashedUsers = {
    ...testUsers,
    data: await Promise.all(
      testUsers.data.map(async (user) => ({
        ...user,
        password: await hashText(user.password),
      }))
    ),
  };

  return [hashedUsers];
};
