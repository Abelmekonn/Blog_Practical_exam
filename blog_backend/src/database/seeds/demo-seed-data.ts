/**
 * Demo script to show the structure of seed data
 * Run with: npx ts-node src/database/seeds/demo-seed-data.ts
 */

const IMAGE_URL =
  'https://res.cloudinary.com/detxtubji/image/upload/v1722631227/cld-sample-2.jpg';

// Demo users data
const usersData = [
  {
    username: 'johndoe',
    email: 'john@example.com',
    password: '[HASHED]',
  },
  {
    username: 'janesmith',
    email: 'jane@example.com',
    password: '[HASHED]',
  },
  {
    username: 'alexjohnson',
    email: 'alex@example.com',
    password: '[HASHED]',
  },
  {
    username: 'emilybrown',
    email: 'emily@example.com',
    password: '[HASHED]',
  },
  {
    username: 'michaelwilson',
    email: 'michael@example.com',
    password: '[HASHED]',
  },
];

// Demo posts data (abbreviated)
const postsData = [
  {
    title: 'Getting Started with React and TypeScript',
    content:
      '# Getting Started with React and TypeScript\n\nTypeScript has become an essential tool for modern React development...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'johndoe',
  },
  {
    title: 'Building Scalable Node.js APIs with Clean Architecture',
    content:
      '# Building Scalable Node.js APIs with Clean Architecture\n\nClean Architecture is a software design philosophy...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'janesmith',
  },
  {
    title: 'Modern CSS: Grid, Flexbox, and Beyond',
    content:
      '# Modern CSS: Grid, Flexbox, and Beyond\n\nCSS has evolved tremendously in recent years...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'alexjohnson',
  },
  {
    title: 'Database Design Best Practices for Web Applications',
    content:
      '# Database Design Best Practices for Web Applications\n\nGood database design is the foundation...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'emilybrown',
  },
  {
    title: 'The Future of Web Development: Trends to Watch in 2024',
    content:
      '# The Future of Web Development: Trends to Watch in 2024\n\nThe web development landscape continues to evolve...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'michaelwilson',
  },
  {
    title: 'Mastering API Design: RESTful Principles and Beyond',
    content:
      '# Mastering API Design: RESTful Principles and Beyond\n\nWell-designed APIs are the backbone...',
    imageUrl: IMAGE_URL,
    imagePublicId: 'cld-sample-2',
    author: 'johndoe',
  },
];

// Demo comments data
const commentsData = [
  {
    content:
      'Great introduction to TypeScript with React! I especially loved the section about type safety.',
    author: 'janesmith',
    postTitle: 'Getting Started with React and TypeScript',
  },
  {
    content:
      'This helped me understand why TypeScript is worth the learning curve. Thanks for the practical examples!',
    author: 'alexjohnson',
    postTitle: 'Getting Started with React and TypeScript',
  },
  {
    content:
      'Clean Architecture has completely changed how I structure my Node.js applications. Excellent breakdown!',
    author: 'johndoe',
    postTitle: 'Building Scalable Node.js APIs with Clean Architecture',
  },
  // ... more comments
];

function displaySeedDataSummary() {
  console.log('🌱 BLOG SEED DATA PREVIEW');
  console.log('='.repeat(50));

  console.log(`\n👥 USERS (${usersData.length} total):`);
  usersData.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.username} (${user.email})`);
  });

  console.log(`\n📝 BLOG POSTS (${postsData.length} total):`);
  postsData.forEach((post, index) => {
    const preview = post.content.substring(0, 80) + '...';
    console.log(`  ${index + 1}. "${post.title}"`);
    console.log(`     Author: ${post.author}`);
    console.log(`     Preview: ${preview.replace(/\n/g, ' ')}`);
    console.log(`     Image: ${post.imageUrl}`);
    console.log('');
  });

  console.log(
    `💬 COMMENTS: ${commentsData.length} realistic comments across all posts`,
  );
  console.log('\nSample comments:');
  commentsData.slice(0, 3).forEach((comment, index) => {
    console.log(`  ${index + 1}. "${comment.content}"`);
    console.log(`     - ${comment.author} on "${comment.postTitle}"`);
    console.log('');
  });

  console.log('\n🔐 LOGIN CREDENTIALS:');
  console.log('   Email: Any user email above');
  console.log('   Password: password123');

  console.log('\n🚀 TO USE SEED DATA:');
  console.log('   1. Ensure your database is running');
  console.log('   2. Run: npm run seed');
  console.log('   3. Start backend: npm run start:dev');
  console.log('   4. Test at: http://localhost:3000/api/docs');

  console.log('\n✅ Ready for frontend development!');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  displaySeedDataSummary();
}
