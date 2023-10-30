import { Card, Typography } from "@mui/joy";
import CloudIdentity from "../CloudIdentity";


function Account(props: any) {
    const { accountID, setAccountID,
        hasCloudIdentity,
        customerFound,
        billingID, setBillingID,
        token, setToken,
        orgAdmins, setOrgAdmins,
        domain,
        billingAdmins, setBillingAdmins,
        monitoringWorkspaceAdmins, setMonitoringWorkspaceAdmins
    } = props;


    return (
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
                    billingID={billingID} setBillingID={setBillingID} billingIdReadOnly={customerFound}
                    token={token} setToken={setToken}
                    orgAdmins={orgAdmins} setOrgAdmins={setOrgAdmins}
                    domain={domain}
                    billingAdmins={billingAdmins} setBillingAdmins={setBillingAdmins}
                    monitoringWorkspaceAdmins={monitoringWorkspaceAdmins} setMonitoringWorkspaceAdmins={setMonitoringWorkspaceAdmins}
                />
            }
        </div>
    )
}

export default Account