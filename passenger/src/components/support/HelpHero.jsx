import { Search } from 'lucide-react';

import Input from '@shared/components/ui/Input';

export default function HelpHero() {
    return (
        <section className="help-hero">

            <span className="help-hero__badge">
                Centre d'aide
            </span>

            <h1>
                Comment pouvons-nous vous aider ?
            </h1>

            <p>
                Recherchez un article ou parcourez nos guides pour
                résoudre rapidement votre problème.
            </p>

            <form className="help-search">

                <Input
                    placeholder="Ex. Vérifier mon email, publier un voyage..."
                />

                <button type="submit">
                    <Search size={18} />
                </button>

            </form>

        </section>
    )
}
