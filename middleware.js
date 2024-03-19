import { NextResponse, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'  // you need to install next-auth/jwt

const secret = process.env.NEXT_PUBLIC_SECRET

// export async function middleware(req) {
//   if(req.nextUrl === 'http://localhost:3000') return NextResponse.next()
//   const token = await getToken({ req, secret })
//   if (!token) {
//     return NextResponse.redirect('http://localhost:3000')
//   }

//   // If authorized, continue to page
//   return new NextResponse()
//  }


export async function middleware(req) {
  const path = req.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/register"|| path === "/";

  const token = await getToken({ req, secret })

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/profile", req.nextUrl));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/my_quizzes",
    "/login",
    "/register",
    "/create_pool",
    "/create_quiz",
    "/create_question",
    "/create_question2",
    "/my_pools",
    "/my_submissions",
    "/pool_detail",
    "/quiz_detail",
    "/quiz_leaderboard",
    "/quizzes",
    "/results",
    "/take_quiz",
    "/users"
  ],
};