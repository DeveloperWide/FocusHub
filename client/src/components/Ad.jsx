import { useEffect, useRef, useState } from "react";

const Ad = () => {
  const adRef = useRef(null);
  const [hasAd, setHasAd] = useState(false);

  useEffect(() => {
    const adElement = adRef.current;

    try {
      if (window.adsbygoogle && adElement) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }

    const observer = new MutationObserver(() => {
      const status = adElement?.getAttribute("data-ad-status");

      if (status === "filled") {
        setHasAd(true);
      }

      if (status === "unfilled") {
        setHasAd(false);
      }
    });

    if (adElement) {
      observer.observe(adElement, {
        attributes: true,
        attributeFilter: ["data-ad-status"],
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className={hasAd ? "w-full overflow-hidden mt-4" : "hidden"}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-6553950675032169"
        data-ad-slot="9617087790"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default Ad;
