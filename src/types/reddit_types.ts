
export interface RedditThread {
  id: string,
  body: string,
  permalink: string,
  type: string|undefined,
  upvote_ratio: number | undefined,
  audio?: Array<string>
}

export interface Response {
  thread: Array<RedditThread>,
  base64_audio: Array<string>
}