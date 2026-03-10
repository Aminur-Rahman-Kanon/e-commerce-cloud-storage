import { NextResponse } from "next/server";

export default async function GET () {
    return NextResponse.json({ status: 'awake', time: new Date().toISOString() },
                             { status: 200 })
}
