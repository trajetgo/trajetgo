import trajetgo from '../assets/logo.png';
import ActivityIndicator from '../components/ui/ActivityIndicator';
import '../styles/components/Loading.scss';

export default function Loading({ message = "" }) {
    return (
        <div className="loading">
            <div className="loading__box">
                <div className="loading__logo">
                    <img
                        src={trajetgo}
                        alt="Kilo Go"
                    />
                </div>

                <ActivityIndicator
                    size={24}
                    color="#072a57"
                    type="digital"
                />

                <p className="loading__message">
                    {message || "Veuillez patienter..."}
                </p>
            </div>
        </div>
    );
}