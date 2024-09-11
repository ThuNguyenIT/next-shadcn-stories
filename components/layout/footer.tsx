import Image from 'next/image';
import * as React from 'react';

export default function Footer() {
  return (
    <footer
      className="w-full py-6"
      style={
        {
          // backgroundImage: `url("/images/bg-footer.png")`
        }
      }
    >
      <div className="container mx-auto flex justify-between px-4 ">
        <div className="mb-4 md:mb-0">
          <Image
            className="h-24 w-24 items-center justify-center"
            src="/images/logo.png" // Relative path from the public folder
            alt="Mystical landscape with pagodas on misty mountains"
            width={96} // Equivalent to w-24 (24 * 4 = 96px)
            height={96} // Equivalent to h-24 (24 * 4 = 96px)
          />
        </div>
        <div className="flex flex-col items-center  md:flex-row md:items-start">
          <div className="text-center md:max-w-2xl md:text-left">
            <p className="mb-2 text-sm text-gray-600">
              © 2020 Truyện chữ giải
            </p>
            <p className="mb-2 text-sm text-gray-600">
              Thư viện truyện chữ ở và free cho cộng đồng fan kiếm hiệp, tiên
              hiệp, ngôn tình.
            </p>
            <p className="text-sm text-gray-600">
              Chúc các bạn có những giây phút thư giãn thoải mái sau giờ làm
              việc và học tập căng thẳng.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
