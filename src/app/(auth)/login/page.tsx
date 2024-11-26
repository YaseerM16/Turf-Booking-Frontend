import AuthNavbar from "@/components/user-auth/AuthNavbar";
import LoginForm from "@/components/user-auth/LoginForm";
// import LoginPage from "@/components/user/LoginForm";
LoginForm

export default function Login() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <LoginForm />
        </div>
    );
}