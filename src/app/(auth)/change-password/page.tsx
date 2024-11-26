import AuthNavbar from "@/components/user-auth/AuthNavbar";
import UpdatePassword from "@/components/user-auth/UpdatePassword";


export default function Login() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <UpdatePassword />
        </div>
    );
}