import AuthNavbar from "@/components/AuthNavbar";
import EmailVerification from "@/components/user/VerifyEmail";


export default function VerifyMail() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <EmailVerification />
        </div>
    );
}