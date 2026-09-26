import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import dataSource from '../config/data-source';
import { Comment } from '../comments/entities/comment.entity';
import { Like } from '../posts/entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';

/** Senha de todos os usuários de teste (documentada no README). */
const SEED_PASSWORD = 'secret123';

/** Base temporal fixa p/ ordenação determinística do feed (createdAt desc). */
const BASE_TIME = new Date('2026-07-22T12:00:00.000Z').getTime();
const hoursAgo = (h: number): Date => new Date(BASE_TIME - h * 3_600_000);

interface UserSpec {
  username: string;
  name: string;
  email: string;
  bio: string;
  avatar: number; // id do i.pravatar.cc
}

const USERS: UserSpec[] = [
  {
    username: 'julio',
    name: 'Júlio Oliveira',
    email: 'julio@example.com',
    bio: 'Corredor amador em evolução. Bora treinar! 🏃',
    avatar: 59,
  },
  {
    username: 'laura',
    name: 'Laura Mota Linhares',
    email: 'laura@example.com',
    bio: 'Cada treino é um recorde pessoal.',
    avatar: 68,
  },
  {
    username: 'julia',
    name: 'Júlia Santos',
    email: 'julia@example.com',
    bio: 'Foco, força e cafuné no cachorro depois da corrida.',
    avatar: 45,
  },
  {
    username: 'pedro',
    name: 'Pedro Lima',
    email: 'pedro@example.com',
    bio: 'Maratonista de fim de semana.',
    avatar: 12,
  },
  {
    username: 'marina',
    name: 'Marina Costa',
    email: 'marina@example.com',
    bio: 'Caminhar também é treino. 💚',
    avatar: 32,
  },
];

type WorkoutType = 'walking' | 'running';

interface PostSpec {
  author: string; // username
  durationSeconds: number;
  type: WorkoutType;
  distanceMeters: number;
  calories: number;
  heartRateBpm: number;
  description: string;
  hoursAgo: number;
  imageSeed: string;
}

const POSTS: PostSpec[] = [
  // Júlio (usuário de login) é autor de 3 posts → aba "Posts" do perfil cheia.
  {
    author: 'julio',
    durationSeconds: 1800,
    type: 'running',
    distanceMeters: 5000,
    calories: 420,
    heartRateBpm: 150,
    description: 'Primeiro 5k do mês saindo! Ritmo tranquilo mas constante.',
    hoursAgo: 2,
    imageSeed: 'julio-5k',
  },
  {
    author: 'julio',
    durationSeconds: 2700,
    type: 'running',
    distanceMeters: 8000,
    calories: 600,
    heartRateBpm: 158,
    description: 'Treino longo de domingo. As pernas pediram água. 💦',
    hoursAgo: 26,
    imageSeed: 'julio-long',
  },
  {
    author: 'julio',
    durationSeconds: 1200,
    type: 'walking',
    distanceMeters: 2000,
    calories: 150,
    heartRateBpm: 110,
    description: 'Caminhada de recuperação ativa. Corpo agradece.',
    hoursAgo: 50,
    imageSeed: 'julio-walk',
  },
  {
    author: 'laura',
    durationSeconds: 1800,
    type: 'walking',
    distanceMeters: 2000,
    calories: 300,
    heartRateBpm: 120,
    description: 'Hoje dei meu mínimo e esse foi meu máximo! kkkk',
    hoursAgo: 1,
    imageSeed: 'laura-walk',
  },
  {
    author: 'laura',
    durationSeconds: 2100,
    type: 'running',
    distanceMeters: 6000,
    calories: 480,
    heartRateBpm: 155,
    description: 'Bati meu recorde nos 6k! Muito feliz com a evolução.',
    hoursAgo: 8,
    imageSeed: 'laura-6k',
  },
  {
    author: 'julia',
    durationSeconds: 1500,
    type: 'running',
    distanceMeters: 4200,
    calories: 350,
    heartRateBpm: 148,
    description: 'Corridinha antes do trabalho pra começar o dia com energia.',
    hoursAgo: 5,
    imageSeed: 'julia-morning',
  },
  {
    author: 'pedro',
    durationSeconds: 3600,
    type: 'running',
    distanceMeters: 10000,
    calories: 780,
    heartRateBpm: 162,
    description: 'Preparação pra meia maratona: 10k no ritmo de prova.',
    hoursAgo: 12,
    imageSeed: 'pedro-10k',
  },
  {
    author: 'marina',
    durationSeconds: 2400,
    type: 'walking',
    distanceMeters: 3500,
    calories: 220,
    heartRateBpm: 105,
    description: 'Caminhada no parque com trilha sonora boa. Recomendo!',
    hoursAgo: 18,
    imageSeed: 'marina-park',
  },
  {
    author: 'marina',
    durationSeconds: 1800,
    type: 'walking',
    distanceMeters: 2800,
    calories: 190,
    heartRateBpm: 108,
    description: 'Segunda-feira começou no ritmo certo. 💚',
    hoursAgo: 40,
    imageSeed: 'marina-monday',
  },
  {
    author: 'pedro',
    durationSeconds: 1980,
    type: 'running',
    distanceMeters: 5500,
    calories: 440,
    heartRateBpm: 152,
    description: 'Intervalado puxado hoje. No pain, no gain!',
    hoursAgo: 34,
    imageSeed: 'pedro-intervals',
  },
];

