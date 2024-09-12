import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SearchIcon } from 'lucide-react';
import { MobileSidebar } from '../layout/mobile-sidebar';

export default function Header() {
  return (
    <header className="relative h-[300px] w-full overflow-hidden">
      <nav className="flex items-center justify-between px-4 py-2 absolute">
        <div className={`${cn('block lg:!hidden')} z-50`}>
          <MobileSidebar />
        </div>

      </nav>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("/images/bg-header.png")`
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
        <div className="mb-8">
          <div className="flex items-center justify-center ">
            <Image
              className="h-24 w-24 items-center justify-center"
              src="/images/logo.png" // Relative path from the public folder
              alt="Mystical landscape with pagodas on misty mountains"
              width={96} // Equivalent to w-24 (24 * 4 = 96px)
              height={96} // Equivalent to h-24 (24 * 4 = 96px)
            />
          </div>
        </div>
        <div className="mb-4 w-full max-w-md">
          <div className="relative">
            <Input
              type="text"
              placeholder="Nhập tên truyện hoặc tác giả"
              className="pr-10"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full bg-[#0277BD]"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="icon" className="w-13 h-13">
            <Image
              src="/svg/icon-shield-active.svg" // Path to your SVG in the public folder
              alt="Users Icon"
              width={52}
              height={52}
            />
          </Button>
          <Button variant="secondary" size="icon" className="w-13 h-13">
            <Image
              src="/svg/icon-users.svg" // Path to your SVG in the public folder
              alt="Users Icon"
              width={52}
              height={52}
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
