import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";

export const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.error("fetch note error: ", error);
        toast.error("Failed to fetch the note!");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await api.delete(`/notes/${id}`);
      navigate("/");
      toast.success("Note deleted successfully!")
    } catch (error) {
      console.error("Delete Error: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!note.title.trim() || !note.content.trim()){
      toast.error("All fields are required!");
      return;
    };

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, {
        title: note.title,
        content: note.content
      });
      toast.success("Note updated successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error submitting form: ", error);
      toast.error("Failed to create note!");
    }finally{
      setSaving(false)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to={"/"} className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100 mt-10">
             <div className="card-body">
              {/* <h2 className="card-title text-2xl mb-4">Create New Note</h2> */}
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title"
                    className="input input-bordered"
                    value={note.title}
                    onChange={(e) => setNote({...note,title: e.target.value})}
                  />
                </div>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={note.content}
                    onChange={(e) => setNote({...note, content: e.target.value})}
                  />
                </div>
                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
