import React, { useContext } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import {
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper
} from './styles';

import { useAuth } from '../../hooks/auth';

import AppleSvg from '../../@types/assets/apple.svg';
import GoogleSvg from '../../@types/assets/google.svg';
import LogoSvg from '../../@types/assets/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';

export function SignIn() {
    const data = useAuth();

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
                <FooterWrapper>
                    <SignInSocialButton
                        title="Entrar com Google"
                        svg={GoogleSvg}
                    />
                    <SignInSocialButton
                        title="Entrar com Apple"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    );
}