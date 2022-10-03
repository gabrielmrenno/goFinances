import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components'

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    TransactionList,
    Transactions,
    Title,
    LoadContainer
} from './styles';
import { BorderlessButton } from 'react-native-gesture-handler';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    total: string;
    lastTransaction: string;
}
interface HighlightData {
    entries: HighlightProps,
    expensives: HighlightProps,
    balance: HighlightProps,
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DataListProps[]>();
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    const { signOut, user } = useAuth();

    function getLastTransitionDate(
        collection: DataListProps[],
        type: 'up' | 'down'
    ) {
        const collectionFiltered = collection
            .filter((transaction: DataListProps) => transaction.type === type);

        if (collectionFiltered.length === 0) {
            return 0;
        }

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
                .map((transaction: DataListProps) => new Date(transaction.date).getTime())));


        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-br', { month: 'long' })}`
    }

    async function loadTransaction() {
        const dataKey = `@gofinance:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
            .map((item: DataListProps) => {
                if (item.type === 'up') {
                    entriesTotal += Number(item.amount);
                } else {
                    expensiveTotal += Number(item.amount);
                }

                // Formatting amount to a BRL currency
                const amount = Number(item.amount)
                    .toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    });

                // Formatting date to a BRL date (dd-mm-yy)
                const date = Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }).format(new Date(item.date));

                return {
                    id: item.id,
                    name: item.name,
                    amount,
                    type: item.type,
                    category: item.category,
                    date
                }
            });
        // Passing the formatted data to te state
        setData(transactionsFormatted);
        setIsLoading(false);

        const lastTransactionEntries = getLastTransitionDate(transactions, 'up');
        const lastTransactionExpensives = getLastTransitionDate(transactions, 'down');


        const balanceInterval = lastTransactionExpensives === 0
            ? 'Não há transações'
            : `01 a ${lastTransactionExpensives}`;

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                total: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0
                    ? 'Não há transações'
                    : `Ultima entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                total: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0
                    ? 'Não há transações'
                    : `Última saída dia ${lastTransactionExpensives}`
            },
            balance: {
                total: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: balanceInterval
            }
        })
    }

    // async function removeAll() {
    //     const dataKey = '@gofinance:transactions';
    //     AsyncStorage.removeItem(dataKey);
    // }

    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []));

    return (
        <Container>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator
                            color={theme.colors.primary}
                            size="large"
                        />
                    </LoadContainer> :
                    <>
                        <Header>
                            <UserWrapper>
                                <UserInfo>
                                    <Photo
                                        source={{ uri: user.photo }}
                                    />
                                    <User>
                                        <UserGreeting>Olá, </UserGreeting>
                                        <UserName>{user.name}</UserName>
                                    </User>
                                </UserInfo>
                                <BorderlessButton onPress={() => signOut()}>
                                    <Icon name="power" />
                                </BorderlessButton>
                            </UserWrapper>
                        </Header>

                        <HighlightCards

                        >
                            <HighlightCard
                                type="up"
                                title="Entradas"
                                amount={highlightData.entries?.total}
                                lastTransaction={highlightData.entries?.lastTransaction}
                            />
                            <HighlightCard
                                type="down"
                                title="Saídas"
                                amount={highlightData.expensives?.total}
                                lastTransaction={highlightData.expensives?.lastTransaction}
                            />
                            <HighlightCard
                                type="total"
                                title="Total"
                                amount={highlightData.balance?.total}
                                lastTransaction={highlightData.balance?.lastTransaction}
                            />
                        </HighlightCards>

                        <Transactions>
                            <Title> Listagem </Title>

                            <TransactionList
                                data={data}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <TransactionCard data={item} />}
                            />
                        </Transactions>
                    </>
            }
        </Container>
    )
}