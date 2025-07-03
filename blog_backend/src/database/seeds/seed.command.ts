import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedService } from './seed.service';

async function runSeed() {
  console.log('🚀 Starting seed command...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const seedService = app.get(SeedService);
    await seedService.seedAll();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await app.close();
  }

  console.log('🎉 Seeding command completed!');
  process.exit(0);
}

// Only run if this file is executed directly
if (require.main === module) {
  runSeed();
}
