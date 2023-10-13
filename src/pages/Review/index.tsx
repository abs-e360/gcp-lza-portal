import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Input from '@mui/joy/Input';
import {
    FormLabel, Button, Card, Typography, Switch, Textarea, Tooltip, FormHelperText,
} from '@mui/joy';
import Environment from '../../components/Environment/Environment';
import RegionConfig from '../../components/RegionConfig';
import { BuyNowButton } from '@shopify/hydrogen-react';

import {
    buildNetworkStructure, isValidDomain, isValidEmail,
    isValidIPv4, isValidSlash15
} from '../../helpers/helpers';

import './Review.css';

const PRODUCT_VARIENT = "gid://shopify/ProductVariant/46703466381595";

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

const Review = () => {
    const navigate = useNavigate();

    const { termsAccepted, onboard, consistentId } = useSelector((state: any) => state.onboard);
    console.log(termsAccepted, onboard, consistentId);

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
    const [networkCIDR, setNetworkCIDR] = useState(onboard.networkCIDR);

    const [useExistingAcct, setUseExistingAcct] = useState(onboard.token !== '');
    const [showDetails, setShowDetails] = useState(false);

    const environments = buildNetworkStructure(networkCIDR);

    return (
        <div style={{ paddingTop: '16px' }}>
            <h1>Review</h1>
            <h2>Contact</h2>
            <div className='input-pair'>
                <div>
                    <FormLabel>First name</FormLabel>
                    <Input readOnly type="text" name="firstName" required autoFocus size='lg' variant='plain'
                        value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div>
                    <FormLabel>Last name</FormLabel>
                    <Input readOnly type="text" name="lastName" required size='lg' variant='plain'
                        value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
            </div>
            <div className='input-single'>
                <FormLabel>Contact Email</FormLabel>
                <Input readOnly type="text" name="email" required placeholder="user@example.com" size='lg' variant='plain'
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    error={!isValidEmail(email)}
                />
            </div>
            <div style={{ padding: '8px' }}>
                <FormLabel>Organization Name</FormLabel>
                <Input readOnly size='lg' variant='plain' required
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
                    <Input readOnly type="text" name="domain" required placeholder="example.com" size='lg' variant='plain'
                        value={domain} onChange={(e) => setDomain(e.target.value)}
                        error={!isValidDomain(domain)}
                    />
                </div>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Network CIDR</FormLabel>
                    <Input readOnly size='lg' placeholder='0.0.0.0' variant='plain' endDecorator={<span> / 15 </span>}
                        value={networkCIDR} required
                        onChange={(e) => setNetworkCIDR(e.target.value)}
                        error={!isValidIPv4(networkCIDR) || !isValidSlash15(networkCIDR)}
                    />
                    <FormHelperText>CIDR range for your complete GCP presence</FormHelperText>
                </div>
            </div>

            <div style={{ padding: '8px' }}>
                <div style={{ textAlign: 'right', padding: '8px 0' }}>
                    <Tooltip title='Display network CIDRs across all environments'>
                        <Button variant='plain' size='sm' onClick={() => { setShowDetails(!showDetails) }}>{showDetails ? 'Hide' : 'Show'} Details</Button>
                    </Tooltip>
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
                    <Switch checked={useExistingAcct} disabled
                        onChange={(e) => setUseExistingAcct(e.target.checked)}
                    />
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
                            <Input readOnly type="text" name="accountID" size='lg' variant='plain' required
                                value={accountID} onChange={(e) => setAccountID(e.target.value)} />
                        </div>
                        <div>
                            <FormLabel>Billing ID</FormLabel>
                            <Input readOnly type="text" name="billingID" size='lg' variant='plain' required
                                value={billingID} onChange={(e) => setBillingID(e.target.value)} />
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <FormLabel>Token</FormLabel>
                            <Textarea name="token" required size='lg' variant='plain'
                                style={{ minHeight: '214px', fontFamily: 'monospace' }}
                                value={token} onChange={(e) => setToken(e.target.value)}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <div className='group-item'>
                                <FormLabel>Org Admins Group</FormLabel>
                                <Input readOnly type="text" name="orgAdmins" size='lg' variant='plain' required
                                    value={orgAdmins} onChange={(e) => setOrgAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                            <div className='group-item'>
                                <FormLabel>Billing Admins Group</FormLabel>
                                <Input readOnly type="text" name="billingAdmins" size='lg' variant='plain' required
                                    value={billingAdmins} onChange={(e) => setBillingAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                            <div className='group-item'>
                                <FormLabel>Workspace Monitoring Admins Group</FormLabel>
                                <Input readOnly type="text" name="monitoringAdmins" size='lg' variant='plain'
                                    value={monitoringWorkspaceAdmins} onChange={(e) => setMonitoringWorkspaceAdmins(e.target.value)}
                                    endDecorator={<span>@{domain}</span>}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className='onboard-button-bar'>
                <BuyNowButton variantId={PRODUCT_VARIENT} className='buy-now-button'
                    attributes={[{ key: 'data', value: JSON.stringify({ id: consistentId }) }]}
                >
                    Proceed to Checkout
                </BuyNowButton>
            </div>
        </div>
    );
}

export default Review;
