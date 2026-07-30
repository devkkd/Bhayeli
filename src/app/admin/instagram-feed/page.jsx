"use client";
import React, { useState, useEffect, useCallback } from "react";

export default function AdminInstagramFeed() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState(null); // null when adding new
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [views, setViews] = useState("");
  const [order, setOrder] = useState("0");
  const [status, setStatus] = useState("active");

  // Upload loaders
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const toast = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchReels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/instagram-feed");
      const data = await res.json();
      if (data.success) {
        setReels(data.data || []);
      } else {
        toast("error", "Failed to load feed.");
      }
    } catch {
      toast("error", "Network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  const openAddModal = () => {
    setEditingReel(null);
    setVideoUrl("");
    setThumbnailUrl("");
    setInstagramUrl("");
    setViews("");
    setOrder("0");
    setStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (reel) => {
    setEditingReel(reel);
    setVideoUrl(reel.videoUrl || "");
    setThumbnailUrl(reel.thumbnailUrl || "");
    setInstagramUrl(reel.instagramUrl || "");
    setViews(reel.views !== undefined ? String(reel.views) : "");
    setOrder(reel.order !== undefined ? String(reel.order) : "0");
    setStatus(reel.status || "active");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = "";

    const isVideo = type === "video";
    const maxMb = isVideo ? 100 : 15;
    if (file.size > maxMb * 1024 * 1024) {
      toast("error", `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds ${maxMb}MB limit.`);
      return;
    }

    if (isVideo) setUploadingVideo(true);
    else setUploadingThumbnail(true);

    try {
      let uploadedUrl = null;
      let uploadSuccess = false;

      // 1. Attempt Presigned R2 Direct Upload (Bypasses server payload limits)
      try {
        const presignedRes = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "get_presigned_url",
            fileName: file.name,
            fileType: file.type || (isVideo ? "video/mp4" : "image/png"),
          }),
        });

        if (presignedRes.ok) {
          const presignedData = await presignedRes.json();
          if (presignedData.success && presignedData.presignedUrl && presignedData.publicUrl) {
            console.log("☁️ Uploading directly to Cloudflare R2...");
            const r2PutRes = await fetch(presignedData.presignedUrl, {
              method: "PUT",
              headers: {
                "Content-Type": presignedData.mimeType || file.type || (isVideo ? "video/mp4" : "image/png"),
              },
              body: file,
            });

            if (r2PutRes.ok) {
              uploadedUrl = presignedData.publicUrl;
              uploadSuccess = true;
              console.log("✅ Direct R2 Upload successful:", uploadedUrl);
            }
          }
        }
      } catch (presignedErr) {
        console.warn("⚠️ Presigned R2 upload not used or failed:", presignedErr.message);
      }

      // 2. Fallback: Multipart Server Upload
      if (!uploadSuccess) {
        console.log("📁 Falling back to server multipart upload...");
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const contentType = res.headers.get("content-type") || "";
        let data;

        if (contentType.includes("application/json")) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          if (res.status === 413) {
            throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds server upload limits. Please paste a direct video link or compress your video.`);
          }
          throw new Error(rawText || `Server returned status ${res.status}`);
        }

        if (data.success) {
          uploadedUrl = data.url;
          uploadSuccess = true;
        } else {
          throw new Error(data.message || "Upload failed.");
        }
      }

      if (uploadSuccess && uploadedUrl) {
        if (isVideo) setVideoUrl(uploadedUrl);
        else setThumbnailUrl(uploadedUrl);
        toast("success", `${isVideo ? "Video" : "Thumbnail"} uploaded successfully.`);
      }
    } catch (err) {
      console.error("❌ File upload error:", err);
      toast("error", err.message || "Network error during upload. Please check your file or try a direct URL.");
    } finally {
      if (isVideo) setUploadingVideo(false);
      else setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl.trim()) {
      toast("error", "Video file/URL is required.");
      return;
    }

    setSubmitting(true);
    const payload = {
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      instagramUrl: instagramUrl.trim(),
      views: views !== "" ? Number(views) : undefined,
      order: Number(order) || 0,
      status,
    };

    try {
      const url = editingReel ? `/api/instagram-feed/${editingReel._id}` : "/api/instagram-feed";
      const method = editingReel ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast("success", editingReel ? "Reel updated." : "Reel created.");
        setIsModalOpen(false);
        fetchReels();
      } else {
        toast("error", data.message || "Failed to save.");
      }
    } catch {
      toast("error", "Network error while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (reel) => {
    const nextStatus = reel.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/instagram-feed/${reel._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReels(p => p.map(r => r._id === reel._id ? { ...r, status: nextStatus } : r));
        toast("success", `Reel status updated to ${nextStatus}.`);
      } else {
        toast("error", data.message || "Toggle failed.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this Instagram reel?")) return;
    try {
      const res = await fetch(`/api/instagram-feed/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReels(p => p.filter(r => r._id !== id));
        toast("success", "Reel deleted permanently.");
      } else {
        toast("error", data.message || "Delete failed.");
      }
    } catch {
      toast("error", "Network error.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#e5dfd5] pb-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e] font-philosopher uppercase tracking-wider">
            Instagram Feed
          </h2>
          <p className="text-xs text-gray-500 font-sans">
            Add and manage dynamic video reels shown on the storefront homepage
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] font-sans font-bold tracking-wider py-2.5 px-5 rounded-xl text-[11px] uppercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Video
        </button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs border font-sans animate-fadeIn ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          {feedback.type === "success" ? "✓" : "⚠"} {feedback.text}
        </div>
      )}

      {/* Content grid */}
      {loading ? (
        <div className="bg-white border border-[#e5dfd5] rounded-2xl p-16 text-center text-gray-400 text-sm font-sans">
          Loading Instagram Video feed...
        </div>
      ) : reels.length === 0 ? (
        <div className="bg-white border border-[#e5dfd5] rounded-2xl p-16 text-center font-sans">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-400 text-sm">No reels uploaded yet. Click "Add Video" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
          {reels.map((reel) => (
            <div
              key={reel._id}
              className={`bg-white border rounded-2xl overflow-hidden shadow-sm relative flex flex-col group transition-all hover:shadow-md ${
                reel.status === "inactive" ? "border-gray-200 opacity-60" : "border-[#e5dfd5]"
              }`}
            >
              {/* Media Preview container */}
              <div className="aspect-[9/16] bg-black relative overflow-hidden flex items-center justify-center">
                {reel.thumbnailUrl ? (
                  <img src={reel.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={reel.videoUrl} muted preload="metadata" className="w-full h-full object-cover" />
                )}
                {/* Active/Inactive Badge */}
                <span className={`absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-sm ${
                  reel.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
                }`}>
                  {reel.status}
                </span>
              </div>

              {/* Reel Info */}
              <div className="p-3.5 flex-1 flex flex-col justify-between gap-3 bg-white">
                <div>
                  <div className="flex justify-between items-center text-[11px] text-gray-500 font-semibold">
                    <span>Views: {reel.views}</span>
                    <span>Order: {reel.order}</span>
                  </div>
                  {reel.instagramUrl && (
                    <a
                      href={reel.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#bfa15f] font-bold hover:underline block truncate mt-1.5"
                    >
                      Instagram Link →
                    </a>
                  )}
                </div>

                {/* Actions row */}
                <div className="flex gap-1.5 border-t border-gray-100 pt-3 shrink-0">
                  <button
                    onClick={() => handleToggleStatus(reel)}
                    className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-lg border transition-all cursor-pointer ${
                      reel.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {reel.status === "active" ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => openEditModal(reel)}
                    className="bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 text-[10px] font-bold py-1.5 px-2.5 rounded-lg cursor-pointer transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(reel._id)}
                    className="border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 text-[10px] font-bold py-1.5 px-2.5 rounded-lg cursor-pointer transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ ADD/EDIT MODAL DIALOG ══ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#FFF8EE] border border-[#e5dfd5] rounded-3xl overflow-hidden shadow-2xl w-full max-w-lg flex flex-col font-sans max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="h-16 px-6 border-b border-[#e5dfd5] bg-white flex justify-between items-center shrink-0">
              <h3 className="text-[14px] font-bold text-[#1a1a2e]" style={{ fontFamily: "var(--font-philosopher)" }}>
                {editingReel ? "Edit Instagram Reel" : "Add New Reel"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Video upload row */}
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-gray-700">Video File (.mp4, .webm) *</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Upload a video or enter direct URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e] placeholder:text-gray-300"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      disabled={uploadingVideo}
                      className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] font-bold py-2.5 px-4 rounded-xl text-[11px] uppercase transition-colors shrink-0 cursor-pointer disabled:opacity-50 min-w-[80px]"
                    >
                      {uploadingVideo ? "..." : "Upload"}
                    </button>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, "video")}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    />
                  </div>
                </div>
                {videoUrl && (
                  <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 break-all">
                    Selected Video: {videoUrl}
                  </div>
                )}
              </div>

              {/* Thumbnail upload row */}
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-gray-700">Thumbnail Image (Optional - overlay display image)</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Upload overlay image or enter URL (default shows video first frame)"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e] placeholder:text-gray-300"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      disabled={uploadingThumbnail}
                      className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] font-bold py-2.5 px-4 rounded-xl text-[11px] uppercase transition-colors shrink-0 cursor-pointer disabled:opacity-50 min-w-[80px]"
                    >
                      {uploadingThumbnail ? "..." : "Upload"}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full"
                    />
                  </div>
                </div>
                {thumbnailUrl && (
                  <div className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 break-all">
                    Selected Thumbnail: {thumbnailUrl}
                  </div>
                )}
              </div>

              {/* Instagram URL */}
              <div className="space-y-2">
                <label className="block text-[12px] font-bold text-gray-700">Instagram Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e]"
                />
              </div>

              {/* views, order, status fields */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-gray-700">Views</label>
                  <input
                    type="number"
                    placeholder="Random"
                    value={views}
                    onChange={(e) => setViews(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-gray-700">Order Weight</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] font-bold text-gray-700">Visibility</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[12.5px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit panel */}
              <div className="border-t border-[#e5dfd5] pt-5 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-2.5 px-5 rounded-xl text-[11px] uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingVideo || uploadingThumbnail}
                  className="bg-[#1a1a2e] text-white hover:bg-[#bfa15f] font-bold py-2.5 px-6 rounded-xl text-[11px] uppercase transition-colors cursor-pointer disabled:opacity-50 min-w-[100px]"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
