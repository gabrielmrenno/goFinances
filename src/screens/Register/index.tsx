import React, { useEffect, useState } from 'react';
import {
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { useAuth } from '../../hooks/auth';
import { useForm } from 'react-hook-form'

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect'
import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';
import { BottomTabNavigatorProps } from '../../routes/app.routes';

interface FormData {
    name: string;
    amount: string;
}

type RegisterProps = BottomTabScreenProps<BottomTabNavigatorProps, 'Cadastrar'>;

const schema = Yup.object().shape({
    name: Yup
        .string()
        .required('Nome obrigatório'),
    amount: Yup.number()
        .required('Nome obrigatório')
        .typeError('Informe um valor numérico')
        .positive('Valor não pode ser negativo')
})

export function Register({ navigation, route }: RegisterProps) {
    const [transactionsType, setTransactionsType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const { user } = useAuth();

    const dataKey = `@gofinance:transactions_user:${user.id}`;

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'up' | 'down') {
        setTransactionsType(type);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (!transactionsType)
            return Alert.alert('Selecione o tipo de transação');

        if (category.key === "category")
            return Alert.alert('Selecione uma categoria');

        const newData = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionsType,
            category: category.key,
            date: new Date()
        }


        try {
            //getItem() return the data as string
            const data = await AsyncStorage.getItem(dataKey);
            // convert to JSON, if data is not null
            const currentData = data ? JSON.parse(data) : [];

            // Concatenate de newData to currentData as JSON
            const dataFormatted = [...currentData, newData];

            // To store the new currentData in the AsyncStorage, after parse the data to string
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
        } catch (error) {
            console.log(error);
            Alert.alert('Erro ao cadastrar');
        }

        // To reset all input from react-hook-form
        reset();

        // To reset other fields that uses state
        setTransactionsType('');
        setCategory({
            key: 'category',
            name: 'Categoria',
        });

        navigation.navigate('Listagem');
    }

    return (
        <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
        >
            <Container>

                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome"
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control}
                            placeholder="Preço"
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionsTypes>
                            <TransactionTypeButton
                                type='up'
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('up')}
                                isActive={transactionsType === 'up'}
                            />
                            <TransactionTypeButton
                                type='down'
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('down')}
                                isActive={transactionsType === 'down'}
                            />
                        </TransactionsTypes>

                        <CategorySelectButton
                            title={category.name}
                            onPress={handleOpenSelectCategoryModal}
                        />
                    </Fields>

                    <Button
                        title='Enviar'
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal
                    visible={categoryModalOpen}
                >
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>

            </Container>
        </TouchableWithoutFeedback>
    );
}