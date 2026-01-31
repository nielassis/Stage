import app from './app';
import { env } from './config/env';

const host = 'localhost';
const PORT = env.PORT || 3000;

const start = async () => {
  try {
    await app.listen({ port: PORT, host });
    app.log.info(
      ` Server listening on ${host}:${PORT} \n  Docs: ${host}:${PORT}/docs`,
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
