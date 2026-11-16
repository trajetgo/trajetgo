import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState
} from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        show: false,
        type: 'info',
        title: '',
        message: '',
        duration: 3000,
    });

    const showToast = useCallback(
        (
            type = 'info',
            title = '',
            message = '',
            options = {}
        ) => {
            setToast({
                show: true,
                type,
                title,
                message,
                duration: options.duration || 3000,
            });
        },
        []
    );

    const closeToast = useCallback(() => {
        setToast(prev => ({
            ...prev,
            show: false,
        }));
    }, []);

    const value = useMemo(
        () => ({
            toast,
            showToast,
            closeToast,
        }),
        [toast, showToast, closeToast]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            'useToast must be used within a ToastProvider'
        );
    }

    return context;
}