"use client";

import { Loader } from "@/components/ui/loader";


const Loading = () => {

    return (

        <div className="h-full w-full flex items-center justify-center">
            <Loader />
        </div>
    );
}

export default Loading;