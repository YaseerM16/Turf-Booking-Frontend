import { InputField } from "@/utils/SubscriptionInput";
import { SubscriptionFormData, SubscriptionPlan } from "./SubcriptionManagement";
import { useEffect } from "react";
import Spinner from "@/components/Spinner";
import { useForm } from "react-hook-form";
// interface SubscriptionFormData {
//     name: string;
//     price: number;
//     duration: string;
//     features: string[];
//     isActive: boolean;

// }

interface AddSubscriptionModalProps {
    onClose: () => void;
    onSubmit: (data: SubscriptionFormData) => Promise<void>;
    load: boolean;
}

interface EditSubscriptionModalProps {
    plan: SubscriptionPlan | null;
    onClose: () => void;
    onSubmit: (plan: SubscriptionFormData, planId: string) => Promise<void>;
    load: boolean;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onClose, onSubmit, load }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<SubscriptionFormData>({
        mode: "onChange",
        defaultValues: {
            name: "",
            price: 500, // Minimum price
            discount: 0, // Default discount is 0%
            duration: undefined,
            features: "", // Store as a string initially
            isActive: true,
        },
    });

    const handleFormSubmit = (data: SubscriptionFormData) => {
        const trimmedFeatures = data.features.trim();

        if (trimmedFeatures.length < 5) {
            alert("Features must be at least 5 characters long.");
            return;
        }

        onSubmit({ ...data, features: trimmedFeatures });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
                <h3 className="text-2xl font-semibold mb-4">Add Subscription Plan</h3>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Plan Name */}
                    <InputField
                        label="Plan Name"
                        name="name"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{ required: "Plan name is required", minLength: { value: 5, message: "Plan name must be at least 5 characters long" } }}
                        trigger={trigger}
                    />

                    {/* Price Input */}
                    <InputField
                        label="Price (₹)"
                        name="price"
                        type="number"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{ required: "Price is required", min: { value: 500, message: "Price must be at least ₹500" } }}
                        trigger={trigger}
                    />

                    {/* Discount Input */}
                    <InputField
                        label="Discount (%)"
                        name="discount"
                        type="number"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{
                            required: "Discount is required",
                            min: { value: 5, message: "Discount cannot be less than 5%" },
                            max: { value: 100, message: "Discount cannot be more than 100%" }
                        }}
                        trigger={trigger}
                    />

                    {/* Duration Select Dropdown */}
                    <div>
                        <label className="block font-medium mb-1">Duration</label>
                        <select
                            {...register("duration", { required: "Please select a duration" })}
                            className="w-full border p-2 rounded-md"
                            defaultValue=""
                        >
                            <option value="" disabled>Select Duration</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                    </div>

                    {/* Features Input */}
                    <InputField
                        label="Features (Comma-separated)"
                        name="features"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        defaultValue={watch("features") || ""}
                        validation={{ required: "At least one feature is required", minLength: { value: 5, message: "Features must be at least 5 characters long" } }}
                        trigger={trigger}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            Close
                        </button>
                        {load ? <Spinner /> : <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Submit
                        </button>}
                    </div>
                </form>
            </div>
        </div>
    );
};








export const EditSubscriptionModal: React.FC<EditSubscriptionModalProps> = ({ onClose, onSubmit, plan, load }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<SubscriptionPlan>({
        defaultValues: {
            name: plan?.name || "",
            price: plan?.price || 500,
            duration: plan?.duration || undefined,
            features: plan?.features || "",
            isActive: plan?.isActive ?? true,
            discount: plan?.discount || 0
        },
    });

    // Set default values when modal opens
    useEffect(() => {
        if (plan) {
            setValue("name", plan.name);
            setValue("price", plan.price);
            setValue("duration", plan?.duration);
            setValue("features", plan.features);
            setValue("isActive", plan.isActive);
            setValue("discount", plan.discount);
        }
    }, [plan, setValue]);

    const handleFormSubmit = (data: SubscriptionFormData) => {
        const trimmedFeatures = data.features.trim();

        if (trimmedFeatures.length < 5) {
            alert("Features must be at least 5 characters long.");
            return;
        }

        onSubmit(data, plan?._id as string);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-[400px]">
                <h3 className="text-2xl font-semibold mb-4">Edit Subscription Plan</h3>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* Plan Name */}
                    <InputField
                        label="Plan Name"
                        name="name"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{ required: "Plan name is required", minLength: { value: 5, message: "Plan name must be at least 5 characters long" } }}
                        trigger={trigger}
                    />

                    {/* Price Input */}
                    <InputField
                        label="Price (₹)"
                        name="price"
                        type="number"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{ required: "Price is required", min: { value: 500, message: "Price must be at least ₹500" } }}
                        trigger={trigger}
                    />

                    {/* Discount Input */}
                    <InputField
                        label="Discount (%)"
                        name="discount"
                        type="number"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        validation={{
                            required: "Discount is required",
                            min: { value: 0, message: "Discount cannot be less than 0%" },
                            max: { value: 100, message: "Discount cannot be more than 100%" }
                        }}
                        trigger={trigger}
                    />

                    {/* Duration Select Dropdown */}
                    <div>
                        <label className="block font-medium mb-1">Duration</label>
                        <select
                            {...register("duration", { required: "Please select a duration" })}
                            className="w-full border p-2 rounded-md"
                            defaultValue={plan?.duration}
                        >
                            <option value="" disabled>Select Duration</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                        {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
                    </div>

                    {/* Features Input */}
                    <InputField
                        label="Features (Comma-separated)"
                        name="features"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        defaultValue={watch("features") || ""}
                        validation={{ required: "At least one feature is required", minLength: { value: 5, message: "Features must be at least 5 characters long" } }}
                        trigger={trigger}
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                        >
                            Close
                        </button>
                        {load ? <Spinner /> : <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Update
                        </button>}
                    </div>
                </form>
            </div>
        </div>
    );
};




