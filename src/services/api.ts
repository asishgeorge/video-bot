const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3001'

export const getRedditData = async () => {
  try {
    let res = await fetch(BASE_URL)
    let a = await res.json()
    console.log('api response', a)

    return a
   
  } catch (error) {
    console.log("error api service",error)
    throw error
  }
}
