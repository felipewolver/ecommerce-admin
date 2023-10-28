import { useEffect, useState } from "react";


/* A origem seria: http://localhost:3000/api/63999ed9-d4ff-498c-80bb-9df74fadc38d 
   a numeração depois do ../api/ eh seu storeId atual q eh passado pelo useParams()    
*/
export const useOrigin = () => {
    const [mounted, setMounted] = useState(false);
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return ''
    }

    return origin;
};