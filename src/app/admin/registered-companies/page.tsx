import AdminDashboard from "@/components/admin/AdminDashboard";
import RegisteredCompanies from "@/components/admin/RegisteredCompany";



export default function Login() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* <AuthNavbar /> */}
            <RegisteredCompanies />
        </div>
    );
}