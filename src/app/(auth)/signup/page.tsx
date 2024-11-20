import AuthNavbar from "@/components/AuthNavbar";
import Register from "@/components/signup/Register";


export default function Signup() {

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <AuthNavbar />
            <Register />
        </div>
    );
}