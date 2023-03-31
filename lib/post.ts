import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'

const postsDirectory: string = path.join(process.cwd(), 'posts')

// mdファイルのデータを取り出す
export function getPostsData() {
  const fileNames: string[] = fs.readdirSync(postsDirectory)
  return fileNames.reverse().map((fileName) => {
    const id: string = fileName.replace(/\.md$/, '')
    const fullPath: string = path.join(postsDirectory, fileName)
    const fileContents: string = fs.readFileSync(fullPath, 'utf8')

    const matterResult: matter.GrayMatterFile<string> = matter(fileContents)

    return {
      id,
      ...matterResult.data,
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    }
  })
}

export async function getPostData(id) {
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
