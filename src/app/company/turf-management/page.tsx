import TurfManagement from "@/components/company/management/TurfManagement";
import CompanyRegister from "@/components/company/register/CompanyRegister";
import TurfRegister from "@/components/company/register/TurfRegister";
import AuthNavbar from "@/components/user-auth/AuthNavbar";




export default function Register() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TurfManagement />
        </div>
    );
}