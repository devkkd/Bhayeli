"use client";
import React, { useState, useEffect, useCallback } from "react";

const STATUS_CONFIG = {
  new:     { label: "New",     color: "bg-blue-100 text-blue-700 border-blue-200" },
  read:    { label: "Read",    color: "bg-amber-100 text-amber-700 border-amber-200" },
  replied: { label: "Replied", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  closed:  { label: "Closed",  color: "bg-gray-100 text-gray-500 border-gray-200" },
};

const TYPE_BADGE = {
  "Product Related": "bg-[#1a1a2e]/10 text-[#1a1a2e]",
  "Custom Order":    "bg-[#bfa15f]/20 text-[#7a5c1e]",
  "Feedback":        "bg-purple-100 text-purple-700",
  "Complain":        "bg-rose-100 text-rose-600",
};

export default function AdminContacts() {
  const [contacts, setContacts]     = useState([]);
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

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/contacts" : `/api/contacts?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setContacts(data.data || []);
      } else {
        toast("error", "Failed to load customer inquiries.");
      }
    } catch {
      toast("error", "Network error while loading inquiries.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const markRead = async (con) => {
    setSelected(con);
    setNotes(con.adminNotes || "");
    setShowEmailMenu(false);
    if (con.status === "new") {
      await patchContact(con._id, { status: "read" }, false);
      setContacts((p) =>
        p.map((c) => (c._id === con._id ? { ...c, status: "read" } : c))
      );
      setSelected((s) => (s ? { ...s, status: "read" } : s));
    }
  };

  const patchContact = async (id, body, msg = true) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (body.status !== undefined || body.adminNotes !== undefined) {
          setContacts((p) =>
            p.map((c) => (c._id === id ? { ...c, ...body } : c))
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
    await patchContact(selected._id, { adminNotes: notes });
    setSaving(false);
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this inquiry permanently?")) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setContacts((p) => p.filter((c) => c._id !== id));
        if (selected?._id === id) setSelected(null);
        toast("success", "Inquiry deleted successfully.");
      } else {
        toast("error", data.message || "Delete failed.");
      }
    } catch {
      toast("error", "Network error during delete.");
    }
  };

  const displayed = contacts.filter((c) => {
    const term = search.toLowerCase();
    return (
      !search ||
      c.fullName?.toLowerCase().includes(term) ||
      c.companyName?.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.message?.toLowerCase().includes(term)
    );
  });

  const counts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    read: contacts.filter((c) => c.status === "read").length,
    replied: contacts.filter((c) => c.status === "replied").length,
    closed: contacts.filter((c) => c.status === "closed").length,
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
              Customer Inquiries
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Review and respond to general contact form submissions
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
              {contacts.length} Total
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
              placeholder="Search by name, company, email, message..."
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-400 text-sm">No contact inquiries found.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-[#e5dfd5] rounded-2xl overflow-hidden shadow-sm font-sans">
              <table className="w-full text-xs">
                <thead className="bg-[#faf8f5] border-b border-[#e5dfd5]">
                  <tr>
                    {["Customer", "Company", "Type", "Message Preview", "Status", "Date", "Actions"].map((h) => (
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
                  {displayed.map((con) => (
                    <tr
                      key={con._id}
                      onClick={() => markRead(con)}
                      className={`hover:bg-[#faf8f5] transition-colors cursor-pointer group ${
                        con.status === "new" ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <p className={`font-semibold text-[#1a1a2e] ${con.status === "new" ? "font-bold" : ""}`}>
                          {con.fullName}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{con.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-[#1a1a2e] font-medium">{con.companyName || "—"}</p>
                        <p className="text-[10px] text-gray-400">{con.country}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                            TYPE_BADGE[con.inquiryType] || "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {con.inquiryType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 max-w-[200px] truncate text-[#1a1a2e]">
                        {con.message}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                            STATUS_CONFIG[con.status]?.color
                          }`}
                        >
                          {STATUS_CONFIG[con.status]?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">
                        <p>{fmt(con.createdAt)}</p>
                        <p className="text-[10px]">{fmtTime(con.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContact(con._id);
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
              {displayed.map((con) => (
                <div
                  key={con._id}
                  onClick={() => markRead(con)}
                  className={`bg-white border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-all ${
                    con.status === "new" ? "border-blue-200 bg-blue-50/30" : "border-[#e5dfd5]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[13px] font-bold text-[#1a1a2e] ${con.status === "new" ? "font-extrabold" : ""}`}>
                          {con.fullName}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            STATUS_CONFIG[con.status]?.color
                          }`}
                        >
                          {STATUS_CONFIG[con.status]?.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {con.companyName || "No Company"} · {con.country}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{con.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            TYPE_BADGE[con.inquiryType] || "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {con.inquiryType}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 shrink-0">{fmt(con.createdAt)}</p>
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
            className="h-full w-full max-w-[480px] bg-white shadow-2xl flex flex-col overflow-hidden animate-slideLeft"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="h-16 px-5 border-b border-[#e5dfd5] flex items-center justify-between shrink-0 bg-white">
              <div>
                <h2
                  className="text-[15px] font-bold text-[#1a1a2e]"
                  style={{ fontFamily: "var(--font-philosopher)" }}
                >
                  Inquiry Details
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
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Status Change */}
              <div className="flex items-center gap-2 flex-wrap font-sans">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">
                  Status:
                </span>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => patchContact(selected._id, { status: key })}
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
              <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4 space-y-2.5 font-sans">
                <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-1">
                  Contact Information
                </p>
                {[
                  ["Name",      selected.fullName],
                  ["Company",   selected.companyName || "—"],
                  ["Email",     selected.email],
                  ["Phone",     selected.phone],
                  ["Country",   selected.country],
                  ["Website",   selected.companyWebsite || "—"],
                  ["Type",      selected.inquiryType],
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

              {/* Message */}
              {selected.message && (
                <div className="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4 font-sans">
                  <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-2">
                    Message
                  </p>
                  <p className="text-[13px] text-[#1a1a2e] leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              )}

              {/* Admin Notes */}
              <div>
                <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-wider mb-2 font-sans">
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
                  className="mt-2 bg-[#1a1a2e] text-white text-[11px] font-bold px-5 py-2 rounded-full hover:bg-black transition-colors disabled:opacity-50 font-sans"
                >
                  {savingNotes ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>

            {/* Drawer Footer — Quick Actions */}
            <div className="shrink-0 border-t border-[#e5dfd5] p-4 bg-white flex gap-2 font-sans">
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
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selected.email}&su=${encodeURIComponent("Regarding your inquiry at Bhayeli")}`}
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
                      href={`mailto:${selected.email}?subject=${encodeURIComponent("Regarding your inquiry at Bhayeli")}`}
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
                onClick={() => deleteContact(selected._id)}
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
