import React from 'react'
import { useEffect, useState } from "react";
import api from "../api/axios";

const Vendor = () => {
    const [vendors, setVendors] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        contactPerson: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    const fetchVendors = async () => {
        try {
            const res = await api.get("/vendors")
            setVendors(res.data.Data || [])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/vendors", form);
            setForm({ name: "", email: "", contactPerson: "", notes: "" });
            fetchVendors();
        } catch (err) {
            console.error(err);
            alert("Failed to create vendor");
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-800">Vendors</h2>

                {/* Add vendor form */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-medium mb-3 text-sm">Add Vendor</h3>
                    <form
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                        onSubmit={handleSubmit}
                    >
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Vendor name"
                            required
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleChange}
                            placeholder="Contact person"
                            className="border rounded-lg px-3 py-2 text-sm"
                        />
                        <input
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Notes"
                            className="border rounded-lg px-3 py-2 text-sm md:col-span-2"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm mt-1 md:col-span-2 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Vendor"}
                        </button>
                    </form>
                </div>

                {/* Vendor list */}
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-medium mb-3 text-sm">Vendor List</h3>
                    {vendors.length === 0 ? (
                        <p className="text-sm text-slate-500">No vendors yet.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-500 border-b">
                                    <th className="py-2">Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.map((v) => (
                                    <tr key={v._id} className="border-b last:border-0">
                                        <td className="py-2">{v.name}</td>
                                        <td>{v.email}</td>
                                        <td>{v.contactPerson}</td>
                                        <td>{v.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    )
}

export default Vendor
