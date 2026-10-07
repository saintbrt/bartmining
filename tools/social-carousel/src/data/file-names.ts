import names from '../../images/file-names.json'
import type { Post } from '../types'

/** Source images and exported slides share category, topic and slide number. */
export function postFilenamePrefix(postId: string): string {
  return names.posts[postId as keyof typeof names.posts]?.prefix ?? postId
}

const oldKeys = new Map(
  names.images.filter(image => !image.keptOriginal).map(image => [image.previousKey, image.key]),
)

/** Keep retired names usable in custom browser edits or copied post code. */
export const renamedImageKey = (key: string) => oldKeys.get(key) ?? key

/** Match by slide first because a shared original now has one file per post. */
export function migratePostImageNames(post: Post): Post {
  return {
    ...post,
    slides: post.slides.map(slide => {
      const rename = names.images.find(image =>
        image.post === post.id && image.slide === slide.id && image.previousKey === slide.image,
      )
      const image = rename?.key ?? (slide.image ? renamedImageKey(slide.image) : slide.image)
      return image === slide.image ? slide : { ...slide, image }
    }),
  }
}
