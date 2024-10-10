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
import { useAuthStore } from "@/lib/store/auth";
import { createAxiosInstance } from "@/utils/axiosInstance";

// Schema validation for login
const LoginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
  password: z.string().min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." }),
});

interface ILoginForm {
  handleCloseAuthModal: () => void;
}
export const LoginForm: React.FC<ILoginForm> = ({ handleCloseAuthModal }) => {
  const axiosInstance = createAxiosInstance();
  const { setUser } = useAuthStore();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data_: z.infer<typeof LoginSchema>) {
    console.log("onSubmit", data_);
    // const response = await axios.post("/api/login", formData);
    // const response = await axiosInstance.post(`/api/users/login`, data_);
    // console.log("response", response);

    // const { data } = response;
    // if (data?.message === "Success") {
    //   console.log("data1231231231", data);
    // }

    // setUser({
    //     id: 10, username: 'vuha',
    //     email: data_.email,
    //     full_name: "Vu ha"
    // })
    // handleCloseAuthModal();
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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

        <Button
          type='submit'
          className='w-full bg-red-500 hover:bg-red-600 text-white'
        >
          Đăng nhập
        </Button>
      </form>
    </Form>
  );
};
