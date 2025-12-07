import React from 'react'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const RfpDetails = () => {
    const { id } = useParams();

    const [rfp, setRfp] = useState(null);
    const [vendors, setVendors] = useState([]);
    const [selectedVendors, setSelectedVendors] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [sending, setSending] = useState(false);
    const [recommendation, setRecommendation] = useState("");
    const [loading, setLoading] = useState(true);

    // ---- API calls ----
    const fetchRfp = async () => {
        try {
            const res = await api.get(`/rfps/${id}`);
            setRfp(res.data.rfp);
        } catch (err) {
            console.error(err);
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
            setProposals(res.data.proposal );
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

    if (loading || !rfp) {
        return <p className="text-sm text-slate-500">Loading...</p>;
    }

    if (!rfp) {
  return <p className="text-sm text-red-600">Failed to load RFP.</p>;
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
