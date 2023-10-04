
function Networking(props: { title: string }) {
    const title = props.title;

    return (
        <div>
            <h5>{title}</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Private</div>
                <div>Restricted</div>
            </div>
            <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <input type="text" placeholder='PrivateServiceCIDR' />
                        <br />
                        <input type="text" placeholder='PrivateServiceConnectIP' />
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder='RestrictedPrivateServiceCIDR' />
                        <br />
                        <input type="text" placeholder='RestrictedPrivateServiceConnectIP' />
                        <br />
                    </div>
                </div>
                <h6>GKE</h6>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <input type="text" placeholder="GKEPodSubnet" name="gkePodSubnet" />
                        <br />
                        <input type="text" placeholder="GKESvcSubnet" name="gkeSvcSubnet" />
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder='RestrictedGKEPodRange' />
                        <br />
                        <input type="text" placeholder='RestrictedGKESvcRange' />
                        <br />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div>
                        <input type="text" placeholder="BaseSubnetRange" name="baseSubnetRange" />
                        <br />
                        <input type="text" placeholder="BaseSubnetRange" name="baseSubnetRange" />
                        <br />
                    </div>
                    <div>
                        <input type="text" placeholder='RestrictedSubnetRange' />
                        <br />
                        <input type="text" placeholder='RestrictedSubnetRange' />
                        <br />
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Networking;