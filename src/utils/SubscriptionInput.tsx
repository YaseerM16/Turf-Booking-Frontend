import { FieldValues, UseFormRegister, FieldErrors, UseFormSetValue, UseFormTrigger, FieldError, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
    label: string;
    name: Path<T>; // Ensure `name` is a valid key of T
    type?: string;
    defaultValue?: string | number;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    setValue?: UseFormSetValue<T>;
    validation?: object;
    trigger?: UseFormTrigger<T>;
}

// ✅ Define the component using generics
export const InputField = <T extends FieldValues>({
    label,
    name,
    type = "text",
    defaultValue = "",
    register,
    errors,
    setValue,
    validation = {},
    trigger
}: InputFieldProps<T>) => {
    return (
        <div className="flex flex-col">
            <label className="font-medium mb-1">{label}</label>
            <input
                type={type}
                defaultValue={defaultValue}
                {...register(name, validation)}
                onChange={(e) => {
                    if (setValue) {
                        setValue(name, e.target.value as T[typeof name]); // Ensure controlled input
                    }
                    if (trigger) {
                        trigger(name); // ✅ Trigger validation on change
                    }
                }}
                className="w-full border p-2 rounded-md"
            />
            {errors[name] && <p className="text-red-500 text-sm">{(errors[name] as FieldError).message}</p>}
        </div>
    );
};
