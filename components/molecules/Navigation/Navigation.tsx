"use client";
import Image from "next/image";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoveredLink } from "@/components/ui/navbar-menu";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { school } from "@/lib/school";

export function Navigation() {
  const pathname = usePathname();
  const infoLinks = [
    { name: "Profil Sekolah", link: "/profile" },
    { name: "Pengumuman", link: "/announcements" },
    { name: "Kepala Sekolah & Tenaga Pendidik", link: "/staff" },
  ];
  const akademikLinks = [
    { name: "Program Keahlian", link: "/academic/majors" },
  ];
  const kegiatanLinks = [
    { name: "Prestasi", link: "/activities/achievements" },
    { name: "Ekstrakurikuler", link: "/activities/extracurricular" },
    { name: "DUDI & Prakerin", link: "/activities/internship" },
  ];
  const galeriLinks = [{ name: "Galeri", link: "/gallery" }];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [akademikOpen, setAkademikOpen] = useState(false);
  const [kegiatanOpen, setKegiatanOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const solidBackground = true;
  const wrapperClasses = "bg-transparent";
  const brandTextClass = "text-white";

  const navItemsClasses = "text-white hover:text-white";

  // Shared dropdown animation classes for smooth open/close
  const dropdownAnim =
    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200 ease-out";

  return (
    <div
      className={`w-full fixed z-50 transition-colors duration-300 ${wrapperClasses}`}
    >
      <Navbar className="top-0">
        {/* Desktop Navigation */}
        <NavBody>
          <a
            href="/"
            className={`relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-medium ${brandTextClass}`}
          >
            <Image
              src="../../../public/assets/logo.png"
              alt={`${school.name} logo`}
              width={36}
              height={36}
              className="h-9 w-9 object-contain drop-shadow"
              priority
            />
            <span className="text-base font-semibold">{school.name}</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            <HoveredLink
              href="/"
              className={`px-3 py-2 rounded-md ${navItemsClasses}`}
            >
              Beranda
            </HoveredLink>

            <div
              onMouseEnter={() => setInfoOpen(true)}
              onMouseLeave={() => setInfoOpen(false)}
              className="relative"
            >
              <DropdownMenu open={infoOpen} onOpenChange={setInfoOpen}>
                <DropdownMenuTrigger
                  className={`px-3 py-2 rounded-md ${navItemsClasses}`}
                >
                  Informasi
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className={`min-w-64 flex flex-col gap-2 bg-primary-900 text-white p-3 ${dropdownAnim}`}
                >
                  {infoLinks.map((item) => (
                    <DropdownMenuItem key={item.link} asChild>
                      <HoveredLink className="text-white" href={item.link}>
                        {item.name}
                      </HoveredLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <HoveredLink
              href="/academic/majors"
              className={`px-3 py-2 rounded-md ${navItemsClasses}`}
            >
              Akademik
            </HoveredLink>

            <div
              onMouseEnter={() => setKegiatanOpen(true)}
              onMouseLeave={() => setKegiatanOpen(false)}
              className="relative"
            >
              <DropdownMenu open={kegiatanOpen} onOpenChange={setKegiatanOpen}>
                <DropdownMenuTrigger
                  className={`px-3 py-2 rounded-md ${navItemsClasses}`}
                >
                  Kegiatan
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className={`min-w-64 flex flex-col gap-2 bg-primary-900 text-white p-3 ${dropdownAnim}`}
                >
                  {kegiatanLinks.map((item) => (
                    <DropdownMenuItem key={item.link} asChild>
                      <HoveredLink className="text-white" href={item.link}>
                        {item.name}
                      </HoveredLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <HoveredLink
              href="/gallery"
              className={`px-3 py-2 rounded-md ${navItemsClasses}`}
            >
              Galeri
            </HoveredLink>
          </div>
          <div className="flex items-center gap-3">
            <NavbarButton
              href="/student/login"
              variant="secondary"
              className="text-white hover:text-white/90"
            >
              Portal Siswa
            </NavbarButton>
            <NavbarButton
              href="/teacher/login"
              className="bg-primary-700 hover:bg-primary-600 text-white"
            >
              Portal Guru / Admin
            </NavbarButton>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <a
              href="/"
              className={`relative z-20 mr-2 flex items-center space-x-2 px-2 py-1 text-sm font-medium ${brandTextClass}`}
            >
              <Image
                src="../../../public/assets/logo.png"
                alt={`${school.name} logo`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain drop-shadow"
                priority
              />
              <span className="text-base font-semibold">{school.name}</span>
            </a>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            <div className="space-y-4">
              <div>
                <div className="text-white/70 text-xs mb-2">Informasi</div>
                <div className="flex flex-col gap-2">
                  {[{ name: "Beranda", link: "/" }, ...infoLinks].map(
                    (item) => (
                      <a
                        key={item.link}
                        href={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="relative text-white/90 hover:text-white"
                      >
                        <span className="block">{item.name}</span>
                      </a>
                    )
                  )}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-xs mb-2">Akademik</div>
                <div className="flex flex-col gap-2">
                  {akademikLinks.map((item) => (
                    <a
                      key={item.link}
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative text-white/90 hover:text-white"
                    >
                      <span className="block">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-xs mb-2">Kegiatan</div>
                <div className="flex flex-col gap-2">
                  {kegiatanLinks.map((item) => (
                    <a
                      key={item.link}
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative text-white/90 hover:text-white"
                    >
                      <span className="block">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-white/70 text-xs mb-2">Galeri</div>
                <div className="flex flex-col gap-2">
                  {galeriLinks.map((item) => (
                    <a
                      key={item.link}
                      href={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative text-white/90 hover:text-white"
                    >
                      <span className="block">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                href="/student/login"
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Portal Siswa
              </NavbarButton>
              <NavbarButton
                href="/teacher/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary-950"
              >
                Portal Guru/Admin
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
