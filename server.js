import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import schema from './schema.js';

const app = express();

app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
);

app.listen(5000, () => {
	console.log('Server running at http://localhos:5000');
});
