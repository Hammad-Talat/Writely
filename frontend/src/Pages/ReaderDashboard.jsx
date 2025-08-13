// src/Pages/ReaderDashboard.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaNewspaper } from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import Feed from "../components/Feed";

export default function ReaderDashboard() {
  const user = useSelector(s => s.auth.user);
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [{ key: "feed", label: "Feed", icon: <FaNewspaper /> }];

  return (
    <DashboardShell
      brand="Writely"
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onLogout={() => {  }}
    >
      <Feed currentUser={user} writerExtras={false} showOnlyPublished />
    </DashboardShell>
  );
}
