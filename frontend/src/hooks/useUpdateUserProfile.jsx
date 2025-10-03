import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    //fetch userProfile
    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (formData) => {
            const res = await fetch(`/api/users/update`, {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            let data;
            try {
                data = await res.json();
            } catch (e) {
                throw new Error("Server returned an invalid response");
            }
            if (!res.ok) {
                throw new Error(data.error || "Something went wrong");
            }
            return data;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
    return { updateProfile, isUpdatingProfile };
}

export default useUpdateUserProfile