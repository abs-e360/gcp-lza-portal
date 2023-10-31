
import { FormLabel, FormControl, Input } from "@mui/joy";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';

function PrimaryContact(props: any) {
    const { orgName, setOrgName,
        addrPlace, setAddrPlace,
        streetAddress, setStreetAddress, locality, setLocality,
        administrativeArea, setAdministrativeArea, postalCode, setPostalCode,
        customerFound, disabled } = props;

    const parseAddress = (selected: any) => {
        console.log(selected);
        for (var i = 0; i < selected.address_components.length; i++) {
            var addrComp = selected.address_components[i];
            for (var j = 0; j < addrComp.types.length; j++) {
                if (addrComp.types[j] === "postal_code") {
                    setPostalCode(addrComp.long_name);
                } else if (addrComp.types[j] === "route") {
                    setStreetAddress(addrComp.long_name);
                } else if (addrComp.types[j] === "locality") {
                    setLocality(addrComp.long_name);
                } else if (addrComp.types[j] === "administrative_area_level_1") {
                    setAdministrativeArea(addrComp.long_name);
                }
            }
        }
    }

    const processAddress = (place: any) => {
        setAddrPlace(place);
        console.log(place);
        // Get potential postal code matches from the place id.
        geocodeByPlaceId(place?.value?.place_id).then((results) => {
            parseAddress(results[0]);
        });
    }

    return (
        <div>
            {!customerFound &&
                <>
                    <div style={{ padding: '8px' }}>
                        <FormControl>
                            <FormLabel>Organization Name</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={orgName} onChange={(e) => { setOrgName(e.target.value) }}
                                disabled={disabled}
                            />
                        </FormControl>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormControl style={{ flex: 2, padding: '8px' }}>
                            <FormLabel>Postal Address</FormLabel>
                            <GooglePlacesAutocomplete
                                apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                                apiOptions={{ language: 'en', region: 'US' }}
                                minLengthAutocomplete={3}
                                autocompletionRequest={{
                                    componentRestrictions: {
                                        country: 'us',
                                    },
                                    types: ['address'],
                                }}
                                selectProps={{
                                    placeholder: 'Postal Address',
                                    onChange: (place: any) => { processAddress(place) },
                                    value: addrPlace,
                                }}
                            />
                        </FormControl>
                        <FormControl style={{ flex: 1, padding: '8px' }}>
                            <FormLabel>Postal Code</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={postalCode}
                                disabled
                                readOnly
                                sx={{
                                    '--Input-focusedHighlight': 'none',
                                    '&:focus-within': {
                                        borderColor: 'none',
                                    },
                                }}
                            />
                        </FormControl>
                    </div>
                </>}

            {customerFound &&
                <>
                    <FormControl style={{ padding: '8px' }}>
                        <FormLabel>Organization Name</FormLabel>
                        <Input size='lg' variant='soft'
                            required readOnly disabled
                            value={orgName}
                            sx={{
                                '--Input-focusedHighlight': 'none',
                                '&:focus-within': {
                                    borderColor: 'none',
                                },
                            }}
                        />
                    </FormControl>
                    <FormControl style={{ padding: '8px' }}>
                        <FormLabel>Street Address</FormLabel>
                        <Input size='lg' variant='soft' required
                            value={streetAddress}
                            readOnly
                            disabled
                            sx={{
                                '--Input-focusedHighlight': 'none',
                                '&:focus-within': {
                                    borderColor: 'none',
                                },
                            }}
                        />
                    </FormControl>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px' }}>
                        <FormControl>
                            <FormLabel>City</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={locality}
                                readOnly disabled
                                sx={{
                                    '--Input-focusedHighlight': 'none',
                                    '&:focus-within': {
                                        borderColor: 'none',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>State</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={administrativeArea}
                                readOnly disabled
                                sx={{
                                    '--Input-focusedHighlight': 'none',
                                    '&:focus-within': {
                                        borderColor: 'none',
                                    },
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Postal Code</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={postalCode}
                                disabled readOnly
                                sx={{
                                    '--Input-focusedHighlight': 'none',
                                    '&:focus-within': {
                                        borderColor: 'none',
                                    },
                                }}
                            />
                        </FormControl>
                    </div>
                </>}
        </div>
    );
}

export default PrimaryContact;