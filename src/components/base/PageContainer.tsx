import { Card, CardContent, Container, Grid, SxProps, Theme, Typography } from '@mui/material';

interface Props {
    title: string;
    children: React.ReactNode;
    cardSx?: SxProps<Theme>;
}

const PageContainer = (props: Props) => {
    const scrollableHeightForDesktop = `calc(100vh - 256px)`;
    const scrollableHeightForMobile = `calc(100vh - 308px)`;

    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Card sx={props.cardSx}>
                    <CardContent
                        sx={{
                            maxHeight: {
                                xs: scrollableHeightForMobile,
                                sm: scrollableHeightForMobile,
                                md: scrollableHeightForDesktop,
                                lg: scrollableHeightForDesktop,
                            },
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h4" gutterBottom p={1}>
                            {props.title}
                        </Typography>
                        <div
                            style={{
                                overflowY: 'scroll',
                                overflowX: 'hidden',
                                display: 'flex',
                                flex: 1,
                                flexDirection: 'column',
                            }}
                        >
                            {props.children}
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default PageContainer;
