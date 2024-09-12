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

export default function Navbar() {
  return (
    <div className="flex w-full justify-around bg-sky-200 p-2 hidden lg:block">
      <div className="max-w-1366 mx-auto flex w-full justify-between">
        <NavigationMenu className="">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Trang chủ
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-textPrimary">Thể loại</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Khám phá thể loại
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Tìm hiểu các thể loại truyện khác nhau
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Hành động">
                    Truyện hành động và phiêu lưu
                  </ListItem>
                  <ListItem href="/docs/installation" title="Tình cảm">
                    Truyện tình cảm lãng mạn
                  </ListItem>
                  <ListItem href="/docs/primitives/typography" title="Hài hước">
                    Truyện hài hước vui nhộn
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-textPrimary">Sắp xếp</NavigationMenuTrigger>
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
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/truyen-con-trai" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Truyện con trai
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/truyen-con-gai" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Truyện con gái
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/lich-su" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Lịch sử
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/thao-luan" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Thảo luận
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/fanpage" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} text-textPrimary`}>
                  Fanpage
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="right-4 top-2 flex space-x-2 items-center">
          <Button variant="ghost" size="sm" className="text-red-400">
            Đăng ký
          </Button>
          <Button variant="ghost" size="sm" className="text-red-400">
            Đăng nhập
          </Button>
        </div>
      </div>
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
