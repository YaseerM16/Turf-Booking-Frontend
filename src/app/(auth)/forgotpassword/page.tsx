import AuthNavbar from "@/components/user-auth/AuthNavbar";
import ForgotPassword from "@/components/user-auth/ForgotPassword";

export default function Forgotpassword() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <ForgotPassword />
        </div>
    );
}