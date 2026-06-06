"use client";
import React, { useState, useEffect, useCallback } from "react";

const STATUS_CONFIG = {
  new:     { label: "New",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  read:    { label: "Read",    color: "bg-amber-100 text-amber-700 border-amber-200" },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  closed:  { label: "Closed",  color: "bg-gray-100 text-gray-500 border-gray-200" },
};

export default function AdminCustomInquiries() {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);
  const [feedback, setFeedback]     = useState(null);
  const [notes, setNotes]           = useState("");
  const [savingNotes, setSaving]    = useState(false);
  const [showEmailMenu, setShowEmailMenu] = useState(false);

  const toast = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/custom-inquiries" : `/api/custom-inquiries?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data || []);
      } else {
        toast("error", "Failed to load custom inquiries.");
      }
    } catch {
      toast("error", "Network error while loading inquiries.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const markRead = async (inq) => {
    setSelected(inq);
    setNotes(inq.adminNotes || "");
    setShowEmailMenu(false);
    if (inq.status === "new") {
      await patchInquiry(inq._id, { status: "read" }, false);
      setInquiries((p) =>
        p.map((i) => (i._id === inq._id ? { ...i, status: "read" } : i))
      );
      setSelected((s) => (s ? { ...s, status: "read" } : s));
    }
  };

  const patchInquiry = async (id, body, msg = true) => {
    try {
      const res = await fetch(`/api/custom-inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (body.status !== undefined || body.adminNotes !== undefined) {
          setInquiries((p) =>
            p.map((i) => (i._id === id ? { ...i, ...body } : i))
          );
          if (selected?._id === id) {
            setSelected((s) => ({ ...s, ...body }));
          }
        }
        if (msg) toast("success", "Inquiry updated successfully.");
      } else {
        if (msg) toast("error", data.message || "Failed to update.");
      }
    } catch {
      if (msg) toast("error", "Network error during update.");
    }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    await patchInquiry(selected._id, { adminNotes: notes });
    setSaving(false);
  };

  const deleteInquiry = async (id) => {
    if (!confirm("Are you sure you want to delete this custom inquiry permanently?")) return;
    try {
      const res = await fetch(`/api/custom-inquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInquiries((p) => p.filter((i) => i._id !== id));
        if (selected?._id === id) setSelected(null);
        toast("success", "Inquiry deleted successfully.");
      } else {
        toast("error", data.message || "Delete failed.");
      }
    } catch {
      toast("error", "Network error during delete.");
    }
  };

  const displayed = inquiries.filter((i) => {
    const term = search.toLowerCase();
    return (
      !search ||
      i.fullName?.toLowerCase().includes(term) ||
      i.companyName?.toLowerCase().includes(term) ||
      i.email?.toLowerCase().includes(term) ||
      i.message?.toLowerCase().includes(term) ||
      i.interests?.some(item => item.toLowerCase().includes(term)) ||
      i.techniques?.some(item => item.toLowerCase().includes(term))
    );
  });

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    read: inquiries.filter((i) => i.status === "read").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    closed: inquiries.filter((i) => i.status === "closed").length,
  };

  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const fmtTime = (d) =>
    new Date(d).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const inp =
    "w-full border border-[#e5dfd5] rounded-xl px-3 py-2.5 text-[12px] outline-none focus:border-[#bfa15f] focus:ring-1 focus:ring-[#bfa15f]/25 bg-white text-[#1a1a2e] placeholder:text-gray-300 resize-none font-sans";

  return (
    <>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-5">
        {/* Inner Page Header */}
        <div className="flex justify-between items-center border-b border-[#e5dfd5] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1a1a2e] font-philosopher uppercase tracking-wider">
              Custom Requests
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Manage custom order inquiries, technique specifications, and design references
            </p>
          </div>
          <div className="flex items-center gap-2">
            {counts.new > 0 && (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5 flex items-center gap-1.5 font-sans">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {counts.new} New
              </span>
            )}
            <span className="text-[10px] font-bold text-[#1a1a2e] bg-white border border-[#e5dfd5] rounded-full px-3 py-1.5 hidden sm:flex items-center gap-2 font-sans">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {inquiries.length} Total
            </span>
          </div>
        </div>

        {/* Toast Notification */}
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "New",     val: counts.new,     color: "text-blue-600",    bg: "bg-blue-50 border-blue-200" },
            { label: "Read",    val: counts.read,    color: "text-amber-600",   bg: "bg-amber-50 border-amber-200" },
            { label: "Replied", val: counts.replied, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Closed",  val: counts.closed,  color: "text-gray-500",    bg: "bg-gray-50 border-gray-200" },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} border rounded-2xl p-4 cursor-pointer hover:shadow-sm transition-all`}
              onClick={() => setFilter(s.label.toLowerCase())}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-500 font-sans">{s.label}</p>
              <p
                className={`text-3xl font-bold mt-1 ${s.color}`}
                style={{ fontFamily: "var(--font-philosopher)" }}
              >
                {s.val}
              </p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, specs, message..."
              className="w-full border border-[#e5dfd5] rounded-xl pl-8 pr-4 py-2.5 text-[12px] outline-none focus:border-[#bfa15f] bg-white text-[#1a1a2e] placeholder:text-gray-300 font-sans"
            />
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-1.5 font-sans">
            {["all", "new", "read", "replied", "closed"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === s
                    ? "bg-[#1a1a2e] text-white"
                    : "bg-white border border-[#e5dfd5] text-gray-500 hover:text-[#1a1a2e] hover:border-[#1a1a2e]/30"
                }`}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
                {counts[s] > 0 && <span className="ml-1 opacity-60">·{counts[s]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-[#e5dfd5] rounded-2xl p-16 text-center text-gray-400 text-sm font-sans">
            Loading...
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white border border-[#e5dfd5] rounded-2xl p-16 text-center font-sans">
            <svg
              className="w-10 h-10 text-gray-300 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.813 15.904L9 21l8.973-1.72a2.282 2.282 0 001.353-.846l2.368-2.736a2.022 2.022 0 00-.285-2.868l-2.073-1.792a2.022 2.022 0 00-2.867.285l-2.367 2.736a2.28 2.28 0 00-.479 1.488zM4 6h16M4 10h16M4 14h8"
              />
            </svg>
            <p className="text-gray-400 text-sm">No custom inquiries found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-[#e5dfd5] rounded-2xl overflow-hidden shadow-sm font-sans">
              <table className="w-full text-xs">
                <thead className="bg-[#faf8f5] border-b border-[#e5dfd5]">
                  <tr>
                    {["Customer", "Company", "Interests", "Techniques", "Description Preview", "Status", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-gray-500"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5dfd5]/50">
                  {displayed.map((inq) => (
                    <tr
                      key={inq._id}
                      onClick={() => markRead(inq)}
                      className={`hover:bg-[#faf8f5] transition-colors cursor-pointer group ${
                        inq.status === "new" ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <p className={`font-semibold text-[#1a1a2e] ${inq.status === "new" ? "font-bold" : ""}`}>
                          {inq.fullName}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{inq.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[#1a1a2e] font-medium">{inq.companyName || "—"}</p>
                        <p className="text-[10px] text-gray-400">{inq.country}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        {inq.interests?.length > 0 ? (
                          <span className="bg-[#bfa15f]/10 text-[#7a5c1e] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {inq.interests.length} item{inq.interests.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {inq.techniques?.length > 0 ? (
                          <span className="bg-purple-50 text-purple-700 border border-purple-100 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {inq.techniques.length} technique{inq.techniques.length > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px] truncate text-[#1a1a2e]">
                        {inq.message}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                            STATUS_CONFIG[inq.status]?.color
                          }`}
                        >
                          {STATUS_CONFIG[inq.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">
                        <p>{fmt(inq.createdAt)}</p>
                        <p className="text-[10px]">{fmtTime(inq.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteInquiry(inq._id);
                          }}
                          className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 font-sans">
              {displayed.map((inq) => (
                <div
                  key={inq._id}
                  onClick={() => markRead(inq)}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all ${
                    inq.status === "new" ? "border-blue-200 bg-blue-50/30" : "border-[#e5dfd5]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[13px] font-bold text-[#1a1a2e] ${inq.status === "new" ? "font-extrabold" : ""}`}>
                          {inq.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            STATUS_CONFIG[inq.status]?.color
                          }`}
                        >
                          {STATUS_CONFIG[inq.status]?.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {inq.companyName || "No Company"} · {inq.country}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{inq.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {inq.interests?.length > 0 && (
                          <span className="bg-[#bfa15f]/15 text-[#7a5c1e] text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {inq.interests.length} Items
                          </span>
                        )}
                        {inq.techniques?.length > 0 && (
                          <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                            {inq.techniques.length} Techniques
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 shrink-0">{fmt(inq.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ══ DETAIL DRAWER ══ */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-end"
          onClick={() => { setSelected(null); setShowEmailMenu(false); }}
        >
          <div
            className="h-full w-full max-w-[500px] bg-white shadow-2xl flex flex-col overflow-hidden animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-[#e5dfd5] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2
                  className="text-[15px] font-bold text-[#1a1a2e]"
                  style={{ fontFamily: "var(--font-philosopher)" }}
                >
                  Custom Request Details
                </h2>
                <p className="text-[10px] text-gray-400 font-sans">
                  {fmt(selected.createdAt)} · {fmtTime(selected.createdAt)}
                </p>
              </div>
              <button
                onClick={() => { setSelected(null); setShowEmailMenu(false); }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 font-sans">
              {/* Status Selector */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                  Status:
                </span>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => patchInquiry(selected._id, { status: key })}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                      selected.status === key
                        ? cfg.color + " shadow-sm border-transparent"
                        : "border-gray-200 text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {cfg.label}
                  </button>
                ))}
              </div>

              {/* Contact Information */}
              <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-1">
                  Contact Profile
                </p>
                {[
                  ["Name",      selected.fullName],
                  ["Company",   selected.companyName || "—"],
                  ["Email",     selected.email],
                  ["Phone",     selected.phone],
                  ["Country",   selected.country],
                  ["Website",   selected.companyWebsite || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-3">
                    <span className="text-[10px] text-gray-400 w-16 shrink-0 pt-0.5">{k}</span>
                    {k === "Website" && v && v !== "—" ? (
                      <a
                        href={v.startsWith("http") ? v : `https://${v}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-[#bfa15f] hover:underline break-all leading-relaxed"
                      >
                        {v}
                      </a>
                    ) : (
                      <span className="text-[12px] font-semibold text-[#1a1a2e] break-all leading-relaxed">
                        {v}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Project Requirements & Techniques */}
              <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4 space-y-4">
                <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider">
                  Specifications
                </p>

                {/* Interests */}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1.5">Interested Products</span>
                  {selected.interests?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.interests.map((item, idx) => (
                        <span key={idx} className="bg-[#bfa15f]/15 text-[#7a5c1e] text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : <span className="text-xs text-gray-400 italic">None selected</span>}
                </div>

                {/* Techniques */}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1.5">Preferred Techniques</span>
                  {selected.techniques?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.techniques.map((item, idx) => (
                        <span key={idx} className="bg-purple-100 text-purple-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : <span className="text-xs text-gray-400 italic">None selected</span>}
                </div>

                {/* Estimated Quantity */}
                <div>
                  <span className="text-[10px] text-gray-400 block mb-1.5">Estimated Quantities</span>
                  {selected.quantities?.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selected.quantities.map((item, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : <span className="text-xs text-gray-400 italic">None selected</span>}
                </div>
              </div>

              {/* Description Message */}
              {selected.message && (
                <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-2">
                    Product Description
                  </p>
                  <p className="text-[12.5px] text-[#1a1a2e] leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Reference Images */}
              {selected.referenceImages?.length > 0 && (
                <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-3">
                    Uploaded Reference Mockups
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selected.referenceImages.map((imgUrl, i) => (
                      <a
                        key={i}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-xl border border-gray-200 overflow-hidden bg-white hover:opacity-85 transition-opacity group"
                      >
                        {imgUrl.endsWith('.pdf') ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-[11px] font-bold text-rose-500">
                            <span>PDF File</span>
                            <span className="text-[8px] text-gray-400 font-normal mt-1 truncate max-w-full px-1">Open →</span>
                          </div>
                        ) : (
                          <>
                            <img src={imgUrl} alt="Customer attachment" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-[9px] font-bold">Open Original</span>
                            </div>
                          </>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-2">
                  Admin Notes
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  className={inp + " h-24"}
                />
                <button
                  onClick={saveNotes}
                  disabled={savingNotes}
                  className="mt-2 bg-[#1a1a2e] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-black transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            {/* Drawer Footer — Quick Actions */}
            <div className="shrink-0 border-t border-[#e5dfd5] p-4 bg-white flex gap-2 font-sans z-10">
              <div className="relative flex-1 flex">
                <button
                  onClick={() => setShowEmailMenu(!showEmailMenu)}
                  className="w-full bg-[#1a1a2e] text-white text-[12px] font-bold py-2.5 rounded-full hover:bg-black transition-all text-center cursor-pointer"
                >
                  Reply via Email
                </button>
                {showEmailMenu && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-[#e5dfd5] rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-50">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selected.email}&su=${encodeURIComponent("Regarding your custom customization inquiry at Bhayeli")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setShowEmailMenu(false);
                        navigator.clipboard.writeText(selected.email);
                        toast("success", "Email copied to clipboard!");
                      }}
                      className="px-3 py-2.5 text-left hover:bg-gray-50 rounded-xl text-[11px] font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Open Gmail (Web)
                    </a>
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent("Regarding your custom customization inquiry at Bhayeli")}`}
                      onClick={() => {
                        setShowEmailMenu(false);
                        navigator.clipboard.writeText(selected.email);
                        toast("success", "Email copied to clipboard!");
                      }}
                      className="px-3 py-2.5 text-left hover:bg-gray-50 rounded-xl text-[11px] font-semibold text-gray-700 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Open Mail App
                    </a>
                    <button
                      onClick={() => {
                        setShowEmailMenu(false);
                        navigator.clipboard.writeText(selected.email);
                        toast("success", "Email copied to clipboard!");
                      }}
                      className="px-3 py-2.5 text-left hover:bg-gray-50 rounded-xl text-[11px] font-bold text-[#bfa15f] flex items-center gap-2 w-full cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Copy Email Address
                    </button>
                  </div>
                )}
              </div>
              <a
                href={`https://wa.me/${selected.phone?.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white text-[12px] font-bold py-2.5 rounded-full hover:bg-[#1ebe5d] transition-colors text-center"
              >
                WhatsApp
              </a>
              <button
                onClick={() => deleteInquiry(selected._id)}
                className="px-4 py-2.5 rounded-full border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white text-[12px] font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
