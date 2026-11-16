import { useCallback, useEffect, useState } from "react"
import service from "../services/dashboard.service"

export default function useDashboard() {
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState("");
    const [data, setData] = useState([]);

    const loadData = useCallback(async () => {
        setLoading(true);
        setServerError("");

        try {
            const result = await service.getDashboard();

            if (!result.success) {
                setServerError("Une erreur est survenue");
            }

            setData(result.data);
        } catch (error) {
            setServerError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData])

    return {
        loading,
        serverError,

        data,

        refresh: loadData,
    }
}
