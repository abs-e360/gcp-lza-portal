import { configureStore, createSlice } from '@reduxjs/toolkit'


export interface EnvSubData {
    primaryRegionCIDR: string;
    secondaryRegionCIDR: string;
    // Shared env will not have this
    serviceCIDR: string;
    serviceIP: string;
};

export interface EnvData {
    base: EnvSubData;
    restricted: EnvSubData;
};

export interface OnboardState {
    firstName: string;
    lastName: string;
    email: string;
    organization: Organization;
    networkCIDR: string;
    billingID: string;
    accountID: string;
    groups: {
        orgAdmins: string;
        billingAdmins: string;
        monitoringWorkspaceAdmins: string;
    },
    token: string;
    primaryRegion: string;
    secondaryRegion: string;
    environments: {
        shared: EnvData;
        development: EnvData;
        nonProduction: EnvData;
        production: EnvData;
    }
};

export interface Organization {
    name: string;
    streetAddress: string;
    locality: string; // city
    administrativeArea: string; // state
    postalCode: string;
    regionCode: string;
    domain: string;
}

export interface RootState {
    // Consistent hash id to identify uniqueness of payload
    consistentId: string;

    // Terms and conditions accepted
    termsAccepted: boolean;

    // True if the customer has already been created
    customerFound: boolean;

    identityFound: boolean;

    // Onboard state.  This is persisted
    onboard: OnboardState;
};

const initialState: RootState = {
    consistentId: '',
    termsAccepted: localStorage.getItem('termsAccepted') === 'true' ? true : false,
    customerFound: localStorage.getItem('customerFound') === 'true' ? true : false,
    identityFound: localStorage.getItem('identityFound') === 'true' ? true : false,
    onboard: {
        firstName: '',
        lastName: '',
        email: '',
        organization: {
            name: '',
            streetAddress: '',
            locality: '',
            administrativeArea: '',
            postalCode: '',
            regionCode: 'US',
            domain: '',
        },
        networkCIDR: '',
        billingID: '',
        accountID: '',
        groups: {
            orgAdmins: 'grp-gcp-organization-admins',
            billingAdmins: 'grp-gcp-billing-admins',
            monitoringWorkspaceAdmins: 'grp-gcp-monitoring-admins',
        },
        token: '',
        primaryRegion: 'us-west2',
        secondaryRegion: 'us-central1',
        environments: {
            shared: {
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
        }
    }
};

export const onboardSlice = createSlice({
    name: 'onboard',
    initialState,
    reducers: {
        setOnboardState: (state, action) => {
            const newValue: OnboardState = action.payload;
            state.onboard = newValue;
        },
        setId: (state, action) => {
            state.consistentId = action.payload;
        },
        resetOnboardState: (state) => {
            state = initialState;
        },
        setTermsAccepted: (state, action) => {
            state.termsAccepted = action.payload;
            localStorage.setItem('termsAccepted', action.payload.toString());
        },
        setBillingID: (state, action) => {
            state.onboard.billingID = action.payload;
        },
        setCustomerFound: (state, action) => {
            state.customerFound = action.payload;
            localStorage.setItem('customerFound', action.payload.toString());
        },
        setIdentityFound: (state, action) => {
            state.identityFound = action.payload;
            localStorage.setItem('identityFound', action.payload.toString());
        },
        setContact: (state, action) => {
            state.onboard.firstName = action.payload.firstName;
            state.onboard.lastName = action.payload.lastName;
            state.onboard.email = action.payload.email;
            state.onboard.organization = action.payload.organization;
        }
    }
});

export const store = configureStore({
    reducer: {
        onboard: onboardSlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export const { setOnboardState, resetOnboardState, setTermsAccepted, setId,
    setBillingID, setCustomerFound, setIdentityFound, setContact } = onboardSlice.actions;