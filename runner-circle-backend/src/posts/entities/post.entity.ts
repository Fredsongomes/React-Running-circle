import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Like } from './like.entity';

export type WorkoutType = 'walking' | 'running';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  author: User;

  /** Foto do treino (upload). URL absoluta ou null. */
  @Column({ type: 'text', nullable: true })
  imageUrl: string | null;

  @Column({ type: 'int' })
  durationSeconds: number;

  @Column({ type: 'enum', enum: ['walking', 'running'] })
  type: WorkoutType;

  /** Canônico em metros (o front converte km↔m). */
  @Column({ type: 'int' })
  distanceMeters: number;

  @Column({ type: 'int' })
  calories: number;

  @Column({ type: 'int' })
  heartRateBpm: number;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