/** Comentários semeados em um post, para a modal de comentários já abrir populada. */
const MODAL_COMMENTS: { author: string; text: string; hoursAgo: number }[] = [
  { author: 'julia', text: 'Arrasou! 👏', hoursAgo: 0.9 },
  {
    author: 'pedro',
    text: 'Bora treinar junto semana que vem?',
    hoursAgo: 0.8,
  },
  { author: 'marina', text: 'Que ritmo! Tô inspirada 🔥', hoursAgo: 0.6 },
  {
    author: 'julio',
    text: 'Top demais, parabéns pela evolução!',
    hoursAgo: 0.4,
  },
];

async function seed(): Promise<void> {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  if ((await userRepo.count()) > 0) {
    console.log('✓ Seed já aplicado (usuários existem). Nada a fazer.');
    await dataSource.destroy();
    return;
  }

  const postRepo = dataSource.getRepository(Post);
  const likeRepo = dataSource.getRepository(Like);
  const commentRepo = dataSource.getRepository(Comment);

  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 10);

  // --- Usuários ---
  const usersByName = new Map<string, User>();
  for (const spec of USERS) {
    const user = await userRepo.save(
      userRepo.create({
        name: spec.name,
        username: spec.username,
        email: spec.email,
        passwordHash,
        bio: spec.bio,
        avatarUrl: `https://i.pravatar.cc/300?img=${spec.avatar}`,
        createdAt: hoursAgo(100),
      }),
    );
    usersByName.set(spec.username, user);
  }

  // --- Posts ---
  const postsByIndex: Post[] = [];
  for (const spec of POSTS) {
    const author = usersByName.get(spec.author)!;
    const post = await postRepo.save(
      postRepo.create({
        author,
        imageUrl: `https://picsum.photos/seed/${spec.imageSeed}/800/600`,
        durationSeconds: spec.durationSeconds,
        type: spec.type,
        distanceMeters: spec.distanceMeters,
        calories: spec.calories,
        heartRateBpm: spec.heartRateBpm,
        description: spec.description,
        createdAt: hoursAgo(spec.hoursAgo),
      }),
    );
    postsByIndex.push(post);
  }

  // --- Curtidas ---
  // Júlio (login) curte posts de OUTROS → aba "Curtidas" do perfil cheia.
  // Índices: 3,4 = laura; 5 = julia; 6,9 = pedro; 7,8 = marina.
  const likePairs: { userIdx: string; postIndexes: number[] }[] = [
    { userIdx: 'julio', postIndexes: [3, 5, 6, 7] },
    { userIdx: 'laura', postIndexes: [0, 5, 6] },
    { userIdx: 'julia', postIndexes: [0, 3, 4, 6] },
    { userIdx: 'pedro', postIndexes: [0, 1, 4] },
    { userIdx: 'marina', postIndexes: [0, 3, 4, 5] },
  ];
  for (const { userIdx, postIndexes } of likePairs) {
    const user = usersByName.get(userIdx)!;
    for (const pi of postIndexes) {
      await likeRepo.save(
        likeRepo.create({ userId: user.id, postId: postsByIndex[pi].id }),
      );
    }
  }

  // --- Comentários (na post da Laura, índice 3 — a do "mínimo/máximo") ---
  const targetPost = postsByIndex[3];
  for (const c of MODAL_COMMENTS) {
    const author = usersByName.get(c.author)!;
    await commentRepo.save(
      commentRepo.create({
        postId: targetPost.id,
        author,
        text: c.text,
        createdAt: hoursAgo(c.hoursAgo),
      }),
    );
  }

  console.log(
    `✓ Seed concluído: ${USERS.length} usuários, ${POSTS.length} posts, ` +
      `curtidas e ${MODAL_COMMENTS.length} comentários.`,
  );
  console.log(`  Login de teste: julio@example.com / ${SEED_PASSWORD}`);

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Falha no seed:', err);
  process.exit(1);
});
