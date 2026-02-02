import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest){
    if (req.nextUrl.pathname.startsWith('/admin')){
        const token = req.cookies.get('token')?.value;

        if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

        try {
            const payload = jwt.verify(token, SECRET) as { role: string };
            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/', req.url));
            }
        } catch (error) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/admin/:path*'],
}
