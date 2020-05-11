import { buildSchema } from "type-graphql";
import path from "path";
import DefaultResolvers, { CustomUserResolver } from "./resolvers";

const schema = buildSchema({
  resolvers: [...Object.values(DefaultResolvers), CustomUserResolver],
  validate: false,
  emitSchemaFile: path.resolve(__dirname, "../generated-schema.graphql"),
});

export default schema;
