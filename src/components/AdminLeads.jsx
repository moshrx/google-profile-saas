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
  const [activeTab, setActiveTab] = useState("kit");
  const [kitLeads, setKitLeads] = useState([]);
  const [websiteLeads, setWebsiteLeads] = useState([]);
  const [grantLeads, setGrantLeads] = useState([]);

  useEffect(() => {
    const kitData = JSON.parse(localStorage.getItem("listedpei_leads") || "[]");
    const websiteData = JSON.parse(localStorage.getItem("listedpei_website_leads") || "[]");
    const grantData = JSON.parse(localStorage.getItem("listedpei_grant_leads") || "[]");
    setKitLeads(kitData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    setWebsiteLeads(websiteData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
    setGrantLeads(grantData.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
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
    const data = type === "kit" ? kitLeads : type === "website" ? websiteLeads : grantLeads;
    if (data.length === 0) return;

    let headers = type === "kit" 
      ? "Email,Business Name,Category,City,Date\n"
      : type === "website"
      ? "Name,Email,Phone,Status,Message,Business,Date\n"
      : "Email,Business Type,Business Age,Employees,Website,Funding Goal,Matched Grants,Date\n";
    
    let csvContent = headers + data.map(l => {
      if (type === "kit") {
        return `${l.email},${l.businessName},${l.category},${l.city},${l.timestamp}`;
      } else if (type === "website") {
        return `${l.name},${l.email},${l.phone || ""},${l.status || ""},"${(l.message || "").replace(/"/g, '""')}",${l.businessName},${l.timestamp}`;
      } else {
        const answers = l.answersLabel || l.answers || {};
        const matched = Array.isArray(l.matchedGrants) ? l.matchedGrants.join("; ") : "";
        return `${l.email || ""},${answers.businessType || ""},${answers.businessAge || ""},${answers.employees || ""},${answers.website || ""},${answers.fundingGoal || ""},"${matched.replace(/"/g, '""')}",${l.timestamp}`;
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
      } else if (activeTab === "website") {
        localStorage.removeItem("listedpei_website_leads");
        setWebsiteLeads([]);
      } else {
        localStorage.removeItem("listedpei_grant_leads");
        setGrantLeads([]);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-primary-500/20 blur-[60px] sm:blur-[100px] rounded-full pointer-events-none"></div>

        <div className="w-full max-w-md glass-dark border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] shadow-2xl relative z-10 animate-fade-in-up">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center mb-4 sm:mb-6 shadow-inner border border-white/5">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Admin Gateway</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">Enter credentials to securely view leads.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
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
            <button type="submit" className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-2 tap-target">
              Unlock Gateway
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </form>
          
          <div className="mt-6 sm:mt-8 text-center border-t border-white/5 pt-4 sm:pt-6">
            <button onClick={() => window.location.href = "/"} className="text-slate-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest tap-target">
              ← Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentLeads = activeTab === "kit" ? kitLeads : activeTab === "website" ? websiteLeads : grantLeads;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Leads Dashboard</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Manage and export your collected potential customers.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
             <button onClick={() => exportCSV(activeTab)} className="btn-primary bg-emerald-600 hover:bg-emerald-700 py-2 text-xs sm:text-sm">
               <span className="hidden sm:inline">Export {activeTab.toUpperCase()} CSV</span>
               <span className="sm:hidden">Export CSV</span>
             </button>
             <button onClick={clearLeads} className="text-[10px] font-black text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg uppercase tracking-widest transition-colors tap-target">
               Clear
             </button>
             <button onClick={handleLogout} className="text-[10px] font-black text-slate-500 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 px-3 py-2 rounded-lg uppercase tracking-widest transition-colors tap-target">
               Logout
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 bg-slate-200/50 p-1.5 rounded-xl sm:rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("kit")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all tap-target ${
              activeTab === "kit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            GBP Kit Leads ({kitLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("website")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all tap-target ${
              activeTab === "website" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Website Leads ({websiteLeads.length})
          </button>
          <button
            onClick={() => setActiveTab("grant")}
            className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all tap-target ${
              activeTab === "grant" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Grant Leads ({grantLeads.length})
          </button>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {currentLeads.length === 0 ? (
            <div className="card p-8 text-center text-slate-400 font-medium">
              No leads collected yet.
            </div>
          ) : (
            currentLeads.map((l, i) => (
              <div key={i} className="card p-4 space-y-3">
                {activeTab === "kit" ? (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{l.email}</p>
                        <p className="text-slate-600 text-xs">{l.businessName}</p>
                      </div>
                      <span className="px-2 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded uppercase tracking-tighter ring-1 ring-primary-100">
                        {l.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">{l.city}</span>
                      <span className="text-slate-400">{new Date(l.timestamp).toLocaleDateString()}</span>
                    </div>
                  </>
                ) : activeTab === "website" ? (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{l.name}</p>
                        <p className="text-slate-600 text-xs">{l.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter ring-1 ${
                        l.status === 'No Website' ? 'bg-orange-50 text-orange-700 ring-orange-100' : 'bg-blue-50 text-blue-700 ring-blue-100'
                      }`}>
                        {l.status || "—"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{l.phone || "No phone"}</p>
                    <p className="text-xs text-primary-700 font-bold">{l.businessName}</p>
                    <p className="text-xs text-slate-400">{new Date(l.timestamp).toLocaleDateString()}</p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{l.email || "—"}</p>
                        <p className="text-slate-600 text-xs">Grant Quiz Lead</p>
                      </div>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded uppercase tracking-tighter ring-1 ring-emerald-100">
                        {Array.isArray(l.matchedGrants) && l.matchedGrants.length > 0 ? `${l.matchedGrants.length} match` : "No match"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {(l.matchedGrants || []).join(", ") || "No matched grants"}
                    </p>
                    <p className="text-xs text-slate-400">{new Date(l.timestamp).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block card shadow-xl overflow-hidden border-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {activeTab === "kit" ? (
                    <>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Business Name</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">City</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </>
                  ) : activeTab === "website" ? (
                    <>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Phone</th>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Business</th>
                       <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Business Type</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Age</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employees</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Funding Goal</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Matched Grants</th>
                      <th className="px-4 lg:px-6 py-3 lg:py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLeads.map((l, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {activeTab === "kit" ? (
                      <>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-800 text-sm">{l.email}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.businessName}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                          <span className="px-2 py-1 bg-primary-50 text-primary-700 text-[10px] font-bold rounded uppercase tracking-tighter ring-1 ring-primary-100">
                            {l.category}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.city}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      </>
                    ) : activeTab === "website" ? (
                      <>
                         <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-800 text-sm">{l.name}</td>
                         <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.email}</td>
                         <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.phone || "—"}</td>
                         <td className="px-4 lg:px-6 py-3 lg:py-4">
                           <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-tighter ring-1 ${
                             l.status === 'No Website' ? 'bg-orange-50 text-orange-700 ring-orange-100' : 'bg-blue-50 text-blue-700 ring-blue-100'
                           }`}>
                             {l.status || "—"}
                           </span>
                         </td>
                         <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-primary-700 text-sm">{l.businessName}</td>
                         <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 font-bold text-slate-800 text-sm">{l.email || "—"}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.answersLabel?.businessType || l.answers?.businessType || "—"}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.answersLabel?.businessAge || l.answers?.businessAge || "—"}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.answersLabel?.employees || l.answers?.employees || "—"}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-600 font-medium text-sm">{l.answersLabel?.fundingGoal || l.answers?.fundingGoal || "—"}</td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-500 text-xs">
                          {(l.matchedGrants || []).join(", ") || "No matched grants"}
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-slate-400 text-xs">{new Date(l.timestamp).toLocaleString()}</td>
                      </>
                    )}
                  </tr>
                ))}
                {currentLeads.length === 0 && (
                   <tr>
                    <td colSpan={activeTab === "kit" ? 5 : activeTab === "website" ? 6 : 7} className="px-6 py-12 text-center text-slate-400 font-medium">
                      No leads collected yet.
                    </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 text-center">
        <button onClick={() => window.location.href = "/"} className="text-slate-400 hover:text-slate-600 font-bold uppercase text-[10px] tracking-widest tap-target">
           ← Return to App
        </button>
      </div>
    </div>
  );
}
