import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ClientNavbar from "../../components/navbar/ClientNavbar";

const ClientClosedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const navigate = useNavigate();

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/complaints/my");
      const closed = res.data.filter((c) => c.status === "CLOSED");
      setComplaints(closed);
    } catch (err) {
      setError("Unable to retrieve closed history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // --- Pagination Logic ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(complaints.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading)
    return (
      <>
        <ClientNavbar />
        <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-4 bg-black rounded-full mb-2"></div>
            <span className="text-sm font-medium tracking-widest text-gray-400">
              LOADING
            </span>
          </div>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      <ClientNavbar />

      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black">
              Complaint History
            </h1>
            <p className="text-gray-500 mt-2 text-sm tracking-wide">
              Archive of all closed and finalized cases.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 border border-red-200 bg-red-50 text-red-800 text-sm">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-300 rounded-sm">
            <p className="text-gray-400 font-light text-lg">
              No closed complaints found.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  onClick={() => navigate(`/complaints/${complaint._id}`)}
                  className="group block p-8 border border-gray-200 hover:border-black transition-colors duration-300 bg-white relative cursor-pointer"
                >
                  {/* Card Top: Status & ID */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                      #{complaint._id.slice(-6)}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Gray dot for closed status */}
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                      <span className="text-xs font-semibold tracking-wide text-gray-500">
                        CLOSED
                      </span>
                    </div>
                  </div>

                  {/* Card Content: Title */}
                  <h2 className="text-xl font-medium text-black mb-2 line-clamp-1 group-hover:underline decoration-1 underline-offset-4">
                    {complaint.title}
                  </h2>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">
                      Created:{" "}
                      {new Date(complaint.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-400">
                      Closed:{" "}
                      {new Date(complaint.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Card Bottom: Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-8">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-black transition-colors flex items-center gap-2">
                      View Archive
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls - Only show if items > limit */}
            {complaints.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-black">
                    {indexOfFirstItem + 1}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium text-black">
                    {Math.min(indexOfLastItem, complaints.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-black">
                    {complaints.length}
                  </span>{" "}
                  archived cases
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-6 py-2 text-xs font-bold uppercase tracking-wider border border-gray-200 text-black hover:border-black disabled:opacity-30 disabled:hover:border-gray-200 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-6 py-2 text-xs font-bold uppercase tracking-wider bg-black text-white border border-black hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-black transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ClientClosedComplaints;
