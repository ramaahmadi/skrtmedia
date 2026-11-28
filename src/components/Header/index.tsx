"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen((prev) => !prev);
  };

  const [sticky, setSticky] = useState(false);
  useEffect(() => {
    const handleStickyNavbar = () => {
      setSticky(window.scrollY >= 40);
    };
    handleStickyNavbar();
    window.addEventListener("scroll", handleStickyNavbar, { passive: true });
    return () => window.removeEventListener("scroll", handleStickyNavbar);
  }, []);

  const [openIndex, setOpenIndex] = useState(-1);
  const handleSubmenu = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  const pathname = usePathname();

  useEffect(() => {
    setNavbarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!navbarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavbarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navbarOpen]);

  return (
    <header
      className={`header top-0 left-0 z-40 flex w-full items-center transition-all duration-300 ${
        sticky
          ? "fixed z-9999 border-b border-gray-200/70 bg-white/85 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-gray-dark/85"
          : "absolute bg-transparent"
      }`}
    >
      {/* Mobile backdrop overlay */}
      {navbarOpen && (
        <div
          aria-hidden="true"
          onClick={() => setNavbarOpen(false)}
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-36 max-w-full px-4 sm:w-48 lg:w-52 xl:mr-10">
            <Link
              href="/"
              className={`header-logo block w-full transition-all duration-300 ${
                sticky ? "py-3 lg:py-2.5" : "py-5 sm:py-6"
              }`}
            >
              <Image
                src="/images/logo/skrt-logo.svg"
                alt="SKRT MEDIA logo"
                width={140}
                height={30}
                priority
                className="w-full"
              />
            </Link>
          </div>

          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-1 justify-center">
              <button
                onClick={navbarToggleHandler}
                id="navbarToggler"
                aria-label="Mobile Menu"
                aria-expanded={navbarOpen}
                className="ring-primary absolute top-1/2 right-4 z-40 block translate-y-[-50%] rounded-xl p-2.5 transition-colors hover:bg-gray-100 focus:ring-2 dark:hover:bg-white/10 lg:hidden"
              >
                <span
                  className={`relative my-1.5 block h-0.5 w-[24px] rounded-full bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[24px] rounded-full bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`relative my-1.5 block h-0.5 w-[24px] rounded-full bg-black transition-all duration-300 dark:bg-white ${
                    navbarOpen ? "top-[-8px] -rotate-45" : ""
                  }`}
                />
              </button>

              <nav
                id="navbarCollapse"
                aria-label="Navigasi Utama"
                className={`navbar absolute right-4 z-30 w-[calc(100vw-2rem)] max-w-[300px] rounded-2xl border border-gray-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-gray-dark/95 lg:visible lg:static lg:w-auto lg:max-w-none lg:rounded-none lg:border-none lg:!bg-transparent lg:p-0 lg:opacity-100 lg:shadow-none lg:backdrop-blur-none ${
                  navbarOpen
                    ? "visible top-full mt-2 opacity-100"
                    : "invisible top-[115%] opacity-0"
                }`}
              >
                <ul className="space-y-1 lg:flex lg:items-center lg:justify-center lg:space-y-0 lg:space-x-8">
                  {menuData.map((menuItem, index) => {
                    const isActive =
                      menuItem.path === "/"
                        ? pathname === "/"
                        : menuItem.path
                          ? pathname?.startsWith(menuItem.path)
                          : false;

                    return (
                      <li key={menuItem.id ?? index} className="group relative">
                        {menuItem.path ? (
                          <Link
                            href={menuItem.path}
                            onClick={() => setNavbarOpen(false)}
                            className={`relative flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors lg:inline-flex lg:rounded-none lg:bg-transparent lg:px-0 lg:py-5 ${
                              isActive
                                ? "bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-sky-300 lg:bg-transparent lg:dark:bg-transparent lg:dark:text-white"
                                : "text-dark/80 hover:bg-gray-100 hover:text-primary dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white lg:hover:bg-transparent lg:dark:hover:bg-transparent"
                            }`}
                          >
                            {menuItem.title}
                            {isActive && (
                              <span className="absolute bottom-3 left-0 hidden h-0.5 w-full rounded-full bg-primary lg:block" />
                            )}
                          </Link>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSubmenu(index)}
                              className="text-dark/80 group-hover:text-primary flex w-full cursor-pointer items-center justify-between py-2.5 text-sm font-medium lg:inline-flex lg:w-auto lg:px-0 lg:py-5 dark:text-white/75 dark:group-hover:text-white"
                            >
                              {menuItem.title}
                              <span className="pl-2">
                                <svg width="20" height="20" viewBox="0 0 25 24">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.29289 8.8427C6.68342 8.45217 7.31658 8.45217 7.70711 8.8427L12 13.1356L16.2929 8.8427C16.6834 8.45217 17.3166 8.45217 17.7071 8.8427C18.0976 9.23322 18.0976 9.86639 17.7071 10.2569L12 15.964L6.29289 10.2569C5.90237 9.86639 5.90237 9.23322 6.29289 8.8427Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </button>
                            <div
                              className={`submenu dark:bg-dark relative top-full left-0 rounded-xl bg-white group-hover:opacity-100 lg:invisible lg:absolute lg:top-[110%] lg:block lg:w-[240px] lg:border lg:border-gray-200/80 lg:p-3 lg:opacity-0 lg:shadow-lg lg:group-hover:visible lg:group-hover:top-full dark:lg:border-white/10 ${
                                openIndex === index ? "block" : "hidden"
                              }`}
                            >
                              {menuItem.submenu?.map((submenuItem, subIndex) => (
                                <Link
                                  href={submenuItem.path}
                                  key={subIndex}
                                  onClick={() => setNavbarOpen(false)}
                                  className="text-dark hover:text-primary block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50 dark:text-white/75 dark:hover:bg-white/5 dark:hover:text-white"
                                >
                                  {submenuItem.title}
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </li>
                    );
                  })}
                  <li className="mt-2 border-t border-gray-200 pt-2 md:hidden dark:border-gray-700">
                    <Link
                      href="/contact"
                      onClick={() => setNavbarOpen(false)}
                      className="flex py-2 text-sm font-semibold text-primary dark:text-white"
                    >
                      Kontak Kami
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center justify-end gap-2 pr-14 lg:pr-0">
              <ThemeToggler />
              <Link
                href="/contact"
                className="hidden rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md md:inline-flex"
              >
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
