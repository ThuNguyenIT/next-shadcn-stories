import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import InputField from '@/components/form-control/input-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useState } from 'react';
import DatePicker from '@/components/form-control/date-picker';
import { useAuthStore } from '@/lib';

export default function AccountForm() {
    const { user } = useAuthStore();
    const [dob, setDob] = useState<Date | undefined>();
    return (
        <div className="flex max-w-4xl mx-auto gap-6 flex-col lg:flex-row">
            <form className="space-y-4 flex-grow">
                <InputField id="username" label="Tên tài khoản" value={user?.username || ''} readOnly />
                <InputField id="email" label="Email" value={user?.email || ''} type="email" readOnly />


                <h3 className="text-lg font-semibold mt-6 mb-4">Thông tin cá nhân</h3>
                <InputField id="fullname" label="Họ tên" value={user?.full_name || ''} />

                <DatePicker id="dob" label="Ngày sinh" selectedDate={dob} onDateChange={setDob} />
                <InputField id="mobile" label="Điện thoại" value={user?.mobile || ""} type="tel" />
                <div className="space-y-2">
                    <Label className="font-medium text-13px text-gray-600">Giới tính</Label>
                    <RadioGroup defaultValue="male" className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Nam</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Nữ</Label>
                        </div>
                    </RadioGroup>
                </div>

                <Button type="submit" className="bg-custom-red hover:bg-red-600 text-white">
                    Cập nhật
                </Button>
            </form>

            <div className="w-full lg:w-64">
                <CardContent className="flex flex-col items-center ">
                    <div className="border border-dashed border-male-blue mb-4 ">
                        <Avatar className="w-32 h-32 ">
                            <AvatarImage src="/placeholder-avatar.png" alt="Avatar" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <Button variant="secondary" className="bg-custom-red hover:bg-red-600 text-white" size="sm">Upload hình</Button>
                </CardContent>
            </div>
        </div>
    );
}
