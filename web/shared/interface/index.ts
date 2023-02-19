export interface page {
  paginationFilters: {
    limit: number
    skip: number
  },
  pageNumber: number
  currentAmmount: number
}

export interface NotesPagination {
  total: number
  pagesList: page[]
  currentPage: number
}

export interface paginationParams {
  limit: number
  skip: number
}