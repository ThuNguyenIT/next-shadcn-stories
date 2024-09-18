import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function BookFilter() {
  return (
    <div className="bg-transparent p-4 text-white">
      <div className="grid grid-cols-[auto,1fr] items-start gap-4">
        <h3 className="text-sky-300">Thể loại</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="tien-hiep" checked className="border-white" />
            <Label htmlFor="tien-hiep" className="text-red-500">
              Tiên hiệp
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="huyen-huyen" className="border-white" />
            <Label htmlFor="huyen-huyen">Huyền huyễn</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="do-thi" className="border-white" />
            <Label htmlFor="do-thi">Đô thị</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="khoa-huyen" className="border-white" />
            <Label htmlFor="khoa-huyen">Khoa huyễn</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ky-huyen" className="border-white" />
            <Label htmlFor="ky-huyen">Kỳ huyễn</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="vo-hiep" className="border-white" />
            <Label htmlFor="vo-hiep">Võ hiệp</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="lich-su" className="border-white" />
            <Label htmlFor="lich-su">Lịch sử</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="dong-nhan" className="border-white" />
            <Label htmlFor="dong-nhan">Đồng nhân</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="quan-su" className="border-white" />
            <Label htmlFor="quan-su">Quân sự</Label>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-4">
        <h3 className="text-sky-300">Sắp xếp</h3>
        <RadioGroup defaultValue="moi-cap-nhat" className="flex gap-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="moi-cap-nhat"
              id="moi-cap-nhat"
              className="border-white"
            />
            <Label htmlFor="moi-cap-nhat" className="text-red-500">
              Mới cập nhật
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="truyen-moi"
              id="truyen-moi"
              className="border-white"
            />
            <Label htmlFor="truyen-moi">Truyện mới</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="so-chuong"
              id="so-chuong"
              className="border-white"
            />
            <Label htmlFor="so-chuong">Số chương</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-4">
        <h3 className="text-sky-300">Lọc theo chương</h3>
        <div className="flex gap-2">
          <Button
            variant="default"
            className="bg-red-500 text-white hover:bg-red-600"
          >
            Tất cả
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-[#002140]"
          >{`<300`}</Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-[#002140]"
          >
            300-1000
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-[#002140]"
          >
            1000-2000
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-[#002140]"
          >{`>2000`}</Button>
        </div>
      </div>
    </div>
  );
}
