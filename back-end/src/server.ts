import app from './app';
import { env } from './config/env';

if (!process.env.VERCEL) {
  const PORT = Number(env.PORT) || 3000;

  app
    .listen({ port: PORT, host: '0.0.0.0' })
    .then(() => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📄 Docs: http://localhost:${PORT}/docs`);
    })
    .catch((err) => {
      app.log.error(err);
      process.exit(1);
    });
}

export default app;
