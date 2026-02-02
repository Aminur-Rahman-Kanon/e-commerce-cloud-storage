'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [btnDisable, setBtnDisable] = useState(true);

    useEffect(() => {
        if (email.length && password.length){
            setBtnDisable(false);
        }
        else {
            setBtnDisable(false);
        }
    }, [email, password])

    const submitHandler = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!email.length || !password.length ) return;

        try {
            const response = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok){
                const error = await response.json();
                throw new Error(error.message || 'authentication failed');
            }

            const token = await response.json();
            localStorage.setItem('token', JSON.stringify(token));
            router.push('/admin');
        } catch (error) {
            //handle error
            console.error(error)
        }
    }

    return (
        <div className='w-full h-screen min-h-[800px] flex flex-col justify-center items-center'>
            <input type='email'
                    placeholder='Email address'
                    className='w-[450px] h-[35px] mb-[10px] border border-gray-400'
                    onChange={(e) => setEmail(e.target.value)} />

            <input type='text'
                    placeholder='Password'
                    className='w-[450px] mb-[10px] h-[35px] border border-gray-400'
                    onChange={(e) => setPassword(e.target.value)} />
            
            <button className='w-[450px] h-[40px] mt-[20px] border border-green-400 bg-green-400 text-white
                                disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={btnDisable}
                    onClick={submitHandler} >
                Submit
            </button>
        </div>
    )
}
