import AuthNavbar from "@/components/user-auth/AuthNavbar";
import OtpForm from "@/components/OtpForm";


export default function Signup() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <OtpForm />
        </div>
    );
}