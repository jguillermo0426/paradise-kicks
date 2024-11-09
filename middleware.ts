import { NextRequest, NextResponse  } from "next/server";

export default function middleware(req: NextRequest) {
  let verify = req.cookies.get('loggedin');
  let url = req.url

  if(!verify && url.includes("/admin-dashboard")) {
    return NextResponse.redirect("localhost:3000/login");
  }

  if(verify && url === "localhost:3000/login") {
    return NextResponse.redirect("localhost:3000/admin-dashboard/inventory");
  }
}