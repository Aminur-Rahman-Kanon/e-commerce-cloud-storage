import Sidebar from "./component/ui/sidebar/sidebar";
import { ToastContainer } from 'react-toastify';
import Header from "./component/layout/header/header";

export default function AdminLayout({ children }: { children: React.ReactNode }){
    return <div className="relative w-full min-h-screen flex justify-start items-start">
        <ToastContainer />
        <Sidebar />
        <main className="w-full h-full flex flex-col justify-start items-start">
            <Header />
            { children }
        </main>
    </div>
}
