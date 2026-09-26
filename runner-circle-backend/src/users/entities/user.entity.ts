import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  /** Handle único, armazenado SEM o `@` (o front prepõe na exibição). */
  @Column({ unique: true })
  username: string;

  /** Só existe quando a pessoa se cadastrou com email (nullable, único quando presente). */
  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  /** Nunca é serializado pela API (select: false + shape PublicUser). */
  @Column({ select: false })
  passwordHash: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  /** URL absoluta servível pelo front. */
  @Column({ type: 'text', nullable: true })
  avatarUrl: string | null;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;
}
