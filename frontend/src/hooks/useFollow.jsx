import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from 'react-hot-toast';
const useFollow = () => {
    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: 'POST',
                })

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw new Error(error.message)
            }
        },
        onSuccess: () => {
            Promise.all([ //we have to add them in promise so they will run all well
                queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] }),
                queryClient.invalidateQueries({ queryKey: ['authUser'] }) //this line to make follow unFollow from users profile so we need to fetch authorize user right
            ]);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return { follow, isPending}
}

export default useFollow