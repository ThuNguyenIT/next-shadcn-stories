import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import InputField from '@/components/form-control/input-field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useEffect, useState } from 'react';
import DatePicker from '@/components/form-control/date-picker';
import { useAuthStore } from '@/lib';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { format } from 'date-fns';


const RegisterSchema = z
    .object({
        full_name: z.string().optional(),

        mobile: z
            .string()
            .optional()
            .refine((val) => !val || /^[0-9]{10}$/.test(val), {
                message: "Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.",
            }),
        birthday: z.string().optional(),
    });
export default function AccountForm() {
    const { user, setUser } = useAuthStore();
    const axiosInstance = createAxiosInstance();
    const [isUpdated, setIsUpdated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);


    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            full_name: user?.full_name || "",
            mobile: user?.mobile || "",
            birthday: user?.birthday ? format(new Date(user.birthday), 'dd/MM/yyyy') : "",
        },
    });

    useEffect(() => {
        const subscription = form.watch((values) => {
            // Check if any values differ from default values to enable the button
            setIsUpdated(
                values.full_name !== user?.full_name || values.mobile !== user?.mobile || values.birthday !== user?.birthday
            );
        });
        return () => subscription.unsubscribe();
    }, [form, user]);


    async function onSubmit(data_: z.infer<typeof RegisterSchema>) {

        const response = await axiosInstance.put(`/api/users`, { ...data_, id: user?.id });
        const { data } = response;
        if (data?.message === "Success") {
            setUser(data.user)
        }
    }
    return (
        <div className="flex max-w-4xl mx-auto gap-6 flex-col lg:flex-row">
            {isMounted && (<Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 flex-grow">
                    <InputField id="username" label="Tên tài khoản" value={user?.username || ''} readOnly />
                    <InputField id="email" label="Email" value={user?.email || ''} type="email" readOnly />


                    <h3 className="text-lg font-semibold mt-6 mb-4">Thông tin cá nhân</h3>
                    <FormField
                        control={form.control}
                        name='full_name'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder='Nhập họ tên' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="birthday"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Controller
                                        control={form.control}
                                        name="birthday"
                                        render={({ field }) => (
                                            <DatePicker
                                                id="dob"
                                                label="Ngày sinh"
                                                selectedDate={field.value ? new Date(field.value) : undefined} // Convert to Date
                                                onDateChange={(date) => field.onChange(date ? date.toISOString() : undefined)} // Convert to ISO string or undefined
                                            />
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='mobile'
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder='Điện thoại' type="tel" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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

                    <Button type="submit" disabled={!isUpdated} className="bg-custom-red hover:bg-red-600 text-white">
                        Cập nhật
                    </Button>
                </form>
            </Form>)}

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
