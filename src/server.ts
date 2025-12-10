import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
dotenv.config();
import routes from "./routes";
import { checkDatabaseConnection, sequelize } from "./plugins/sequelize";

const server = Fastify({ logger: true });

const start = async () => {
  try {
    await server.register(cors, {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization","token"],
    });
    await server.register(routes);

    server.log.info("DB connected");

    await sequelize.sync({});
    const dbStatus: any = await checkDatabaseConnection();

    if (!dbStatus.connected) {
      throw new Error(dbStatus.message || "Database connection failed");
    }
    const port = Number(process.env.PORT || 3000);

    await server.listen({ port, host: "0.0.0.0" });

    server.log.info(`Server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
