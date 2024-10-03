'use client';
import * as React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import AuthModal from '../auth/auth-modal';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import LogoutConfirmationDialog from '../home/confirm-logout-dialog';
import { Genders, useAuthStore, useHomeStore } from '@/lib';

const genres = [
  { name: "Tiên hiệp", href: "/category/tien-hiep" },
  { name: "Huyền huyễn", href: "/category/huyen-huyen" },
  { name: "Đô thị", href: "/category/do-thi" },
  { name: "Khoa huyễn", href: "/category/khoa-huyen" },
  { name: "Kỳ huyễn", href: "/category/ky-huyen" },
  { name: "Võ hiệp", href: "/category/vo-hiep" },
  { name: "Lịch sử", href: "/category/lich-su" },
  { name: "Đồng nhân", href: "/category/dong-nhan" },
  { name: "Quân sự", href: "/category/quan-su" },
  { name: "Du hí", href: "/category/du-hi" },
  { name: "Canh kỳ", href: "/category/canh-ky" },
  { name: "Linh dị", href: "/category/linh-di" },
  { name: "Ngôn tình", href: "/category/ngon-tinh" },
  { name: "Nữ cường", href: "/category/nu-cuong" },
  { name: "Đam mỹ", href: "/category/dam-my" },
]


interface IState {
  isAlertOpen: boolean;
  open: boolean;
  color: string
  bgColor: string
  activeTab: string
}
export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { targetGender } = useHomeStore();

  const [state, setState] = useState<IState>({
    isAlertOpen: false,
    open: false,
    color: "male-blue",
    bgColor: "bg-sky-300",
    activeTab: "login"
  });
  const handleSetStateField = useCallback(
    (field: keyof IState, value: string | boolean) => {
      setState((prevState) => ({ ...prevState, [field]: value }));
    },
    []
  );

  useEffect(() => {
    // Cập nhật className sau khi component đã mount trên client
    handleSetStateField('color', targetGender === Genders.MALE ? 'text-male-blue' : 'text-female-purple')
    handleSetStateField('bgColor', targetGender === Genders.MALE ? 'bg-sky-300' : 'bg-pink-100')

  }, [targetGender, handleSetStateField]);

  const handleOpenAuthModal = useCallback(() => {
    handleSetStateField('open', true)
  }, [])
  const handleCloseAuthModal = useCallback(() => {
    handleSetStateField('open', false)
  }, [])
  const handleLogout = () => {
    // Implement your logout logic here
    console.log("User logged out", typeof user, user)
    logout()
  }

  const openRegisterTab = useCallback(() => {
    handleSetStateField('activeTab', 'register')

    handleOpenAuthModal()
  }, []);
  const openSignUpTab = useCallback(() => {
    handleSetStateField('activeTab', 'login')
    handleOpenAuthModal()
  }, []);
  const setActiveTab = useCallback((tab: string) => {
    handleSetStateField('activeTab', tab)
  }, []);
  const setIsAlertOpen = useCallback((open: boolean) => {
    handleSetStateField('isAlertOpen', open)
  }, []);
  return (
    <div
      className={`flex hidden w-full justify-around p-2 lg:block ${state.bgColor}`}
    >
      <div className="mx-auto flex w-full max-w-1366 justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Trang chủ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`nav-link text-${state.color}`}>
                Thể loại
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className={`!data-[state=open]:bg-transparent !data-[active]:bg-transparent !data-[state=open]:bg-transparent !data-[active]:bg-transparent`}
              >
                <div
                  className={`grid w-[400px] gap-3 bg-[#F3FCFF] p-4 md:w-[500px] md:grid-cols-3 `}
                >
                  {genres.map((genre) => (
                    <NavigationMenuLink
                      key={genre.name}
                      href={genre.href}
                      className="block select-none space-y-1 border-b border-dashed border-gray-200 p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      {genre.name}
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {/* <NavigationMenuItem>
              <NavigationMenuTrigger className={`nav-link text-${color}`}>
                Sắp xếp
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {sortItems.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem> */}
            <NavigationMenuItem>
              <Link href="/sort" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Sắp xếp
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/truyen-con-trai" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Truyện con trai
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/truyen-con-gai" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Truyện con gái
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/lich-su" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Lịch sử
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/thao-luan" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Thảo luận
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/fanpage" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`nav-link ${navigationMenuTriggerStyle()} text-${state.color}`}
                >
                  Fanpage
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {user ? (<div className="right-4 top-2 flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-custom-red">
              {user.full_name}

              <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href="/account">Tài khoản</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleSetStateField('isAlertOpen', true)}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>) : (
          <div className="right-4 top-2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="nav-link text-custom-red"
              onClick={openRegisterTab}
            >
              Đăng ký
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="nav-link text-custom-red"
              onClick={openSignUpTab}
            >
              Đăng nhập
            </Button>
          </div>)}

      </div>
      <AuthModal
        open={state.open}
        handleCloseAuthModal={handleCloseAuthModal}
        activeTab={state.activeTab}
        setActiveTab={setActiveTab}
      />
      <LogoutConfirmationDialog isAlertOpen={state.isAlertOpen} setIsAlertOpen={setIsAlertOpen} handleLogout={handleLogout} />
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

const sortItems = [
  {
    title: 'Mới cập nhật',
    href: '/sort/latest',
    description: 'Truyện mới được cập nhật gần đây'
  },
  {
    title: 'Xem nhiều nhất',
    href: '/sort/most-viewed',
    description: 'Truyện có lượt xem cao nhất'
  },
  {
    title: 'Đánh giá cao',
    href: '/sort/top-rated',
    description: 'Truyện được đánh giá tốt nhất'
  },
  {
    title: 'Theo thể loại',
    href: '/sort/by-genre',
    description: 'Sắp xếp truyện theo thể loại'
  }
];
