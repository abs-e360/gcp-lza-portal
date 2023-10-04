import { Table } from "@mui/joy";

const Environment = (props: any) => {

    return (
        <div>
            <h5>{props.name}</h5>
            <Table size='sm' variant='outlined' style={{ borderRadius: '6px' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Base</th>
                        <th>Restricted</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ textAlign: 'left' }}>
                        <td>Primary Region CIDR</td>
                        <td>{props.base.primaryRegionCIDR}</td>
                        <td>{props.restricted.primaryRegionCIDR}</td>
                    </tr>
                    <tr style={{ textAlign: 'left' }}>
                        <td>Secondary Region CIDR</td>
                        <td>{props.base.secondaryRegionCIDR}</td>
                        <td>{props.restricted.secondaryRegionCIDR}</td>
                    </tr>
                    {props.base.service &&
                        <tr style={{ textAlign: 'left' }}>
                            <td>Service CIDR</td>
                            <td>{props.base.serviceCIDR}</td>
                            <td>{props.restricted.serviceCIDR}</td>
                        </tr>
                    }
                    <tr style={{ textAlign: 'left' }}>
                        <td>Service IP</td>
                        <td>{props.base.serviceIP}</td>
                        <td>{props.restricted.serviceIP}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default Environment;