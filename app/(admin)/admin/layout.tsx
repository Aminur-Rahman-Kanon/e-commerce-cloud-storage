import Sidebar from "./component/ui/sidebar/sidebar";
import { ToastContainer } from 'react-toastify';
import Header from "./component/layout/header/header";

export default function AdminLayout({ children }: { children: React.ReactNode }){
    return <div className="relative w-full flex justify-start items-start">
        {/*others*/}
        <ToastContainer />
        <Sidebar />
        <main className="w-full h-full">
            <Header />
            { children }
        </main>
    </div>
}
