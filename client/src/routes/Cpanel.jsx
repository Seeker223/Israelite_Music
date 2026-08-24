import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const fetchGenres = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const fetchTracks = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/posts?page=1&limit=50`
  );
  return res.data?.posts || [];
};

const Cpanel = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const {
    isPending: categoriesPending,
    error: categoriesError,
    data: categories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchGenres,
  });

  const {
    isPending: tracksPending,
    error: tracksError,
    data: tracks,
  } = useQuery({
    queryKey: ["cpanelTracks"],
    queryFn: fetchTracks,
    enabled: isAdmin,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Genre created");
      setNewCategory("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to create category");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name }) => {
      const token = await getToken();
      return axios.put(
        `${import.meta.env.VITE_API_URL}/categories/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Genre updated");
      setEditingCategoryId(null);
      setEditingCategoryName("");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to update category");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Genre deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete category");
    },
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Track deleted");
      queryClient.invalidateQueries({ queryKey: ["cpanelTracks"] });
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete track");
    },
  });

  if (!isLoaded) {
    return <div className="text-slate-600 dark:text-slate-300">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        You should login!
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        Only admins can access the control panel.
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Music Studio
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage tracks and genres.
        </p>
      </div>

      <section className="bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-5 shadow-card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Genres
          </h2>
          <div className="flex items-center gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New genre name"
              className="px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm"
              type="text"
            />
            <button
              onClick={() => createCategoryMutation.mutate()}
              disabled={
                createCategoryMutation.isPending || !newCategory.trim()
              }
              className="px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-medium shadow-soft disabled:bg-brand-300"
              type="button"
            >
              {createCategoryMutation.isPending ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div className="mt-4">
          {categoriesPending ? (
            <div className="text-slate-600 dark:text-slate-300">Loading...</div>
          ) : categoriesError ? (
            <div className="text-slate-600 dark:text-slate-300">
              Failed to load categories.
            </div>
          ) : !categories?.length ? (
            <div className="text-slate-600 dark:text-slate-300">
              No categories yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const isEditing = editingCategoryId === cat._id;
                return (
                  <div
                    key={cat._id}
                    className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 p-4"
                  >
                    {isEditing ? (
                      <input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/90 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-sm"
                        type="text"
                      />
                    ) : (
                      <>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {cat.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {cat.slug}
                        </div>
                      </>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() =>
                              updateCategoryMutation.mutate({
                                id: cat._id,
                                name: editingCategoryName,
                              })
                            }
                            disabled={
                              updateCategoryMutation.isPending ||
                              !editingCategoryName.trim()
                            }
                            className="px-3 py-1.5 rounded-xl bg-brand-700 text-white text-xs font-medium shadow-soft disabled:bg-brand-300"
                            type="button"
                          >
                            {updateCategoryMutation.isPending
                              ? "Saving..."
                              : "Save"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategoryId(null);
                              setEditingCategoryName("");
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                            type="button"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingCategoryId(cat._id);
                              setEditingCategoryName(cat.name);
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategoryMutation.mutate(cat._id)}
                            disabled={deleteCategoryMutation.isPending}
                            className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-xs"
                            type="button"
                          >
                            {deleteCategoryMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-5 shadow-card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Tracks
          </h2>
          <Link
            to="/write"
            className="px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-medium shadow-soft hover:bg-brand-800 transition"
          >
            New Track
          </Link>
        </div>

        <div className="mt-4">
          {tracksPending ? (
            <div className="text-slate-600 dark:text-slate-300">Loading...</div>
          ) : tracksError ? (
            <div className="text-slate-600 dark:text-slate-300">
              Failed to load tracks.
            </div>
          ) : !tracks?.length ? (
            <div className="text-slate-600 dark:text-slate-300">
              No tracks yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tracks.map((track) => (
                <div
                  key={track._id}
                  className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 p-4 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {track.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {track.category} • {track.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/${track.slug}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                    >
                      View
                    </Link>
                    <Link
                      to={`/cpanel/tracks/${track._id}/edit`}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteTrackMutation.mutate(track._id)}
                      disabled={deleteTrackMutation.isPending}
                      className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 text-xs"
                      type="button"
                    >
                      {deleteTrackMutation.isPending ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cpanel;
