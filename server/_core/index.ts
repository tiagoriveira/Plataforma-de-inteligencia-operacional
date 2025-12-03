// Servidor mínimo para desenvolvimento (KISS)
import express from 'express';
import { createServer } from 'vite';

const app = express();
const PORT = 3000;

async function startServer() {
  // Criar servidor Vite em modo desenvolvimento
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  // Usar middleware do Vite
  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
