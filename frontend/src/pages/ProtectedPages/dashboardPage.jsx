import { Outlet } from "react-router-dom";
import AppNavigation from "../../components/navigation/appNavigation";

function DashboardPage() {
  return (
    <div className="min-h-svh w-full overflow-x-clip bg-background">
      <AppNavigation />

      <main className="min-w-0 w-full pb-24 lg:pl-[72px]">
        <div className="mx-auto w-full max-w-[1600px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
