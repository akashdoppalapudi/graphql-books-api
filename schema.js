import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLInt,
	GraphQLNonNull,
} from 'graphql';

import { authors, books } from './data.js';

const AuthorType = new GraphQLObjectType({
	name: 'Author',
	description: 'This represents the author of the book',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLInt) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		books: {
			type: new GraphQLList(BookType),
			resolve: (author) => books.filter((b) => b.authorId === author.id),
		},
	}),
});

const BookType = new GraphQLObjectType({
	name: 'Book',
	description: 'This represents a book written by an author',
	fields: () => ({
		id: { type: new GraphQLNonNull(GraphQLInt) },
		name: { type: new GraphQLNonNull(GraphQLString) },
		authorId: { type: new GraphQLNonNull(GraphQLInt) },
		author: {
			type: AuthorType,
			description: 'Author of the book',
			resolve: (book) => authors.find((a) => a.id === book.authorId),
		},
	}),
});

const RootQueryType = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: () => ({
		books: {
			type: new GraphQLList(BookType),
			description: 'List of Books',
			resolve: () => books,
		},
		book: {
			type: BookType,
			description: 'A single book',
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve: (parent, args) => books.find((b) => b.id == args.id),
		},
		authors: {
			type: new GraphQLList(AuthorType),
			description: 'List of Authors',
			resolve: () => authors,
		},
		author: {
			type: AuthorType,
			description: 'A single Author',
			args: {
				id: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve: (parent, args) => authors.find((a) => a.id == args.id),
		},
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: () => ({
		addBook: {
			type: BookType,
			description: 'Add a new Book',
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve: (parent, args) => {
				const book = {
					id: books.length + 1,
					name: args.name,
					authorId: args.authorId,
				};
				books.push(book);
				return book;
			},
		},
		addAuthor: {
			type: AuthorType,
			description: 'Add a new Author',
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve: (parent, args) => {
				const author = {
					id: authors.length + 1,
					name: args.name,
					authorId: args.authorId,
				};
				authors.push(author);
				return author;
			},
		},
	}),
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

export default schema;
