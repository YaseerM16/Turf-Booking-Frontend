import UpdatePassword from "@/components/company/UpdatePassword";
import AuthNavbar from "@/components/user-auth/AuthNavbar";

export default function ChangePassword() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <UpdatePassword />
        </div>
    );
}