import React from 'react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreatedRfp = () => {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        try {
            const res = await api.post("/rfps/from-text", { text });
            const created = res.data.data || res.data;
            setPreview(created);
        } catch (err) {
            console.error(err);
            alert("Failed to create RFP from text");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">Create RFP</h2>

                <div className="bg-white rounded-xl shadow p-4 space-y-4">
                    <h3 className="font-medium text-sm">From free text (AI)</h3>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            placeholder=" Give the RFP description here..."
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Generate RFP"}
                        </button>
                    </form>

                    {preview && (
                        <div className="mt-4 border-t pt-4">
                            <h4 className="font-medium text-sm mb-2">Generated RFP</h4>
                            <p className="text-sm font-semibold">
                                {preview.title || "Untitled RFP"}
                            </p>
                            <p className="text-sm text-slate-600 mb-2">
                                {preview.description}
                            </p>
                            <p className="text-xs text-slate-500">
                                Budget: {preview.budget ? `₹${preview.budget}` : "N/A"}
                            </p>
                            <button
                                onClick={() => navigate(`/rfps/${preview._id}`)}
                                className="mt-3 text-xs underline text-slate-800"
                            >
                                View details
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default CreatedRfp
