
export interface RedditThread {
  id: string,
  body: string,
  permalink: string,
  type: string|undefined,
  upvote_ratio: number | undefined,
  audio: Array<string>
}
