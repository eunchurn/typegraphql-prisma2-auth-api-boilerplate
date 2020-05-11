import "dotenv/config";
import { GraphQLServer } from "graphql-yoga";
import { context } from "./context";
import createSchema from "./schema";
import { permissions } from "./permissions";

const PORT = process.env.API_PORT || 8000;

createSchema.then((schema) => {
  new GraphQLServer({
    schema,
    context,
    middlewares: [permissions],
  }).start({ port: PORT }, () =>
    console.log(
      `🚀  GraphQL API server is running on ${process.env.API_HOST}:${PORT}`,
    ),
  );
});
