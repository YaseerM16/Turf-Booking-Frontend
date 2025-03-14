import ForgotPassword from "@/components/company/ForgotPassword";
import AuthNavbar from "@/components/user-auth/AuthNavbar";


export default function Register() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <ForgotPassword />
        </div>
    );
}