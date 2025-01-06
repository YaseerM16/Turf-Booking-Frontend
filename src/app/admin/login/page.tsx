import AdminLoginForm from "@/components/admin/LoginForm";
import AuthNavbar from "@/components/user-auth/AuthNavbar";

export default function Login() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <AdminLoginForm />
        </div>
    );
}