import { CONFIG } from "../../configs";

import { Note } from "../../interface";
import { GetManyResponse, GetOneResponse } from "./interface";

import notesMock from "../../mock/notes.json"

type paginationParams = {
  limit: number
  skip: number
}
type getOneParams = {
  noteSlug: string
  authorSlug: string
}
type searchParams = {
  paginationParams: paginationParams
  keyWords: string
}

function convertStringToArray(text: string): string[] {
  const stringArray = text
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => {
    if(word.includes(" ") || word.length <= 0) {
      return
    }
    return word
    })
    .filter((word) => {
    if(word === undefined) {
      return
    }
    return word
    }) as string[]

    return stringArray
}

export class NotesService {
  private baseUrl: string

  constructor() {
    this.baseUrl = `${CONFIG.baseApiUrl}/notes`
  }

  async getMany(paginationParams?: paginationParams): Promise<GetManyResponse<Note>> {
    return notesMock
  }

  async getOne({ noteSlug, authorSlug }: getOneParams): Promise<GetOneResponse<Note>> {
    const note = notesMock.results.find((note) => {
      return (note.noteSlug === noteSlug) && (note.authorSlug === authorSlug)
    })

    return note || null
  }

  async getManyByAuthor(authorSlug: string): Promise<GetManyResponse<Note>> {
    const notes = notesMock.results.map((note) => {
      if(note.authorSlug === authorSlug) {
        return note
      }
      return
    })
    .filter((note) => note ? true : false) as any

    return {
      pagination: {
        limit: 999,
        skip: 999,
        total: notes.length,
      },
      results: notes || []
    }
  }

  async search({ keyWords, paginationParams }: searchParams): Promise<GetManyResponse<Note>> {
    const keyWordsArray: string[] = convertStringToArray(keyWords)    

    const notes = notesMock.results.map((item) => {
      const title = item.title.toLowerCase()
        
      const content = item.content.toLowerCase()

      const includesSomeWord = keyWordsArray.some((item) => {
        if(title.includes(item) || content.includes(item)) {
          return true
        }
        return false
      })

      if(!includesSomeWord) {
        return
      }

      return item
    }).filter((note) => note ? true : false) as any

    return {
      pagination: {
        limit: 999,
        skip: 999,
        total: notes.length,
      },
      results: notes || []
    }
  }
}