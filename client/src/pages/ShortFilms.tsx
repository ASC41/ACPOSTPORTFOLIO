import { useState, useRef, useEffect } from "react";
import PortfolioItem from "@/components/PortfolioItem";
import { getPortfolioItemsByCategory } from "@/lib/portfolio-data";

export default function ShortFilms() {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  
  // Get portfolio items for Short Films category
  const shortFilmsData = getPortfolioItemsByCategory("Short Films");

  // Toggle expanded state for a portfolio item
  const handleToggleExpand = (id: string) => {
    if (expandedItemId === id) {
      setExpandedItemId(null);
    } else {
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

  return (
    <>

      <section id="portfolio" ref={portfolioRef} className="relative bg-gray-900 portfolio-container space-y-0 pt-20">
        {shortFilmsData.map((item, index) => (
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