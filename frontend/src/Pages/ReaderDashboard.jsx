import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaNewspaper } from "react-icons/fa";
import DashboardShell from "../components/DashboardShell";
import Feed from "../components/Feed";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../store/authSlice";
import { logout as apiLogout } from "../services/auth";


export default function ReaderDashboard() {
  const user = useSelector(s => s.auth.user);
  const [activeTab, setActiveTab] = useState("feed");

  const tabs = [{ key: "feed", label: "Feed", icon: <FaNewspaper /> }];
  
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const handleLogout = async () => {
   try {
     dispatch(logoutAction());   
     await apiLogout();          
   } finally {
     navigate("/login", { replace: true });
   }
 };

  return (
    <DashboardShell
      brand="Writely"
      user={user}
      tabs={tabs}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      onLogout={handleLogout}

    >
      <Feed currentUser={user} writerExtras={false} showOnlyPublished />
    </DashboardShell>
  );
}
