import CompanyRegister from "@/components/company/register/CompanyRegister";
import LoginForm from "@/components/user-auth/LoginForm";
// import LoginPage from "@/components/user/LoginForm";

LoginForm


export default function Register() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <CompanyRegister />
        </div>
    );
}