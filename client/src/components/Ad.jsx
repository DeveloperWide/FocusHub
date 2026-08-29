import { useEffect } from "react";

const Ad = () => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <ins
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
