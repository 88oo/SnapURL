import Header from "@/components/header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return <div>
        <main className="min-h-screen container">
            <Header/>
            {/*body*/}
            <Outlet />
        </main>

        <div className="p-10 text-center bg-slate-600 mt-9">
            Made By 88oo
        </div>

        {/* Footer */}
    </div>;
};

export default AppLayout;