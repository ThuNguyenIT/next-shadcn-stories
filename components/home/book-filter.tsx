"use client"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCallback, useState } from 'react';
import classNames from 'classnames';

interface IState {
  sortActiveButton: string
  chapterActiveButton: string
  statusActiveButton: string
}

interface CheckboxItem {
  id: string;
  label: string;
  isChecked?: boolean;
}
interface ButtonOption {
  label: string;
  value: string;
}

const checkboxItems: CheckboxItem[] = [
  { id: 'tien-hiep', label: 'Tiên hiệp', isChecked: true },
  { id: 'huyen-huyen', label: 'Huyền huyễn' },
  { id: 'do-thi', label: 'Đô thị' },
  { id: 'khoa-huyen', label: 'Khoa huyễn' },
  { id: 'ky-huyen', label: 'Kỳ huyễn' },
  { id: 'vo-hiep', label: 'Võ hiệp' },
  { id: 'lich-su', label: 'Lịch sử' },
  { id: 'dong-nhan', label: 'Đồng nhân' },
  { id: 'quan-su', label: 'Quân sự' },
];

const sortButtonOptions: ButtonOption[] = [
  { label: 'Mới cập nhật', value: 'moi-cap-nhat' },
  { label: 'Truyện mới', value: 'truyen-moi' },
  { label: 'Số chương', value: 'so-chuong' },
];
const chapterButtonOptions: ButtonOption[] = [
  { label: 'Tất cả', value: 'all' },
  { label: '<300', value: '<300' },
  { label: '300-1000', value: '300-1000' },
  { label: '1000-2000', value: '1000-2000' },
  { label: '>2000', value: '>2000' },
];
const statusButtonOptions: ButtonOption[] = [
  { label: 'Đang tiến hành', value: 'progress' },
  { label: 'Hoàn thành', value: 'complete' },
  { label: 'Tạm ngưng', value: 'pause' },
];
export default function BookFilter() {
  const [state, setState] = useState<IState>({
    sortActiveButton: 'moi-cap-nhat',
    chapterActiveButton: 'all',
    statusActiveButton: 'progress'
  })
  const handleSetStateField = useCallback(
    (field: keyof IState, value: boolean | string) => {
      setState((prevState) => ({ ...prevState, [field]: value }))
    },
    []
  )
  return (
    <div className="bg-transparent p-4 text-white">
      <div className="grid grid-cols-[auto,1fr] items-start gap-4">
        <h3 className="text-sky-300">Thể loại</h3>
        <div className="flex flex-wrap gap-2">
          {checkboxItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox id={item.id} checked={item.isChecked} className="border-white data-[state=checked]:bg-custom-red data-[state=checked]:border-none rounded-none h-6 w-6 border-gray-300" />
              <Label htmlFor={item.id} className={`${item.isChecked ? 'text-custom-red' : 'text-gray-600'}`}>
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-4">
        <h3 className="text-sky-300">Sắp xếp</h3>
        <div defaultValue="moi-cap-nhat" className="flex gap-2">
          {sortButtonOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Button
                onClick={() => handleSetStateField('sortActiveButton', option.value)}
                variant="default"
                className={classNames(
                  'bg-transparent border-gray-300 rounded-none', // Các lớp chung
                  {
                    'text-custom-red border border-custom-red hover:bg-custom-red hover:text-white': state.sortActiveButton === option.value, // Trạng thái active
                    'text-gray-500 hover:bg-custom-red hover:text-white': state.sortActiveButton !== option.value, // Trạng thái không active
                  }
                )}
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-4">
        <h3 className="text-sky-300">Lọc theo chương</h3>
        <div className="flex gap-2">
          {chapterButtonOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Button
                onClick={() => handleSetStateField('chapterActiveButton', option.value)}
                variant="default"
                className={classNames(
                  'bg-transparent border-gray-300 rounded-none', // Các lớp chung
                  {
                    'text-custom-red border border-custom-red hover:bg-custom-red hover:text-white': state.chapterActiveButton === option.value, // Trạng thái active
                    'text-gray-500 hover:bg-custom-red hover:text-white': state.chapterActiveButton !== option.value, // Trạng thái không active
                  }
                )}
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto,1fr] items-center gap-4">
        <h3 className="text-sky-300">Tình trạng</h3>
        <div className="flex gap-2">
          {statusButtonOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Button
                onClick={() => handleSetStateField('statusActiveButton', option.value)}
                variant="default"
                className={classNames(
                  'bg-transparent border-gray-300 rounded-none', // Các lớp chung
                  {
                    'text-custom-red border border-custom-red hover:bg-custom-red hover:text-white': state.statusActiveButton === option.value, // Trạng thái active
                    'text-gray-500 hover:bg-custom-red hover:text-white': state.statusActiveButton !== option.value, // Trạng thái không active
                  }
                )}
              >
                {option.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
