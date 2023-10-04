import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Input from '@mui/joy/Input';
import {
    FormLabel, Button, Card, Typography, Switch, Textarea, Tooltip, FormHelperText,
} from '@mui/joy';
import Autocomplete from '@mui/joy/Autocomplete';
import { InfoOutlined, } from '@mui/icons-material';

import Environment from '../../components/Environment/Environment';
import './Onboard.css';
import { setEnvironments, setOnboardState } from '../../store/store';

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

const envList: string[] = ['shared', 'development', 'nonProduction', 'production'];
const keyList: string[][] = [
    ['base', 'primaryRegionCIDR'], ['restricted', 'primaryRegionCIDR'],
    ['base', 'secondaryRegionCIDR'], ['restricted', 'secondaryRegionCIDR']
];

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDomain = (domain: string): boolean => {
    domain = domain.trim();

    if (domain[0] === '.') {
        return false;
    }

    const parts = domain.split('.');
    if (parts.length < 2) {
        return false;
    }
    return true
}

const isValidIPv4 = (ipAddress: string): boolean => {
    // Split the IP address by "."
    const octets = ipAddress.split('.');

    // Check if the IP address has exactly 4 octets
    if (octets.length !== 4 || octets[0] === '0') {
        return false;
    }

    // Validate each octet
    for (let i = 0; i < 4; i++) {
        // Check if the octet is a valid number
        if (isNaN(Number(octets[i]))) {
            return false;
        }

        // Convert the octet to a number
        const num = parseInt(octets[i], 10);

        // Check if the octet is between 0 and 255
        if (num < 0 || num > 255) {
            return false;
        }

        // Check if the octet has leading zeros (e.g., "01" or "001")
        if (num.toString() !== octets[i]) {
            return false;
        }
    }

    return true;
}

const isValidSlash15 = (cidr: string): boolean => {
    const baseOctets = cidr.split('.');
    if (parseInt(baseOctets[2]) % 2 === 0) return true;
    return false;
}

const getServiceIps = (cidr: string, lastOctet: Number): string[] => {
    const staticsBaseOctets = cidr.split('.');
    const thirdOctet = parseInt(staticsBaseOctets[2]);

    let serviceIPs: string[] = [];
    for (let i = thirdOctet; i < 256; i += 4) {
        serviceIPs.push(`${staticsBaseOctets[0]}.${staticsBaseOctets[1]}.${i}.${lastOctet}`);
    }
    return serviceIPs
}

// Takes /15 CIDR and returns a list of /19 CIDRs
const slash19sFromSlash15 = (cidr: string): string[] => {
    const cidrs: string[] = [];
    const baseOctets = cidr.split('.');

    const baseOctet = parseInt(baseOctets[1]);
    for (let i = baseOctet; i < baseOctet + 2; i++) {
        for (let j = 0; j < 256; j += 32) {
            const newCIDR = `${baseOctets[0]}.${i}.${j}.0/19`;
            cidrs.push(newCIDR);
        }
    }

    return cidrs;
}

const slash21sFromSlash19 = (cidr: string): string[] => {
    const cidrs: string[] = [];
    const baseOctets = cidr.split('.');

    const baseOctet = parseInt(baseOctets[2]);
    for (let i = baseOctet; i < 256; i += 8) {
        const newCIDR = `${baseOctets[0]}.${baseOctets[1]}.${i}.0/21`;
        cidrs.push(newCIDR);
    }

    return cidrs;
};

