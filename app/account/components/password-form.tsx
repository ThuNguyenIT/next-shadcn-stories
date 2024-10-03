import { Button } from '@/components/ui/button';
import InputField from '@/components/form-control/input-field';

export default function PasswordForm() {
    return (
        <div className="flex flex-col lg:flex-row max-w-4xl mx-auto gap-6">

            <form className="space-y-4 flex-grow">
                <InputField id="current-password" label="Mật khẩu hiện tại" value="" type="password" />
                <InputField id="new-password" label="Mật khẩu mới" value="" type="password" />
                <InputField id="confirm-password" label="Xác nhận mật khẩu mới" value="" type="password" />

                <Button type="submit" className="bg-custom-red hover:bg-red-600 text-white">
                    Đổi mật khẩu
                </Button>
            </form>
            <div className="w-64"></div>
        </div>
    );
}
