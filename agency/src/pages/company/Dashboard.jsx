
import '../../styles/pages/company/Dashboard.scss';

export default function Dashboard() {
    return (
        <div className='dashboard'>
            <div className="dashboard__container">

                <div className="dashboard__header">
                    <h3>Direction Compagnie de Transport</h3>
                    <p>Pilotage des revenus, programmation des lignes régulières et supervision des taux d'occupation</p>

                    <button>
                        Nouveau départ
                    </button>
                </div>

                <div>
                    <h3>Catalogue des Trajets Interurbains</h3>
                </div>

            </div>
        </div>
    )
}
