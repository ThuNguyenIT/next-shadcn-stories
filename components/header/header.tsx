'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SearchIcon } from 'lucide-react';
import { MobileSidebar } from '../layout/mobile-sidebar';
import { Genders, useHomeStore } from '@/lib';
import { useEffect, useState } from 'react';

export default function Header() {
  const { targetGender, setTargetGender } = useHomeStore();
  const [imageMaleSrc, setImageMaleSrc] = useState('/svg/icon-shield-active.svg');
  const [imageFemaleSrc, setImageFemaleSrc] = useState('/svg/icon-users.svg');
  const [color, setColor] = useState('male-blue');

  useEffect(() => {
    // Cập nhật imageSrc sau khi component đã mount trên client
    if (targetGender === Genders.MALE) {
      setImageMaleSrc('/svg/icon-shield-active.svg');
      setImageFemaleSrc('/svg/icon-users.svg');
    } else {
      setImageMaleSrc('/svg/icon-shield.svg');
      setImageFemaleSrc('/svg/icon-users-active.svg');
    }
    setColor(
      `${targetGender === Genders.MALE ? 'male-blue' : 'female-purple'
      }`
    );
  }, [targetGender]);


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
              className={`pr-10 border-${color} `}
            />
            <Button
              size="icon"
              variant="ghost"
              className={`absolute right-0 top-0 h-full hover:bg-${color} bg-${color}`}
            >
              <SearchIcon className="h-4 w-4 text-white " />
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" size="icon" className="w-13 h-13" onClick={() => setTargetGender(Genders.MALE)}>
            <Image
              src={imageMaleSrc}
              alt="Users Icon"
              width={52}
              height={52}
            />
          </Button>
          <Button variant="secondary" size="icon" className="w-13 h-13"
            onClick={() => setTargetGender(Genders.FEMALE)}>
            <Image
              src={imageFemaleSrc}
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
