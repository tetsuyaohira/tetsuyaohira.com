import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import { Post, PostData } from '../types/types'

const postsDirectory: string = path.join(process.cwd(), 'posts')

// mdファイルのデータを取り出す
export function getPostsData(): Post[] {
  const fileNames: string[] = fs.readdirSync(postsDirectory)
  return fileNames.reverse().map((fileName) => {
    const id: string = fileName.replace(/\.md$/, '')
    const fullPath: string = path.join(postsDirectory, fileName)
    const fileContents: string = fs.readFileSync(fullPath, 'utf8')
    const matterResult: matter.GrayMatterFile<string> = matter(fileContents)
    const { title, date } = matterResult.data
    return {
      id,
      title,
      date,
    }
  })
}

export function getAllPostIds(): { params: { id: string } }[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const { title, date } = matterResult.data

  return {
    id,
    markdown: matterResult.content,
    title,
    date,
  }
}
