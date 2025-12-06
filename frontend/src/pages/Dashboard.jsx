import React from 'react'
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
    const [rfps, setRfps] = useState([]);

    const fetchRfps = async () => {
        try {
            const res = await api.get("/rfps");
           setRfps(res.data.rfpsData || []);
           
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchRfps();
    }, []);
    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">RFPs</h2>
                    <Link
                        to="/rfps/new"
                        className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        + New RFP
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow divide-y">
                    {rfps.length === 0 ? (
                        <p className="p-4 text-sm text-slate-500">No RFPs yet.</p>
                    ) : (
                        rfps.map((r) => (
                            <Link
                                key={r._id}
                                to={`/rfps/${r._id}`}
                                className="block px-4 py-3 hover:bg-slate-50"
                            >
                                <div className="flex justify-between items-center gap-4">
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {r.title || "Untitled RFP"}
                                        </p>
                                        <p className="text-xs text-slate-500 line-clamp-1">
                                            {r.description}
                                        </p>
                                    </div>
                                    <div className="text-right text-xs text-slate-500">
                                        {r.budget && <p>Budget: ₹{r.budget}</p>}
                                        <p>
                                            Created:{" "}
                                            {r.createdAt
                                                ? new Date(r.createdAt).toLocaleDateString()
                                                : "-"}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default Dashboard
