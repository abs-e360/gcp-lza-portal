import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    FormControl, FormHelperText, FormLabel, Input,
    CircularProgress, LinearProgress, Button, Typography
} from "@mui/joy";

import PrimaryContact from "../../components/PrimaryContact";

import { isValidDomain, isValidEmail } from "../../helpers/helpers";
import { service } from "../../service/service";
import { setBillingID, setCustomerFound, setIdentityFound, setContact } from "../../store/store";
import { useNavigate } from "react-router-dom";

function Contact() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { onboard } = useSelector((state: any) => state.onboard);

    const [addressLoading, setAddressLoading] = useState(false);
    const [showProgress, setShowProgress] = useState(false);
    const [creatingCustomer, setCreatingCustomer] = useState(false);

    const [customerFound, setCustomerFoundLocal] = useState(onboard.customerFound);

    const [hasCloudIdentity, setHasCloudIdentity] = useState(false);
    const [domainHelperText, setDomainHelperText] = useState('');

    const [firstName, setFirstName] = useState(onboard.firstName);
    const [lastName, setLastName] = useState(onboard.lastName);
    const [email, setEmail] = useState(onboard.email);
    const [orgName, setOrgName] = useState(onboard.organization.name);
    const [domain, setDomain] = useState(onboard.organization.domain);

    const [streetAddress, setStreetAddress] = useState(onboard.organization.streetAddress);

    const [locality, setLocality] = useState(onboard.organization.locality);
    const [postalCode, setPostalCode] = useState(onboard.organization.postalCode);
    const [administrativeArea, setAdministrativeArea] = useState(onboard.organization.administrativeArea);

    const defaultAddrPlace = () => {
        if (streetAddress)
            return {
                label: `${streetAddress}, ${locality}, ${administrativeArea}`,
                value: {},
            };
        return null
    }
    const [addrPlace, setAddrPlace] = useState<any>(defaultAddrPlace());

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
        setHasCloudIdentity(false);
        if (isValidEmail(e.target.value)) {
            setDomain(e.target.value.split('@')[1]);
        }
    }

    const getCustomer = () => {
        if (!isValidDomain(domain)) return;

        setAddressLoading(true);
        service.get('/customer/' + domain).then((response) => {
            console.log(response);

            dispatch(setCustomerFound(true));
            setCustomerFoundLocal(true);

            setOrgName(response.org_display_name);

            var addr = response.org_postal_address;
            setAdministrativeArea(addr.administrative_area);
            setLocality(addr.locality);
            setStreetAddress(addr.address_lines[0]);
            setPostalCode(addr.postal_code);

            dispatch(setBillingID(response.billing_id));

            setAddressLoading(false);
        }).catch((error) => {
            dispatch(setCustomerFound(false));
            setCustomerFoundLocal(false);

            setPostalCode('');
            setAddrPlace(null);

            setAddressLoading(false);
        });
    }

    const checkDomainCloudIdentity = () => {
        if (!isValidDomain(domain)) return;
        if (hasCloudIdentity) return;

        setShowProgress(true);

        service.get('/cloud-identity?domain=' + domain).then((response) => {
            console.log(response);

            dispatch(setIdentityFound(true));
            setHasCloudIdentity(true);

            setDomainHelperText('Cloud Identity found!');
            // getCustomer();

            setShowProgress(false);
        }).catch((error) => {
            console.log(error);

            dispatch(setIdentityFound(false));
            setHasCloudIdentity(false);

            setDomainHelperText('A new Cloud Identity will be created!');
            setShowProgress(false);
        });

        getCustomer();
    }

    const handleClick = () => {
        // Store local
        dispatch(setContact({
            firstName: firstName,
            lastName: lastName,
            email: email,
            organization: {
                name: orgName,
                domain: domain,
                streetAddress: streetAddress,
                locality: locality,
                postalCode: postalCode,
                administrativeArea: administrativeArea,
            }
        }));

        if (customerFound) {
            navigate('/onboard');
            return;
        }

        setCreatingCustomer(true);
        // Create a customer
        // service.post('/customer', {
        //     org_display_name: orgName,
        //     org_domain: domain,
        //     org_postal_address: {
        //         address_lines: [streetAddress],
        //         locality: locality,
        //         administrative_area: administrativeArea,
        //         postal_code: postalCode,
        //         region_code: 'US',
        //     },
        //     org_primary_contact: {
        //         first_name: firstName,
        //         last_name: lastName,
        //         email: email,
        //     }
        // }).then((response) => {
        //     setCreatingCustomer(false);
        //     console.log(response);
        //     navigate('/onboard');
        // }).catch((error) => {
        //     setCreatingCustomer(false);
        //     console.log(error);
        // });
    }

    // useEffect(() => {
    //     checkDomainCloudIdentity();
    // })

    return (
        <div style={{ paddingTop: '16px' }}>
            <h1>Landing Zone Provisioning</h1>
            <div style={{ textAlign: 'left', padding: '32px 0' }}>
                <h3>Primary Contact</h3>
                {!customerFound &&
                    <div className='input-pair'>
                        <div>
                            <FormLabel>First name</FormLabel>
                            <Input type="text" name="firstName" required autoFocus size='lg' variant='soft'
                                value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={creatingCustomer} />
                        </div>
                        <div>
                            <FormLabel>Last name</FormLabel>
                            <Input type="text" name="lastName" required size='lg' variant='soft'
                                value={lastName} onChange={(e) => setLastName(e.target.value)}
                                disabled={creatingCustomer}
                            />
                        </div>
                    </div>}

                <div style={{ display: 'flex', alignItems: 'top', justifyContent: 'space-between' }}>
                    <FormControl error={!isValidEmail(email)} style={{ padding: '8px', flex: 1 }}>
                        <FormLabel>Contact Email</FormLabel>
                        <Input type="text" name="email"
                            required placeholder="user@example.com" size='lg' variant='soft'
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={checkDomainCloudIdentity}
                            disabled={creatingCustomer}
                        />
                    </FormControl>
                    <FormControl style={{ padding: '8px', flex: 1 }} error={!isValidDomain(domain)}>
                        <FormLabel>Domain</FormLabel>
                        <Input type="text" name="domain"
                            required readOnly disabled
                            placeholder="example.com" size='lg' variant='soft'
                            value={domain}
                            sx={{
                                '--Input-focusedHighlight': 'none',
                                '&:focus-within': {
                                    borderColor: 'none',
                                },
                            }}
                            endDecorator={hasCloudIdentity ? <img alt='gcp-logo' src='/gcp-logo.png' style={{ maxHeight: 32 }} /> : null}
                        />
                        <FormHelperText>
                            {showProgress ? <LinearProgress thickness={1} /> : domainHelperText}
                        </FormHelperText>
                    </FormControl>
                </div>

                {addressLoading &&
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
                        <CircularProgress />
                    </div>}

                {!addressLoading &&
                    <PrimaryContact addrPlace={addrPlace} setAddrPlace={setAddrPlace}
                        streetAddress={streetAddress} setStreetAddress={setStreetAddress}
                        locality={locality} setLocality={setLocality}
                        postalCode={postalCode} setPostalCode={setPostalCode}
                        administrativeArea={administrativeArea} setAdministrativeArea={setAdministrativeArea}
                        orgName={orgName} setOrgName={setOrgName}
                        customerFound={customerFound}
                        disabled={creatingCustomer}
                    />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 2, padding: '32px 8px', textAlign: 'left' }}>
                    {customerFound && <Typography level="h4" color="success">Customer Found!</Typography>}
                    {creatingCustomer && <LinearProgress color="neutral" thickness={2} />}
                </div>
                <div style={{ padding: '32px 8px' }}>
                    <Button size='lg' onClick={handleClick} variant="outlined" disabled={creatingCustomer}>
                        {customerFound ? 'Next' : 'Create Account'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Contact;