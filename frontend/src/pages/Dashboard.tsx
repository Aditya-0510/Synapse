import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/Modal";
import { Sidebar } from "../components/Sidebar";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import { useEffect, useState, useRef } from "react";
import { useContent } from "../hooks/useContent";
import axios from "axios";
import ShareDropdown from "../components/ShareDropdown";
import { useNavigate } from "react-router-dom";

interface ConfirmDialogProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function LogoutConfirmDialog({ isOpen, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300 transform-gpu">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sign Out</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to sign out? You'll need to sign in again to access your content.
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 cursor-pointer"
            onClick={onConfirm}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

const Dashboard = () => {
  const [modal, setModal] = useState(false);
  const { contents, refresh } = useContent();
  const [shareDropdown, setShareDropdown] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
   const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, [modal, refresh]);

  // handling mouse click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShareDropdown(false);
      }
    };

    if (shareDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [shareDropdown]);

  // handling esc key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShareDropdown(false);
      }
    };

    if (shareDropdown) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [shareDropdown]);

  const filteredContents =
    activeFilter && contents
      ? contents.filter((content: any) => content.type === activeFilter)
      : contents || [];

  const contentCounts = {
    all: contents?.length || 0,
    twitter: contents?.filter((c: any) => c.type === "twitter")?.length || 0,
    youtube: contents?.filter((c: any) => c.type === "youtube")?.length || 0,
    notion: contents?.filter((c: any) => c.type === "notion")?.length || 0,
  };

  const handleFilterChange = (filter: string | null) => {
    setActiveFilter(filter);
  };

  async function shareBrain() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const frontendUrl = import.meta.env.VITE_FRONTEND_URL;

    if (shareUrl && !isSharing) {
      setShareDropdown(!shareDropdown);
      return;
    }

    try {
      setIsSharing(true);
      const response = await axios.post(
        `${backendUrl}/brain/share`,
        {
          share: true,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const url = `${frontendUrl}/share/${response.data.hash}`;
      setShareUrl(url);
      setShareDropdown(true);
    } catch (error) {
      console.error("Error sharing brain:", error);
      alert("Failed to generate share link. Please try again.");
    } finally {
      setIsSharing(false);
    }
  }

 const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
    <div>
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        contentCounts={contentCounts}
      />
      <div className="p-4 ml-76 min-h-screen bg-gray-100">
        <Modal open={modal} onClose={() => setModal(false)} />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeFilter
                ? `${
                    activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)
                  } Content`
                : "All Content"}
            </h2>
            <p className="text-gray-600">
              Showing {filteredContents?.length || 0} of {contents?.length || 0}{" "}
              items
            </p>
          </div>

          <div className="flex gap-4 relative">
            <Button
              startIcon={<PlusIcon size="md" />}
              variant="primary"
              text="Add Content"
              size="sm"
              onClick={() => setModal(true)}
            />

            <div className="relative" ref={dropdownRef}>
              <Button
                startIcon={<ShareIcon size="md" />}
                variant="secondary"
                text={isSharing ? "Generating..." : "Share Brain"}
                size="sm"
                onClick={shareBrain}
                loading={isSharing}
              />

              {shareDropdown && shareUrl && (
                <ShareDropdown
                  url={shareUrl}
                  onClose={() => setShareDropdown(false)}
                />
              )}
            </div>
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-all duration-200 font-medium cursor-pointer"
              title="Sign Out"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>

        {filteredContents.length === 0 ? (
          <div className="text-center py-16"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContents.map(({ type, link, title }) => (
              <Card key={link} type={type} link={link} title={title} />
            ))}
          </div>
        )}
      </div>
    </div>
    <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Dashboard;
