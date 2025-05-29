import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: 
  [
    // Oauth provider (Normal Continue with Google)
    Google,
    // Credentials provider (Sign in with email and password)
    

  ],
})