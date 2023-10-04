import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Input from '@mui/joy/Input';
import {
    FormLabel, Button, Card, Typography, Switch, Textarea, Tooltip, FormHelperText,
} from '@mui/joy';
import Autocomplete from '@mui/joy/Autocomplete';
import { InfoOutlined, } from '@mui/icons-material';

import Environment from '../../components/Environment/Environment';
import './Onboard.css';

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

const ContactConfig = (props: any) => {
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [email, setEmail] = useState(props.email);

    const [domain, setDomain] = useState(props.domain);
    const [billingID, setBillingID] = useState(props.billingID);
    const [accountID, setAccountID] = useState(props.accountID);

    const [orgAdmins, setOrgAdmins] = useState(props.groups.orgAdmins);
    const [billingAdmins, setBillingAdmins] = useState(props.groups.billingAdmins);
    const [monitoringWorkspaceAdmins, setMonitoringWorkspaceAdmins] = useState(props.groups.monitoringWorkspaceAdmins);
    // const [workspaceAdmins, setWorkspaceAdmins] = useState(props.workspaceAdmins);
    const [token, setToken] = useState(props.token);

    // const [primaryRegion, setPrimaryRegion] = useState(props.primaryRegion);
    // const [secondaryRegion, setSecondaryRegion] = useState(props.secondaryRegion);

    const [useExistingAcct, setUseExistingAcct] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [networkCIDR, setNetworkCIDR] = useState(props.networkCIDR);

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
                    value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {/* <div> */}
            <div style={{ padding: '8px' }}>
                <FormLabel>Organization Name</FormLabel>
                <Input size='lg' variant='soft' />
                <FormHelperText>This will be used to create the GCP billing account</FormHelperText>
            </div>
            <h2>Configuration</h2>
            <RegionConfig primaryRegion={props.primaryRegion} secondaryRegion={props.secondaryRegion} />
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
                        error={!isValidIPv4(networkCIDR)}
                    />
                </div>
            </div>

            <div style={{ padding: '8px' }}>
                <div style={{ textAlign: 'right', padding: '8px 0' }}>
                    <Button variant='plain' size='sm' onClick={() => { setShowDetails(!showDetails) }}>{showDetails ? 'Hide' : 'Show'} Details</Button>
                </div>
                {showDetails &&
                    <NetworkBreakdown networkCIDR={networkCIDR} />
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
                    {/* <div className='input-pair'>
                        <div>
                            <FormLabel>WorkspaceAdmins</FormLabel>
                            <Input type="text" name="workspaceAdmins" size='lg' variant='soft'
                                value={workspaceAdmins} onChange={(e) => setWorkspaceAdmins(e.target.value)} />
                        </div>
                        <div>
                            <FormLabel>MonitoringAdmins</FormLabel>
                            <Input type="text" name="monitoringAdmins" size='lg' variant='soft'
                                value={monitoringAdmins} onChange={(e) => setMonitoringAdmins(e.target.value)} />
                        </div>
                    </div> */}
                    {/* <div className='input-single'>
                        <FormLabel>Token</FormLabel>
                        <Input type="text" name="token" required size='lg' variant='soft'
                            value={token} onChange={(e) => setToken(e.target.value)} />
                    </div> */}
                </div>
            }

        </div>
    );
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

const envList: string[] = ['shared', 'dev', 'nonprod', 'prod'];
const keyList: string[][] = [
    ['base', 'primary'], ['restricted', 'primary'],
    ['base', 'secondary'], ['restricted', 'secondary']
];

const NetworkBreakdown = (props: any) => {
    let nets: any = {
        shared: {
            base: {
                primary: '',
                secondary: '',
                serviceIP: '',
            },
            restricted: {
                primary: '',
                secondary: '',
                serviceIP: '',
            },
        },
        dev: {
            base: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
            restricted: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
        },
        nonprod: {
            base: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
            restricted: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
        },
        prod: {
            base: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
            restricted: {
                primary: '',
                secondary: '',
                service: '',
                serviceIP: '',
            },
        },
    };

    const buildIndex = (cidr: string) => {
        if (!isValidIPv4(cidr)) return;

        // TODO: validate its a slash 15 boundary

        const s19 = slash19sFromSlash15(cidr);
        for (let i = 0; i < 4; i++) {
            const s21 = slash21sFromSlash19(s19[i]);
            const k = keyList[i];

            for (let j = 0; j < 4; j++) {
                nets[envList[j]][k[0]][k[1]] = s21[j];
            }
        }

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
            nets[envList[i]].base.service = baseServiceCIDRs[i - 1];
        }

        const restrictedServiceCIDRs = slash21sFromSlash19(s19[s19.length - 2]);
        for (let i = 1; i < 4; i++) {
            nets[envList[i]].restricted.service = restrictedServiceCIDRs[i - 1];
        }
    }

    buildIndex(props.networkCIDR);
    console.log(nets);

    return (
        <Card style={{ padding: '16px 32px', borderRadius: '4px' }} color='primary'>
            <Environment name='Shared' {...nets.shared} />
            <Environment name='Development' {...nets.dev} />
            <Environment name='Non-Production' {...nets.nonprod} />
            <Environment name='Production' {...nets.prod} />
        </Card>
    );
}

const RegionConfig = (props: any) => {
    const [primaryRegion, setPrimaryRegion] = useState(props.primaryRegion);
    const [secondaryRegion, setSecondaryRegion] = useState(props.secondaryRegion);

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

const Onboard = () => {
    const navigate = useNavigate();
    const onboard = useSelector((state: any) => state.onboard);


    useEffect(() => {
        // Check if terms of service have been accepted.  if not redirect to terms page.
        if (onboard.termsAccepted === false) {
            navigate('/terms');
        }
    }, [onboard.termsAccepted, navigate]);

    const onClickReview = () => {
        navigate('/review');
    }

    return (
        <div>
            <form id='onboarding-form'>
                <ContactConfig {...onboard} />
                <div className='onboard-button-bar'>
                    <Button type="button" size='lg' onClick={onClickReview}>Review</Button>
                </div>
            </form >
        </div >
    );
}

export default Onboard;