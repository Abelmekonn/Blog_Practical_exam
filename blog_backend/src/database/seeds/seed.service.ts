import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Import entities
import { User } from '../../infrastructure/database/entities/user.orm-entity';
import { Post } from '../../infrastructure/database/entities/post.orm-entity';
import { Comment } from '../../infrastructure/database/entities/comment.orm-entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async seedAll(): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await this.clearDatabase();

    // Seed data in order
    const users = await this.seedUsers();
    const posts = await this.seedPosts(users);
    await this.seedComments(users, posts);

    console.log('✅ Database seeding completed successfully!');
  }

  private async clearDatabase(): Promise<void> {
    console.log('🗑️ Clearing existing data...');

    await this.commentRepository.delete({});
    await this.postRepository.delete({});
    await this.userRepository.delete({});

    console.log('✅ Database cleared');
  }

  private async seedUsers(): Promise<User[]> {
    console.log('👥 Seeding users...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersData = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: hashedPassword,
      },
      {
        username: 'janesmith',
        email: 'jane@example.com',
        password: hashedPassword,
      },
      {
        username: 'alexjohnson',
        email: 'alex@example.com',
        password: hashedPassword,
      },
      {
        username: 'emilybrown',
        email: 'emily@example.com',
        password: hashedPassword,
      },
      {
        username: 'michaelwilson',
        email: 'michael@example.com',
        password: hashedPassword,
      },
    ];

    const users = this.userRepository.create(usersData);
    const savedUsers = await this.userRepository.save(users);

    console.log(`✅ Created ${savedUsers.length} users`);
    return savedUsers;
  }

  private async seedPosts(users: User[]): Promise<Post[]> {
    console.log('📝 Seeding posts...');

    const imageUrl =
      'https://res.cloudinary.com/detxtubji/image/upload/v1722631227/cld-sample-2.jpg';
    const imagePublicId = 'cld-sample-2';

    const postsData = [
      {
        title: 'Getting Started with React and TypeScript',
        content: `
# Getting Started with React and TypeScript

TypeScript has become an essential tool for modern React development. In this comprehensive guide, we'll explore how to set up a React project with TypeScript and leverage its powerful type system to build more robust applications.

## Why TypeScript with React?

TypeScript brings several advantages to React development:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete and refactoring capabilities
- **Improved Developer Experience**: Clear contracts for component props and state
- **Easier Maintenance**: Self-documenting code with explicit types

## Setting Up Your Environment

To get started, you'll need to install the necessary dependencies:

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Creating Your First TypeScript Component

Here's a simple example of a TypeScript React component:

\`\`\`tsx
interface Props {
  name: string;
  age?: number;
}

const UserProfile: React.FC<Props> = ({ name, age }) => {
  return (
    <div>
      <h2>Welcome, {name}!</h2>
      {age && <p>Age: {age}</p>}
    </div>
  );
};
\`\`\`

This approach provides type safety and makes your components more predictable and maintainable.
        `,
        imageUrl,
        imagePublicId,
        author: users[0],
      },
      {
        title: 'Building Scalable Node.js APIs with Clean Architecture',
        content: `
# Building Scalable Node.js APIs with Clean Architecture

Clean Architecture is a software design philosophy that emphasizes separation of concerns and dependency inversion. When applied to Node.js APIs, it creates maintainable, testable, and scalable applications.

## Core Principles

1. **Independence**: The architecture should be independent of frameworks, UI, and databases
2. **Testability**: Business rules can be tested without external elements
3. **Flexibility**: Easy to change and adapt to new requirements

## Layer Structure

### Domain Layer
Contains business entities and rules. This is the core of your application:

\`\`\`typescript
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
  ) {}

  updateProfile(name: string): User {
    return new User(this.id, this.email, name);
  }
}
\`\`\`

### Application Layer
Orchestrates business logic through use cases:

\`\`\`typescript
export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: CreateUserRequest): Promise<User> {
    const user = new User(generateId(), userData.email, userData.name);
    return await this.userRepository.save(user);
  }
}
\`\`\`

### Infrastructure Layer
Handles external concerns like databases and web frameworks.

This architecture pattern has revolutionized how we build maintainable applications!
        `,
        imageUrl,
        imagePublicId,
        author: users[1],
      },
      {
        title: 'Modern CSS: Grid, Flexbox, and Beyond',
        content: `
# Modern CSS: Grid, Flexbox, and Beyond

CSS has evolved tremendously in recent years. Modern layout systems like Grid and Flexbox have revolutionized how we approach web design, making complex layouts simple and intuitive.

## CSS Grid: The Game Changer

CSS Grid provides a two-dimensional layout system that's perfect for complex designs:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
\`\`\`

## Flexbox: One-Dimensional Layouts

Flexbox excels at distributing space and aligning items in a single dimension:

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
\`\`\`

## CSS Custom Properties (Variables)

Custom properties make your CSS more maintainable and dynamic:

\`\`\`css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --spacing-unit: 1rem;
}

.button {
  background-color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 0.75) var(--spacing-unit);
  border-radius: 0.375rem;
}
\`\`\`

These modern CSS features enable us to create responsive, maintainable designs with less code!
        `,
        imageUrl,
        imagePublicId,
        author: users[2],
      },
      {
        title: 'Database Design Best Practices for Web Applications',
        content: `
# Database Design Best Practices for Web Applications

Good database design is the foundation of any successful web application. It affects performance, scalability, and maintainability throughout the application's lifecycle.

## Normalization: Finding the Right Balance

### First Normal Form (1NF)
- Eliminate repeating groups
- Each column should contain atomic values
- Each row should be unique

### Second Normal Form (2NF)
- Must be in 1NF
- Remove partial dependencies
- Non-key attributes must depend on the entire primary key

### Third Normal Form (3NF)
- Must be in 2NF
- Remove transitive dependencies
- Non-key attributes should not depend on other non-key attributes

## Indexing Strategies

Strategic indexing can dramatically improve query performance:

\`\`\`sql
-- Index frequently queried columns
CREATE INDEX idx_user_email ON users(email);

-- Composite indexes for multi-column queries
CREATE INDEX idx_post_author_date ON posts(author_id, created_at);

-- Partial indexes for conditional queries
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
\`\`\`

## Relationships and Constraints

Properly defined relationships ensure data integrity:

\`\`\`sql
-- Foreign key relationships
ALTER TABLE posts 
ADD CONSTRAINT fk_posts_author 
FOREIGN KEY (author_id) REFERENCES users(id);

-- Check constraints for data validation
ALTER TABLE users 
ADD CONSTRAINT chk_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
\`\`\`

## Performance Considerations

- Use appropriate data types
- Avoid over-normalization for read-heavy workloads
- Consider denormalization for analytical queries
- Implement proper connection pooling
- Monitor and optimize slow queries

Remember: the best database design balances normalization with performance requirements!
        `,
        imageUrl,
        imagePublicId,
        author: users[3],
      },
      {
        title: 'The Future of Web Development: Trends to Watch in 2024',
        content: `
# The Future of Web Development: Trends to Watch in 2024

The web development landscape continues to evolve at a rapid pace. As we move through 2024, several key trends are shaping how we build and deploy web applications.

## Server-Side Rendering Renaissance

Server-side rendering (SSR) is making a strong comeback with modern frameworks:

- **Next.js 14**: App Router and Server Components
- **SvelteKit**: File-based routing and adaptive rendering
- **Remix**: Focused on web standards and progressive enhancement

## Edge Computing and CDN Evolution

Edge computing is bringing computation closer to users:

\`\`\`javascript
// Cloudflare Workers example
export default {
  async fetch(request) {
    const country = request.cf.country;
    return new Response(\`Hello from \${country}!\`);
  }
};
\`\`\`

## AI Integration in Development

AI tools are transforming the development process:

- **Code Generation**: GitHub Copilot, Codeium, and Tabnine
- **Testing**: AI-powered test generation and bug detection
- **Design**: AI-assisted UI/UX design tools
- **Code Review**: Automated code quality analysis

## WebAssembly (WASM) Adoption

WebAssembly is enabling new possibilities:

\`\`\`rust
// Rust code compiled to WASM
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
\`\`\`

## TypeScript Everywhere

TypeScript adoption continues to grow:
- Better tooling and IDE support
- Improved type inference
- Enhanced developer experience

## Micro-Frontends Architecture

Large applications are embracing micro-frontends:

\`\`\`javascript
// Module Federation with Webpack 5
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell',
      remotes: {
        products: 'products@http://localhost:3001/remoteEntry.js',
      },
    }),
  ],
};
\`\`\`

## Sustainability in Web Development

Green web development is becoming a priority:
- Optimized images and assets
- Efficient caching strategies
- Reduced JavaScript bundle sizes
- Carbon-aware hosting solutions

The future of web development is exciting, with technologies that make applications faster, more scalable, and more accessible than ever before!
        `,
        imageUrl,
        imagePublicId,
        author: users[4],
      },
      {
        title: 'Mastering API Design: RESTful Principles and Beyond',
        content: `
# Mastering API Design: RESTful Principles and Beyond

Well-designed APIs are the backbone of modern web applications. They enable seamless communication between different services and provide a foundation for scalable, maintainable systems.

## RESTful Design Principles

### Resource-Based URLs
Design URLs around resources, not actions:

\`\`\`
Good:
GET /api/users/123
POST /api/users
PUT /api/users/123
DELETE /api/users/123

Avoid:
GET /api/getUser/123
POST /api/createUser
\`\`\`

### HTTP Status Codes
Use appropriate status codes to communicate response state:

\`\`\`javascript
// Success responses
200 OK - Request successful
201 Created - Resource created
204 No Content - Successful deletion

// Client error responses
400 Bad Request - Invalid request
401 Unauthorized - Authentication required
403 Forbidden - Access denied
404 Not Found - Resource not found
422 Unprocessable Entity - Validation errors

// Server error responses
500 Internal Server Error - Server malfunction
503 Service Unavailable - Temporary unavailability
\`\`\`

## API Versioning Strategies

### URL Versioning
\`\`\`
/api/v1/users
/api/v2/users
\`\`\`

### Header Versioning
\`\`\`
Accept: application/vnd.api+json;version=1
API-Version: 2
\`\`\`

## Response Formatting

Consistent response structures improve developer experience:

\`\`\`javascript
// Success response
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Email must be a valid email address"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_123456"
  }
}
\`\`\`

## Pagination and Filtering

Implement efficient data retrieval:

\`\`\`javascript
// Cursor-based pagination
GET /api/posts?limit=20&cursor=eyJpZCI6IjEyMyJ9

// Offset-based pagination
GET /api/posts?page=2&limit=20

// Filtering and sorting
GET /api/posts?author=john&category=tech&sort=-createdAt
\`\`\`

## Rate Limiting

Protect your API from abuse:

\`\`\`javascript
// Rate limiting headers
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
\`\`\`

## Documentation with OpenAPI

Comprehensive documentation is crucial:

\`\`\`yaml
paths:
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
\`\`\`

Remember: a well-designed API is intuitive, consistent, and thoroughly documented!
        `,
        imageUrl,
        imagePublicId,
        author: users[0],
      },
    ];

    const posts = this.postRepository.create(postsData);
    const savedPosts = await this.postRepository.save(posts);

    console.log(`✅ Created ${savedPosts.length} posts`);
    return savedPosts;
  }

  private async seedComments(users: User[], posts: Post[]): Promise<void> {
    console.log('💬 Seeding comments...');

    const commentsData = [
      // Comments for React/TypeScript post
      {
        content:
          'Great introduction to TypeScript with React! I especially loved the section about type safety.',
        author: users[1],
        post: posts[0],
      },
      {
        content:
          'This helped me understand why TypeScript is worth the learning curve. Thanks for the practical examples!',
        author: users[2],
        post: posts[0],
      },
      {
        content:
          'Do you have any recommendations for TypeScript configuration for large projects?',
        author: users[3],
        post: posts[0],
      },

      // Comments for Clean Architecture post
      {
        content:
          'Clean Architecture has completely changed how I structure my Node.js applications. Excellent breakdown!',
        author: users[0],
        post: posts[1],
      },
      {
        content:
          'The use case example really clarified the concept for me. More posts like this please!',
        author: users[2],
        post: posts[1],
      },
      {
        content:
          'How do you handle validation in the domain layer vs application layer?',
        author: users[4],
        post: posts[1],
      },

      // Comments for CSS post
      {
        content:
          'CSS Grid was a game-changer for me. Your examples make it so much easier to understand!',
        author: users[0],
        post: posts[2],
      },
      {
        content:
          "The custom properties section is gold! I'm definitely implementing this in my next project.",
        author: users[1],
        post: posts[2],
      },
      {
        content:
          'Would love to see a follow-up post about CSS animations and transitions!',
        author: users[4],
        post: posts[2],
      },

      // Comments for Database post
      {
        content:
          'Database design is often overlooked but so crucial. Thanks for the comprehensive guide!',
        author: users[0],
        post: posts[3],
      },
      {
        content:
          'The indexing strategies section saved me hours of research. Bookmarked for future reference!',
        author: users[1],
        post: posts[3],
      },
      {
        content:
          'Could you cover database migration strategies in a future post?',
        author: users[2],
        post: posts[3],
      },

      // Comments for Future of Web Dev post
      {
        content:
          'Exciting times ahead! The WebAssembly section has me really curious to dive deeper.',
        author: users[0],
        post: posts[4],
      },
      {
        content:
          'AI integration in development is happening faster than I expected. Great overview!',
        author: users[1],
        post: posts[4],
      },
      {
        content:
          "The sustainability angle is something I hadn't considered much. Thanks for highlighting it!",
        author: users[3],
        post: posts[4],
      },

      // Comments for API Design post
      {
        content:
          'This should be required reading for any backend developer. Fantastic resource!',
        author: users[1],
        post: posts[5],
      },
      {
        content:
          'The response formatting examples are exactly what I needed for my current project.',
        author: users[2],
        post: posts[5],
      },
      {
        content:
          'How do you handle API versioning when you have breaking changes?',
        author: users[3],
        post: posts[5],
      },
      {
        content:
          'The pagination strategies comparison is super helpful. Thanks!',
        author: users[4],
        post: posts[5],
      },
    ];

    const comments = this.commentRepository.create(commentsData);
    await this.commentRepository.save(comments);

    console.log(`✅ Created ${comments.length} comments`);
  }
}
