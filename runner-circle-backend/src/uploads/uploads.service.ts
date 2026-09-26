import { randomUUID } from 'crypto';
import { join } from 'path';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import sharp from 'sharp';
import { UPLOADS_DIR } from './uploads.util';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  /**
   * Converte a imagem enviada para WebP (comprimida e com dimensão máxima),
   * grava em `uploads/` e devolve o nome do arquivo (`<uuid>.webp`).
   * Aceita png/jpg/webp na entrada; a saída é sempre WebP.
   */
  async saveAsWebp(file: Express.Multer.File): Promise<string> {
    const filename = `${randomUUID()}.webp`;
    const dest = join(process.cwd(), UPLOADS_DIR, filename);

    try {
      await sharp(file.buffer)
        .rotate() // respeita a orientação EXIF
        .resize({
          width: 1600,
          height: 1600,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(dest);
    } catch (err) {
      this.logger.error('Falha ao processar imagem', err as Error);
      throw new BadRequestException('Não foi possível processar a imagem.');
    }

    return filename;
  }
}
