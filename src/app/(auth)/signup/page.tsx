import AuthNavbar from "@/components/user-auth/AuthNavbar";
import Register from "@/components/user-auth/Register";


export default function Signup() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <Register />
        </div>
    );
}