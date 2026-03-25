import { useState, useEffect } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

/**
 * Admin Leads Dashboard (Feature 5)
 */
export default function AdminLeads() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("kit"); // kit or website
  const [kitLeads, setKitLeads] = useState([]);
  const [websiteLeads, setWebsiteLeads] = useState([]);

  useEffect(() => {
    // Load leads from localStorage
    const kitData = JSON.parse(localStorage.getItem("listedpei_leads") || "[]");
    const websiteData = JSON.parse(localStorage.getItem("listedpei_website_leads") || "[]");
    setKitLeads(kitData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    setWebsiteLeads(websiteData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const exportCSV = (type) => {
    const data = type === "kit" ? kitLeads : websiteLeads;
    if (data.length === 0) return;

    let headers = type === "kit" 
      ? "Email,Business Name,Category,City,Date\n"
      : "Name,Email,Phone,Status,Message,Business,Date\n";
    
    let csvContent = headers + data.map(l => {
      if (type === "kit") {
        return `${l.email},${l.businessName},${l.category},${l.city},${l.timestamp}`;
      } else {
        return `${l.name},${l.email},${l.phone || ""},${l.status || ""},"${(l.message || "").replace(/"/g, '""')}",${l.businessName},${l.timestamp}`;
      }
    }).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `listedpei_${type}_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearLeads = () => {
    if (window.confirm("Are you SURE you want to clear all leads? This cannot be undone.")) {
      if (activeTab === "kit") {
        localStorage.removeItem("listedpei_leads");
        setKitLeads([]);
      } else {
        localStorage.removeItem("listedpei_website_leads");
        setWebsiteLeads([]);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Admin Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Admin Password</label>
              <input
                type="password"
                className="input-field border-slate-200"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full btn-primary bg-slate-800 hover:bg-slate-900 py-4">
              Unlock Leads →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Leads Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage and export your collected potential customers.</p>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => exportCSV(activeTab)} className="btn-primary bg-emerald-600 hover:bg-emerald-700">
               Export {activeTab.toUpperCase()} CSV
             </button>
             <button onClick={clearLeads} className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest">
               Clear All
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("kit")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "kit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            GBP Kit Leads ({kitLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("website")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === "website" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Website Leads ({websiteLeads.length})
          </button>
        </div>

        {/* Table Content */}
        <div className="card shadow-xl overflow-hidden border-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {activeTab === "kit" ? (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Business Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">City</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    </>
                  ) : (
                    <>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Email</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Phone</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Business</th>
                       <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === "kit" ? kitLeads : websiteLeads).map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {activeTab === "kit" ? (
                      <>
                        <td className="px-6 py-4 font-bold text-slate-800">{l.email}</td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{l.businessName}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-md uppercase tracking-tighter ring-1 ring-primary-100">
                            {l.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">{l.city}</td>
                        <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      </>
                    ) : (
                      <>
                         <td className="px-6 py-4 font-bold text-slate-800">{l.name}</td>
                         <td className="px-6 py-4 text-slate-600 font-medium">{l.email}</td>
                         <td className="px-6 py-4 text-slate-600 font-medium">{l.phone || "—"}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-tighter ring-1 ${
                             l.status === 'No Website' ? 'bg-orange-50 text-orange-700 ring-orange-100' : 'bg-blue-50 text-blue-700 ring-blue-100'
                           }`}>
                             {l.status || "—"}
                           </span>
                         </td>
                         <td className="px-6 py-4 font-bold text-primary-700">{l.businessName}</td>
                         <td className="px-6 py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      </>
                    )}
                  </tr>
                ))}
                {(activeTab === "kit" ? kitLeads : websiteLeads).length === 0 && (
                   <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">No leads collected yet.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <button onClick={() => window.location.href = "/"} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-widest">
           ← Return to App
        </button>
      </div>
    </div>
  );
}
