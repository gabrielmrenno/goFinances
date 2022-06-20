import React from 'react';

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
    LogoutButton,
} from './styles';

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {
    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date: "13/04/2020"
        },
        {
            id: '2',
            type: 'negative',
            title: "Almoço fora",
            amount: "R$ 50,00",
            category: {
                name: 'Compras',
                icon: 'coffee'
            },
            date: "13/04/2020"
        },
        {
            id: '3',
            type: 'negative',
            title: "Desenvolvimento de site",
            amount: "R$ 12.000,00",
            category: {
                name: 'Vendas',
                icon: 'shopping-bag'
            },
            date: "13/04/2020"
        }
    ];
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/18034920?v=4' }}
                        />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Gabriel</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power" />
                    </LogoutButton>
                </UserWrapper>
            </ Header>

            <HighlightCards

            >
                <HighlightCard
                    type="up"
                    title="Entradas"
                    amount="R$ 1.000.400,00"
                    lastTransaction="Última entrada dia 13 de abril de 2022"
                />
                <HighlightCard
                    type="down"
                    title="Saídas"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril de 2022"
                />
                <HighlightCard
                    type="total"
                    title="Total"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril de 2022"
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
        </Container>
    )
}