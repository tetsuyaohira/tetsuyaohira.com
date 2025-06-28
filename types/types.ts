export type Post = {
  id: string
  title: string
  date: string
  description?: string
  tags?: string[]
}

export type PostData = {
  id: string
  markdown: string
  title: string
  date: string
  description?: string
  tags?: string[]
}
