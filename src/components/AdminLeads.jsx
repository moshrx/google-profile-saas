import { useState, useEffect } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

/**
 * Admin Leads Dashboard (Feature 5)
 */
export default function AdminLeads() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("listedpei_admin_auth") === "true"
  );
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
      sessionStorage.setItem("listedpei_admin_auth", "true");
    } else {
      alert("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("listedpei_admin_auth");
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md glass-dark border-white/10 p-10 rounded-[2rem] shadow-2xl relative z-10 animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner border border-white/5">
              <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Gateway</h1>
            <p className="text-slate-400 text-sm mt-2">Enter credentials to securely view leads.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block ml-1">Master Password</label>
              <input
                type="password"
                className="w-full bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2">
              Unlock Gateway
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button onClick={() => window.location.href = "/"} className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
              ← Return Home
            </button>
          </div>
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
             <button onClick={() => exportCSV(activeTab)} className="btn-primary bg-emerald-600 hover:bg-emerald-700 py-2">
               Export {activeTab.toUpperCase()} CSV
             </button>
             <button onClick={clearLeads} className="text-[10px] font-black text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg uppercase tracking-widest transition-colors">
               Clear
             </button>
             <button onClick={handleLogout} className="text-[10px] font-black text-slate-500 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-lg uppercase tracking-widest transition-colors">
               Logout
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
