import { Button, Card, Typography } from "@mui/joy";

function Home() {
    return (
        <div style={{ width: '60vw', height: '70vh', margin: 'auto' }}>
            <div style={{ padding: '32px' }}>
                <h1>Automated GCP Landing Zones</h1>
            </div>
            <Card>
                {/* <h2>A Quick Walk into the Clouds</h2> */}
                <div style={{ padding: '64px 64px 0 64px' }}>
                    <Typography level="body-lg">
                        Start your journey into the Google Cloud Platform with a ready to use account including a Landing Zone with Google Best Practices.
                    </Typography>
                </div>
                <div style={{ padding: '64px' }}>
                    <Button size="lg" onClick={() => { window.location.href = '/terms'; }}>
                        Get Started
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default Home;