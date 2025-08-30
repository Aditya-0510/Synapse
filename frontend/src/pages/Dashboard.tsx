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

const Dashboard = () => {
  const [modal, setModal] = useState(false);
  const { contents, refresh } = useContent();
  const [shareDropdown, setShareDropdown] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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
    if (shareUrl && !isSharing) {
      setShareDropdown(!shareDropdown);
      return;
    }

    try {
      setIsSharing(true);
      const response = await axios.post(
        "http://localhost:3000/api/v1/brain/share",
        {
          share: true,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const url = `http://localhost:5173/share/${response.data.hash}`;
      setShareUrl(url);
      setShareDropdown(true);
    } 
    catch (error) {
      console.error("Error sharing brain:", error);
      alert("Failed to generate share link. Please try again.");
    } 
    finally {
      setIsSharing(false);
    }
  }

  return (
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
  );
};

export default Dashboard;
