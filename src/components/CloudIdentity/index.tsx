

import Input from '@mui/joy/Input';
import {
    FormLabel, Textarea, FormHelperText, FormControl, IconButton, Tooltip,
} from '@mui/joy';
import { CopyAllOutlined } from '@mui/icons-material';


function CloudIdentity(props: any) {
    const { accountID, setAccountID, billingID, setBillingID,
        token, setToken, orgAdmins, setOrgAdmins, domain,
        billingIdReadOnly, billingAdmins, setBillingAdmins,
        monitoringWorkspaceAdmins, setMonitoringWorkspaceAdmins } = props;

    const tokenCommand = `gcloud auth print-access-token ${accountID ? accountID : '{account-id}'} --lifetime=7200`;

    const copyTokenCommand = () => {
        navigator.clipboard.writeText(tokenCommand);
    }

    const validateAccountID = (value: string) => {
        return /^[0-9]+$/.test(value);
    }
    const validateBillingID = (value: string) => {
        return /^[0-9A-F\\-]+$/.test(value);
    }

    return (
        <div>
            <div className='input-pair'>
                <div>
                    <FormControl error={!validateAccountID(accountID)}>
                        <FormLabel>Account ID</FormLabel>
                        <Input type="text" name="accountID" size='lg' variant='soft' required
                            value={accountID} onChange={(e) => setAccountID(e.target.value)} />
                    </FormControl>
                </div>
                <div>
                    <FormControl error={!validateBillingID(billingID)}>
                        <FormLabel>Billing ID</FormLabel>
                        <Input type="text" name="billingID" size='lg' variant='soft' required
                            placeholder='012345-6789AB-CDEF01'
                            value={billingID} onChange={(e) => setBillingID(e.target.value)}
                            readOnly={billingIdReadOnly}
                            disabled={billingIdReadOnly}
                        />
                    </FormControl>
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '50%', padding: '8px' }}>
                    <FormLabel>Token</FormLabel>
                    <Textarea name="token" required size='lg' variant='soft'
                        placeholder='Paste your admin token here.'
                        style={{ minHeight: '214px', fontFamily: 'monospace' }}
                        value={token} onChange={(e) => setToken(e.target.value)}
                    />
                    <FormHelperText style={{ padding: '8px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div>{tokenCommand}</div>
                            <div>
                                <Tooltip title='Copy token generation command'>
                                    <IconButton onClick={copyTokenCommand} disabled={accountID === ''}>
                                        <CopyAllOutlined fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                    </FormHelperText>
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
    );
}

export default CloudIdentity;