interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface UserPublicData extends BaseEntity {
  username: string
} 

export interface UserPublicDataWithNotes extends BaseEntity {
  username: string
  notes: NoteData[]
}

export interface NoteData extends BaseEntity {
  noteSlug: string
  title: string
  content: string
  author: UserPublicData
  privacyStatus: string
}