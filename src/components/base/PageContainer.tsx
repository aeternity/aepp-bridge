import { Card, CardContent, Container, Grid, Typography } from '@mui/material';

interface Props {
    title: string;
    children: React.ReactNode;
}

const PageContainer = (props: Props) => {
    return (
        <Container sx={{ paddingY: 8 }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-start">
                <Card sx={{ minHeight: 460 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom p={1}>
                            {props.title}
                        </Typography>
                        {props.children}
                    </CardContent>
                </Card>
            </Grid>
        </Container>
    );
};

export default PageContainer;
