import AuthNavbar from "@/components/user-auth/AuthNavbar";
import EmailVerification from "@/components/user-auth/VerifyEmail";


export default function VerifyMail() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <EmailVerification />
        </div>
    );
}