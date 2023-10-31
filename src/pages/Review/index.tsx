import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    FormLabel, Button, Card, Typography, Switch, Textarea, Tooltip, FormHelperText,
} from '@mui/joy';
import Environment from '../../components/Environment/Environment';
import RegionConfig from '../../components/RegionConfig';
import { BuyNowButton } from '@shopify/hydrogen-react';

import { buildNetworkStructure } from '../../helpers/helpers';

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


    const firstName = onboard.firstName;
    const lastName = onboard.lastName;
    const email = onboard.email;
    const orgName = onboard.organization.name;
    const domain = onboard.organization.domain;

    const billingID = onboard.billingID;
    const accountID = onboard.accountID;

    const orgAdmins = onboard.groups.orgAdmins;
    const billingAdmins = onboard.groups.billingAdmins;
    const monitoringWorkspaceAdmins = onboard.groups.monitoringWorkspaceAdmins;
    const token = onboard.token;

    // const [primaryRegion, setPrimaryRegion] = useState(onboard.primaryRegion);
    // const [secondaryRegion, setSecondaryRegion] = useState(onboard.secondaryRegion);
    const primaryRegion = onboard.primaryRegion;
    const secondaryRegion = onboard.secondaryRegion;
    const networkCIDR = onboard.networkCIDR;

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
                    <Typography className='field-default'>{firstName}</Typography>
                </div>
                <div>
                    <FormLabel>Last name</FormLabel>
                    <Typography className='field-default'>{lastName}</Typography>
                </div>
            </div>
            <div className='input-single'>
                <FormLabel>Contact Email</FormLabel>
                <Typography className='field-default'>{email}</Typography>
            </div>
            <div style={{ padding: '8px' }}>
                <FormLabel>Organization Name</FormLabel>
                <Typography className='field-default'>{orgName}</Typography>
                <FormHelperText>This will be used to create your GCP billing account</FormHelperText>
            </div>
            <h2>Configuration</h2>
            <RegionConfig readOnly
                primaryRegion={primaryRegion} secondaryRegion={secondaryRegion}
            // setPrimaryRegion={setPrimaryRegion} setSecondaryRegion={setSecondaryRegion}
            />
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Domain</FormLabel>
                    <Typography className='field-default'>{domain}</Typography>
                </div>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Network CIDR</FormLabel>
                    <Typography className='field-default'>{networkCIDR}</Typography>
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
                            <Typography className='field-default'>{accountID}</Typography>
                        </div>
                        <div>
                            <FormLabel>Billing ID</FormLabel>
                            <Typography className='field-default'>{billingID}</Typography>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <FormLabel>Token</FormLabel>
                            <Textarea name="token" required size='lg' variant='plain' readOnly
                                style={{ minHeight: '214px', fontFamily: 'monospace' }}
                                value={token}
                            />
                        </div>
                        <div style={{ width: '50%', padding: '8px' }}>
                            <div className='group-item'>
                                <FormLabel>Org Admins Group</FormLabel>
                                <Typography className='field-default'>{orgAdmins}@{domain}</Typography>
                            </div>
                            <div className='group-item'>
                                <FormLabel>Billing Admins Group</FormLabel>
                                <Typography className='field-default'>{billingAdmins}@{domain}</Typography>
                            </div>
                            <div className='group-item'>
                                <FormLabel>Workspace Monitoring Admins Group</FormLabel>
                                <Typography className='field-default'>{monitoringWorkspaceAdmins}@{domain}</Typography>
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
