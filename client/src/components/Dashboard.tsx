// client/src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    Calendar,
    TrendingUp,
    Filter,
    Download,
    Search,
    Mail,
    Phone,
    MapPin,
    Clock,
    BookOpen,
    Target,
    BarChart3,
    PieChart,
    Activity,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { useLocation } from "wouter";
import { getApiBase } from "@/lib/queryClient";

import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RePieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Types from your schema
type Attendee = {
    id: string;
    name: string;
    email: string;
    mobile: string;
    companyName?: string;
    registeredAt: Date;
};

type Enrollment = {
    id: string;
    fullName: string;
    mobile: string;
    email: string;
    city: string;
    ageGroup: string;
    currentRole: string;
    blockchainCoding?: string;
    cryptoDefi?: string;
    nftWeb3?: string;
    preferredMode: string;
    preferredTiming: string;
    hearAboutUs: string;
    whyLearn: string;
    enrolledAt: Date;
};

// API service functions
const apiService = {
    // Fetch all attendees
    async fetchAttendees(): Promise<Attendee[]> {
        try {
            const apiBase = getApiBase();
            const url = `${apiBase}/api/attendees`;
            console.log("Fetching attendees from:", url);
            const response = await fetch(url);
            console.log("Attendees response status:", response.status);
            if (!response.ok) throw new Error(`Failed to fetch attendees: ${response.status}`);
            const data = await response.json();
            return data.attendees || [];
        } catch (error) {
            console.error("Error fetching attendees:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    },

    // Fetch all enrollments
    async fetchEnrollments(): Promise<Enrollment[]> {
        try {
            const apiBase = getApiBase();
            const url = `${apiBase}/api/enrollments`;
            console.log("Fetching enrollments from:", url);
            const response = await fetch(url);
            console.log("Enrollments response status:", response.status);
            if (!response.ok) throw new Error(`Failed to fetch enrollments: ${response.status}`);
            const data = await response.json();
            return data.enrollments || [];
        } catch (error) {
            console.error("Error fetching enrollments:", error instanceof Error ? error.message : String(error));
            throw error;
        }
    },

    // Export data to CSV
    async exportToCSV(
        type: "attendees" | "enrollments",
        filters?: any
    ): Promise<void> {
        try {
            const queryParams = new URLSearchParams(filters || {}).toString();
            const response = await fetch(`${getApiBase()}/api/export/${type}${queryParams ? `?${queryParams}` : ""}`);
            if (!response.ok) throw new Error("Failed to export data");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}-export-${
                new Date().toISOString().split("T")[0]
            }.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error exporting data:", error);
            throw error;
        }
    },
};

// Process data for charts
const processEnrollmentData = (enrollments: Enrollment[]) => {
    const monthlyData = enrollments.reduce((acc, enrollment) => {
        const month = new Date(enrollment.enrolledAt).toLocaleString(
            "default",
            { month: "short", year: "numeric" }
        );
        if (!acc[month]) acc[month] = 0;
        acc[month]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
    }));
};

const processAgeGroupData = (enrollments: Enrollment[]) => {
    const ageGroups = enrollments.reduce((acc, enrollment) => {
        if (!acc[enrollment.ageGroup]) acc[enrollment.ageGroup] = 0;
        acc[enrollment.ageGroup]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(ageGroups).map(([ageGroup, count]) => ({
        ageGroup,
        count,
    }));
};

const processRoleData = (enrollments: Enrollment[]) => {
    const roles = enrollments.reduce((acc, enrollment) => {
        if (!acc[enrollment.currentRole]) acc[enrollment.currentRole] = 0;
        acc[enrollment.currentRole]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(roles).map(([role, count]) => ({
        role,
        count,
    }));
};

const processSkillData = (enrollments: Enrollment[]) => {
    const skills: Record<string, Record<string, number>> = {
        blockchainCoding: { Beginner: 0, Intermediate: 0, Advanced: 0 },
        cryptoDefi: { Beginner: 0, Intermediate: 0, Advanced: 0 },
        nftWeb3: { Beginner: 0, Intermediate: 0, Advanced: 0 },
    };

    enrollments.forEach((enrollment) => {
        if (enrollment.blockchainCoding && skills.blockchainCoding) {
            skills.blockchainCoding[enrollment.blockchainCoding]++;
        }
        if (enrollment.cryptoDefi && skills.cryptoDefi) {
            skills.cryptoDefi[enrollment.cryptoDefi]++;
        }
        if (enrollment.nftWeb3 && skills.nftWeb3) {
            skills.nftWeb3[enrollment.nftWeb3]++;
        }
    });

    return skills;
};

const COLORS = [
    "#8b5cf6",
    "#ec4899",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
];

// Loading component
const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
    </div>
);

// Error component
const ErrorMessage = ({
    message,
    onRetry,
}: {
    message: string;
    onRetry: () => void;
}) => (
    <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-400 mb-4">{message}</p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
        </button>
    </div>
);

export default function Dashboard() {
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<
        Enrollment[]
    >([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("All");
    const [filterAgeGroup, setFilterAgeGroup] = useState("All");
    const [filterMode, setFilterMode] = useState("All");
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [, navigate] = useLocation(); // Add this if using wouter
    // const navigate = useNavigate(); // Add this if using react-router-dom

    // Add session check effect
    useEffect(() => {
        const checkSession = () => {
            const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
            const loginTime = localStorage.getItem("loginTime");

            if (isLoggedIn !== "true" || !loginTime) {
                navigate("/login");
                return;
            }

            const loginDate = new Date(loginTime);
            const now = new Date();
            const hoursDiff =
                (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

            if (hoursDiff >= 24) {
                localStorage.removeItem("isAdminLoggedIn");
                localStorage.removeItem("loginTime");
                navigate("/login");
            }
        };

        // Check session every 5 minutes
        const interval = setInterval(checkSession, 300000);
        checkSession();

        return () => clearInterval(interval);
    }, [navigate]);
    // Fetch data from database
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch both attendees and enrollments in parallel
            const [attendeesData, enrollmentsData] = await Promise.all([
                apiService.fetchAttendees(),
                apiService.fetchEnrollments(),
            ]);

            setAttendees(attendeesData);
            setEnrollments(enrollmentsData);
            setFilteredEnrollments(enrollmentsData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = enrollments;

        if (searchTerm) {
            filtered = filtered.filter(
                (enrollment) =>
                    enrollment.fullName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    enrollment.city
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        if (filterRole !== "All") {
            filtered = filtered.filter(
                (enrollment) => enrollment.currentRole === filterRole
            );
        }

        if (filterAgeGroup !== "All") {
            filtered = filtered.filter(
                (enrollment) => enrollment.ageGroup === filterAgeGroup
            );
        }

        if (filterMode !== "All") {
            filtered = filtered.filter(
                (enrollment) => enrollment.preferredMode === filterMode
            );
        }

        setFilteredEnrollments(filtered);
    }, [enrollments, searchTerm, filterRole, filterAgeGroup, filterMode]);

    // Process data for charts
    const monthlyData = processEnrollmentData(enrollments);
    const ageGroupData = processAgeGroupData(enrollments);
    const roleData = processRoleData(enrollments);
    const skillData = processSkillData(enrollments);

    // Calculate statistics
    const totalAttendees = attendees.length;
    const totalEnrollments = enrollments.length;
    const onlineEnrollments = enrollments.filter(
        (e) => e.preferredMode === "Online"
    ).length;
    const offlineEnrollments = enrollments.filter(
        (e) => e.preferredMode === "Offline"
    ).length;
    const thisMonthEnrollments = enrollments.filter((e) => {
        const now = new Date();
        const enrollmentDate = new Date(e.enrolledAt);
        return (
            enrollmentDate.getMonth() === now.getMonth() &&
            enrollmentDate.getFullYear() === now.getFullYear()
        );
    }).length;

    // Handle export
    const handleExport = async (type: "attendees" | "enrollments") => {
        try {
            const filters =
                type === "enrollments"
                    ? {
                          role: filterRole !== "All" ? filterRole : undefined,
                          ageGroup:
                              filterAgeGroup !== "All"
                                  ? filterAgeGroup
                                  : undefined,
                          mode: filterMode !== "All" ? filterMode : undefined,
                          search: searchTerm || undefined,
                      }
                    : {};

            await apiService.exportToCSV(type, filters);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to export data"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white flex items-center justify-center">
                <ErrorMessage message={error} onRetry={fetchData} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold">
                                TechARA Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={fetchData}
                                data-testid="button-refresh"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                title="Refresh Data">
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button 
                                data-testid="button-filter"
                                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                title="Filter Data">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tabs */}
                <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg w-fit">
                    {["overview", "attendees", "enrollments"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-md transition-all ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                    : "text-gray-400 hover:text-white"
                            }`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-purple-300">
                                        Live
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {totalAttendees}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Total Attendees
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-gradient-to-br from-pink-900/30 to-pink-900/10 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center">
                                        <UserCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-pink-300">
                                        Live
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {totalEnrollments}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Total Enrollments
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 backdrop-blur-sm border border-blue-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-blue-300">
                                        This Month
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {thisMonthEnrollments}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    New Enrollments
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-gradient-to-br from-green-900/30 to-green-900/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-green-300">
                                        {totalEnrollments > 0
                                            ? Math.round(
                                                  (onlineEnrollments /
                                                      totalEnrollments) *
                                                      100
                                              )
                                            : 0}
                                        %
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {onlineEnrollments}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Online Students
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-orange-300">
                                        {totalEnrollments > 0
                                            ? Math.round(
                                                  (offlineEnrollments /
                                                      totalEnrollments) *
                                                      100
                                              )
                                            : 0}
                                        %
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-1">
                                    {offlineEnrollments}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Offline Students
                                </p>
                            </motion.div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Enrollment Trend */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Enrollment Trend
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={monthlyData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#374151"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#9CA3AF"
                                        />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1F2937",
                                                border: "1px solid #374151",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#8B5CF6"
                                            fill="#8B5CF6"
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Age Groups */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Age Groups
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <RePieChart>
                                        <Pie
                                            data={ageGroupData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) =>
                                                `${name} ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count">
                                            {ageGroupData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1F2937",
                                                border: "1px solid #374151",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Current Roles */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 }}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Current Roles
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={roleData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#374151"
                                        />
                                        <XAxis
                                            dataKey="role"
                                            stroke="#9CA3AF"
                                        />
                                        <YAxis stroke="#9CA3AF" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1F2937",
                                                border: "1px solid #374151",
                                                borderRadius: "8px",
                                            }}
                                        />
                                        <Bar dataKey="count" fill="#EC4899" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Skill Levels */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                                <h3 className="text-xl font-semibold mb-4">
                                    Skill Levels
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(skillData).map(
                                        ([skill, levels]) => (
                                            <div
                                                key={skill}
                                                className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="capitalize">
                                                        {skill
                                                            .replace(
                                                                /([A-Z])/g,
                                                                " $1"
                                                            )
                                                            .trim()}
                                                    </span>
                                                    <span>
                                                        {Object.values(
                                                            levels
                                                        ).reduce(
                                                            (a, b) => a + b,
                                                            0
                                                        )}{" "}
                                                        students
                                                    </span>
                                                </div>
                                                <div className="flex space-x-2">
                                                    {Object.entries(levels).map(
                                                        ([level, count]) => (
                                                            <div
                                                                key={level}
                                                                className="flex-1">
                                                                <div className="text-xs text-gray-400 mb-1">
                                                                    {level}
                                                                </div>
                                                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                                                        style={{
                                                                            width: `${
                                                                                (count /
                                                                                    Object.values(
                                                                                        levels
                                                                                    ).reduce(
                                                                                        (
                                                                                            a,
                                                                                            b
                                                                                        ) =>
                                                                                            a +
                                                                                            b,
                                                                                        0
                                                                                    )) *
                                                                                100
                                                                            }%`,
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Attendees Tab */}
                {activeTab === "attendees" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold">
                                Attendees ({attendees.length})
                            </h3>
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search attendees..."
                                        className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    onClick={() => handleExport("attendees")}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium flex items-center space-x-2">
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                            Name
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                            Email
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                            Mobile
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                            Company
                                        </th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                            Registered At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendees.map((attendee, index) => (
                                        <motion.tr
                                            key={attendee.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                            }}
                                            className="border-b border-slate-700 hover:bg-slate-700/50">
                                            <td className="py-3 px-4 text-sm">
                                                {attendee.name}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {attendee.email}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {attendee.mobile}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {attendee.companyName || "-"}
                                            </td>
                                            <td className="py-3 px-4 text-sm">
                                                {new Date(
                                                    attendee.registeredAt
                                                ).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {/* Enrollments Tab */}
                {activeTab === "enrollments" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6">
                        {/* Filters */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                Filters
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search enrollments..."
                                            className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white w-full"
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Role
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                        value={filterRole}
                                        onChange={(e) =>
                                            setFilterRole(e.target.value)
                                        }>
                                        <option value="All">All Roles</option>
                                        <option value="Student">Student</option>
                                        <option value="Working Professional">
                                            Working Professional
                                        </option>
                                        <option value="Business Owner">
                                            Business Owner
                                        </option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Age Group
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                        value={filterAgeGroup}
                                        onChange={(e) =>
                                            setFilterAgeGroup(e.target.value)
                                        }>
                                        <option value="All">
                                            All Age Groups
                                        </option>
                                        <option value="15-20">15-20</option>
                                        <option value="21-25">21-25</option>
                                        <option value="26-30">26-30</option>
                                        <option value="31+">31+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Preferred Mode
                                    </label>
                                    <select
                                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                                        value={filterMode}
                                        onChange={(e) =>
                                            setFilterMode(e.target.value)
                                        }>
                                        <option value="All">All Modes</option>
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Enrollments Table */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">
                                    Enrollments ({filteredEnrollments.length})
                                </h3>
                                <button
                                    onClick={() => handleExport("enrollments")}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-medium flex items-center space-x-2">
                                    <Download className="w-4 h-4" />
                                    <span>Export CSV</span>
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Name
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Email
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Mobile
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                City
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Age Group
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Role
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Mode
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Timing
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Source
                                            </th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                                                Enrolled At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnrollments.map(
                                            (enrollment, index) => (
                                                <motion.tr
                                                    key={enrollment.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                        delay: index * 0.05,
                                                    }}
                                                    className="border-b border-slate-700 hover:bg-slate-700/50">
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.fullName}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.email}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.mobile}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.city}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.ageGroup}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.currentRole}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                enrollment.preferredMode ===
                                                                "Online"
                                                                    ? "bg-blue-500/20 text-blue-400"
                                                                    : "bg-green-500/20 text-green-400"
                                                            }`}>
                                                            {
                                                                enrollment.preferredMode
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {
                                                            enrollment.preferredTiming
                                                        }
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {enrollment.hearAboutUs}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm">
                                                        {new Date(
                                                            enrollment.enrolledAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                </motion.tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
