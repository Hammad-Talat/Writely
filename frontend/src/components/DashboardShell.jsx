import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaUserCircle, FaSignOutAlt, FaIdBadge } from "react-icons/fa";

export default function DashboardShell({ brand="Writely", user, tabs, activeTab, onChangeTab, onLogout, children }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen text-white font-sans bg-gradient-to-tr from-gray-900 via-black to-gray-800">
      <aside className="w-16 sm:w-20 md:w-64 fixed top-0 left-0 h-full bg-white/10 backdrop-blur-xl shadow-xl p-3 sm:p-4 md:p-6 space-y-4 z-40">
        <h1 className="text-xl md:text-2xl font-bold hidden sm:block">{brand}</h1>
        <nav className="space-y-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onChangeTab(t.key)}
              className={`flex items-center w-full justify-center sm:justify-start px-2 py-2 sm:px-3 sm:py-3 rounded-lg md:rounded-xl transition-all font-medium shadow-md hover:shadow-lg gap-2 text-sm
                ${activeTab === t.key ? "bg-gradient-to-r from-indigo-400 to-cyan-400 text-black" : "text-white/85 hover:bg-white/10"}`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="ml-16 sm:ml-20 md:ml-64 p-4 sm:p-6">
        <div className="flex justify-end">
          <div className="relative">
            <button onClick={() => setDropdownOpen(v => !v)}
              className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full hover:bg-white/20 transition shadow-md text-sm">
              <FaUserCircle />
              <span className="hidden sm:inline">{user?.username || "Profile"}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg py-2 z-50 text-sm">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center gap-2"
                  onClick={() => { setProfileOpen(true); setDropdownOpen(false); }}
                >
                  <FaIdBadge /> Profile Details
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/20 flex items-center gap-2 text-red-300 hover:text-red-400"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>

      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen p-4 bg-black/40 backdrop-blur-sm">
          <Dialog.Panel className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md ring-1 ring-white/20">
            <Dialog.Title className="text-xl font-bold mb-3">Profile</Dialog.Title>
            <div className="space-y-2 text-sm">
              <div><span className="text-white/70">Username:</span> <span className="font-medium">{user?.username}</span></div>
              <div><span className="text-white/70">Role:</span> <span className="font-medium">{user?.role}</span></div>
              <div><span className="text-white/70">Email:</span> <span className="font-medium">{user?.email}</span></div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setProfileOpen(false)} className="rounded-lg bg-white px-4 py-2 text-neutral-900">Close</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
