import NextAuth from "next-auth"
import { options } from "./options.ts"

const handler = NextAuth(options)

export { handler as GET, handler as POST }
// https://help.heroku.com/tickets/1289514