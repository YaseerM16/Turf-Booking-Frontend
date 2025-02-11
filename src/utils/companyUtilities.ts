import Swal from "sweetalert2";
// import { axiosInstance } from "./constants";
import { toast } from "react-toastify";
import { axiosInstance } from "@/services/companyApi";
import { makeSlotAvailableUrl, makeSlotUnAvailableUrl } from "@/services/SlotApis";


export const handleSlotAvailability = async (
    action: "available" | "unavailable",
    slotId: string,
    day: string,
    turfId: string | undefined,
    fetchSlotsByDay: (turfId: string, day: string, additionalParam: string) => void,
    setSpinLoading: (value: boolean) => void,
    setSelectedSlot: (value: null) => void
) => {
    try {
        const actionText = action === "available" ? "Mark as Available" : "Mark as Unavailable";
        const apiUrl =
            action === "available"
                ? makeSlotAvailableUrl(slotId, turfId as string)
                : makeSlotUnAvailableUrl(slotId, turfId as string)

        Swal.fire({
            title: `Are you sure?`,
            text: `Do you want to ${actionText}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed!",
            cancelButtonText: "No, cancel!",
            toast: true,
            position: "top-end",
            timer: 3000,
            timerProgressBar: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setSpinLoading(true);
                const { data } = await axiosInstance.get(apiUrl);
                // console.log("Whole response :", response);

                if (data?.success) {
                    // const { data } = data
                    const { updatedSlot } = data.data.updatedSlot
                    setSpinLoading(false);
                    setSelectedSlot(null);
                    // console.log("Response Data BY the AvailabilityChange ::- ", updatedSlot?.date);
                    fetchSlotsByDay(turfId as string, day, updatedSlot?.date);
                    toast.success(
                        `Slot ${action === "available" ? "Marked as Available" : "Marked as Unavailable"} successfully ✅`,
                        { onClick: () => setSpinLoading(false) }
                    );
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "info",
                    title: "Action canceled.",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    } catch (error) {
        console.error(`Error handling slot availability:`, error);
    } finally {
        setSpinLoading(false);
    }
};
