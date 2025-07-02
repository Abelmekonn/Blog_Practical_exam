import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.orm-entity';
import { Comment } from './comment.orm-entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  imagePublicId: string;

  @ManyToOne(() => User, user => user.posts)
  author: User;

  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}