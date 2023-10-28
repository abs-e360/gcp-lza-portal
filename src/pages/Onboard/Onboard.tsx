import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@mui/joy/Input';
import {
    FormLabel, Button, Card, Typography,
    Tooltip, FormHelperText, FormControl, LinearProgress,
} from '@mui/joy';
import RegionConfig from '../../components/RegionConfig';
// import { Cloud, InfoOutlined, } from '@mui/icons-material';

import Environment from '../../components/Environment/Environment';

import { setId, setOnboardState } from '../../store/store';
import { service } from '../../service/service';
import {
    isValidDomain, isValidEmail, isValidIPv4, isValidSlash15,
    buildNetworkStructure
} from '../../helpers/helpers';

import './Onboard.css';
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';
import CloudIdentity from '../../components/CloudIdentity';

const NetworkBreakdown = (props: any) => {
    const { environments } = props;

    return (
        <Card style={{ padding: '16px 32px', borderRadius: '4px' }} color='primary'>
            <Environment name='Shared' {...environments.shared} />
            <Environment name='Development' {...environments.development} />
            <Environment name='Non-Production' {...environments.nonProduction} />
            <Environment name='Production' {...environments.production} />
        </Card>
    );
}

const Onboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { termsAccepted, onboard } = useSelector((state: any) => state.onboard);

    useEffect(() => {
        // Check if terms of service have been accepted.  if not redirect to terms page.
        if (termsAccepted === false) {
            navigate('/terms');
        }
    }, [termsAccepted, navigate]);


    const [firstName, setFirstName] = useState(onboard.firstName);
    const [lastName, setLastName] = useState(onboard.lastName);
    const [email, setEmail] = useState(onboard.email);
    const [orgName, setOrgName] = useState(onboard.organization.name);
    const [domain, setDomain] = useState(onboard.organization.domain);

    const [billingID, setBillingID] = useState(onboard.billingID);
    const [accountID, setAccountID] = useState(onboard.accountID);

    const [orgAdmins, setOrgAdmins] = useState(onboard.groups.orgAdmins);
    const [billingAdmins, setBillingAdmins] = useState(onboard.groups.billingAdmins);
    const [monitoringWorkspaceAdmins, setMonitoringWorkspaceAdmins] = useState(onboard.groups.monitoringWorkspaceAdmins);
    const [token, setToken] = useState(onboard.token);

    const [primaryRegion, setPrimaryRegion] = useState(onboard.primaryRegion);
    const [secondaryRegion, setSecondaryRegion] = useState(onboard.secondaryRegion);
    const [networkCIDR, setNetworkCIDR] = useState(onboard.networkCIDR);

    const [showDetails, setShowDetails] = useState(false);
    const [hasCloudIdentity, setHasCloudIdentity] = useState(false);
    const [domainHelperText, setDomainHelperText] = useState('e.g. example.com');
    const [showProgress, setShowProgress] = useState(false);

    const [streetAddress, setStreetAddress] = useState(onboard.organization.streetAddress);
    const [locality, setLocality] = useState(onboard.organization.locality);
    const [postalCode, setPostalCode] = useState(onboard.organization.postalCode);
    const [administrativeArea, setAdministrativeArea] = useState(onboard.organization.administrativeArea);

    const environments = buildNetworkStructure(networkCIDR);

    const proceedToReview = () => {
        const onboardingPayload = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            organization: {
                name: orgName,
                domain: domain,
                streetAddress: streetAddress,
                locality: locality,
                administrativeArea: administrativeArea,
                postalCode: postalCode,
                regionCode: onboard.organization.regionCode, // only default supported
            },
            networkCIDR: networkCIDR,
            billingID: billingID,
            accountID: accountID,
            groups: {
                orgAdmins: orgAdmins,
                billingAdmins: billingAdmins,
                monitoringWorkspaceAdmins: monitoringWorkspaceAdmins,
            },
            token: token,
            primaryRegion: primaryRegion,
            secondaryRegion: secondaryRegion,
            environments: environments,
        };

        dispatch(setOnboardState(onboardingPayload));
        service.post('/onboard', onboardingPayload).then((response) => {
            dispatch(setId(response.id));
            navigate('/review');
        }).catch((error) => {
            console.log(error);
        });
    }

    const canProceed = (): boolean => {
        if (!firstName || !lastName || !email || !orgName || !domain || !networkCIDR || !postalCode) {
            return false;
        }

        if (!isValidDomain(domain)) {
            return false;
        }

        if (!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)) {
            return false;
        }

        if (!hasCloudIdentity) {
            return true;
        }

        if (!billingID || !accountID || !token || !orgAdmins || !billingAdmins || !monitoringWorkspaceAdmins) {
            return false;
        }

        return true;
    }

    // const handleDomainChange = (e: any) => {
    //     setHasCloudIdentity(false);
    //     setDomain(e.target.value);
    //     setDomainHelperText('e.g. example.com');
    // }

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        setHasCloudIdentity(false);
        if (isValidEmail(e.target.value)) {
            setDomain(e.target.value.split('@')[1]);
        }
    }

    const checkDomainCloudIdentity = () => {
        if (!isValidDomain(domain)) return;
        if (hasCloudIdentity) return;

        setShowProgress(true);

        service.get('/cloud-identity?domain=' + domain).then((response) => {
            console.log(response);
            setHasCloudIdentity(true);
            setDomainHelperText('Cloud Identity found!');
            setShowProgress(false);
        }).catch((error) => {
            console.log(error);
            setHasCloudIdentity(false);
            setDomainHelperText('A new Cloud Identity will be created!');
            setShowProgress(false);
        });
    }

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
        // Get potential postal code matches from the place id.
        geocodeByPlaceId(place?.value?.place_id).then((results) => {
            parseAddress(results[0]);
        });
    }

    return (
        <div style={{ paddingTop: '16px' }}>
            <h1>Landing Zone Provisioning</h1>
            <div style={{ textAlign: 'left' }}>
                <h2>Contact</h2>
                <div className='input-pair'>
                    <div>
                        <FormLabel>First name</FormLabel>
                        <Input type="text" name="firstName" required autoFocus size='lg' variant='soft'
                            value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div>
                        <FormLabel>Last name</FormLabel>
                        <Input type="text" name="lastName" required size='lg' variant='soft'
                            value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                </div>

                <div style={{ padding: '8px' }}>
                    <FormControl>
                        <FormLabel>Organization Name</FormLabel>
                        <Input size='lg' variant='soft' required
                            value={orgName} onChange={(e) => { setOrgName(e.target.value) }} />
                        {/* <FormHelperText>Used for your GCP billing account</FormHelperText> */}
                    </FormControl>
                </div>

                <div style={{ display: 'flex', alignItems: 'top', justifyContent: 'space-between' }}>
                    <div style={{ textAlign: 'left', padding: '8px', flex: 1 }}>
                        <FormControl>
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
                                    onChange: (place: any) => { processAddress(place) }
                                }}
                            />
                        </FormControl>
                    </div>
                    <div style={{ padding: '8px', flex: 1 }}>
                        <FormControl>
                            <FormLabel>Postal Code</FormLabel>
                            <Input size='lg' variant='soft' required
                                value={postalCode}
                                onChange={(e) => { setPostalCode(e.target.value) }}
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
                </div>

                <div style={{ display: 'flex', alignItems: 'top', justifyContent: 'space-between' }}>
                    <div style={{ padding: '8px', flex: 1 }}>
                        <FormControl error={!isValidEmail(email)}>
                            <FormLabel>Contact Email</FormLabel>
                            <Input type="text" name="email" required placeholder="user@example.com" size='lg' variant='soft'
                                value={email}
                                onChange={handleEmailChange}
                                onBlur={checkDomainCloudIdentity}
                            />
                        </FormControl>
                    </div>
                    <div style={{ padding: '8px', flex: 1 }}>
                        <FormControl error={!isValidDomain(domain)} >
                            <FormLabel>Domain</FormLabel>
                            <Input type="text" name="domain" required placeholder="example.com" size='lg' variant='soft'
                                value={domain}
                                sx={{
                                    '--Input-focusedHighlight': 'none',
                                    '&:focus-within': {
                                        borderColor: 'none',
                                    },
                                }}
                                // onChange={handleDomainChange}
                                // onBlur={checkDomainCloudIdentity}
                                readOnly
                                endDecorator={hasCloudIdentity ? <img alt='gcp-logo' src='/gcp-logo.png' style={{ maxHeight: 32 }} /> : null}
                            />
                            <FormHelperText>
                                {showProgress ? <LinearProgress thickness={1} /> : domainHelperText}
                            </FormHelperText>
                        </FormControl>
                    </div>
                </div>

                <div>
                    <h2>Account</h2>
                    {!hasCloudIdentity &&
                        <div style={{ padding: '16px', textAlign: 'center' }}>
                            <Card size='lg' color='primary'>
                                <Typography color='primary'>
                                    A new Google Identity and GCP account will be provisioned.
                                </Typography>
                                <Typography color='primary'>
                                    You will be billed directly by <a href='https://www.e360.com/'>e360</a>.
                                </Typography>
                            </Card>
                        </div>
                    }
                    {hasCloudIdentity &&
                        <CloudIdentity
                            accountID={accountID} setAccountID={setAccountID}
                            billingID={billingID} setBillingID={setBillingID}
                            token={token} setToken={setToken}
                            orgAdmins={orgAdmins} setOrgAdmins={setOrgAdmins}
                            domain={domain}
                            billingAdmins={billingAdmins} setBillingAdmins={setBillingAdmins}
                            monitoringWorkspaceAdmins={monitoringWorkspaceAdmins} setMonitoringWorkspaceAdmins={setMonitoringWorkspaceAdmins}
                        />
                    }
                </div>

                <h2>Configuration</h2>
                <RegionConfig
                    primaryRegion={primaryRegion} secondaryRegion={secondaryRegion}
                    setPrimaryRegion={setPrimaryRegion} setSecondaryRegion={setSecondaryRegion}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ padding: '8px', minWidth: '50%' }}>
                        <FormControl error={!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)}>
                            <FormLabel>Network CIDR</FormLabel>
                            <Input size='lg' placeholder='0.0.0.0' variant='soft' endDecorator={<span> / 15 </span>}
                                value={networkCIDR} required
                                onChange={(e) => setNetworkCIDR(e.target.value)}
                            />
                            <FormHelperText>CIDR range for your complete GCP presence</FormHelperText>
                        </FormControl>
                    </div>
                    <div style={{ textAlign: 'right', padding: '8px 0' }}>
                        <Tooltip title='Display network CIDRs across all environments'>
                            <Button variant='plain' size='lg'
                                disabled={!isValidIPv4(networkCIDR)}
                                onClick={() => { setShowDetails(!showDetails) }}>{showDetails ? 'Hide' : 'Show'} Details</Button>
                        </Tooltip>
                    </div>
                </div>
                <div style={{ padding: '8px' }}>
                    {showDetails && <NetworkBreakdown environments={environments} />}
                </div>



                <div className='onboard-button-bar'>
                    <Button variant='outlined' size='lg' onClick={() => proceedToReview()}
                        disabled={!canProceed()}
                    >
                        Review</Button>
                </div>
            </div>
        </div>
    );
}

export default Onboard;
