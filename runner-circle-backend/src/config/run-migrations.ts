import dataSource from './data-source';

/**
 * Roda as migrations em produção sem depender do typeorm CLI / ts-node.
 * O entrypoint do container executa `node dist/config/run-migrations.js`.
 */
async function run(): Promise<void> {
  await dataSource.initialize();
  const executed = await dataSource.runMigrations();
  if (executed.length) {
    console.log(`✓ ${executed.length} migration(s) aplicada(s).`);
  } else {
    console.log('✓ Nenhuma migration pendente.');
  }
  await dataSource.destroy();
}

run().catch((err) => {
  console.error('Falha ao rodar migrations:', err);
  process.exit(1);
});
