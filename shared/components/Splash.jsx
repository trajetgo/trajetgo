import React from 'react';
import trajetgo from '../assets/logo.png';
import ActivityIndicator from './ui/ActivityIndicator';
import '../styles/components/Splash.scss';

export default function Splash() {
    return (
        <main className="splash">

            <div style={{ flex: 1 }} />

            <div className="image-wrapper">
                <img
                    src={trajetgo}
                    alt="Kilo Go"
                />

            </div>

            <div style={{ flex: 1 }} />

            <p>
                Réservez. Voyagez. Arrivez.
            </p>

            <ActivityIndicator
                color='white'
                size={32}
                type='digital'
            />
        </main>
    )
}
