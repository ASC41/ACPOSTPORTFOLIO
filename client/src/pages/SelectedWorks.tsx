import { useState, useRef, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import PortfolioItem from "@/components/PortfolioItem";
import InlineFilterModal from "@/components/InlineFilterModal";
import { portfolioData } from "@/lib/portfolio-data";

export default function SelectedWorks() {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Filter portfolio data based on active filter
  const filteredPortfolioData = activeFilter 
    ? portfolioData.filter(item => 
        item.tags?.includes(activeFilter) || 
        item.role.toLowerCase().includes(activeFilter.toLowerCase()) ||
        item.categories.some(cat => cat.toLowerCase().includes(activeFilter.toLowerCase()))
      )
    : portfolioData;

  // Toggle expanded state for a portfolio item
  const handleToggleExpand = (id: string) => {
    // If clicking the same item that's already expanded, close it
    if (expandedItemId === id) {
      setExpandedItemId(null);
    } else {
      // If a different item is already expanded, close it and open the new one
      setExpandedItemId(id);
    }
  };

  // Scroll to the correct position when expanding/collapsing items
  useEffect(() => {
    if (expandedItemId && portfolioRef.current) {
      const expandedItem = document.getElementById(`portfolio-item-${expandedItemId}`);
      if (expandedItem) {
        setTimeout(() => {
          expandedItem.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [expandedItemId]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(activeFilter === filter ? null : filter);
    setExpandedItemId(null); // Close any expanded items when filtering
  };

  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    setExpandedItemId(null); // Close any expanded items when filtering
  };

  const handleFilterClose = () => {
    setActiveFilter(null);
    setExpandedItemId(null);
  };


  return (
    <>
      <HeroSection onFilterClick={handleFilterClick} activeFilter={activeFilter} />

      <section id="portfolio" ref={portfolioRef} className="relative bg-gray-900 portfolio-container space-y-0">
        
        {activeFilter && (
          <div className="px-6 pt-6">
            <InlineFilterModal 
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              onClose={handleFilterClose}
            />
          </div>
        )}
        
        {filteredPortfolioData.map((item, index) => (
          <div key={item.id} id={`portfolio-item-${item.id}`} className="w-full">
            <PortfolioItem
              id={item.id}
              index={index + 1}
              title={item.title}
              subtitle={item.subtitle}
              stillImageUrl={item.stillImageUrl}
              loopVideoUrl={item.loopVideoUrl}
              client={item.client}
              agency={item.agency}
              productionCompany={item.productionCompany}
              role={item.role}
              description={item.description}
              additionalCredits={item.additionalCredits}
              externalLinks={item.externalLinks}
              assets={item.assets}
              isExpanded={expandedItemId === item.id}
              onToggleExpand={handleToggleExpand}
              expandedItemId={expandedItemId}
              overlayImageUrl={item.overlayImageUrl}
              stackedLayout={item.stackedLayout}
            />
          </div>
        ))}
      </section>
    </>
  );
}