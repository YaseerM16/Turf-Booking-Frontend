"use client"
export const dynamic = "error";  // ✅ Prevents pre-rendering

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { getSubcriptionPlans, getTopTurfs, getTurfsApi } from "@/services/userApi";
import Swal from "sweetalert2";
import { SubscriptionPlans } from "@/components/SubscriptionSwiper";
import { SubscriptionPlan, TurfDetails } from "@/utils/type";
import FireLoading from "@/components/FireLoading";
import HomeMapComponent from "@/components/HomeTurfsMap";
import { useRouter } from "next/navigation";

interface Turf {
  turfId: string;
  totalEarnings: number;
  turfName: string;
  price: number;
  images: string[];
  turfSize: string;
  turfType: string;
  workingSlots: {
    fromTime: string;
    toTime: string;
    workingDays: { day: string; fromTime: string; toTime: string; price: number }[];
  };
}


export default function Home() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loadPlans, setLoadPlans] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [turfs, setTurfs] = useState<TurfDetails[] | null>([])
  const [topTurfs, setTopTurfs] = useState<Turf[] | null>([])
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      localStorage.removeItem("auth");
    }
  }, []); // This runs only on the client side

  const fetchPlans = useCallback(async () => {
    try {
      setLoadPlans(true)
      const response = await getSubcriptionPlans()
      if (response.success) {
        const { data } = response
        console.log("THsi are all the PLANs toTAL :", data.plans.totalPlans);
        setPlans(data.plans.plans);
        setLoadPlans(false)
      }
    } catch (err: unknown) {
      console.log("THIs is the FetchPlans err :", err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: (err as Error)?.message || "Something went wrong. Please try again.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoadPlans(false)
    }
  }, []);

  const fetchTurfs = useCallback(async () => {
    try {
      // setLoading(true);

      const response = await getTurfsApi(undefined)

      if (response?.success) {
        const { data } = response
        setTurfs(prev => (JSON.stringify(prev) !== JSON.stringify(data.turfs) ? data.turfs : prev));
        setLoading(false)
      }

    } catch (err) {
      console.error("Error fetching user data:", err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: (err as Error)?.message || "Something went wrong. Please try again.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        timer: 3000,
        toast: true,
      });
    } finally {
      // setLoading(false)
    }
  }, []);

  // console.log("Turfs in HOme :", turfs);
  const fetchTopTurfs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getTopTurfs()

      if (response?.success) {
        const { data } = response
        console.log("DATA From the TIOP Turf :", data);
        setTopTurfs(data.turfs)
        setLoading(false)
      }

    } catch (err) {
      console.log("Error fetching user data:", err);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Error!",
        text: (err as Error)?.message || "Something went wrong. Please try again.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        timer: 3000,
        toast: true,
      });
    } finally {
      setLoading(false)
    }
  }, []);

  // console.log("Turfs in HOme :", turfs);

  useEffect(() => {
    fetchPlans();
    fetchTurfs();
    fetchTopTurfs();
  }, [fetchPlans, fetchTurfs, fetchTopTurfs]);

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

      <HomeMapComponent turfs={turfs || []} />

      {/* Featured Turfs Section */}
      <section className="py-12 bg-green-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Turfs</h3>
          {loading ? <FireLoading renders="Featured Turfs" /> :
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {topTurfs?.map((turf) => (
                <div
                  key={turf.turfId}
                  className="shadow-lg rounded-lg overflow-hidden bg-white hover:scale-105 transition-transform duration-300 ease-in-out"
                  onClick={() => router.push(`/turfs/${turf.turfId}`)}
                >
                  <Image
                    src={turf.images.length > 0 ? turf.images[0] : "/placeholder.jpg"}
                    alt={turf.turfName}
                    width={500}
                    height={250}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-gray-900">{turf.turfName}</h4>
                    <p className="text-gray-600 text-sm">{turf.turfSize} | {turf.turfType} Type</p>
                    <div className="mt-3 text-green-600 font-semibold text-sm">
                      ₹{turf.price.toLocaleString()} /hr
                    </div>
                    <div className="mt-2 text-gray-500 text-xs">
                      Open: {turf.workingSlots.fromTime} - {turf.workingSlots.toTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }

          <div className="text-center mt-8">
            <Link href="/turfs" className="text-green-700 font-semibold hover:underline text-lg">
              Discover More Turfs →
            </Link>
          </div>
        </div>
      </section>

      <div className="py-5">
        <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
        {loadPlans ?
          <FireLoading renders="Fetching Subscriptions" />
          :
          <SubscriptionPlans plans={plans} />
        }
      </div>



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
