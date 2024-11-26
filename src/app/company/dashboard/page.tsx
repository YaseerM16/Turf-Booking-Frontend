import CompanyDashboard from "@/components/company/CompanyDashboard";
import Header from "@/components/company/CompanyHeader";
import AuthNavbar from "@/components/user-auth/AuthNavbar";


export default function Register() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <CompanyDashboard />
        </div>
    );
}