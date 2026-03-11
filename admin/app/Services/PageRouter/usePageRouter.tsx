"use client";
import { useRouter } from "next/navigation";
import { use, useCallback } from "react";

export function usePageRouter(){
    const router = useRouter();

    const navigate = useCallback((destination: string) => {
        router.push(destination);
    },[router]);

    return {navigate};
}