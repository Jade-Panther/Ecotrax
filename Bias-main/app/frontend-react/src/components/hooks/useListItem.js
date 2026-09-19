import { useEffect, useState } from "react";
import { goto } from "../map/Map";

export function useListItem(item, onPromote) {
    const [isOpen, setIsOpen] = useState(false);

    const promote = () => onPromote?.(item.id);

    useEffect(() => {
        const handleMapSelection = (e) => {
            if (e.detail.id === item.id) {
                setIsOpen(true);
                promote();
            }
        };

        document.addEventListener("mapMarkerSelected", handleMapSelection);

        return () => {
            document.removeEventListener("mapMarkerSelected", handleMapSelection);
        };
    }, [item.id]);

    const handleGotoClick = () => {
        goto(item.lat ?? item.latitude, item.lon ?? item.longitude);
        promote();
    };

    const handleToggleClick = () => {
        setIsOpen((prev) => !prev);
    };

    return {
        isOpen,
        handleGotoClick,
        handleToggleClick,
    };
}