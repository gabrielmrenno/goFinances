import React from 'react';
import { TextInputProps } from 'react-native'

import { Container } from './styles';

type Props = TextInputProps;

export function Input({ ...rest }: Props) {
    return (
        <Container
            {...rest}
            placeholderTextColor={'rgba(0,0,0,0.3)'}
        />
    );
}