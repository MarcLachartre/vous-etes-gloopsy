export { default } from "next-auth/middleware" 
// this line applies nextauth to our entire project
export const config = { matcher: []} // add routes to matcher to block if not loggedin
// export default {}