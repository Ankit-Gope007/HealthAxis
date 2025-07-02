"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import PageLoadingAnimation from "@/src/animation/PageLoadingAnimation"

export default function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // adjust: fake loading time or use Suspense

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <PageLoadingAnimation />
    </div>
  );
}