const buildNetworkStructure = (cidr: string) => {

    // Structure holding the network information
    let nets: any = {
        shared: {
            base: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceIP: '',
                serviceCIDR: '',
            },
            restricted: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceIP: '',
                serviceCIDR: '',
            },
        },
        development: {
            base: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
            restricted: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
        },
        nonProduction: {
            base: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
            restricted: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
        },
        production: {
            base: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
            restricted: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceCIDR: '',
                serviceIP: '',
            },
        },
    };

    if (!isValidIPv4(cidr) || !isValidSlash15(cidr)) return;

    const s19 = slash19sFromSlash15(cidr);
    for (let i = 0; i < 4; i++) {
        const s21 = slash21sFromSlash19(s19[i]);
        const k = keyList[i];

        for (let j = 0; j < 4; j++) {
            nets[envList[j]][k[0]][k[1]] = s21[j];
        }
    }

    // Service IPs
    const lastOctet: Number = 5;
    const serviceIps = getServiceIps(s19[s19.length - 1], lastOctet);
    for (let i = 0; i < 4; i++) {
        nets[envList[i % envList.length]].base.serviceIP = serviceIps[i];
    }
    for (let i = 4; i < 8; i++) {
        nets[envList[i % envList.length]].restricted.serviceIP = serviceIps[i];
    }

    const baseServiceCIDRs = slash21sFromSlash19(s19[s19.length - 3]);
    for (let i = 1; i < 4; i++) {
        nets[envList[i]].base.serviceCIDR = baseServiceCIDRs[i - 1];
    }

    const restrictedServiceCIDRs = slash21sFromSlash19(s19[s19.length - 2]);
    for (let i = 1; i < 4; i++) {
        nets[envList[i]].restricted.serviceCIDR = restrictedServiceCIDRs[i - 1];
    }
    return nets;
}

