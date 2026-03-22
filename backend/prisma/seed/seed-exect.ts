import 'dotenv/config';
import { seedDb } from './seed';

seedDb()
  .then(() => {
    console.log('Seeding completed successfully');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });
