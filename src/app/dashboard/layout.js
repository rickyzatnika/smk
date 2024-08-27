"use client";

import Aside from "@/components/Dashboard/Aside";
import ResizeAttention from "@/components/ResizeAttention";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import useSWR from "swr";

const fetcher =
  (...args) =>
  () =>
    fetch(...args).then((res) => res.json());

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_DEV}/api/daftar`,
    fetcher
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "user") {
      router.push("/");
    } else if (status === "unauthenticated") {
      router.push("/");
    }
  }, [router, session, status]);

  // NOTIFICATIONS
  const [notifiedMurids, setNotifiedMurids] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notifiedRiders");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (data && data.murid) {
      const newMurid = data?.murid;

      // Filter riders that haven't been notified yet
      const newMuridToNotify = newMurid.filter(
        (murid) => !notifiedMurids.includes(murid._id)
      );

      if (newMuridToNotify.length > 0) {
        toast.info(`Yeaay ${newMuridToNotify.length} rider baru registrasi`);

        // Update the state and localStorage to include the notified riders
        const updatedNotifiedMurids = [
          ...notifiedMurids,
          ...newMuridToNotify.map((murid) => murid._id),
        ];
        setNotifiedMurids(updatedNotifiedMurids);
        localStorage.setItem(
          "notifiedMurids",
          JSON.stringify(updatedNotifiedMurids)
        );
      }
    }
  }, [data, notifiedMurids, mutate]);

  return (
    <>
      <ResizeAttention />
      <ToastContainer theme="dark" />
      <div className="w-full flex h-full">
        <div className="basis-[16%]">
          <Aside />
        </div>
        <div className="w-full basis-[84%] border-l border-gray-400 dark:border-gray-800 overflow-x-auto h-screen px-3 py-4">
          {children}
        </div>
      </div>
    </>
  );
}
