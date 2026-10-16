
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import { Navbar } from './../components/navbar/Navbar';
import Footer from './../components/shared/Footer';

export const MainLayouts = () => {
  const location = useLocation();

  return (
    <div>
      <header>
        <Navbar />
        {/* <ResponsiveNav></ResponsiveNav> */}
      </header>

      {/* Home sections share one background with Home.jsx (H2) */}
      <main className="bg-base-100">
        <Outlet />
        <ScrollRestoration />
      </main>

      <Footer></Footer>
    </div>
  );
};
