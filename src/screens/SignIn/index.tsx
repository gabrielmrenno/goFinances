import React, { useContext, useState } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

import AppleSvg from '../../@types/assets/apple.svg';
import GoogleSvg from '../../@types/assets/google.svg';
import LogoSvg from '../../@types/assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';

import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();
    const theme = useTheme();

    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            return await signInWithGoogle();
        } catch (err) {
            console.log(err);
            Alert.alert('Não foi possível conectar à conta google');
            setIsLoading(false);
        }
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            return await signInWithApple();
        } catch (err) {
            console.log(err);
            Alert.alert('Não foi possível conectar à conta Apple');
            setIsLoading(false);
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                </TitleWrapper>

                <Title>
                    Controle suas {'\n'}
                    finanças de forma {'\n'}
                    muito simples
                </Title>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>

                {isLoading
                    ? <ActivityIndicator color={theme.colors.shape} />
                    : <FooterWrapper>
                        <SignInSocialButton
                            title="Entrar com Google"
                            svg={GoogleSvg}
                            onPress={handleSignInWithGoogle}
                        />
                        {Platform.OS === 'ios' &&
                            <SignInSocialButton
                                title="Entrar com Apple"
                                svg={AppleSvg}
                                onPress={handleSignInWithApple}
                            />}
                    </FooterWrapper>}
            </Footer>
        </Container>
    );
}