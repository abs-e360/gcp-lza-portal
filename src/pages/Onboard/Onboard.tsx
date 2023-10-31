import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@mui/joy/Input';
import {
    FormLabel, Button, Card,
    Tooltip, FormHelperText, FormControl,
} from '@mui/joy';
import RegionConfig from '../../components/RegionConfig';

import Environment from '../../components/Environment/Environment';

import { setId, setOnboardState } from '../../store/store';
import { service } from '../../service/service';
import {
    isValidIPv4, isValidSlash15, buildNetworkStructure
} from '../../helpers/helpers';

import './Onboard.css';
import Account from '../../components/Account';
// import PrimaryContact from '../../components/PrimaryContact';

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

    const { termsAccepted, onboard, customerFound, identityFound } = useSelector((state: any) => state.onboard);

    useEffect(() => {
        // Check if terms of service have been accepted.  if not redirect to terms page.
        if (termsAccepted === false) {
            navigate('/terms');
        }
    }, [termsAccepted, navigate]);

    // const [addressLoading, setAddressLoading] = useState(false);
    // const [showProgress, setShowProgress] = useState(false);

    // const [customerFound] = useState(onboard.customerFound);
    // console.log(customerFound);

    const [firstName, setFirstName] = useState(onboard.firstName);
    const [lastName, setLastName] = useState(onboard.lastName);
    const [email, setEmail] = useState(onboard.email);
    const [orgName, setOrgName] = useState(onboard.organization.name);
    const [domain, setDomain] = useState(onboard.organization.domain);

    const [streetAddress, setStreetAddress] = useState(onboard.organization.streetAddress);
    const [locality, setLocality] = useState(onboard.organization.locality);
    const [postalCode, setPostalCode] = useState(onboard.organization.postalCode);
    const [administrativeArea, setAdministrativeArea] = useState(onboard.organization.administrativeArea);

    // const [addrPlace, setAddrPlace] = useState<any>(null);

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
    // const [hasCloudIdentity, setHasCloudIdentity] = useState(false);
    // const [domainHelperText, setDomainHelperText] = useState('');

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
        // if (!firstName || !lastName || !email || !orgName || !domain || !networkCIDR || !postalCode) {
        //     return false;
        // }
        // if (!isValidDomain(domain)) {
        //     return false;
        // }

        if (!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)) {
            return false;
        }

        if (!identityFound) {
            return true;
        }

        if (!billingID || !accountID || !token || !orgAdmins || !billingAdmins || !monitoringWorkspaceAdmins) {
            return false;
        }

        return true;
    }

    return (
        <div style={{ paddingTop: '16px' }}>
            <h1>Landing Zone Provisioning</h1>
            <div style={{ textAlign: 'left' }}>
                <h2 style={{ textAlign: 'center' }}>{domain}</h2>

                <Account accountID={accountID} setAccountID={setAccountID}
                    hasCloudIdentity={identityFound}
                    customerFound={customerFound}
                    billingID={billingID} setBillingID={setBillingID}
                    token={token} setToken={setToken}
                    orgAdmins={orgAdmins} setOrgAdmins={setOrgAdmins}
                    domain={domain}
                    billingAdmins={billingAdmins} setBillingAdmins={setBillingAdmins}
                    monitoringWorkspaceAdmins={monitoringWorkspaceAdmins} setMonitoringWorkspaceAdmins={setMonitoringWorkspaceAdmins}
                />

                <h3>Configuration</h3>
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
                                onClick={() => { setShowDetails(!showDetails) }}
                            >
                                {showDetails ? 'Hide' : 'Show'} Details
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <div style={{ padding: '8px' }}>
                    {showDetails && <NetworkBreakdown environments={environments} />}
                </div>
                <div className='onboard-button-bar'>
                    <Button variant='outlined' size='lg'
                        onClick={() => proceedToReview()}
                        disabled={!canProceed()}
                    >
                        Review
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Onboard;
