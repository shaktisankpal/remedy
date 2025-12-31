import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ClientNavbar from "../../components/navbar/ClientNavbar";

const CreateComplaint = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description) {
      return setError("Please fill in all required fields.");
    }

    setLoading(true);
    try {
      await api.post("/api/complaints", {
        title,
        description,
      });

      navigate("/client");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <ClientNavbar />

      {/* Changed py-16 to pt-8 pb-16 to reduce top gap */}
      <main className="max-w-2xl mx-auto px-8 pt-8 pb-16">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate("/client")}
          className="text-gray-400 text-sm hover:text-black transition-colors mb-6 flex items-center gap-2 group"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-light tracking-tight text-black mb-2">
            Submit a Case
          </h1>
          <p className="text-gray-500 font-light">
            Please provide details about the issue you are facing.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-600 text-red-700 text-sm">
            <span className="font-bold mr-2">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Input */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">
              Subject / Title
            </label>
            <input
              type="text"
              className="w-full bg-white border border-gray-200 text-black text-lg p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder:text-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. System latency issues"
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="group">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-focus-within:text-black transition-colors">
              Detailed Description
            </label>
            <textarea
              className="w-full bg-white border border-gray-200 text-black p-4 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 placeholder:text-gray-300 min-h-[200px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the steps to reproduce the issue, expected behavior, and any other relevant context..."
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/client")}
              className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateComplaint;
