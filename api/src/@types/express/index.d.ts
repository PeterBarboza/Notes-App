import express from 'express'
import 'express'

export interface pagination {
  limit?: string | number
  skip?: string | number
}

export type ParsedQs = {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[]
}

export interface Pagination {
  limit?: string | number
  skip?: string | number
}

export interface Filters extends ParsedQs {}

export interface query extends ParsedQs {
  pagination?: Pagination
  filters?: Filters
}

export interface userData {
  id?: string
  username?: string
}

declare module 'express' {
  export interface Request extends express.Request {
    query: query
    userdata?: userData
  }
}