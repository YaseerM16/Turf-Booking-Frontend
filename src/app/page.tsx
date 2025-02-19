"use client"
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { getSubcriptionPlans } from "@/services/userApi";
import Swal from "sweetalert2";
import { SubscriptionPlans } from "@/components/SubscriptionSwiper";
import { SubscriptionPlan } from "@/utils/type";

export default function Home() {
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  const plansPerPage = 6

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      localStorage.removeItem("auth");
    }
  }, []); // This runs only on the client side
  const fetchPlans = useCallback(async () => {

    try {
      const response = await getSubcriptionPlans(1, plansPerPage)
      if (response.success) {
        const { data } = response
        console.log("THsi are all the PLANs toTAL :", data.plans.totalPlans);
        setPlans(data.plans.plans);
        // setTotalPlans(prev => (prev !== Math.ceil(data.plans.totalPlans / plansPerPage) ? Math.ceil(data.plans.totalPlans / plansPerPage) : prev));
      }
    } catch (err: unknown) {
      console.log("THIs is the FetchPlans err :", err);
      if (err instanceof Error) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Error!",
          text: err?.message || "Something went wrong. Please try again.",
          showConfirmButton: true,
          confirmButtonText: "OK",
          timer: 3000,
          toast: true,
        });
      }
    }
  }, [])
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />

      {/* Hero Section */}
      <section
        className="h-64 bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: `url('/turf-background-image.jpg')` }}
      >
        <h2 className="text-3xl font-bold text-white bg-black bg-opacity-50 p-4 rounded-lg">
          Book Your Favorite Turf Now!
        </h2>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8 text-center">
          {[
            { title: "Last Minute Deals", description: "Special discounts on late bookings" },
            { title: "Early Bird Offers", description: "Save on advanced reservations" },
            { title: "Free Cancellation", description: "Cancel for free within 24 hours" },
            { title: "Priority Access", description: "Get the best slots instantly" },
          ].map((feature, index) => (
            <div key={index} className="space-y-2">
              <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex justify-center items-center">
                <span className="text-green-700 font-bold text-lg">{index + 1}</span>
              </div>
              <h3 className="font-bold text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Turfs Section */}
      <section className="py-12 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Featured Turfs</h3>
          <div className="grid grid-cols-4 gap-6">
            {["Koval Arena", "Nut Meg", "Koval Arena", "Nut Meg"].map((turf, index) => (
              <div key={index} className="shadow-lg rounded-lg overflow-hidden bg-white">
                <Image
                  src={`/logo.jpeg`}
                  alt={turf}
                  width={500} // Replace with actual width
                  height={200} // Replace with actual height
                  className="h-32 w-full object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800">{turf}</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/turfs" className="text-green-700 font-semibold hover:underline">
              Search more...
            </Link>
          </div>
        </div>
      </section>

      <SubscriptionPlans plans={plans} />


      {/* Footer */}
      {/* import Link from "next/link"; */}

      <footer className="bg-green-700 text-white py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-4">Turf Book</h4>
            <p className="text-sm">Book your favorite turfs with ease and convenience.</p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/press" className="hover:underline">Press</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Connect with us</h4>
            <div className="flex space-x-4">
              <Link href="/facebook" className="hover:underline">Facebook</Link>
              <Link href="/instagram" className="hover:underline">Instagram</Link>
              <Link href="/twitter" className="hover:underline">Twitter</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
