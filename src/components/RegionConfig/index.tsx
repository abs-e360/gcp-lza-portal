
import {
    FormLabel,
} from '@mui/joy';
import Autocomplete from '@mui/joy/Autocomplete';

const gcpRegions = [
    "asia-east2",
    "asia-northeast1",
    "asia-northeast2",
    "asia-south1",
    "asia-south2",
    "asia-southeast2",
    "australia-southeast1",
    "australia-southeast2",
    "europe-central2",
    "europe-north1",
    "europe-southwest1",
    "europe-west3",
    "europe-west4",
    "europe-west6",
    "europe-west8",
    "europe-west9",
    "europe-west12",
    "me-central1",
    "southamerica-east2",
    "asia-east1",
    "asia-northeast3",
    "asia-southeast1",
    "europe-west1",
    "europe-west2",
    "me-west1",
    "northamerica-northeast1",
    "northamerica-northeast2",
    "southamerica-east1",
    "us-south1",
    "us-central1",
    "us-east4",
    "us-west1",
    "us-west2",
    "us-west4",
    "us-east1",
    "us-east5",
    "us-west3",
];

const RegionConfig = (props: any) => {
    const { primaryRegion, secondaryRegion, setPrimaryRegion, setSecondaryRegion, readOnly } = props;

    return (
        <div style={{ display: 'flex', textAlign: 'left' }}>
            <div style={{ flexGrow: 1, padding: '8px' }}>
                <FormLabel>Primary Region</FormLabel>
                <div className='region-item'>
                    <Autocomplete error={primaryRegion === secondaryRegion}
                        readOnly={readOnly}
                        id="primaryRegion"
                        options={gcpRegions}
                        getOptionLabel={(option) => option}
                        variant='plain'
                        size='lg'
                        onChange={(_, value) => setPrimaryRegion(value)}
                        value={primaryRegion}
                        sx={{
                            '--Input-focusedHighlight': 'none',
                            '&:focus-within': {
                                borderColor: 'none',
                            },
                        }}
                    />
                </div>
            </div>
            <div style={{ flexGrow: 1, padding: '8px' }}>
                <div className='region-item'>
                    <FormLabel>Secondary Region</FormLabel>
                    <Autocomplete error={primaryRegion === secondaryRegion}
                        readOnly={readOnly}
                        id="secondaryRegion"
                        options={gcpRegions}
                        getOptionLabel={(option) => option}
                        variant='plain'
                        size='lg'
                        onChange={(_, value) => setSecondaryRegion(value)}
                        value={secondaryRegion}
                        sx={{
                            '--Input-focusedHighlight': 'none',
                            '&:focus-within': {
                                borderColor: 'none',
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegionConfig;
