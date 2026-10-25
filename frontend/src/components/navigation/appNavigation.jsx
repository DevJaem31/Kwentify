import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  House,
  ArrowLeftRight,
  WalletCards,
  PiggyBank,
  ChartNoAxesCombined,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: House,
    bottom: true,
  },
  {
    label: "Transactions",
    to: "/dashboard/transactions",
    icon: ArrowLeftRight,
    bottom: true,
  },
  {
    label: "Budgets",
    to: "/dashboard/budgets",
    icon: WalletCards,
    bottom: true,
  },
  {
    label: "Savings",
    to: "/dashboard/savings",
    icon: PiggyBank,
    bottom: true,
  },
  {
    label: "Investments",
    to: "/dashboard/investments",
    icon: ChartNoAxesCombined,
    bottom: false,
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: Settings,
    bottom: false,
  },
];

function NavigationLink({ item, collapsed = false, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.to === "/dashboard"}
      title={collapsed ? item.label : undefined}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`
      }
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function NavigationItems({ items, collapsed = false, onNavigate }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <NavigationLink
          key={item.to}
          item={item}
          collapsed={collapsed}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

function DesktopSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  const primaryItems = navigation.filter((item) => item.label !== "Settings");

  const settingsItem = navigation.find((item) => item.label === "Settings");

  return (
    <aside
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className={`fixed inset-y-0 left-0 z-50 hidden border-r bg-background p-3 transition-[width] duration-200 lg:flex lg:flex-col ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      <NavLink
        to="/dashboard"
        className="mb-6 flex h-10 items-center gap-3 px-2"
      >
        <img
          src="/kwentify_icon_logo.png"
          alt="Kwentify"
          className="size-8 shrink-0 object-contain"
        />
        {!collapsed && <span className="font-semibold">Kwentify</span>}
      </NavLink>

      <div className="flex-1">
        <NavigationItems items={primaryItems} collapsed={collapsed} />
      </div>

      {settingsItem && (
        <NavigationItems items={[settingsItem]} collapsed={collapsed} />
      )}
    </aside>
  );
}

function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur lg:hidden">
        <NavLink
          to="/dashboard"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 font-semibold"
        >
          <img
            src="/kwentify_icon_logo.png"
            alt="Kwentify"
            className="size-8 shrink-0 object-contain"
          />
          <span>Kwentify</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-drawer"
          className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <aside
            id="mobile-navigation-drawer"
            className="absolute inset-y-0 right-0 flex w-[min(18rem,85vw)] flex-col border-l bg-background p-4 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-semibold">Navigation</span>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-accent"
              >
                <X className="size-5" />
              </button>
            </div>

            <NavigationItems
              items={navigation}
              onNavigate={() => setMenuOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

function MobileBottomNavigation() {
  const bottomItems = navigation.filter((item) => item.bottom);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background/95 px-1 pt-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {bottomItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-xs transition-colors ${
                isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`
            }
          >
            <Icon className="size-5 shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function AppNavigation() {
  return (
    <>
      <DesktopSidebar />
      <MobileHeader />
      <MobileBottomNavigation />
    </>
  );
}
