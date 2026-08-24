import axios from "axios";
import Comment from "./Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import TextSkeleton from "./TextSkeleton";

const fetchComments = async (trackId) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/comments/${trackId}`
  );
  return res.data;
};

const Comments = ({ trackId }) => {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", trackId],
    queryFn: () => fetchComments(trackId),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComment) => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${trackId}`,
        newComment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", trackId] });
      toast.success("Comment tracked");
    },
    onError: (error) => {
      toast.error(error.response.data);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      toast.info("Please login to comment.");
      return;
    }
    const formData = new FormData(e.target);

    const data = {
      desc: formData.get("desc")?.trim(),
    };

    if (!data.desc) {
      toast.info("Upload a comment first.");
      return;
    }

    mutation.mutate(data);
    e.target.reset();
  };

  return (
    <section className="mt-12 flex flex-col gap-6 border-t border-slate-200 pt-8 dark:border-slate-800">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Comments
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isSignedIn ? "Join the conversation." : "Sign in to add your comment."}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200/70 bg-white/85 p-4 shadow-card dark:border-slate-800 dark:bg-slate-900/75 sm:flex-row sm:items-end"
      >
        <textarea
          name="desc"
          placeholder="Upload a comment..."
          className="min-h-24 w-full resize-y rounded-xl border border-slate-200 bg-white/80 p-3 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-900/40 dark:disabled:bg-slate-900"
          disabled={!isSignedIn}
        />
        <button
          className="rounded-xl bg-brand-700 px-5 py-3 font-medium text-white shadow-soft transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-brand-300 sm:w-28"
          disabled={!isSignedIn}
        >
          {mutation.isPending ? "Sending" : "Send"}
        </button>
      </form>
      {isPending ? (
        <div className="w-full rounded-2xl border border-slate-200/70 p-4 dark:border-slate-800">
          <TextSkeleton lines={4} />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          Error loading comments.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {mutation.isPending && user && (
            <Comment
              comment={{
                desc: `${mutation.variables.desc} (Sending...)`,
                createdAt: new Date(),
                user: {
                  img: user.imageUrl,
                  username: user.username,
                },
              }}
            />
          )}

          {data?.length ? (
            data.map((comment) => (
              <Comment key={comment._id} comment={comment} trackId={trackId} />
            ))
          ) : (
            <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
              No comments yet.
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Comments;
