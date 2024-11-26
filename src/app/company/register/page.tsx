import CompanyRegister from "@/components/company/register/CompanyRegister";
import AuthNavbar from "@/components/user-auth/AuthNavbar";
// import LoginPage from "@/components/user/LoginForm";



export default function Register() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <CompanyRegister />
        </div>
    );
}