import { createServerFn } from '@tanstack/react-start'
import { getStrapiClient, readFromStrapi } from '@/data/strapi-sdk'
import { parseArticleKey, parseArticleListInput } from '@/lib/article-input'
import type {
  TArticle,
  TStrapiResponseCollection,
  TStrapiResponseSingle,
} from '@/types/strapi'

const PAGE_SIZE = 3

// Created per call: the client reads server-only env vars.
const articles = () => getStrapiClient().collection('articles')

/**
 * Fetch articles with optional filtering, search, and pagination
 */
const getArticles = async (
  page?: number,
  category?: string,
  query?: string,
) => {
  const filterConditions: Array<Record<string, unknown>> = []

  // Add search query filter
  if (query) {
    filterConditions.push({
      $or: [
        { title: { $containsi: query } },
        { description: { $containsi: query } },
      ],
    })
  }

  // Add category filter
  if (category) {
    filterConditions.push({
      category: {
        slug: { $eq: category },
      },
    })
  }

  const filters =
    filterConditions.length === 0
      ? undefined
      : filterConditions.length === 1
        ? filterConditions[0]
        : { $and: filterConditions }

  return articles().find({
    sort: ['createdAt:desc'],
    pagination: {
      page: page || 1,
      pageSize: PAGE_SIZE,
    },
    populate: ['cover', 'author', 'category'],
    filters,
  }) as Promise<TStrapiResponseCollection<TArticle>>
}

/**
 * Fetch a single article by documentId
 */
const getArticleById = async (documentId: string) => {
  return articles().findOne(documentId, {
    populate: ['cover', 'author', 'category', 'blocks.file', 'blocks.files'],
  }) as Promise<TStrapiResponseSingle<TArticle>>
}

/**
 * Fetch a single article by slug
 */
const getArticleBySlug = async (slug: string) => {
  return articles().find({
    filters: {
      slug: { $eq: slug },
    },
    populate: ['cover', 'author', 'category', 'blocks.file', 'blocks.files'],
  }) as Promise<TStrapiResponseCollection<TArticle>>
}

// Server Functions - these run on the server and can be called from components.
// Inputs are validated (strings and bounded numbers only reach the Strapi
// query) and failures go through the same sanitiser as the product loader.

export const getArticlesData = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (input?: { page?: number; category?: string; query?: string }) =>
      parseArticleListInput(input),
  )
  .handler(({ data }): Promise<TStrapiResponseCollection<TArticle>> =>
    readFromStrapi('articles list', () =>
      getArticles(data.page, data.category, data.query),
    ),
  )

export const getArticleByIdData = createServerFn({
  method: 'GET',
})
  .inputValidator((documentId: string) =>
    parseArticleKey(documentId, 'documentId'),
  )
  .handler(({ data: documentId }): Promise<TStrapiResponseSingle<TArticle>> =>
    readFromStrapi('article by id', () => getArticleById(documentId)),
  )

export const getArticleBySlugData = createServerFn({
  method: 'GET',
})
  .inputValidator((slug: string) => parseArticleKey(slug, 'slug'))
  .handler(({ data: slug }): Promise<TStrapiResponseCollection<TArticle>> =>
    readFromStrapi('article by slug', () => getArticleBySlug(slug)),
  )
