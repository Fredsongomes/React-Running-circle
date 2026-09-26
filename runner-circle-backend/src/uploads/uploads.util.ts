import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const UPLOADS_DIR = 'uploads';

const ALLOWED_MIME = ['image/png', 'image/jpeg', 'image/webp'];

/** Limite de tamanho do upload (MB), configurável por env. Padrão 15 MB. */
export const UPLOAD_MAX_MB = Number(process.env.UPLOAD_MAX_MB ?? 15);

/**
 * Opções do Multer para upload de imagem. Guarda o arquivo em MEMÓRIA — a
 * conversão para WebP acontece no `UploadsService` antes de gravar em disco.
 */
export const imageMulterOptions: MulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: UPLOAD_MAX_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'Formato de imagem inválido. Use png, jpg ou webp.',
        ),
        false,
      );
    }
  },
};

/** Monta a URL absoluta servível pelo front a partir do nome do arquivo salvo. */
export function buildFileUrl(filename?: string | null): string | null {
  if (!filename) return null;
  const base = (process.env.API_BASE_URL ?? 'http://localhost:3000').replace(
    /\/+$/,
    '',
  );
  return `${base}/${UPLOADS_DIR}/${filename}`;
}

/**
 * Resolve o valor guardado no banco para uma URL absoluta.
 * - Uploads guardam só o nome do arquivo → vira `${API_BASE_URL}/uploads/<nome>`
 *   (robusto a troca de host).
 * - Seed guarda URLs externas absolutas (pravatar/picsum) → devolvidas como estão.
 */
export function resolveUrl(stored?: string | null): string | null {
  if (!stored) return null;
  if (/^https?:\/\//i.test(stored)) return stored;
  return buildFileUrl(stored);
}
