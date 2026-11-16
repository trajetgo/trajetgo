import React, { useEffect } from 'react';
import LoginHeader from '../../components/auth/LoginHeader';
import LoginForm from '../../components/auth/LoginForm';
import LoginFooter from '../../components/auth/LoginFooter';
import '../../styles/pages/auth/Login.scss';

export default function Login() {
    useEffect(() => {
        document.title = "Auth Login | Trajet Go"
    }, []);

    return (
        <main className='login-page'>
            <div className='login-container'>
                <LoginHeader />
                <LoginForm />
                <LoginFooter />
            </div>
        </main>
    )
}