const NetworkBreakdown = (props: any) => {
    // const environments = buildNetworkStructure(props.networkCIDR);
    // console.log(environments);
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

const RegionConfig = (props: any) => {
    const { primaryRegion, secondaryRegion, setPrimaryRegion, setSecondaryRegion } = props;

    return (
        <div style={{ display: 'flex', textAlign: 'left' }}>
            <div style={{ flexGrow: 1, padding: '8px' }}>
                <FormLabel>Primary Region</FormLabel>
                <div className='region-item'>
                    <Autocomplete error={primaryRegion === secondaryRegion}
                        id="primaryRegion"
                        options={gcpRegions}
                        getOptionLabel={(option) => option}
                        variant='soft'
                        size='lg'
                        onChange={(_, value) => setPrimaryRegion(value)}
                        value={primaryRegion}
                    />
                </div>
            </div>
            <div style={{ flexGrow: 1, padding: '8px' }}>
                <div className='region-item'>
                    <FormLabel>Secondary Region</FormLabel>
                    <Autocomplete error={primaryRegion === secondaryRegion}
                        id="secondaryRegion"
                        options={gcpRegions}
                        getOptionLabel={(option) => option}
                        variant='soft'
                        size='lg'
                        onChange={(_, value) => setSecondaryRegion(value)}
                        value={secondaryRegion}
                    />
                </div>
            </div>
        </div>
    );
};

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
    const [orgName, setOrgName] = useState(onboard.orgName);

    const [domain, setDomain] = useState(onboard.domain);
    const [billingID, setBillingID] = useState(onboard.billingID);
    const [accountID, setAccountID] = useState(onboard.accountID);

    const [orgAdmins, setOrgAdmins] = useState(onboard.groups.orgAdmins);
    const [billingAdmins, setBillingAdmins] = useState(onboard.groups.billingAdmins);
    const [monitoringWorkspaceAdmins, setMonitoringWorkspaceAdmins] = useState(onboard.groups.monitoringWorkspaceAdmins);
    const [token, setToken] = useState(onboard.token);

    const [primaryRegion, setPrimaryRegion] = useState(onboard.primaryRegion);
    const [secondaryRegion, setSecondaryRegion] = useState(onboard.secondaryRegion);

    const [useExistingAcct, setUseExistingAcct] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [networkCIDR, setNetworkCIDR] = useState(onboard.networkCIDR);

    const environments = buildNetworkStructure(networkCIDR);

    const proceedToCheckout = () => {
        dispatch(setOnboardState({
            termsAccepted: true,
            firstName: firstName,
            lastName: lastName,
            email: email,
            orgName: orgName,
            domain: domain,
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
        }));

        dispatch(setEnvironments(environments));

        // window.location.href = 'https://e360-landing-zone-checkout.web.app/';
        navigate('/review');
    }

    const canProceed = (): boolean => {
        if (!firstName || !lastName || !email || !orgName || !domain || !networkCIDR) {
            return false;
        }

        if (!isValidDomain(domain)) {
            return false;
        }

        if (!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)) {
            return false;
        }

        if (!useExistingAcct) {
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
            <div className='input-single'>
                <FormLabel>Email</FormLabel>
                <Input type="text" name="email" required placeholder="user@example.com" size='lg' variant='soft'
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    error={!isValidEmail(email)}
                />
            </div>
            {/* <div> */}
            <div style={{ padding: '8px' }}>
                <FormLabel>Organization Name</FormLabel>
                <Input size='lg' variant='soft' required
                    value={orgName} onChange={(e) => { setOrgName(e.target.value) }} />
                <FormHelperText>This will be used to create your GCP billing account</FormHelperText>
            </div>
            <h2>Configuration</h2>
            <RegionConfig primaryRegion={primaryRegion} secondaryRegion={secondaryRegion}
                setPrimaryRegion={setPrimaryRegion} setSecondaryRegion={setSecondaryRegion}
            />
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Domain</FormLabel>
                    <Input type="text" name="domain" required placeholder="example.com" size='lg' variant='soft'
                        value={domain} onChange={(e) => setDomain(e.target.value)}
                        error={!isValidDomain(domain)}
                    />
                </div>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Network CIDR</FormLabel>
                    <Input size='lg' placeholder='0.0.0.0' variant='soft' endDecorator={<span> / 15 </span>}
                        value={networkCIDR} required
                        onChange={(e) => setNetworkCIDR(e.target.value)}
                        error={!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)}
                    />
                    <FormHelperText>CIDR range for your complete GCP presence</FormHelperText>
                </div>
            </div>

            <div style={{ padding: '8px' }}>
                <div style={{ textAlign: 'right', padding: '8px 0' }}>
                    <Button variant='plain' size='sm' onClick={() => { setShowDetails(!showDetails) }}>{showDetails ? 'Hide' : 'Show'} Details</Button>
                </div>
                {showDetails &&
                    <NetworkBreakdown environments={environments} />
                }
            </div>

            <div id='account-configuration'>
                <div>
                    <h2>Account</h2>
                </div>
                <div style={{ display: 'flex' }}>
                    <span style={{ padding: '0 4px' }}>Use an existing GCP account </span>
                    <Switch checked={useExistingAcct} onChange={(e) => setUseExistingAcct(e.target.checked)} />
                </div>
            </div>

            {!useExistingAcct &&
                <div style={{ padding: '16px' }}>
                    <Card size='lg' color='primary'>
                        <Typography color='primary'>
                            A new GCP account will be created for you.
                        </Typography>
                        <Typography color='primary'>
                            You will be billed directly by <a href='https://www.e360.com/'>e360</a>.
                        </Typography>
                    </Card>
                </div>
            }
            {useExistingAcct &&
                <div>
                    <div className='input-pair'>
                        <div>
                            <FormLabel>Account ID</FormLabel>
                            <Input type="text" name="accountID" size='lg' variant='soft' required
                                value={accountID} onChange={(e) => setAccountID(e.target.value)} />
                        </div>
                        <div>
                            <FormLabel>Billing ID</FormLabel>
                            <Input type="text" name="billingID" size='lg' variant='soft' required
                                value={billingID} onChange={(e) => setBillingID(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <FormLabel>Token</FormLabel>
                            <Textarea name="token" required size='lg' variant='soft'
                                style={{ minHeight: '214px', fontFamily: 'monospace' }}
                                endDecorator={
                                    <Tooltip title={`gcloud auth print-access-token ${accountID ? accountID : '{account-id}'} --lifetime=7200`} placement='right' variant='outlined'>
                                        <InfoOutlined fontSize='small' />
                                    </Tooltip>
                                }
                                value={token} onChange={(e) => setToken(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <div className='group-item'>
                                <FormLabel>Org Admins Group</FormLabel>
                                <Input type="text" name="orgAdmins" size='lg' variant='soft' required
                                    value={orgAdmins} onChange={(e) => setOrgAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                            <div className='group-item'>
                                <FormLabel>Billing Admins Group</FormLabel>
                                <Input type="text" name="billingAdmins" size='lg' variant='soft' required
                                    value={billingAdmins} onChange={(e) => setBillingAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                            <div className='group-item'>
                                <FormLabel>Workspace Monitoring Admins Group</FormLabel>
                                <Input type="text" name="monitoringAdmins" size='lg' variant='soft'
                                    value={monitoringWorkspaceAdmins} onChange={(e) => setMonitoringWorkspaceAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className='onboard-button-bar'>
                <Button type="button" size='lg' onClick={proceedToCheckout} disabled={!canProceed()}>
                    Proceed to Checkout</Button>
            </div>
        </div>
    );
}

export default Onboard;
