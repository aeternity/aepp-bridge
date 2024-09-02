import { Card, CardContent, Container, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

const faqListContent = [
    {
        question: 'What is bridgae?',
        answer: (
            <>
                <p>
                    bridgae helps you bridge tokens and native cryptocurrencies between the Ethereum and
                    æternity blockchain. It supports a variety of tokens as well as the Ethereum (ETH) and æternity
                    (AE) crypto currency.
                </p>
            </>
        ),
    },
    {
        question: 'How do I use bridgae?',
        answer: (
            <>
                <p>
                    1. First you chose which network (Ethereum or æternity) you want to bridge native crypto currency
                    or tokens from. Depending on which Network you chose, your wallet should signal to you that bridgae
                    intends to connect, which you need to accept. If this does not happen, try reloading the page or
                    click the "connect wallet" button inside bridgae if one is being shown to you.
                </p>
                <p> 2. Next, you chose the asset you want to bridge from the drop-down list.</p>
                <p>
                    3. Enter the address of the wallet on the target network which you want the bridged assets to be
                    transferred to. Make sure this is a wallet you are in control of or is a contract that can receive
                    and transfer the bridged assets. If you are unsure, just use one of your addresses you previously
                    used on the network or create a new one with a wallet.
                </p>
                <p>
                    4. Initiate the bridging. The wallet of the network opens up which the assets are bridged from.
                    Confirm the transaction.
                </p>
                <p>
                    5. Once the depositing transaction is mined, You will see a confirmation. After a few blocks on the
                    target network, you will receive the assets on the target address you provided for that network.
                </p>
            </>
        ),
    },
    {
        question: 'How does bridgae work?',
        answer: (
            <>
                <p>
                    Bridgae locks tokens and currencies in smart contracts on one protocol and releases their equivalent
                    counterpart on the other protocol.
                </p>
                <p>
                    Example 1: When bridging tokens, the tokens get transferred to the contract of
                    bridgae. The backend service gets notified about the locking of the tokens and releases the same
                    amount of the token's official counterpart on the other protocol.
                </p>
                <p>
                    Example 2: Bridging Native Currency Just like with Tokens, the bridged Ether or AE is locked inside
                    the bridgae contract. What is released on the target protocol is a wrapped token though: When
                    bridging Ether to æternity, you receive wETH, wrapped Ether in the form of a AEX-9 Token
                    (æternity's Fungible Token Standard). The same thing happens the other way round: Bridged AE is
                    released in the form of an ERC20-Token called wAE, wrapped AE, on the Ethereum blockchain.
                </p>
            </>
        ),
    },
    {
        question: 'How do I know bridgae does not cheat?',
        answer: (
            <>
                <p>
                    At any time, the amount of tokens or currency released on one protocol equals the amount of tokens /
                    currency locked inside the bridgae smart contract the other protocol. This can be verified through
                    the smart contracts on both æternity and Ethereum.
                </p>
            </>
        ),
    },
    {
        question: "I've bridged my tokens, what's next?",
        answer: (
            <>
                <p>
                    Once you have submitted the bridging transaction, after a few minutes you will see your tokens on
                    the target network. You can now use them as you would use any other token on that network. However,
                    for the Ethereum network, you might need to add the token to your wallet first. You can do this by
                    going to{' '}
                    <a href="\tokens" target="_blank">
                        supported tokens list page
                    </a>{' '}
                    and adding the token address to your wallet. For the æternity, Superhero Wallet should
                    automatically show you the token.
                </p>
                <p>
                    In case you are having issues with the bridging process, please contact us through the{' '}
                    <a href="https://forum.aeternity.com" target="_blank">
                        forum
                    </a>
                    .
                </p>
            </>
        ),
    },
];

const FAQ = () => {
    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Card>
                    <CardContent>
                        <Typography variant="h3" gutterBottom p={1}>
                            FAQ
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {faqListContent.map((faqItem, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primaryTypographyProps={{ fontSize: '20px', fontWeight: '600' }}
                                        secondaryTypographyProps={{ fontSize: '16px' }}
                                        primary={faqItem.question}
                                        secondary={faqItem.answer}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default FAQ;
