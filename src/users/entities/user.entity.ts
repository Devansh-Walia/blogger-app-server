import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Post } from 'src/posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  provider: string; // 'google' or 'facebook'

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
