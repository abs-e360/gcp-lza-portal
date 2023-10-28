// Takes a list of /19 CIDRs and returns a list of /21 CIDRs.
const slash21sFromSlash19 = (cidr: string, slash?: string): string[] => {
    const cidrs: string[] = [];
    const baseOctets = cidr.split('.');
    const sls = slash ? slash : '21';

    const baseOctet = parseInt(baseOctets[2]);
    for (let i = baseOctet; i < 256; i += 8) {
        const newCIDR = `${baseOctets[0]}.${baseOctets[1]}.${i}.0/${sls}`;
        cidrs.push(newCIDR);
    }

    return cidrs;
};

// Takes /15 CIDR and returns a list of /19 CIDRs
const slash19sFromSlash15 = (cidr: string): string[] => {
    const cidrs: string[] = [];
    const baseOctets = cidr.split('.');

    const baseOctet = parseInt(baseOctets[1]);
    for (let i = baseOctet; i < baseOctet + 2; i++) {
        for (let j = 0; j < 256; j += 32) {
            const newCIDR = `${baseOctets[0]}.${i}.${j}.0/19`;
            cidrs.push(newCIDR);
        }
    }

    return cidrs;
};

const envList: string[] = ['shared', 'development', 'nonProduction', 'production'];
const keyList: string[][] = [
    ['base', 'primaryRegionCIDR'], ['restricted', 'primaryRegionCIDR'],
    ['base', 'secondaryRegionCIDR'], ['restricted', 'secondaryRegionCIDR']
];

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[a-z0-9]+$/i.test(email);
};

const isValidDomain = (domain: string): boolean => {
    return /^[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/i.test(domain);
}

const isValidIPv4 = (ipAddress: string): boolean => {
    // Split the IP address by "."
    const octets = ipAddress.split('.');

    // Check if the IP address has exactly 4 octets
    if (octets.length !== 4 || octets[0] === '0') {
        return false;
    }

    // Validate each octet
    for (let i = 0; i < 4; i++) {
        // Check if the octet is a valid number
        if (isNaN(Number(octets[i]))) {
            return false;
        }

        // Convert the octet to a number
        const num = parseInt(octets[i], 10);

        // Check if the octet is between 0 and 255
        if (num < 0 || num > 255) {
            return false;
        }

        // Check if the octet has leading zeros (e.g., "01" or "001")
        if (num.toString() !== octets[i]) {
            return false;
        }
    }

    return true;
}

const isValidSlash15 = (cidr: string): boolean => {
    const baseOctets = cidr.split('.');
    if (parseInt(baseOctets[2]) % 2 === 0) return true;
    return false;
}

const getServiceIps = (cidr: string, lastOctet: Number): string[] => {
    const staticsBaseOctets = cidr.split('.');
    const thirdOctet = parseInt(staticsBaseOctets[2]);

    let serviceIPs: string[] = [];
    for (let i = thirdOctet; i < 256; i += 4) {
        serviceIPs.push(`${staticsBaseOctets[0]}.${staticsBaseOctets[1]}.${i}.${lastOctet}`);
    }
    return serviceIPs
}

const buildNetworkStructure = (cidr: string) => {
    // Structure holding the network information
    let nets: any = {
        shared: {
            base: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceIP: '',
                serviceCIDR: '',
            },
            restricted: {
                primaryRegionCIDR: '',
                secondaryRegionCIDR: '',
                serviceIP: '',
                serviceCIDR: '',
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
    };

    if (!isValidIPv4(cidr) || !isValidSlash15(cidr)) return nets;

    const s19 = slash19sFromSlash15(cidr);
    for (let i = 0; i < 4; i++) {
        const s21 = slash21sFromSlash19(s19[i]);
        const k = keyList[i];

        for (let j = 0; j < 4; j++) {
            nets[envList[j]][k[0]][k[1]] = s21[j];
        }
    }

    // Make shared all /24s
    nets.shared.base.primaryRegionCIDR = nets.shared.base.primaryRegionCIDR.replace('/21', '/24');
    nets.shared.base.secondaryRegionCIDR = nets.shared.base.secondaryRegionCIDR.replace('/21', '/24');
    nets.shared.restricted.primaryRegionCIDR = nets.shared.restricted.primaryRegionCIDR.replace('/21', '/24');
    nets.shared.restricted.secondaryRegionCIDR = nets.shared.restricted.secondaryRegionCIDR.replace('/21', '/24');

    // Service IPs
    const lastOctet: Number = 5;
    const serviceIps = getServiceIps(s19[s19.length - 1], lastOctet);
    for (let i = 0; i < 4; i++) {
        nets[envList[i % envList.length]].base.serviceIP = serviceIps[i];
    }
    for (let i = 4; i < 8; i++) {
        nets[envList[i % envList.length]].restricted.serviceIP = serviceIps[i];
    }

    const baseServiceCIDRs = slash21sFromSlash19(s19[s19.length - 3]);
    for (let i = 1; i < 4; i++) {
        nets[envList[i]].base.serviceCIDR = baseServiceCIDRs[i];
    }

    const restrictedServiceCIDRs = slash21sFromSlash19(s19[s19.length - 2]);
    for (let i = 1; i < 4; i++) {
        nets[envList[i]].restricted.serviceCIDR = restrictedServiceCIDRs[i];
    }

    console.log(nets);
    return nets;
}


export {
    slash19sFromSlash15,
    slash21sFromSlash19,
    isValidEmail,
    isValidDomain,
    isValidIPv4,
    isValidSlash15,
    getServiceIps,
    buildNetworkStructure
};