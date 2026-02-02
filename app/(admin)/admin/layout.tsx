import Sidebar from "./component/ui/sidebar/sidebar";
import { ToastContainer } from 'react-toastify';

export default function AdminLayout({ children }: { children: React.ReactNode }){
    return <div className="w-full h-full flex justify-left align-items">
        {/*others*/}
        <ToastContainer />
        <Sidebar />
        <main className="w-full">
            { children }
        </main>
    </div>
}
