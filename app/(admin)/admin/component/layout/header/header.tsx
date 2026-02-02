'use client';

import Image from "next/image";
import { getUserToken } from "@/app/(admin)/admin/utilities/utilities";
import { useEffect, useState } from "react";

type TokenType = {
  token: string,
  name: string,
  email: string,
  role: string
}

type UserToken = TokenType | null

export default function Header() {

  const [token, setToken] = useState<TokenType | null>(null);
  
  //get user details
  useEffect(() => {
    const fetchedToken:UserToken = getUserToken();
    setToken(fetchedToken)
  }, []);
  
  return (
    <header className="bg-white border-b border-gray-200 flex items-center justify-between py-2">
      <span className="font-medium">Welcome back 👋</span>
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-10 h-10 rounded-full flex justify-center align-items">
          <Image src={'/images/icons/admin.png'}
                  alt="admin"
                  fill />
        </div>
        <div className="flex justify-center align-items space-x-2">
          <span className="flex justify-center items-center text-sm font-normal">{token?.role.toUpperCase()}</span>
          <button className="w-[80px] h-[25px] border border-gray-400 bg-gray-400 text-black cursor-pointer"
                   >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
