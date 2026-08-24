import { useAuth, useUser } from "@clerk/clerk-react";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const fetchGenres = async () => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
  return res.data;
};

const Upload = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [value, setValue] = useState("");
  const [cover, setCover] = useState("");
  const [img, setImg] = useState("");
  const [video, setVideo] = useState("");
  const [progress, setProgress] = useState(0);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchGenres,
  });

  useEffect(() => {
    img && setValue((prev) => prev + `<p><img src="${img.url}"/></p>`);
  }, [img]);

  useEffect(() => {
    video &&
      setValue(
        (prev) => prev + `<p><iframe class="ql-video" src="${video.url}"/></p>`
      );
  }, [video]);

  const navigate = useNavigate();

  const { getToken } = useAuth();

  const mutation = useMutation({
    mutationFn: async (newTrack) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newTrack, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: (res) => {
      toast.success("Track has been uploaded");
      navigate(`/${res.data.slug}`);
    },
  });

  if (!isLoaded) {
    return <div className="text-slate-600 dark:text-slate-300">Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <div className="text-slate-600 dark:text-slate-300">You should login!</div>;
  }

  if (isLoaded && isSignedIn && !isAdmin) {
    return (
      <div className="text-slate-600 dark:text-slate-300">
        Only admins can upload music.
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      img: cover.filePath || "",
      title: formData.get("title"),
      category: formData.get("category"),
      desc: formData.get("desc"),
      content: value,
    };

    if (!data.title || !data.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    console.log(data);

    mutation.mutate(data);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Upload a New Track</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 mb-6">
        <Upload type="image" setProgress={setProgress} setData={setCover}>
          <button className="w-max p-2 shadow-card rounded-xl text-sm text-slate-600 dark:text-slate-200 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 hover:bg-brand-50 dark:hover:bg-slate-800 transition">
            Add a cover image
          </button>
        </Upload>
        <input
          className="text-3xl md:text-4xl font-semibold bg-transparent outline-none text-slate-900 dark:text-slate-100"
          type="text"
          placeholder="My Awesome Song"
          name="title"
          required
        />
        <div className="flex items-center gap-4">
            <label htmlFor="" className="text-sm text-slate-700 dark:text-slate-300">
            Choose a genre:
          </label>
          <select
            name="category"
            id=""
            className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card"
          >
            {Array.isArray(categories) && categories.length ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))
            ) : (
              <>
                <option value="general">General</option>
                <option value="web-design">Gospel</option>
                <option value="development">Worship</option>
                <option value="databases">Praise</option>
                <option value="seo">Afrobeat</option>
                <option value="marketing">Inspirational</option>
              </>
            )}
          </select>
        </div>
        <textarea
          className="p-4 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card text-slate-800 dark:text-slate-100"
          name="desc"
          placeholder="A Short Description"
        />
        <div className="flex flex-1 ">
          <div className="flex flex-col gap-2 mr-2">
            <Upload type="image" setProgress={setProgress} setData={setImg}>
              <span className="px-3 py-2 text-sm rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card hover:bg-brand-50 dark:hover:bg-slate-800 transition">
                Image
              </span>
            </Upload>
            <Upload type="video" setProgress={setProgress} setData={setVideo}>
              <span className="px-3 py-2 text-sm rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card hover:bg-brand-50 dark:hover:bg-slate-800 transition">
                Video
              </span>
            </Upload>
          </div>
          <ReactQuill
            theme="snow"
            className="flex-1 rounded-xl bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 shadow-card"
            value={value}
            onChange={setValue}
            readOnly={0 < progress && progress < 100}
          />
        </div>
        <button
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className="bg-brand-700 text-white font-medium rounded-xl mt-4 p-3 w-full sm:w-44 sm:self-start shadow-soft hover:bg-brand-800 disabled:bg-brand-300 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Loading..." : "Send"}
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">{"Progress:" + progress}</span>
        {/* {mutation.isError && <span>{mutation.error.message}</span>} */}
      </form>
    </div>
  );
};

export default Upload;

