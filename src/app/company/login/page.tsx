import CompanyLoginForm from "@/components/company/CompanyLogin";
import AuthNavbar from "@/components/user-auth/AuthNavbar";


export default function CompanyLogin() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <CompanyLoginForm />
        </div>
    );
}