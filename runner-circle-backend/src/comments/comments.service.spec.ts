import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Post } from '../posts/entities/post.entity';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

function setup() {
  const comments = {
    findOne: jest.fn(),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };
  const posts = { exists: jest.fn().mockResolvedValue(true) };
  const service = new CommentsService(
    comments as unknown as Repository<Comment>,
    posts as unknown as Repository<Post>,
  );
  return { service, comments, posts };
}

describe('CommentsService', () => {
  describe('remove', () => {
    it('permite que o autor exclua o próprio comentário', async () => {
      const { service, comments } = setup();
      comments.findOne.mockResolvedValue({ id: 'c1', author: { id: 'u1' } });

      await service.remove('p1', 'c1', 'u1');

      expect(comments.delete).toHaveBeenCalledWith({ id: 'c1' });
    });

    it('impede outra pessoa de excluir o comentário (403)', async () => {
      const { service, comments } = setup();
      comments.findOne.mockResolvedValue({ id: 'c1', author: { id: 'u1' } });

      await expect(service.remove('p1', 'c1', 'u2')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
      expect(comments.delete).not.toHaveBeenCalled();
    });

    it('responde 404 quando o comentário não existe no post', async () => {
      const { service, comments } = setup();
      comments.findOne.mockResolvedValue(null);

      await expect(service.remove('p1', 'c1', 'u1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  it('não permite comentar em post inexistente', async () => {
    const { service, posts } = setup();
    posts.exists.mockResolvedValue(false);

    await expect(
      service.create('p-inexistente', 'u1', { text: 'Oi' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
