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
    orgName: string;
    domain: string;
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

export interface RootState {
    termsAccepted: boolean;
    onboard: OnboardState;
};

const initialState: RootState = {
    termsAccepted: false,
    onboard: {
        firstName: '',
        lastName: '',
        email: '',
        orgName: '',
        domain: '',
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
        setEnvironments: (state, action) => {
            const envs = action.payload;
            state.onboard.environments = envs;
        },
        resetOnboardState: (state) => {
            state = initialState;
        },
        setTermsAccepted: (state, action) => {
            state.termsAccepted = action.payload;
        }
    }
});

export const store = configureStore({
    reducer: {
        onboard: onboardSlice.reducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});

export const { setOnboardState, resetOnboardState, setTermsAccepted, setEnvironments } = onboardSlice.actions;