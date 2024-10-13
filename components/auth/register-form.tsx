import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createAxiosInstance } from "@/utils/axiosInstance";

// Schema validation for register
const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Tên người dùng phải có ít nhất 6 ký tự." })
      .max(20, { message: "Tên người dùng không được vượt quá 20 ký tự." })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Tên người dùng chỉ được chứa chữ, số và dấu gạch dưới.",
      }),
    email: z.string().email({ message: "Email không hợp lệ." }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
      .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất một ký tự thường." })
      // .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất một ký tự hoa." })
      .regex(/\d/, { message: "Mật khẩu phải có ít nhất một chữ số." })
    // .regex(/[@$!%*?&#]/, {
    //   message: "Mật khẩu phải có ít nhất một ký tự đặc biệt.",
    // })
    ,
    confirmPassword: z
      .string()
      .min(8, { message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  });
interface IRegisterForm {
  setActiveTab: (tab: string) => void;
}
export const RegisterForm: React.FC<IRegisterForm> = ({ setActiveTab }) => {
  const axiosInstance = createAxiosInstance();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data_: z.infer<typeof RegisterSchema>) {
    const response = await axiosInstance.post(`/api/users/register`, data_);
    const { data } = response;
    if (data?.message === "Success") {
      setActiveTab("login");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder='Nhập username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='email' placeholder='Nhập Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type='password' placeholder='Nhập mật khẩu' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Nhập lại mật khẩu'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full bg-red-500 hover:bg-red-600 text-white'
        >
          Đăng ký
        </Button>
      </form>
    </Form>
  );
};
