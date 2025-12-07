import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
};


const RfpDetails = () => {
    const { id } = useParams();

    const [rfp, setRfp] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [sending, setSending] = useState(false);
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ---- API calls ----
    const fetchRfp = async () => {
        try {
            const res = await api.get(`/rfps/${id}`);
            setRfp(res.data.rfp);
             setError(""); 
        } catch (err) {
            console.error(err);
            setError("Failed to load RFP");
    setRfp(null);
        }
    };

    const fetchVendors = async () => {
        try {
            const res = await api.get("/vendors");
            setVendors(res.data.Data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProposals = async () => {
        try {
            const res = await api.get(`/proposals/rfp/${id}`);
            // backend: { message: "Success", proposal: [...] }
            setProposals(res.data.proposal);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchRfp(), fetchVendors(), fetchProposals()]);
            setLoading(false);
        };
        loadAll();
    }, [id]);

    // ---- Handlers ----
    const toggleVendor = (vendorId) => {
        setSelectedVendors((prev) =>
            prev.includes(vendorId)
                ? prev.filter((v) => v !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSendRfp = async () => {
        if (selectedVendors.length === 0) {
            alert("Select at least one vendor");
            return;
        }
        setSending(true);
        try {

            await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
            await fetchRfp(); // update sentTo in DB if needed
            alert("Emails processed");
        } catch (err) {
            console.error(err);
            alert("Failed to send emails");
        } finally {
            setSending(false);
        }
    };

    const handleCompare = async () => {
        try {
            const res = await api.get(`/rfps/${id}/compare`);
            setRecommendation(res.data.recommendation || "");
        } catch (err) {
            console.error(err);
            alert("Failed to get recommendation");
        }
    };

    if (loading) {
  return <p className="text-sm text-slate-500">Loading...</p>;
}

if (error) {
  return <p className="text-sm text-red-600">{error}</p>;
}

if (!rfp) {
  return <p className="text-sm text-red-600">RFP not found.</p>;
}


    return (
        <>
            <div className="space-y-6">
                {/* RFP INFO */}
                <div className="bg-white rounded-xl shadow p-4 space-y-2">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {rfp.title || "Untitled RFP"}
                    </h2>
                    <p className="text-sm text-slate-700 whitespace-pre-line">
                        {rfp.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                        <span>Budget: {rfp.budget ? `₹${rfp.budget}` : "N/A"}</span>
                        <span>
                            Created:{" "}
                            {rfp.createdAt
                                ? new Date(rfp.createdAt).toLocaleDateString()
                                : "-"}
                        </span>
                    </div>
                </div>
                {/* ALREADY SENT TO */}
                <div className="bg-white rounded-xl shadow p-4 space-y-2">
                    <h3 className="font-medium text-sm">Already Sent To</h3>

                    {Array.isArray(rfp.sentTo) && rfp.sentTo.length > 0 ? (
                        <div className="space-y-2 text-sm">
                            {rfp.sentTo.map((entry) => {
                                // find vendor from vendors list using vendorId
                                const vendor = vendors.find(
                                    (v) => String(v._id) === String(entry.vendorId)
                                );

                                const name = vendor ? vendor.name : String(entry.vendorId);
                                const email = vendor ? vendor.email : "";

                                return (
                                    <div
                                        key={entry._id || `${entry.vendorId}-${entry.sentAt}`}
                                        className="flex items-center justify-between border rounded-lg px-3 py-2"
                                    >
                                        <div>
                                            <p className="font-medium">{name}</p>
                                            {email && (
                                                <p className="text-xs text-slate-500">{email}</p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-slate-600">
                                            <p>Status: sent</p>
                                            <p>Sent: {formatDate(entry.sentAt)}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-500">
                            RFP not sent to any vendors yet.
                        </p>
                    )}
                </div>


                {/* SEND RFP TO VENDORS */}
                <div className="bg-white rounded-xl shadow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Send RFP to vendors</h3>
                        <button
                            onClick={handleSendRfp}
                            disabled={sending || selectedVendors.length === 0}
                            className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs disabled:opacity-60"
                        >
                            {sending ? "Sending..." : "Send RFP"}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {vendors.length === 0 && (
                            <p className="text-xs text-slate-500">
                                No vendors yet. Add from Vendors page.
                            </p>
                        )}

                        {vendors.map((v) => (
                            <button
                                key={v._id}
                                type="button"
                                onClick={() => toggleVendor(v._id)}
                                className={`px-3 py-1.5 rounded-full text-xs border ${selectedVendors.includes(v._id)
                                    ? "bg-slate-900 text-white border-slate-900"
                                    : "bg-slate-50 text-slate-700 border-slate-200"
                                    }`}
                            >
                                {v.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ADD PROPOSAL FORM */}
                <div className="bg-white rounded-xl shadow p-4 space-y-3">
                    <h3 className="font-medium text-sm">Add Proposal (Paste Vendor Email)</h3>

                    <div className="grid grid-cols-1 gap-3">
                        {/* Vendor dropdown */}
                        <select
                            className="border rounded-lg px-3 py-2 text-sm"
                            value={selectedVendors[0] || ""}
                            onChange={(e) => setSelectedVendors([e.target.value])}
                        >
                            <option value="">Select Vendor</option>
                            {vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                    {vendor.name}
                                </option>
                            ))}
                        </select>

                        {/* Subject */}
                        <input
                            type="text"
                            placeholder="Email Subject"
                            id="proposal-subject"
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        {/* From Email */}
                        <input
                            type="text"
                            placeholder="Vendor Email (From)"
                            id="proposal-from"
                            className="border rounded-lg px-3 py-2 text-sm"
                        />

                        {/* Raw Email Text */}
                        <textarea
                            id="proposal-text"
                            rows={5}
                            placeholder="Paste the vendor email content here..."
                            className="border rounded-lg px-3 py-2 text-sm"
                        ></textarea>

                        {/* Submit button */}
                        <button
                            onClick={async () => {
                                const vendorId = selectedVendors[0];
                                const subject = document.getElementById("proposal-subject").value;
                                const fromEmail = document.getElementById("proposal-from").value;
                                const rawEmail = document.getElementById("proposal-text").value;

                                if (!vendorId || !rawEmail) {
                                    alert("Vendor and email content are required.");
                                    return;
                                }

                                try {
                                    await api.post("/proposals/manual", {
                                        rfpId: id,
                                        vendorId,
                                        rawEmail,
                                        subject,
                                        fromEmail,
                                    });

                                    alert("Proposal added!");
                                    await fetchProposals(); // refresh proposals list
                                } catch (err) {
                                    console.error("Add proposal error:", err);
                                    alert("Failed to add proposal");
                                }
                            }}
                            className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm"
                        >
                            Add Proposal
                        </button>
                    </div>
                </div>


                {/* PROPOSALS LIST + COMPARE */}
                <div className="bg-white rounded-xl shadow p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">Proposals</h3>
                        <button
                            onClick={handleCompare}
                            disabled={proposals.length === 0}
                            className="border border-slate-900 text-slate-900 px-3 py-1.5 rounded-lg text-xs disabled:opacity-60"
                        >
                            Compare & Get Recommendation
                        </button>
                    </div>

                    {proposals.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No proposals yet. For now, create them via the backend/manual
                            endpoint.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {proposals.map((p) => (
                                <div
                                    key={p._id}
                                    className="border rounded-lg px-3 py-2 text-sm flex justify-between gap-4"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {p.vendorId?.name || "Unknown vendor"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {p.fromEmail} • {p.subject}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {p.rawEmail}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-slate-600 min-w-[90px]">
                                        <p>Price: {p.price ? `₹${p.price}` : "-"}</p>
                                        <p>
                                            Delivery:{" "}
                                            {p.parsedFields?.deliveryDays ||
                                                p.parseFields?.deliveryDays ||
                                                "-"}{" "}
                                            days
                                        </p>
                                        <p>
                                            Warranty:{" "}
                                            {p.parsedFields?.warranty ||
                                                p.parseFields?.warranty ||
                                                "-"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {recommendation && (
                        <div className="mt-4 border-t pt-3">
                            <h4 className="font-medium text-sm mb-1">AI Recommendation</h4>
                            <p className="text-sm text-slate-700 whitespace-pre-line">
                                {recommendation}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default RfpDetails
