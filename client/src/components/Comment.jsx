import { format } from "timeago.js";
import Image from "./Image";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const Comment = ({ comment, trackId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const role = user?.publicMetadata?.role;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.delete(
        `${import.meta.env.VITE_API_URL}/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", trackId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/75">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {comment.user?.img ? (
          <Image
            src={comment.user.img}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100"
            w="40"
            h="40"
            alt={comment.user?.username || "Comment author"}
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 ring-2 ring-brand-100 dark:bg-slate-800 dark:text-brand-300 dark:ring-slate-700">
            {(comment.user?.username || "?").slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {comment.user?.username || "User"}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {format(comment.createdAt)}
        </span>
        {user &&
          (comment.user?.username === user.username || role === "admin") && (
            <button
              type="button"
              className="text-xs font-medium text-red-500 transition hover:text-red-600 disabled:cursor-not-allowed disabled:text-red-300"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              delete
              {mutation.isPending && <span>...</span>}
            </button>
          )}
      </div>
      <div className="mt-4">
        <p className="leading-7 text-slate-700 dark:text-slate-300">
          {comment.desc}
        </p>
      </div>
    </div>
  );
};

export default Comment;
