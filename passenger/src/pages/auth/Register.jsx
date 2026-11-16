import React, { useEffect } from 'react';
import RegisterHeader from '../../components/auth/RegisterHeader';
import RegisterForm from '../../components/auth/RegisterForm';
import RegisterFooter from '../../components/auth/RegisterFooter';
import '../../styles/pages/auth/Register.scss';

export default function Register() {
    useEffect(() => {
        document.title = "Auth Register | Kilo Go"
    }, []);

    return (
        <main className='register-page'>
            <div className='register-container'>
                <RegisterHeader />
                <RegisterForm />
                <RegisterFooter />
            </div>
        </main>
    )
}
