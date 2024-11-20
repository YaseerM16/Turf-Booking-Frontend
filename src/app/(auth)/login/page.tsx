import AuthNavbar from "@/components/AuthNavbar";
import LoginForm from "@/components/user/LoginForm";
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