import { configureStore, createSlice } from '@reduxjs/toolkit'

export interface OnboardState {
    termsAccepted: boolean;
    firstName: string;
    lastName: string;
    email: string;
    orgName: string;
    billingStreetAddress: string;
    billingCity: string;
    billingState: string;
    billingZip: string;
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
    development: any,
    shared: any,
    nonProduction: any,
    production: any
};

const initialState: OnboardState = {
    termsAccepted: false,
    firstName: '',
    lastName: '',
    email: '',
    domain: '',
    networkCIDR: '',
    orgName: '',
    billingStreetAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
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
    development: {},
    shared: {},
    nonProduction: {},
    production: {}
};

export const onboardSlice = createSlice({
    name: 'onboard',
    initialState,
    reducers: {
        setOnboardState: (state, action) => {
            // const newValue: OnboardState = action.payload;
            // state = newValue;
            if (action.payload.groups) {
                state.groups = action.payload.groups;
            }
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

export const { setOnboardState, resetOnboardState, setTermsAccepted } = onboardSlice.actions;