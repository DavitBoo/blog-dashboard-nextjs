"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type MenuItemWithLink = {
  href: string;
  label: string;
  icon: string;
  exact: boolean;
};

type MenuItemWithChildren = {
  label: string;
  icon: string;
  children: {
    href: string;
    label: string;
    exact: boolean;
  }[];
};

type MenuItem = MenuItemWithLink | MenuItemWithChildren;

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null); // dropdown
  const [sidebarOpen, setSidebarOpen] = useState(false); // sidebar menu

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const menuItems: MenuItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard Home",
      icon: "📊",
      exact: true,
    },
    {
      label: "Posts",
      icon: "📝",
      children: [
        {
          href: "/dashboard/posts",
          label: "Manage Posts",
          exact: false,
        },
        {
          href: "/dashboard/posts/new",
          label: "Create New Post",
          exact: true,
        },
      ],
    },
    {
      href: "/dashboard/comments",
      label: "Manage Comments",
      icon: "💬",
      exact: true,
    },
    {
      href: "/dashboard/manageLabels",
      label: "Manage Labels",
      icon: "🏷️",
      exact: true,
    },
    {
      href: "/dashboard/media",
      label: "Media Manager",
      icon: "📷",
      exact: true,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && pathname !== "/dashboard";
  };

  const renderMenuItem = (item: MenuItem) => {
    if ("href" in item) {
      // Render simple link item
      return (
        <li key={item.href}>
          <Link href={item.href} className={`nav-link ${isActive(item.href, item.exact) ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        </li>
      );
    } else {
      // Render item with children
      const isPostsActive = item.children.some((child) => isActive(child.href, child.exact));
      const isExpanded = expandedMenu === item.label || isPostsActive;

      return (
        <li key={item.label}>
          <div
            className={`nav-link ${isPostsActive ? "active" : ""}`}
            onClick={() => toggleMenu(item.label)}
            style={{ cursor: "pointer" }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            <span className="menu-arrow" style={{ marginLeft: "auto" }}>
              {isExpanded ? "▼" : "▶"}
            </span>
          </div>
          {isExpanded && (
            <ul className="submenu">
              {item.children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className={`submenu-link ${isActive(child.href, child.exact) ? "active" : ""}`}
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>
      <div className="dashboard-container">
          <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <div className="sidebar-header">
              <h2>Dashboard</h2>
            </div>
            <nav className="sidebar-nav">
              <ul>{menuItems.map(renderMenuItem)}</ul>
            </nav>
          </aside>
      </div>
    </>
  );
};

export default DashboardSidebar;
